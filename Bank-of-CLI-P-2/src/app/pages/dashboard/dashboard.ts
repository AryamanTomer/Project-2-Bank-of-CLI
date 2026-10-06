import { Component, AfterViewInit, signal } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { LoadingSkeleton } from '../../shared/directives/loading-skeleton';

import Chart from 'chart.js/auto';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatCardModule, LoadingSkeleton],
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements AfterViewInit {
  loading = signal(true);

  constructor() {
    this.fakeLoad();
  }

  fakeLoad(){
    this.loading.set(true);
    setTimeout(() => this.loading.set(false), 2000);
  }

  cardholderName = 'John Doe';
  cardNumber = '4827 1938 6274 9183';
  expirationDate = '08/30';

  ngAfterViewInit(): void {
    new Chart('balanceChart', {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
          {
            label: 'Balance',
            data: [8000, 9500, 8900, 11000, 10500, 12450],
            borderWidth: 2,
            tension: 0.4,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          y: {
            beginAtZero: false,
            ticks: {
              callback: function(value) {
                return '$' + value;
              }
            }
          }
        }
      }
    });
  }
}
