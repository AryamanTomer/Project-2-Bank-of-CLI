import { Component, inject, signal } from '@angular/core';
import { ToastService } from '../../service/toast';
import { MatDialog } from '@angular/material/dialog';
import { PopUp } from '../../shared/components/pop-up/pop-up';
import { InputPopUp } from '../../shared/components/input-pop-up/input-pop-up';
import { Button } from '../../shared/components/button/button';
import { Card } from '../../shared/components/card/card';
import { Dropdown } from '../../shared/components/dropdown/dropdown';
import { Input } from '../../shared/components/input/input';
import { Label } from '../../shared/components/label/label';
import { ToastContainer } from '../../shared/components/toast/toast';
import { Transaction } from '../../models/Transaction.model';
import { TransactionStatus } from '../../models/TransactionStatus.model';
import { TransactionType } from '../../models/TransactionType.model';
import { CdkMenu, CdkMenuItem, CdkMenuTrigger } from '@angular/cdk/menu';
import { firstValueFrom } from 'rxjs';
import { ErrorPopUp } from '../../shared/components/error-pop-up/error-pop-up';

// Snippets live here (not in the template) so Angular doesn't parse `{{`, `@` or tags inside them.
const snippets = {
  button: `<app-button type="button" [disabled]="false" (clicked)="onClick()">Click me</app-button>`,
  card: `<app-card class="max-w-sm">Anything goes in here</app-card>

<!-- skeleton instead of content while loading -->
<app-card [loading]="isLoading()">Your content</app-card>`,
  dropdown: `<app-dropdown
  [options]="['Apple', 'Banana', 'Orange']"
  placeHolder="Pick a fruit"
  [(value)]="fruit"
/>`,
  input: `<app-input inputId="account-id" type="text" [(value)]="accountId" />

<!-- eye icon toggles visibility -->
<app-input inputId="pw" type="password" [(value)]="password" />

<!-- search icon -->
<app-input inputId="q" type="search" [(value)]="query" />`,
  label: `<app-label status="Approved" />   <!-- 'Approved' | 'Pending' | 'Rejected' -->`,
  toast: `// app.html (once, at the root)
<app-toast />

// anywhere
private toast = inject(ToastService);
this.toast.success('Saved!');
this.toast.error('Something went wrong');
this.toast.show('Custom', 'success', 5000); // message, type, duration ms`,
};

