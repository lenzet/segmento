import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { AccountingLine, AccountingLineAddData } from '../models/accounting.model';

@Injectable({
  providedIn: 'root'
})
export class AccountingService {

  private _accountingList: AccountingLine[];
  private _nextId: number;
  private _totalBudget: number;
  private _totalBudgetSource: BehaviorSubject<number>;

  constructor() {
    this._accountingList = [];
    this._nextId = 1;
    this._totalBudget = 0;
    this._totalBudgetSource = new BehaviorSubject<number>(0);
  }

  private _copyList(): AccountingLine[] {
    return JSON.parse(JSON.stringify(this._accountingList));
  }

  public getLines(): AccountingLine[] {
    return this._copyList();
  }

  public getLine(id): AccountingLine {
    for (let i = 0; i < this._accountingList.length; i++) {
      if (this._accountingList[i].id === id)
        return {
          id: this._accountingList[i].id,
          cash: this._accountingList[i].cash,
          comment: this._accountingList[i].comment
        };
    }
  }

  public addLine(data: AccountingLineAddData): AccountingLine[] {
    let insertData: AccountingLine = {
      id: this._nextId++,
      cash: data.cash,
      comment: data.comment
    };
    this._accountingList.push(insertData);
    this._totalBudget += insertData.cash;
    this._totalBudgetSource.next(this._totalBudget);
    return this._copyList();
  }

  public addLines(data: AccountingLineAddData[]): AccountingLine[] {
    data.forEach(elem => {
      this.addLine(elem);
    });
    return this._copyList();
  }

  public editLine(id: number, data: AccountingLineAddData): AccountingLine[] {
    this._accountingList.forEach(elem => {
      if (elem.id === id) {
        this._totalBudget = this._totalBudget - elem.cash + data.cash;
        this._totalBudgetSource.next(this._totalBudget);
        elem.cash = data.cash;
        elem.comment = data.comment;
      }
    });
    return this._copyList();
  }

  public getLinesCount(): number {
    return this._accountingList.length;
  }

  public getTotalBudget(): Observable<number> {
    return this._totalBudgetSource.asObservable();
  }

  public getNextId(): number {
    return this._nextId;
  }

}