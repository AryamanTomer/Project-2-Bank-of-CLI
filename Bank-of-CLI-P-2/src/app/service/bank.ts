import { Injectable } from '@angular/core';
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
    private accounts = new Map<string, AccountRecord>();

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
}