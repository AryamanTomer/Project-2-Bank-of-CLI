import { Component, signal, effect, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { Transaction } from '../../../models/Transaction.model';
import { Input } from '../input/input';
import { Card } from '../card/card';

@Component({
  imports: [MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose, Input, Card],
  selector: 'app-input-pop-up',
  styleUrl: './input-pop-up.css',
  templateUrl: './input-pop-up.html',
})
export class InputPopUp {
  protected readonly data = inject<Transaction>(MAT_DIALOG_DATA);
  notes = signal(this.data.description ?? '');
  amount = signal(this.data.amount ? String(this.data.amount) : '');
  destinationAccount = signal(this.data.recipientAccountId ?? '');
  constructor() {
    effect(() => {
      this.data.amount = +this.amount();
      this.data.recipientAccountId = this.destinationAccount();
      this.data.description = this.notes();
    });
  }
}
