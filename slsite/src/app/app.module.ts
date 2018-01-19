import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { AccountComponent } from './accounts/accounts.component';
import { Web3Service } from './services/web3.service';
import { WindowRefService } from './services/window-ref.service';
import { EthValuePipe } from './pipes/eth.pipe';
import { TicketsComponent } from './tickets/tickets.component';
import { LastresultsComponent } from './lastresults/lastresults.component';
import { GameresultsComponent } from './gameresults/gameresults.component';


@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    EthValuePipe,
    TicketsComponent,
    LastresultsComponent,
    GameresultsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule
  ],
  providers: [
    Web3Service,
    WindowRefService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
