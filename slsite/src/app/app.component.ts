import { Component, ChangeDetectorRef } from '@angular/core';
import {Web3Service} from './services/web3.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';
  accounts:string[] = [];
  account: string = "";

  constructor(private web3:  Web3Service,private ref: ChangeDetectorRef) { 
    web3.accountsObservable.subscribe(accs => {
      this.accounts = accs;
      if(this.account==undefined || this.account == "") this.account=accs[0];
    });
  }
}
