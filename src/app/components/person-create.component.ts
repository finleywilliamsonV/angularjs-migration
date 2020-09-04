import * as angular from 'angular'
import { ContactService, IContact } from '../services/contact.service'

const COMPONENT_NAME: string = 'personCreate'

interface IPersonCreateController {
    ContactService: ContactService,
    person: IContact,
    save: () => Promise<void>
}

class PersonCreateController implements IPersonCreateController, angular.IController {

    public person

    constructor(public ContactService: ContactService,
                private $state
    ) {
        this.person = {}
    }

    public async save(): Promise<void> {
        await this.ContactService.createContact(this.person)
        this.$state.go('list')
    }
}

class PersonCreateComponent implements angular.IComponentOptions {
    public templateUrl: string
    public controllerAs: string
    public controller // inferred type

    constructor() {
        this.templateUrl = 'templates/create.html'
        this.controllerAs = COMPONENT_NAME
        this.controller = PersonCreateController
    }
}

angular
    .module('codecraft')
    .component(COMPONENT_NAME, new PersonCreateComponent())
