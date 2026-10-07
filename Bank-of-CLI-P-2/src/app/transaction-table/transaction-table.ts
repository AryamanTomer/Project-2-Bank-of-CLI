import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { matChevronLeftFillOutline, matChevronRightFillOutline } from '@ng-icons/material-symbols/outline';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Button } from '../shared/components/button/button';
import { Dropdown } from '../shared/components/dropdown/dropdown';
import { Input } from '../shared/components/input/input';
import { Label } from '../shared/components/label/label';
import { LoadingRow } from '../shared/components/loading-row/loading-row';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { ConnectedPosition } from '@angular/cdk/overlay';

interface Transaction {
  id: number;
  date: string;
  category: string;
  destination: string;
  status: string;
  amount: number;
}

@Component({
  imports: [FormsModule, NgIcon, Button, Dropdown, Input, Label, LoadingRow, CdkMenu, CdkMenuItem, CdkMenuTrigger],
  selector: 'app-transaction-table',
  styleUrl: './transaction-table.css',
  templateUrl: './transaction-table.html',
  viewProviders: [provideIcons({ matChevronLeftFillOutline, matChevronRightFillOutline })],
})
export class TransactionTable {

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

  constructor(private cdr: ChangeDetectorRef) {
    this.loadTransactions();
  }

  // loading values
  loadingRows = Array.from({ length: this.rowsPerPage });
  dataLoading(): boolean {
    return this.transactions.length === 0;
  }

  loadTransactions(): void {
    fetch('transactions.json')
      .then(response => response.json())
      .then(data => {
        this.transactions = data;
        this.filteredTransactions = data;
        this.updateTable();

        this.cdr.detectChanges();
      });
  }

  updateTable(): void {
    this.totalPages = Math.ceil(
      this.filteredTransactions.length / this.rowsPerPage
    );

    const startIndex = (this.currentPage - 1) * this.rowsPerPage;
    const endIndex = startIndex + this.rowsPerPage;

    this.tableData = this.filteredTransactions.slice(
      startIndex,
      endIndex
    );
  }

  applyFiltersAndSort(): void {
    const search = this.searchString.toLowerCase().trim();

    // Start with all transactions
    let results = this.transactions.filter(transaction => {

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
    if (this.orderBy !== '') {
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

        return this.sortDirection.toLowerCase() === 'dsc'
          ? -comparison
          : comparison;
      });
    }

    this.filteredTransactions = results;

    this.currentPage = 1;

    this.updateTable();
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
