import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { ChangeDetectorRef, Component, effect, inject, input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import {
  matChevronLeftFillOutline,
  matChevronRightFillOutline,
} from '@ng-icons/material-symbols/outline';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { Transaction as BankTransaction } from '../../../models/Transaction.model';
import { TransactionStatus } from '../../../models/TransactionStatus.model';
import { TransactionType } from '../../../models/TransactionType.model';
import { BankService } from '../../../service/bank';
import { Button } from '../../../shared/components/button/button';
import { Dropdown } from '../../../shared/components/dropdown/dropdown';
import { ErrorPopUp } from '../../../shared/components/error-pop-up/error-pop-up';
import { Input } from '../../../shared/components/input/input';
import { InputPopUp } from '../../../shared/components/input-pop-up/input-pop-up';
import { Label } from '../../../shared/components/label/label';
import { LoadingPopUp } from '../../../shared/components/loading-pop-up/loading-pop-up';
import { LoadingRow } from '../../../shared/components/loading-row/loading-row';
import { PopUp } from '../../../shared/components/pop-up/pop-up';
import { SucessfulTransactionPopUp } from '../../../shared/components/sucessful-transaction-pop-up/sucessful-transaction-pop-up';

interface Transaction {
  id: string;
  date: string;
  category: string;
  destination: string;
  status: string;
  amount: number;
}

@Component({
  imports: [
    FormsModule,
    NgIcon,
    Button,
    Dropdown,
    Input,
    Label,
    LoadingRow,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
  ],
  selector: 'app-transaction-table',
  styleUrl: './transaction-table.css',
  templateUrl: './transaction-table.html',
  viewProviders: [provideIcons({ matChevronLeftFillOutline, matChevronRightFillOutline })],
})
export class TransactionTable {
  private readonly bank = inject(BankService);
  private readonly dialog = inject(MatDialog);
  protected readonly types = TransactionType;

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  tableData: Transaction[] = [];

  currentPage = 1;
  rowsPerPage = 5;
  totalPages = 0;

  // form values
  searchString: string = '';
  orderBy: string = '';
  sortDirection: string = '';
  selectedCategory: string = '';

  // menu values
  // Tried in order; the CDK uses the first one that fits on screen
  menuPositions: ConnectedPosition[] = [
    // Left of the button, top edges aligned
    { originX: 'start', originY: 'top', overlayX: 'end', overlayY: 'top', offsetX: -8 },
    // Below, right edges aligned
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 8 },
    // Below, left edges aligned (mobile, where the button wraps to the left)
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 8 },
  ];

  constructor(private readonly cdr: ChangeDetectorRef) {
    effect(() => {
      this.bank.revision();
      if (!this.bank.transactionsLoaded()) return;
      const id = this.bank.currentAccountId();
      this.transactions = id ? this.rowsFor(id) : [];
      this.applyFiltersAndSort();
      this.cdr.detectChanges();
    });
  }

  // loading values
  loading = input(false);
  loadingRows = Array.from({ length: this.rowsPerPage });
  dataLoading(): boolean {
    return this.loading() || !this.bank.transactionsLoaded();
  }

  private rowsFor(accountId: string): Transaction[] {
    return this.bank.getTransactions(accountId).map((transaction) => {
      const other = transaction.recipientAccountId
        ? this.bank.getAccount(transaction.recipientAccountId)
        : undefined;
      const category =
        transaction.transactionType === TransactionType.Deposit
          ? 'Deposit'
          : transaction.transactionType === TransactionType.Withdraw
            ? 'Withdraw'
            : 'Transfer';
      const status =
        transaction.transactionStatus.charAt(0) +
        transaction.transactionStatus.slice(1).toLowerCase();

      return {
        id: transaction.transactionId,
        date: transaction.dateCreated.toLocaleString('en-US', {
          month: '2-digit',
          day: '2-digit',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
        }),
        category,
        destination: other?.accountName ?? '-',
        status,
        amount: transaction.amount,
      };
    });
  }

  updateTable(): void {
    this.totalPages = Math.ceil(this.filteredTransactions.length / this.rowsPerPage);

    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;

    this.tableData = this.filteredTransactions.slice(startIndex, endIndex);
  }

  applyFiltersAndSort(): void {
    const search = this.searchString.toLowerCase().trim();

    // Start with all transactions
    let results = this.transactions.filter((transaction) => {
      // Search filter
      const matchesSearch =
        transaction.category.toLowerCase().includes(search) ||
        transaction.destination.toLowerCase().includes(search) ||
        transaction.status.toLowerCase().includes(search) ||
        transaction.amount.toString().includes(search);

      // Category filter
      const matchesCategory =
        this.selectedCategory === '' ||
        transaction.category.toLowerCase() === this.selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });

    // Sorting
    if (this.orderBy !== '' && this.sortDirection !== '') {
      results.sort((a, b) => {
        let comparison = 0;

        switch (this.orderBy.toLowerCase()) {
          case 'date':
            comparison = a.date.localeCompare(b.date);
            break;

          case 'category':
            comparison = a.category.localeCompare(b.category);
            break;

          case 'destination':
            comparison = a.destination.localeCompare(b.destination);
            break;

          case 'status':
            comparison = a.status.localeCompare(b.status);
            break;

          case 'amount':
            comparison = a.amount - b.amount;
            break;
        }

        return this.sortDirection.toLowerCase() === 'descending' ? -comparison : comparison;
      });
    }

    this.filteredTransactions = results;

    this.currentPage = 1;

    this.updateTable();
  }

  // Same flow as TransactionPage; the table refreshes itself through bank.revision().
  protected async processTransaction(transactionType: TransactionType): Promise<void> {
    const tx: BankTransaction = {
      transactionId: '',
      accountId: this.bank.currentAccountId() ?? '',
      recipientAccountId: this.bank.currentAccountId() ?? '',
      amount: 0,
      description: '',
      transactionType,
      dateCreated: new Date(),
      transferId: null,
      transactionStatus: TransactionStatus.Pending,
    };

    while (true) {
      const next = await firstValueFrom(
        this.dialog
          .open<InputPopUp, BankTransaction, boolean>(InputPopUp, { width: '700px', data: tx })
          .afterClosed(),
      );
      if (!next) return;

      if (
        transactionType === TransactionType.TransferOut &&
        !this.bank.getAccount((tx.recipientAccountId ?? '').trim())
      ) {
        await this.showError('Destination account not found');
        continue;
      }

      const confirmed = await firstValueFrom(
        this.dialog
          .open<PopUp, BankTransaction, boolean>(PopUp, { width: 'auto', height: 'auto', data: tx })
          .afterClosed(),
      );
      if (confirmed === undefined) return;
      if (!confirmed) continue;

      if (!(await this.showLoading(3000))) continue;
      const error = this.send(tx);
      if (error) {
        await this.showError(error);
        continue;
      }

      tx.transactionStatus = TransactionStatus.Approved;
      await firstValueFrom(
        this.dialog.open(SucessfulTransactionPopUp, { width: '700px', data: tx }).afterClosed(),
      );
      return;
    }
  }

  // BankService validates, creates and stores the record; returns '' on success.
  private send(tx: BankTransaction): string {
    const note = tx.description ?? '';
    switch (tx.transactionType) {
      case TransactionType.Deposit:
        return this.bank.deposit(tx.amount, note);
      case TransactionType.Withdraw:
        return this.bank.withdraw(tx.amount, note);
      default:
        return this.bank.transfer(tx.amount, tx.recipientAccountId ?? '', note);
    }
  }

  private showError(error: string): Promise<boolean | undefined> {
    return firstValueFrom(
      this.dialog
        .open<ErrorPopUp, { error: string }, boolean>(ErrorPopUp, {
          width: '700px',
          data: { error },
        })
        .afterClosed(),
    );
  }

  private async showLoading(ms: number): Promise<boolean> {
    const ref = this.dialog.open<LoadingPopUp, void, boolean>(LoadingPopUp, { width: 'auto' });
    const timer = setTimeout(() => ref.close(true), ms);
    const done = await firstValueFrom(ref.afterClosed());
    clearTimeout(timer);
    return done === true;
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updateTable();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updateTable();
    }
  }
}
