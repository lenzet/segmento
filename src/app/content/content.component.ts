import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AccountingLine, AccountingLineAddData, SortByObj } from '../models/accounting.model';
import { AccountingService } from '../services/accounting.service';
import { TestData } from './data';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html'
})
export class ContentComponent implements OnInit {

  accountingTable: AccountingLine[];
  sortBy: SortByObj;

  showPopup: boolean = false;
  popupId: number;
  popupForm: FormGroup;

  pages: number[];
  currentPage: number;
  pageSize: number = 10;

  constructor(private fb: FormBuilder,
        private route: ActivatedRoute,
        private accountingService: AccountingService) { }

  countPages(): void {
    this.pages = [];
    let pagesCount = Math.ceil(this.accountingService.getLinesCount() / this.pageSize);
    for (let i = 1; i <= pagesCount; i++) {
      this.pages.push(i);
    }
  }

  stopE(e): void {
    e.stopPropagation();
  }

  displayPopup(id=this.accountingService.getNextId()): void {
    let cash: number = null;
    let comment: string = null;
    this.popupId = id;

    if (id !== this.accountingService.getNextId()) {
      let row = this.accountingService.getLine(id);
      cash = row.cash;
      comment = row.comment;
    }
    this.showPopup = true;
    this.popupForm = this.fb.group({
      cash: new FormControl(cash, [
          Validators.required,
          Validators.pattern('(^-?([0]+)?[1-9]([0-9]+)?([.][0-9]{1,2})?$)|(^-?[0]+[.][0][1-9]$)|(^-?[0]+[.][1-9][0-9]?$)'),
          Validators.min(-1000),
          Validators.max(1000)
        ]
      ),
      comment: new FormControl(comment, [
          Validators.required,
          Validators.maxLength(512),
          Validators.pattern('^[а-яА-ЯёЁa-zA-Z0-9]([а-яА-ЯёЁa-zA-Z0-9.,:;!?\\- ]+)?$')
        ]
      )
    });
  }

  onSubmit(): void {
    let id = this.popupId;
    let cash: number = +this.popupForm.value.cash;
    let comment: string = this.popupForm.value.comment;

    if (id === this.accountingService.getNextId()) {
      let data: AccountingLineAddData = {
        cash: cash,
        comment: comment
      };
      this.accountingTable = this.accountingService.addLine(data);
      if (this.accountingService.getLinesCount() % this.pageSize === 1) this.countPages();
    } else {
      let data: AccountingLineAddData = {
        cash: cash,
        comment: comment  
      };
      this.accountingTable = this.accountingService.editLine(id, data);
    }
    this.showPopup = false;
  }

  ngOnInit() {
    this.accountingService.addLines(TestData);
    this.sortBy = {column: 'id', desc: false};
    this.countPages();

    this.route.queryParams.subscribe(params => {
      this.accountingTable = this.accountingService.getLines();
      this.currentPage = +params.page || 1;
      if (this.currentPage > Math.ceil(this.accountingService.getLinesCount() / this.pageSize))
        this.currentPage = 1;
      if (params.sortBy) {
        let column: string = params.sortBy;
        let desc: boolean = params.desc === 'false' ? false : true;
        this.sortBy = {column: column, desc: desc};
      }
    });
  }

}