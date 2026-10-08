import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Account } from '../models/Account.model';


interface AccountRecord {
    accountId: string;
    accountPin: string;
    accountName: string;
    balance: number;
    dateCreated: string;
}

@Injectable({ providedIn: 'root'})
export class BankService {

    private readonly storageKey = 'currentAccountId';

    readonly accountsLoaded = signal<boolean>(false);

    readonly currentAccountId = signal<string | null>(null);

    private accounts = new Map<string, AccountRecord>();

    constructor(private readonly http: HttpClient) {
        const savedId = localStorage.getItem(this.storageKey);
        if(savedId) {
            this.currentAccountId.set(savedId);
        }
        this.loadFromFile();
    }

    loadFromFile(): void {
        this.http.get<AccountRecord[]>('accounts.json').subscribe((accounts) => {
            this.load(accounts);
            this.accountsLoaded.set(true);
        });
    }

    load(accountSeed: AccountRecord[]): void {
        this.accounts.clear();

        for(const record of accountSeed) {
            this.accounts.set(record.accountId, {
                ...record,
                dateCreated: new Date(record.dateCreated).toISOString(),
            });
        }
    }

    getAccount(accountId: string): Account | undefined {
        const record = this.accounts.get(accountId);
        if(!record) return undefined;

        return { ...record, dateCreated: new Date(record.dateCreated) };
    }

    login(accountId: string, accountPin: string): string {
        const account = this.getAccount(accountId);
        if(!account || account.accountPin !== accountPin) {
            return 'Invalid credentials. Please try again, your account may not exist.';
        }
        this.currentAccountId.set(accountId);
        localStorage.setItem(this.storageKey, accountId);
        return '';
    }

    register(accountId: string, accountPin: string, accountName: string): string {
        if(this.accounts.has(accountId)) {
            return 'Account ID already exists. Please try a different account ID.';
        }
        this.accounts.set(accountId, {
            accountId,
            accountPin,
            accountName,
            balance: 0,
            dateCreated: new Date().toISOString(),
        });
        return '';
    }
}
