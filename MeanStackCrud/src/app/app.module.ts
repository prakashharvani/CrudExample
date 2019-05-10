import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ListUserComponent } from './list-user/list-user.component';
import { AddUserComponent } from './add-user/add-user.component';
import { LoginComponent } from './login/login.component';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './user.service';
import { ToastrModule } from 'ngx-toastr';
import { EditUserComponent } from './edit-user/edit-user.component';

@NgModule({
  declarations: [
    AppComponent,
    ListUserComponent,
    AddUserComponent,
    LoginComponent,
    EditUserComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 2000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      enableHtml: true,
    }),

  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
