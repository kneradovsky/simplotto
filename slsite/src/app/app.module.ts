import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { AccountsComponent } from './accounts/accounts.component';
import { Web3Service } from './services/web3.service';
import { WindowRefService } from './services/window-ref.service';
import { EthValuePipe } from './pipes/eth.pipe';


@NgModule({
  declarations: [
    AppComponent,
    AccountsComponent,
    EthValuePipe
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
