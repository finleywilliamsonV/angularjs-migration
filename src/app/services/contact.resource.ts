import { IContact } from './contact.service';
import { HttpClient } from '@angular/common/http'
import { Inject } from '@angular/core'

export type ContactRouteParams = {
    _page: string,
    _sort: string,
    _order: string,
    q: string   // query string
}


export class ContactDB {

    private readonly apiRoot: string = 'http://localhost:3000/contacts'

    constructor( @Inject( HttpClient ) private http: HttpClient ) { }

    query( params: ContactRouteParams ): Promise<IContact[]> {
        return this.http.get<IContact[]>( this.apiRoot, { params: params } ).toPromise()
    }

    get( id, params?: ContactRouteParams ): Promise<IContact> {
        return this.http.get<IContact>( this.apiRoot + '/' + id, { params: params } ).toPromise()
    }

    save( person: IContact ): Promise<IContact> {
        return this.http.post<IContact>( this.apiRoot, person ).toPromise()
    }

    update( person: IContact ): Promise<IContact> {
        return this.http.put<IContact>( this.apiRoot + '/' + person.id, person ).toPromise()
    }

    remove( person: IContact ): Promise<IContact> {
        return this.http.delete<IContact>( this.apiRoot + '/' + person.id ).toPromise()
    }
}

// removed all angularJS code because this is now a complete Angular service