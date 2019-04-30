export interface AccountingLine {
  id: number;
  cash: number;
  comment: string;
}

export interface AccountingLineAddData {
  cash: number;
  comment: string;
}

export interface SortByObj {
  column: string;
  desc: boolean;
}