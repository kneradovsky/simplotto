import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import contract = require('truffle-contract');
import Web3  = require('web3');

import simplotto_artifacts = require('../../../../build/contracts/Simplotoken.json');
import { WindowRefService } from './window-ref.service';



@Injectable()
export class Web3Service {
  private web3: Web3;
  private accounts: string[];
  private SimplottoType : any;
  public CurrentTour: any;
  public Simplotoken : any;

  public accountsObservable = new Subject<string[]>();
  constructor(private wnd : WindowRefService) {
    this.setupSimplotto();
    this.refreshAccounts();
   }
  
   private setupMetamaskWeb3() {
    if( typeof this.wnd.browser.web3 != undefined) {
      console.log('use metamask')
      this.web3 = new Web3(this.wnd.browser.web3.currentProvider);
    } else {
      console.log('fallback to ganache')
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:7545'));
    }
}

  private setupSimplotto() {
    this.setupMetamaskWeb3();
    this.SimplottoType = contract(simplotto_artifacts);
    this.SimplottoType.setProvider(this.web3.currentProvider);
    this.Simplotoken = this.SimplottoType.at("0x345ca3e014aaf5dca488057592ee47305d9b3e10");    
  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        alert(`There was an error fetching your accounts.`);
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length == 0) {
        alert(`Couldn't get any accounts! Make sure your Ethereum client is configured correctly.`);
        return;
      }

      if (!this.accounts || this.accounts.length != accs.length || this.accounts[0] != accs[0]) {
        console.log(`Observed new accounts`);
        this.accountsObservable.next(accs);
        this.accounts = accs;
      }
    });
  }

  public getApi() : Web3 {
    return this.web3;
  }

}
