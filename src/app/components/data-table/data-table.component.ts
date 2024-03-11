import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';

import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../confirmation-dialog/confirmation-dialog.component';
import { PersonFormDialogComponent } from '../person-form-dialog/person-form-dialog.component';
import { PersonService } from 'src/app/core/services/person.service';
import { Person } from 'src/app/core/models/person';
import { Observable } from 'rxjs';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss']
})
export class DataTableComponent implements OnInit, OnDestroy, AfterViewInit {
  @Output() onUpdateStats: EventEmitter<Object> = new EventEmitter();
 stats: Observable<Object>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  public displayedColumns: string[] = ['firstName', 'lastName', 'dob','address','city','state','phone','email','profilePic'];
  public columnsToDisplay: string[] = [...this.displayedColumns, 'actions'];

  /**
   * it holds a list of active filter for each column.
   * example : {firstName: {contains : 'person 1'}}
   **/
  public columnsFilters = {};

  public dataSource: MatTableDataSource<Person>;
  private serviceSubscribe: Subscription;

  constructor(private personsService: PersonService, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource<Person>();
  }


  private filter() {

    this.dataSource.filterPredicate = (data: Person, filter: string) => {
      let find = true;

      for (var columnName in this.columnsFilters) {

        let currentData = "" + data[columnName];

        //if there is no filter, jump to next loop, otherwise do the filter.
        if (!this.columnsFilters[columnName]) {
          return;
        }


        let searchValue = this.columnsFilters[columnName]["contains"];

        if (!!searchValue && currentData.indexOf("" + searchValue) < 0) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["equals"];
        if (!!searchValue && currentData != searchValue) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["greaterThan"];
        if (!!searchValue && currentData <= searchValue) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["lessThan"];
        if (!!searchValue && currentData >= searchValue) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["startWith"];

        if (!!searchValue && !currentData.startsWith("" + searchValue)) {
          find = false;
          //exit loop
          return;
        }

        searchValue = this.columnsFilters[columnName]["endWith"];
        if (!!searchValue && !currentData.endsWith("" + searchValue)) {
          find = false;
          //exit loop
          return;
        }

      }

      return find;
    };

    this.dataSource.filter = null;
    this.dataSource.filter = 'activate';

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  /**
   * Create a filter for the column name and operate the filter action.
   */
  applyFilter(columnName: string, operationType: string, searchValue: string) {
    this.columnsFilters[columnName] = {};
    this.columnsFilters[columnName][operationType] = searchValue;
    this.filter();
  }

  /**
   * clear all associated filters for column name.
   */
  clearFilter(columnName: string) {
    if (this.columnsFilters[columnName]) {
      delete this.columnsFilters[columnName];
      this.filter();
    }
  }


  edit(data: Person) {
    const dialogRef = this.dialog.open(PersonFormDialogComponent, {
      width: '400px',
      data: data
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personsService.edit(result);
      }
    });
  }

  addRow(): Promise<string> {

      const dialogRef = this.dialog.open(PersonFormDialogComponent, {
        width: '400px',
        data: {address: null,
addressLine2: null,
city:null,
description: null,
dob: null,
email: null,
firstName: null,
id: null,
lastName:null,
phone: null,
profilePic: null,
researchCode: null,
state: null,
zipCode: null}
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.personsService.add(result);
        }
      });
 }

  delete(id: any) {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personsService.remove(id);
      }
    });
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  /**
   * initialize data-table by providing persons list to the dataSource.
   */
  ngOnInit() {
    const data1 = this.personsService.getAll()
    // this.data1.subscribe(res => {
      // this.dataSource.data.push(res);
    // })
    this.serviceSubscribe = this.personsService.changeVar.subscribe(res => {
      if(Object.keys(res).length !== 0){
      this.dataSource.data = res;
    }
    })
  }

  ngOnDestroy(): void {
    this.serviceSubscribe.unsubscribe();
  }

}
