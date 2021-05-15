import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PurchaseFormComponent} from './sales/purchase-form/purchase-form.component';
import {SharedModule} from '@shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommunicationService} from '@shared/communication.service';
import {HTTP_INTERCEPTORS, HttpClient} from '@angular/common/http';
import {ClassModel} from './classes/class.model';
import {Package} from './models/package';
import {PaymentMethod} from './models/payment-method';
import {ClassCategory} from './classes/class.category';
import {ErrorInterceptor} from './helpers/errors.interceptor';
import {JwtInterceptor} from './helpers/jwt.interceptor';

@NgModule({
  declarations: [
    AppComponent,
    PurchaseFormComponent
  ],
  imports: [
    BrowserAnimationsModule,
    BrowserModule,
    AppRoutingModule,
    SharedModule,
  ],
  providers: [
    CommunicationService,
    {
      provide: APP_INITIALIZER, useFactory: (http: HttpClient, commService: CommunicationService) => {

        return () => new Promise((resolve, _) => {
          Promise.all([http.get<Package[]>('/memberships').toPromise(),
            http.get<ClassModel[]>('/classes').toPromise(),
            http.get<PaymentMethod[]>('/paymentMethods').toPromise(),
            http.get<ClassCategory[]>('/classCategories').toPromise()])
            .then(([memberships, classes, paymentMethods, classCategories]) => {
              commService.classesSubj.next(classes);
              commService.packagesSubj.next(memberships);
              commService.paymentMethodsSubj.next(paymentMethods);
              commService.classCategoriesSubj.next(classCategories);
              resolve(true);
            });
        });
      }, deps: [HttpClient, CommunicationService], multi: true
    }, {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
