import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PurchaseFormComponent} from './sales/purchase-form/purchase-form.component';
import {SharedModule} from './shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommunicationService} from './shared/communication.service';
import {HttpClient} from '@angular/common/http';
import {PrimalClassModel} from './classes/primal-class.model';
import {MembershipService} from './models/membership-service.model';

@NgModule({
    declarations: [
        AppComponent,
        PurchaseFormComponent
    ],
    imports: [
        BrowserAnimationsModule,
        BrowserModule,
        AppRoutingModule,
        SharedModule
    ],
    providers: [
        CommunicationService,
        {
            provide: APP_INITIALIZER, useFactory: (http: HttpClient, commService: CommunicationService) => {

                return () => new Promise((resolve, _) => {
                    Promise.all([http.get<MembershipService[]>('/memberships').toPromise(),
                        http.get<PrimalClassModel[]>('/classes').toPromise()]).then(([memberships, classes]) => {
                        commService.primalClassSubj.next(classes);
                        commService.membershipServicesSubj.next(memberships);
                        resolve();
                    });
                });
            }, deps: [HttpClient, CommunicationService], multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}
