import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface Transaction {
  id: number;
  date: string;
  category: string;
  destination: string;
  status: string;
  amount: number;
}

// FIXME: implement filtering logic
@Component({
  imports: [FormsModule],
  selector: 'app-transaction-table',
  styleUrl: './transaction-table.css',
  templateUrl: './transaction-table.html',
})
export class TransactionTable {

  transactions: Transaction[] = [];
  filteredTransactions: Transaction[] = [];
  tableData: Transaction[] = [];

  currentPage = 1;
  rowsPerPage = 10;
  totalPages = 0;

  // form values
  searchString: string = '';
  orderBy: string = '';
  sortDirection: string = '';
  selectedCategory: string = '';

  constructor(private cdr: ChangeDetectorRef) {
    this.loadTransactions();
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
        transaction.category.toLowerCase() === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });

    // Sorting
    if (this.orderBy !== '') {
      results.sort((a, b) => {
        let comparison = 0;

        switch (this.orderBy) {
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

        return this.sortDirection === 'dsc'
          ? -comparison
          : comparison;
      });
    }

    this.filteredTransactions = results;

    this.currentPage = 1;

    this.updateTable();
  }


  // FIXME: might this need to be a signal? instead of a function????
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
