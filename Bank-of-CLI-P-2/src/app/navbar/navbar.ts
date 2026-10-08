import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { NgIcon, provideIcons } from '@ng-icons/core';
import { lucideLogOut } from '@ng-icons/lucide';
import { AuthService } from '../service/auth/auth.service';
import { Logo } from '../shared/components/logo/logo';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive, Logo, NgIcon],
  viewProviders: [provideIcons({ lucideLogOut })],

  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar {
  private readonly authService = inject(AuthService);
  constructor(private router: Router) {}

  protected readonly transactionLinks = [
    { path: '/transactions/deposit', label: 'Deposit' },
    { path: '/transactions/withdraw', label: 'Withdraw' },
    { path: '/transactions/transfer', label: 'Transfer' },
  ];

  protected readonly menuOpen = signal(false);

  private hovering = false;

  protected onPointerEnter(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      this.hovering = true;
      this.menuOpen.set(true);
    }
  }

  protected onPointerLeave(event: PointerEvent): void {
    if (event.pointerType === 'mouse') {
      this.hovering = false;
      this.closeMenu();
    }
  }

  protected toggleMenu(): void {
    if (!this.hovering) {
      this.menuOpen.update((open) => !open);
    }
  }

  protected closeMenu(): void {
    this.menuOpen.set(false);
  }

  protected onFocusOut(event: FocusEvent): void {
    const next = event.relatedTarget as Node | null;
    if (!(event.currentTarget as HTMLElement).contains(next)) {
      this.closeMenu();
    }
  }

  protected logout() {
    this.authService.logout();
    this.router.navigate(['login']);
  }
}
