import 'angular'
import 'angular-resource'
import 'angular-animate'
import 'ng-infinite-scroll'
import 'angular-spinner'
import 'angular-auto-validate/dist/jcs-auto-validate'
import 'angular-ladda'
import 'angular-strap'
import 'angularjs-toaster'
import 'angular-ui-router'

// for some reason we need to import external module css separately
import 'angularjs-toaster/toaster.css'

import './app.main'
import './services'
import './components'
import './filters'
import './app.routes'

import './polyfills.ts'

// FontAwesome Compatibility
import { library, dom } from '@fortawesome/fontawesome-svg-core'
import { faMapMarker, faGift, faEnvelope, faPencilAlt, faTrash, faFemale, faMale } from '@fortawesome/free-solid-svg-icons'

library.add(faMale, faFemale, faMapMarker, faGift, faEnvelope, faPencilAlt, faTrash)
dom.watch()

// Angular Booting
import { NgModule, NgModuleRef } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { UpgradeModule } from '@angular/upgrade/static'
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic'
import { HttpClientModule } from '@angular/common/http'
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { ContactDB } from './services/contact.resource'
import { ContactService } from './services/contact.service'
import { ToasterServiceProvider } from './ajs-upgraded-providers'
import { SearchComponent } from './components/search.component'

/**
 * how to deal with injection
 * https://codecraft.tv/courses/angularjs-migration/step-7-migrate-services-to-angular/migrate-contact-resource/
 */

@NgModule({
    imports: [
        BrowserModule,
        UpgradeModule,
        HttpClientModule,
        FormsModule,
        ReactiveFormsModule
    ],
    providers: [
        ContactDB,
        ContactService,
        ToasterServiceProvider
    ],

    // VERY IMPORTANT
    // all components that we need to downgrade should be added to declarations and entryComponents
    declarations: [
        SearchComponent
    ],
    entryComponents: [
        SearchComponent
    ]
})

export class AppModule {
    // Override Angular bootstrap so it doesn't do anything
    ngDoBootstrap(): void {
        return
    }
}

// Bootstrap using the UpgradeModule
platformBrowserDynamic()
    .bootstrapModule(AppModule)
    .then((platformRef: NgModuleRef<AppModule>): void => {
        console.log('Bootstrapping in Hybrid mode with Angular & AngularJS')
        const upgrade: UpgradeModule = platformRef.injector.get(UpgradeModule) as UpgradeModule
        upgrade.bootstrap(document.body, ['codecraft'])
    })