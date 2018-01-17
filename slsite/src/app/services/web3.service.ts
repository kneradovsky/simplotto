import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import contract = require('truffle-contract');
import Web3  = require('web3');

import simplotto_artifacts = require('../../../../build/contracts/Simplotoken.json');
import gametour_artifacts = require('../../../../build/contracts/GameTour.json');
import { WindowRefService } from './window-ref.service';




@Injectable()
export class Web3Service {
  private web3: Web3;
  private accounts: string[];
  private SimplottoType : any;
  public GameTourType : any;
  public CurrentTour: any;
  public SLT8 : any;

  public accountsObservable = new Subject<string[]>();
  //token events sinks
  public pricesChange = new Subject<any>();
  public ticketBought = new Subject<any>();
  public tourStarted = new Subject<any>();
  public tourClosed = new Subject<any>();
  public onTransfer = new Subject<any>();

  constructor(private wnd : WindowRefService) {
    this.setupSimplotto();
    this.refreshAccounts();
   }
  
   private setupMetamaskWeb3() {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    
    this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));
    /*
    if( typeof this.wnd.browser.web3 != undefined) {
      console.log('use metamask')
      this.web3 = new Web3(this.wnd.browser.web3.currentProvider);
    } else {
      console.log('fallback to ganache')
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));
    }
    */
}

  private setupSimplotto() {
    this.setupMetamaskWeb3();
    this.SimplottoType = contract(simplotto_artifacts);
    this.SimplottoType.setProvider(this.web3.currentProvider);
    this.GameTourType = contract(gametour_artifacts);
    this.GameTourType.setProvider(this.web3.currentProvider);
    //this.SimplottoType.deployed().then(instance => this.Simplotoken=instance);
    this.SLT8 = this.SimplottoType.deployed().then(ct => {
      this.SLT8 = ct;
      this.setupEvents(this.SLT8);
    });
    
  }

  private setupEvents(source:any) {
      source.PricesChanged().watch((err,event) => this.pricesChange.next(event));
      source.TicketBought().watch((err,event) => this.ticketBought.next(event));
      source.TourStarted().watch((err,event) => this.tourStarted.next(event));
      source.TourClosed().watch((err,event) => this.tourClosed.next(event));
      source.Transfer().watch((err,event) => this.onTransfer.next(event));
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
