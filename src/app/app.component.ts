import { Component, OnInit, ViewChild } from '@angular/core';
import { names } from './names';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import {map, startWith, tap} from 'rxjs/operators';
import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  names = names;
  sortedNames = names.slice().sort();
  nameSearchTextBox = new FormControl('');

  filteredOptions: Observable<string[]>;

  @ViewChild(CdkVirtualScrollViewport) viewPort: CdkVirtualScrollViewport;

  searchButtonDisabled = true;

  ngOnInit() {
    this.filteredOptions = this.nameSearchTextBox.valueChanges
      .pipe(
        startWith(''),
        tap(value => {if (value.length < 1) {this.searchButtonDisabled = true; }}),
        map(value => value.length >= 1 ? this._filter(value) : [])
      );
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.names.filter(name => name.toLowerCase().startsWith(filterValue));
  }

  optionSelected() {
    this.searchButtonDisabled = false;
  }

  goToSelectedName() {
    const selectedName = this.nameSearchTextBox.value;
    const index = this.sortedNames.indexOf(selectedName);
    this.viewPort.scrollToIndex(index, 'smooth');
  }
}
