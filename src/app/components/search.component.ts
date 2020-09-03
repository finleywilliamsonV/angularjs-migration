import * as angular from 'angular';
import { Component, Inject } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { downgradeComponent } from '@angular/upgrade/static';

import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators'

import { ContactService } from '../services/contact.service';

const COMPONENT_NAME: string = 'search'
const TEMPLATE_URL: string = 'templates/searchform.html'

interface ISearchController {
    contactService: ContactService,
    loadMore: () => void
}

@Component( {
    selector: COMPONENT_NAME,
    template:
    `
        <form class="navbar-form navbar-left" [formGroup]="myForm">

            <div class="form-group">
            <input id="name"
                   class="form-control"
                   type="text"
                   placeholder="Search name..."
                   formControlName="searchString"/>
            </div>

            <div class="form-group">
                <select class="form-control"
                        formControlName="sorting">

                    <option value="name">Name</option>
                    <option value="email">Email</option>
                </select>
            </div>

            <div class="form-group">
            
                <select class="form-control"
                        formControlName="ordering">

                    <option value="ASC">ASC</option>
                    <option value="DESC">DESC</option>
                </select>
            </div>
        </form>
    `
} )
export class SearchComponent implements ISearchController, angular.IController {

    protected myForm: FormGroup

    constructor( @Inject( ContactService ) public contactService: ContactService ) {
        this.myForm = new FormGroup({
            searchString: new FormControl(),
            sorting: new FormControl('name'),
            ordering: new FormControl('ASC')
        })
    }

    ngOnInit() {
        this.myForm
            .valueChanges
            .pipe(
                debounceTime(400),
                distinctUntilChanged(),
                tap(console.log)
            )
            .subscribe(({sorting, ordering, searchString}) => {
                this.contactService.searchString = searchString
                this.contactService.sorting = sorting
                this.contactService.ordering = ordering
                this.contactService.doSearch()
            })
    }

    public loadMore(): void {
        this.contactService.loadMore()
    }
}

angular
    .module('codecraft')
    .directive(COMPONENT_NAME, downgradeComponent({
        component: SearchComponent
    }))