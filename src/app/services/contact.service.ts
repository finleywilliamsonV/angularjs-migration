import * as angular from 'angular';

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

angular
    .module( "codecraft" )
    .factory( "ContactService", function ( Contact, $rootScope, $q, toaster ) {
        var self = {
            getPerson: function ( email ) {
                console.log( email );
                for ( var i = 0; i < self.persons.length; i++ ) {
                    var obj = self.persons[ i ];
                    if ( obj.email == email ) {
                        return obj;
                    }
                }
            },
            page: 1,
            hasMore: true,
            isLoading: false,
            isSaving: false,
            isDeleting: false,
            persons: [],
            search: null,
            sorting: "name",
            ordering: "ASC",
            doSearch: function () {
                self.hasMore = true;
                self.page = 1;
                self.persons = [];
                self.loadContacts();
            },
            doOrder: function () {
                self.hasMore = true;
                self.page = 1;
                self.persons = [];
                self.loadContacts();
            },
            loadContacts: function () {
                if ( self.hasMore && !self.isLoading ) {
                    self.isLoading = true;

                    var params = {
                        _page: self.page,
                        _sort: self.sorting,
                        _order: self.ordering,
                        q: self.search
                    };

                    Contact.query( params, function ( data ) {
                        console.debug( data );
                        angular.forEach( data, function ( person ) {
                            self.persons.push( new Contact( person ) );
                        } );

                        if ( data.length === 0 ) {
                            self.hasMore = false;
                        }
                        self.isLoading = false;
                    } );
                }
            },
            loadMore: function () {
                if ( self.hasMore && !self.isLoading ) {
                    self.page += 1;
                    self.loadContacts();
                }
            },
            updateContact: function ( person ) {
                var d = $q.defer();
                self.isSaving = true;
                person.$update().then( function () {
                    self.isSaving = false;
                    toaster.pop( "success", "Updated " + person.name );
                    d.resolve();
                } );
                return d.promise;
            },
            removeContact: function ( person ) {
                var d = $q.defer();
                self.isDeleting = true;
                var name = person.name;
                person.$remove().then( function () {
                    self.isDeleting = false;
                    var index = self.persons.indexOf( person );
                    self.persons.splice( index, 1 );
                    toaster.pop( "success", "Deleted " + name );
                    d.resolve();
                } );
                return d.promise;
            },
            createContact: function ( person ) {
                var d = $q.defer();
                self.isSaving = true;
                Contact.save( person ).$promise.then( function () {
                    self.isSaving = false;
                    self.hasMore = true;
                    self.page = 1;
                    self.persons = [];
                    self.loadContacts();
                    toaster.pop( "success", "Created " + person.name );
                    d.resolve();
                } );
                return d.promise;
            }
        };

        self.loadContacts();

        return self;
    } );
