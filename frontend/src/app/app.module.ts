import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {PurchaseFormComponent} from './sales/purchase-form/purchase-form.component';
import {SharedModule} from '@shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommunicationService} from '@shared/communication.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ErrorInterceptor} from './helpers/errors.interceptor';
import {JwtInterceptor} from './helpers/jwt.interceptor';
import {GlobalErrorHandlerService} from '@shared/global-error-handler.service';

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
    {provide: ErrorHandler, useClass: GlobalErrorHandlerService},
    CommunicationService,
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
