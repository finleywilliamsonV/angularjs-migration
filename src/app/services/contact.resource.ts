import * as angular from 'angular';
import { IContact } from './contact.service';
import { HttpClient } from '@angular/common/http'
import {Injectable, Inject} from '@angular/core'
import {downgradeInjectable} from '@angular/upgrade/static'

export type ContactRouteParams = {
    _page: string,
    _sort: string,
    _order: string,
    q: string   // query string
}

@Injectable()
export class ContactDB {

    private readonly apiRoot: string = 'http://localhost:3000/contacts'
    
    constructor( @Inject(HttpClient) private http: HttpClient ) { }

    query( params: ContactRouteParams ): Promise<Object> {
        const queryResults = this.http.get( this.apiRoot, { params: params } ).toPromise()
        return queryResults
    }

    get( id, params?: ContactRouteParams ): Promise<Object> {
        return this.http.get( this.apiRoot + '/' + id, { params: params } ).toPromise()
    }

    save( person: IContact ): Promise<Object> {
        return this.http.post( this.apiRoot, person ).toPromise()
    }

    update( person: IContact ): Promise<Object> {
        return this.http.put( this.apiRoot + '/' + person.id, person ).toPromise()
    }

    remove( person: IContact ): Promise<Object> {
        return this.http.delete( this.apiRoot + '/' + person.id ).toPromise()
    }
}

angular
    .module( "codecraft" )
    // change from service to factory to downgrade
    .factory( "ContactDB", downgradeInjectable(ContactDB) );