@Component({
  imports: [
    Button,
    Card,
    Dropdown,
    Input,
    Label,
    ToastContainer,
    CdkMenu,
    CdkMenuItem,
    CdkMenuTrigger,
  ],
  selector: 'app-docs',
  template: `
    <app-toast />
    <main class="mx-auto flex max-w-3xl flex-col gap-8 p-6">
      <h1 class="text-3xl font-bold">Component docs</h1>
      <p>
        Every component in <code>shared/components</code>, with basic usage. All accept an optional
        <code>class</code> input that is merged with <code>tailwind-merge</code>.
      </p>

      <section class="flex flex-col gap-3">
        <h2 class="text-2xl font-semibold">Button <code>app-button</code></h2>
        <p>
          Inputs: <code>type</code> ('button' | 'submit'), <code>disabled</code>,
          <code>class</code>. Output: <code>clicked</code>.
        </p>
        <div class="flex gap-3">
          <app-button class="w-48" (clicked)="toast.success('Clicked')">Click me</app-button>
          <app-button class="w-48" [disabled]="true">Disabled</app-button>
          <app-button class="w-48" [disabled]="true">Loading</app-button>
        </div>
        <pre class="overflow-x-auto rounded-xl bg-gray-100 p-3 text-sm">{{ snippets.button }}</pre>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="text-2xl font-semibold">Card <code>app-card</code></h2>
        <p>
          Content-projected container with a border, padding and shadow. Input:
          <code>loading</code> (boolean) swaps the content for a skeleton.
        </p>
        <app-card class="max-w-sm">Anything goes in here</app-card>
        <app-card class="max-w-sm" [loading]="cardLoading()">
          Loaded content: this is hidden while loading.
        </app-card>
        <app-button class="w-48" (clicked)="cardLoading.set(!cardLoading())">
          {{ cardLoading() ? 'Stop loading' : 'Start loading' }}
        </app-button>
        <pre class="overflow-x-auto rounded-xl bg-gray-100 p-3 text-sm">{{ snippets.card }}</pre>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="text-2xl font-semibold">Dropdown <code>app-dropdown</code></h2>
        <p>
          Inputs: <code>options</code> (string[]), <code>placeHolder</code>. Two-way:
          <code>[(value)]</code>.
        </p>
        <app-dropdown [options]="fruits" placeHolder="Pick a fruit" [(value)]="fruit" />
        <p>
          Selected: <strong>{{ fruit() || 'nothing' }}</strong>
        </p>
        <pre class="overflow-x-auto rounded-xl bg-gray-100 p-3 text-sm">{{
          snippets.dropdown
        }}</pre>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="text-2xl font-semibold">Input <code>app-input</code></h2>
        <p>
          Inputs: <code>inputId</code> (required), <code>name</code>, <code>type</code> ('text' |
          'password' | 'search'), <code>class</code>. Two-way: <code>[(value)]</code>.
        </p>
        <ul class="list-disc pl-6">
          <li><code>text</code>: plain input, no icon.</li>
          <li>
            <code>password</code>: eye icon button on the right that toggles showing/hiding the
            password.
          </li>
          <li><code>search</code>: decorative search icon on the right.</li>
        </ul>
        <app-input inputId="docs-demo-text" [(value)]="text" />
        <app-input inputId="docs-demo-password" [(value)]="password" type="password" />
        <app-input inputId="docs-demo-search" [(value)]="search" type="search" />

        <p>
          Value: <strong>{{ text() }}</strong>
        </p>
        <pre class="overflow-x-auto rounded-xl bg-gray-100 p-3 text-sm">{{ snippets.input }}</pre>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="text-2xl font-semibold">Label <code>app-label</code></h2>
        <p>Status pill. Input: <code>status</code> ('Approved' | 'Pending' | 'Rejected').</p>
        <div class="flex gap-3">
          <app-label status="Approved" />
          <app-label status="Pending" />
          <app-label status="Rejected" />
        </div>
        <pre class="overflow-x-auto rounded-xl bg-gray-100 p-3 text-sm">{{ snippets.label }}</pre>
      </section>

      <section class="flex flex-col gap-3">
        <h2 class="text-2xl font-semibold">
          Toast <code>app-toast</code> + <code>ToastService</code>
        </h2>
        <p>
          Place <code>&lt;app-toast /&gt;</code> once at the root, then call the service from
          anywhere.
        </p>
        <div class="flex gap-3">
          <app-button class="w-48" (clicked)="toast.success('Success toast')">Success</app-button>
          <app-button class="w-48" (clicked)="toast.error('Error toast')">Error</app-button>
        </div>
        <pre class="overflow-x-auto rounded-xl bg-gray-100 p-3 text-sm">{{ snippets.toast }}</pre>

        <app-button class="w-48" [cdkMenuTriggerFor]="transactionMenu">Make Transaction</app-button>
        <ng-template #transactionMenu>
          <div cdkMenu class="flex min-w-40 flex-col rounded-xl bg-white p-1.5 shadow-lg">
            <button
              cdkMenuItem
              class="cursor-pointer rounded-lg px-3 py-2.5 text-left hover:bg-purple-200 focus-visible:bg-purple-200 focus-visible:outline-none"
              (click)="processTransaction(types.Deposit)"
            >
              Deposit
            </button>
            <button
              cdkMenuItem
              class="cursor-pointer rounded-lg px-3 py-2.5 text-left hover:bg-purple-200 focus-visible:bg-purple-200 focus-visible:outline-none"
              (click)="processTransaction(types.Withdraw)"
            >
              Withdraw
            </button>
            <button
              cdkMenuItem
              class="cursor-pointer rounded-lg px-3 py-2.5 text-left hover:bg-purple-200 focus-visible:bg-purple-200 focus-visible:outline-none"
              (click)="processTransaction(types.TransferOut)"
            >
              Transfer
            </button>
          </div>
        </ng-template>
        <pre class="overflow-x-auto rounded-xl bg-gray-100 p-3 text-sm">{{ result() }}</pre>
      </section>
    </main>
  `,
})
export class Docs {
  protected toast = inject(ToastService);
  protected snippets = snippets;
  protected fruits = ['Apple', 'Banana', 'Orange'];
  protected fruit = signal('');
  protected cardLoading = signal(true);
  protected text = signal('');
  protected password = signal('');
  protected search = signal('');

  private readonly dialog = inject(MatDialog);
  protected readonly types = TransactionType;
  protected readonly result = signal('No transaction yet.');

  // Input -> (destination check) -> confirm. Back/error-continue return to input; cancel aborts.
  protected async processTransaction(transactionType: TransactionType): Promise<void> {
    const tx: Transaction = {
      transactionId: '',
      accountId: '001',
      recipientAccountId: '0001',
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
          .open<InputPopUp, Transaction, boolean>(InputPopUp, { width: '700px', data: tx })
          .afterClosed(),
      );
      if (!next) return;

      if (tx.recipientAccountId !== '0001') {
        await firstValueFrom(
          this.dialog
            .open<ErrorPopUp, { error: string }, boolean>(ErrorPopUp, {
              width: '700px',
              data: { error: 'Destination account not found' },
            })
            .afterClosed(),
        );
        continue;
      }

      const confirmed = await firstValueFrom(
        this.dialog
          .open<PopUp, Transaction, boolean>(PopUp, { width: '700px', data: tx })
          .afterClosed(),
      );
      if (confirmed === undefined) return; // dismissed
      if (confirmed) {
        this.result.set(JSON.stringify(tx, null, 2));
        return;
      }
      // false = Back -> loop to input
    }
  }
}
