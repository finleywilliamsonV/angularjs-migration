// AngularJS imports
import * as angular from 'angular';

// Angular imports
import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl } from "@angular/forms";
import { downgradeComponent } from '@angular/upgrade/static';

// RxJS imports
import { debounceTime, distinctUntilChanged, tap } from 'rxjs/operators'

// local imports
import { ContactService } from '../services/contact.service';

// constants
const COMPONENT_NAME: string = 'search'
const TEMPLATE_URL: string = 'templates/searchform.html' 

@Component( {
    selector: COMPONENT_NAME,
    templateUrl: TEMPLATE_URL
} )
export class SearchComponent implements OnInit {

    protected myForm: FormGroup

    constructor( @Inject( ContactService ) public contactService: ContactService ) {
        this.myForm = new FormGroup({
            searchParam: new FormControl(),
            sortParam: new FormControl('name'),
            orderParam: new FormControl('ASC')
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
            .subscribe(({sortParam, orderParam, searchParam}) => {
                this.contactService.searchParam = searchParam
                this.contactService.sortParam = sortParam
                this.contactService.orderParam = orderParam
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