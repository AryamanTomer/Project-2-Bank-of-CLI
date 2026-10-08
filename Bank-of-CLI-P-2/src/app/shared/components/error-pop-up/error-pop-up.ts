import { Component, computed, input, signal, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { Card } from '../card/card';
import { Input } from '../input/input';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogTitle,
} from '@angular/material/dialog';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { Transaction } from '../../../models/Transaction.model';
import { TransactionStatus } from '../../../models/TransactionStatus.model';
import { matErrorRound } from '@ng-icons/material-symbols/round';

@Component({
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    Card,
    Input,
    NgIcon,
  ],
  viewProviders: [provideIcons({ matErrorRound })],
  selector: 'app-error-pop-up',
  styleUrl: './error-pop-up.css',
  templateUrl: './error-pop-up.html',
})
export class ErrorPopUp {
  protected readonly data = inject<{ error: string }>(MAT_DIALOG_DATA);
}
