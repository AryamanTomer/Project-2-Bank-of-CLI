import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, computed, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Button } from '../../shared/components/button/button';
import { Card } from '../../shared/components/card/card';
import { TransactionTable } from './transaction-table/transaction-table';

import Chart from 'chart.js/auto';

import { NgIcon, provideIcons } from '@ng-icons/core';
import { matMoneyBagFillOutline, matSavingsFillOutline } from '@ng-icons/material-symbols/outline';
import { matAddCircleRound } from '@ng-icons/material-symbols/round';
import { BankService } from '../../service/bank';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, TransactionTable, Button, Card, DatePipe, NgIcon],
  providers: [
    provideIcons({
      matMoneyBagFillOutline,
      matSavingsFillOutline,
      matAddCircleRound,
    }),
  ],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements AfterViewInit {
  private readonly bank = inject(BankService);
  protected readonly accountsLoaded = this.bank.accountsLoaded;
  protected readonly transactionsLoaded = this.bank.transactionsLoaded;
  cardNumber = '4827 1938 6274 9183';
  expirationDate = '08/30';
  currentDate = new Date();

  protected readonly account = computed(() => {
    this.bank.revision();
    if (!this.accountsLoaded()) return undefined;
    const id = this.bank.currentAccountId();
    return id ? this.bank.getAccount(id) : undefined;
  });

  ngAfterViewInit(): void {
    const yAxis = this.getYAxisRange();

    new Chart('balanceChart', {
      type: 'line',

      data: {
        labels: this.getLastFiveMonths(),

        datasets: [
          {
            label: 'Balance',
            data: this.balanceData,
            borderColor: '#232323',
            borderWidth: 1,
            tension: 0,
            fill: false,

            pointRadius: 7,

            // Creates the visual gap around the dot
            pointBorderWidth: 4,
            pointBorderColor: 'white',

            // Actual dot
            pointBackgroundColor: '#C3A9E9',
            pointHoverRadius: 7,
          },
        ],
      },

      options: {
        responsive: true,
        maintainAspectRatio: false,

        plugins: {
          legend: {
            display: false,
          },
        },

        scales: {
          y: {
            min: yAxis.min,
            max: yAxis.max,

            ticks: {
              stepSize: yAxis.step,

              callback: function (value) {
                const amount = Number(value);

                if (amount >= 1000) {
                  return '$' + amount / 1000 + 'k';
                }

                return '$' + amount;
              },
            },
          },
        },
      },
    });
  }

  getLastFiveMonths(): string[] {
    const months: string[] = [];

    for (let i = 4; i >= 0; i--) {
      const date = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - i, 1);

      months.push(date.toLocaleString('en-US', { month: 'short' }));
    }

    return months;
  }

  balanceData = [8900, 11000, 10500, 11800, 12450];

  getYAxisRange() {
    const minData = Math.min(...this.balanceData);
    const maxData = Math.max(...this.balanceData);

    // Round outward to the nearest $1,000
    const min = Math.floor(minData / 1000) * 1000;
    const max = Math.ceil(maxData / 1000) * 1000;

    // 5 ticks means 4 equal spaces
    const step = (max - min) / 4;

    return {
      min,
      max,
      step,
    };
  }
}
