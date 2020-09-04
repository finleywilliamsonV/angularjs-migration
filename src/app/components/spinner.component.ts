import * as angular from 'angular'
import { ContactService } from '../services/contact.service'

const COMPONENT_NAME: string = 'ccSpinner'

interface ISpinnerController {
    ContactService: ContactService,
    loadMore: () => void
}

class SpinnerController implements ISpinnerController, angular.IController {

    public isLoading: boolean
    public message: string

    constructor(public ContactService: ContactService) { }

    public loadMore(): void {
        this.ContactService.loadMore()
    }
}

class SpinnerComponent implements angular.IComponentOptions {
    public restrict: string
    public templateUrl: string
    public controllerAs: string
    public controller // inferred type
    public bindings: { [boundProperty: string]: string }

    constructor() {
        this.restrict = 'AE'
        this.templateUrl = 'templates/spinner.html'
        this.controllerAs = COMPONENT_NAME
        this.controller = SpinnerController
        this.bindings = {
            isLoading: '=',
            message: '@'
        }
    }
}

angular
    .module('codecraft')
    .component(COMPONENT_NAME, new SpinnerComponent())
