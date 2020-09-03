import * as angular from 'angular'
import { Inject } from '@angular/core'
import { downgradeInjectable } from '@angular/upgrade/static'

import * as _ from 'lodash'

import { ContactDB, ContactRouteParams } from './contact.resource'
import { Toaster } from '../ajs-upgraded-providers'

export interface IContact {
    id: number,
    createdTs: string
    updatedTs: string
    name: string
    email: string
    sex: string
    birthdate: string
    phonenumber: string
    address: string
    city: string
    country: string
    photo: string
    favorite: boolean
}

/**
 * Class ContactService
 */
export class ContactService {

    // private member vars
    private page: number
    private hasMore: boolean
    private isLoading: boolean
    private persons: IContact[]
    private searchString: string
    private sorting: string
    private ordering: string

    // public memeber vars
    public isSaving: boolean
    public isDeleting: boolean

    /**
     * Constructor
     * @param ContactDB -- injected 
     * @param Toaster  -- injected from upgraded provider
     */
    constructor( @Inject(ContactDB) private contactDB: ContactDB,
                 @Inject(Toaster) private toaster: any ) {
        this.page = 1
        this.hasMore = true
        this.isLoading = false
        this.isSaving = false
        this.isDeleting = false
        this.persons = []
        this.searchString = ''
        this.sorting = 'name'
        this.ordering = 'ASC'

        this.loadContacts()
    }

    /**
     * Returns a Contact from the DB
     * @param email 
     */
    public getPerson = ( email: string ): IContact => {
        return _.find( this.persons, ( person: IContact ) => person.email == email )
    }

    /**
     * Performs the search on the db
     */
    public doSearch = (): void => {
        this.hasMore = true
        this.page = 1
        this.persons = []
        this.loadContacts()
    }

    /**
     * Performs the ordering on the results
     */
    public doOrder = (): void => {
        this.hasMore = true
        this.page = 1
        this.persons = []
        this.loadContacts()
    }

    /**
     * Loads current set of contacts from the db
     */
    public loadContacts = async (): Promise<void> => {
        if ( this.hasMore && !this.isLoading ) {
            this.isLoading = true

            const params: ContactRouteParams = {
                _page: this.page.toString(),
                _sort: this.sorting,
                _order: this.ordering,
                q: this.searchString
            }

            const response: IContact[] = await this.contactDB.query( params )
            this.persons.push( ...response )

            if ( response.length === 0 ) {
                this.hasMore = false
            }
            this.isLoading = false
        }
    }

    /**
     * Loads the next page of contacts
     */
    public loadMore = (): void => {
        if ( this.hasMore && !this.isLoading ) {
            this.page += 1
            this.loadContacts()
        }
    }

    /**
     * Updates the contact info for a particular person
     * @param person 
     */
    public updateContact = async ( person ): Promise<void> => {
        this.isSaving = true
        await this.contactDB.update( person )
        this.isSaving = false
        this.toaster.pop( "success", "Updated " + person.name )
        console.log( "success", "Updated " + person.name )
    }

    /**
     * Removes a contact from the DB
     * @param person 
     */
    public removeContact = async ( person ): Promise<void> => {
        this.isDeleting = true
        const name: string = person.name
        await this.contactDB.remove( person )
        this.isDeleting = false
        const index: number = this.persons.indexOf( person )
        this.persons.splice( index, 1 )
        this.toaster.pop( "success", "Deleted " + name )
        console.log( "success", "Deleted " + name )
    }

    /**
     * Creates a contact and adds it to the DB
     * @param person 
     */
    public createContact = async ( person ): Promise<void> => {
        this.isSaving = true
        await this.contactDB.save( person )
        this.isSaving = false
        this.hasMore = true
        this.page = 1
        this.persons = []
        this.loadContacts()
        this.toaster.pop( "success", "Created " + person.name )
        console.log( "success", "Created " + person.name )
    }
}

angular
    .module( "codecraft" )
    // change from service to factory to downgrade
    .factory( "ContactService", downgradeInjectable(ContactService) )
