import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';


import { AppComponent } from './app.component';
import { AccountComponent } from './accounts/accounts.component';
import { Web3Service } from './services/web3.service';
import { WindowRefService } from './services/window-ref.service';
import { EthValuePipe } from './pipes/eth.pipe';
import { TicketsComponent } from './tickets/tickets.component';
import { LastresultsComponent } from './lastresults/lastresults.component';
import { GameresultsComponent } from './gameresults/gameresults.component';
import { ErrorsComponent } from './errors/errors.component';
import { ErrorService } from './services/error.service';


@NgModule({
  declarations: [
    AppComponent,
    AccountComponent,
    EthValuePipe,
    TicketsComponent,
    LastresultsComponent,
    GameresultsComponent,
    ErrorsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule.forRoot()
  ],
  providers: [
    Web3Service,
    WindowRefService,
    ErrorService
  ],
  entryComponents : [ErrorsComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
