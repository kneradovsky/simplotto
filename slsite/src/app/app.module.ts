import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AccountsComponent } from './accounts/accounts.component';
import { Web3Service } from './web3.service';
import { WindowRefService } from './window-ref.service';


@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    Web3Service,
    WindowRefService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
