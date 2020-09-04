import * as angular from 'angular'
import { ContactService } from '../services/contact.service'

const COMPONENT_NAME: string = 'personList'

interface IPersonListController {
    ContactService: ContactService
}

class PersonListController implements IPersonListController, angular.IController {

    constructor(public ContactService: ContactService) { }
}

class PersonListComponent implements angular.IComponentOptions {

    public templateUrl: string
    public controllerAs: string
    public controller // inferred type

    constructor() {
        this.templateUrl = 'templates/list.html'
        this.controllerAs = COMPONENT_NAME
        this.controller = PersonListController
    }
}

angular
    .module('codecraft')
    .component(COMPONENT_NAME, new PersonListComponent())
