import { Component, OnInit } from '@angular/core';

import { Ng2BootstrapConfig, Ng2BootstrapTheme } from '../utils/ng2-bootstrap-config';
import { DatePickerInnerComponent } from './datepicker-inner.component';

@Component({
  selector: 'yearpicker',
  template: `
<table *ngIf="datePicker.datepickerMode==='year'" role="grid">
  <thead>
    <tr>
      <th>
        <button type="button" class="btn btn-default btn-sm pull-left"
                (click)="datePicker.move(-1)" tabindex="-1">
          <i class="glyphicon glyphicon-chevron-left"></i>
        </button>
      </th>
      <th [attr.colspan]="((datePicker.yearColLimit - 2) <= 0) ? 1 : datePicker.yearColLimit - 2">
        <button [id]="datePicker.uniqueId + '-title'" role="heading"
                type="button" class="btn btn-default btn-sm"
                (click)="datePicker.toggleMode()"
                [disabled]="datePicker.datepickerMode === datePicker.maxMode"
                [ngClass]="{disabled: datePicker.datepickerMode === datePicker.maxMode}" tabindex="-1" style="width:100%;">
          <strong>{{title}}</strong>
        </button>
      </th>
      <th>
        <button type="button" class="btn btn-default btn-sm pull-right"
                (click)="datePicker.move(1)" tabindex="-1">
          <i class="glyphicon glyphicon-chevron-right"></i>
        </button>
      </th>
    </tr>
  </thead>
  <tbody>
    <tr *ngFor="let rowz of rows">
      <td *ngFor="let dtz of rowz" class="text-center" role="gridcell">
        <button type="button" style="min-width:100%;" class="btn btn-default"
                [ngClass]="{'btn-link': isBS4 && !dtz.selected && !datePicker.isActive(dtz), 'btn-info': dtz.selected || (isBS4 && !dtz.selected && datePicker.isActive(dtz)), disabled: dtz.disabled, active: !isBS4 && datePicker.isActive(dtz)}"
                [disabled]="dtz.disabled"
                (click)="datePicker.select(dtz.date)" tabindex="-1">
          <span [ngClass]="{'text-success': isBS4 && dtz.current, 'text-info': !isBS4 && dtz.current}">{{dtz.label}}</span>
        </button>
      </td>
    </tr>
  </tbody>
</table>
  `
})
export class YearPickerComponent implements OnInit {
  public datePicker:DatePickerInnerComponent;
  public title:string;
  public rows:any[] = [];

  public constructor(datePicker:DatePickerInnerComponent) {
    this.datePicker = datePicker;
  }

  public get isBS4():boolean {
    return Ng2BootstrapConfig.theme === Ng2BootstrapTheme.BS4;
  }

  public ngOnInit():void {
    let self = this;

    this.datePicker.stepYear = {years: this.datePicker.yearRange};

    this.datePicker.setRefreshViewHandler(function ():void {
      let years:any[] = new Array(this.yearRange);
      let date:Date;
      let start = self.getStartingYear(this.activeDate.getFullYear());

      for (let i = 0; i < this.yearRange; i++) {
        date = new Date(start + i, 0, 1);
        date = this.fixTimeZone(date);
        years[i] = this.createDateObject(date, this.formatYear);
        years[i].uid = this.uniqueId + '-' + i;
      }

      self.title = [years[0].label,
        years[this.yearRange - 1].label].join(' - ');
      self.rows = this.split(years, self.datePicker.yearColLimit);
    }, 'year');

    this.datePicker.setCompareHandler(function (date1:Date, date2:Date):number {
      return date1.getFullYear() - date2.getFullYear();
    }, 'year');

    this.datePicker.refreshView();
  }

  protected getStartingYear(year:number):number {
    // todo: parseInt
    return ((year - 1) / this.datePicker.yearRange) * this.datePicker.yearRange + 1;
  }
}
