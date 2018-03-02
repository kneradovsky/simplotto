import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import contract = require('truffle-contract');
import Web3  = require('web3');

import gametour_artefacts = require('../../../../build/contracts/GameTour.json');

import token_artefacts = require('../../../../build/contracts/MishaToken.json');
import pos_artefacts = require('../../../../build/contracts/Pos.json');
import raffle_artefacts = require('../../../../build/contracts/RaffleLottery.json');


import { WindowRefService } from './window-ref.service';
import { ErrorService } from './error.service';




@Injectable()
export class Web3Service {
  private web3: Web3;
  private accounts: string[];
  private RaffleType : any;
  private TokenType : any;
  private PosType : any;
  public GameTourType : any;
  public Token : any;
  public Pos : any;
  public CurrentTour: any;
  public SLT8 : any;
  public SLT10 : any;
  public SLT12 : any;

  public initFailed = false;

  public accountsObservable = new Subject<string[]>();
  //token events sinks
  public pricesChange = new Subject<any>();
  public onTransfer = new Subject<any>();

  public ticketBought = {};
  public tourStarted = {};
  public tourClosed = {};
  
 

  constructor(private wnd : WindowRefService,private errsvc : ErrorService) {
    try {
      this.setupTokenSystem();
      this.refreshAccounts();
    } catch(err) {
      this.initFailed = true;
      this.errsvc.next({title: "web3 init failed",text:"web3 init failed. Please consider using metamask: https://metamask.io",error:err});
    }
   }
  
   private setupMetamaskWeb3() {
    Web3.providers.HttpProvider.prototype.sendAsync = Web3.providers.HttpProvider.prototype.send;
    
    //this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));

    if( typeof this.wnd.browser.web3 != "undefined") {
      console.log('use metamask')
      this.web3 = new Web3(this.wnd.browser.web3.currentProvider);
    } else {
      console.log('no web3');
      // this.initFailed = true;
      // this.errsvc.next({title: "web3 init failed",text:"web3 init failed. Please consider using metamask: https://metamask.io"});
      this.web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:9545'));
    }
    return !this.initFailed;
}

  private setupTokenSystem() {
    if(!this.setupMetamaskWeb3()) return;
    this.TokenType = contract(token_artefacts);
    this.PosType = contract(pos_artefacts);
    this.TokenType.deployed().then(ct => {
      this.Token = ct;
      console.log(`Token at ${ct.address}`);
      this.Token.Transfer().watch((err,event) => this.onTransfer.next(event));
      this.PosType.deployed().then(ct => {
        this.Pos = ct;
        this.Pos.PricesChanged().watch((err,event) => this.pricesChange.next(event));
        console.log(`POS at ${ct.address}`);
        this.setupLottery();
      });
    });
  }

  private setupLottery() {
    this.RaffleType = contract(raffle_artefacts);
    this.SLT8 = this.RaffleType.at("");
    this.setupEvents(this.SLT8,8);
    this.SLT10 = this.RaffleType.at("");
    this.setupEvents(this.SLT10,10);
    this.SLT12 = this.RaffleType.at("");
    this.setupEvents(this.SLT12,12);
  }

  private setupEvents(source:any,bits) {
    this.ticketBought[bits]=new Subject<any>();
    this.tourClosed[bits] = new Subject<any>();
    this.tourStarted[bits] = new Subject<any>();
    source.TicketBought().watch((err,event) => this.ticketBought[bits].next(event));
    source.TourStarted().watch((err,event) => this.tourStarted[bits].next(event));
    source.TourClosed().watch((err,event) => this.tourClosed[bits].next(event));
  }

  private refreshAccounts() {
    this.web3.eth.getAccounts((err, accs) => {
      if (err != null) {
        this.errsvc.next({title: "Accounts failed", text: "There was an error fetching your accounts.",error: err});
        return;
      }

      // Get the initial account balance so it can be displayed.
      if (accs.length == 0) {
        this.errsvc.next({title: "Accounts failed", text: "Couldn't get any accounts! Make sure your Ethereum client is configured correctly.",error: null});
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
