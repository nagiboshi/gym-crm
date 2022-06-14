import {BrowserModule} from '@angular/platform-browser';
import {ApplicationRef, ComponentFactoryResolver, DoBootstrap, ErrorHandler, Inject, NgModule, Type} from '@angular/core';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {SharedModule} from '@shared/shared.module';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommunicationService} from '@shared/communication.service';
import {HTTP_INTERCEPTORS} from '@angular/common/http';
import {ErrorInterceptor} from './helpers/errors.interceptor';
import {GlobalErrorHandlerService} from '@shared/global-error-handler.service';
import {AppMenuComponent} from './app-menu/app-menu.component';
import {MainComponent} from './main/main.component';
import {FormOutletComponent} from './forms/form-outlet/form-outlet.component';
import { FormListComponent } from './forms/form-list/form-list.component';
import { FormBuilderComponent } from './forms/form-builder/form-builder.component';
import { DynamicFormComponent } from './forms/dynamic-form/dynamic-form.component';

@NgModule({
  declarations: [
    AppComponent,
    AppMenuComponent,
    MainComponent,
    FormOutletComponent,
    FormListComponent,
    FormBuilderComponent,
    DynamicFormComponent
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
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent]
})
export class AppModule  {

}
