import { Pipe, PipeTransform } from '@angular/core';
import { AccountingLine } from '../models/accounting.model';

@Pipe({
  name: 'accountingLinesPipe'
})
export class AccountingLinesPipe implements PipeTransform {

  transform(lines: AccountingLine[],
            sortBy: string,
            desc: boolean,
            pageNumber: number,
            pageSize: number): AccountingLine[] {

    let result: AccountingLine[] = lines.sort((a: AccountingLine, b: AccountingLine): number => {
      if (a[sortBy] > b[sortBy]) {
        return desc ? -1 : 1;
      }
      if (a[sortBy] < b[sortBy]) {
        return desc ? 1 : -1;
      }
    });
    let indexFrom: number = pageNumber * pageSize - pageSize;
    result = result.splice(indexFrom, pageSize);
    return result;

  }

}
