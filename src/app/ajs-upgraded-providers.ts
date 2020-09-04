/**
 * Makes AngularJS Toaster injectable into AngularJS
 * Can be replicated with other AngularJS dependencies
 */

import { InjectionToken, Injector, FactoryProvider } from '@angular/core'

export const Toaster: InjectionToken<string> = new InjectionToken('Toaster')

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const ToasterServiceFactory: any = ($injector: Injector) => $injector.get('toaster')    // returns AngularJS toaster service

export const ToasterServiceProvider: FactoryProvider = {
    provide: Toaster,
    useFactory: ToasterServiceFactory,
    deps: ['$injector'] // from AngularJS
}