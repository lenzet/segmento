import { Component, OnInit } from '@angular/core';
import { AccountingService } from '../services/accounting.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit {

  totalBudget: number;

  constructor(private accountingService: AccountingService) { }

  getTotalBudget(): void {
    this.accountingService.getTotalBudget().subscribe(budget => {
      this.totalBudget = budget;
    });
  }

  ngOnInit() {
    this.getTotalBudget();
  }

}
