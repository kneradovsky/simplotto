import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Web3Service} from '../services/web3.service';
import BigNumber = require('bignumber.js');
import { fromWei, toWei } from 'web3-utils';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  balances :any = {};
  accs : string[];
  tokamnt: number =0;
  buyPrice =  new BigNumber(0) ;
  sellPrice = new  BigNumber(0);

  constructor(private web3:  Web3Service,private ref: ChangeDetectorRef) { 

  }

  async ngOnInit() {
    this.accs = [];
    this.balances = {};
    var self = this;
    this.web3.accountsObservable.subscribe(accs => {
      self.accs = accs;
      self.updateBalances(accs);
    });
    var prices = await this.web3.SLT8.getPrices();
    this.web3.onTransfer.subscribe( event => console.log(event));
    this.sellPrice = prices[0];
    this.buyPrice = prices[1];
    console.log(prices);
  }

  private updateBalances(accounts : string[]) {
    var self = this;
    console.log(this);
    var web3api = this.web3.getApi();
    this.accs.forEach(acc => {
      if(self.balances[acc] === undefined) self.balances[acc]={};
      web3api.eth.getBalance(acc).then(b => {
        if(b == null) b=0;
        self.balances[acc]=Object.assign(self.balances[acc],{eth:b})
        this.ref.detectChanges();    
      });
      self.web3.SLT8.balanceOf(acc).then(tokens => {
        self.balances[acc]=Object.assign(self.balances[acc],{slt8:tokens});
        console.log(tokens);
        this.ref.detectChanges();
      });
    })
    this.ref.detectChanges();
  }

  public async onBuyTokens8() {
    console.log(this.tokamnt);
    var amount = this.buyPrice.times(this.tokamnt).toString(10);
    await this.web3.SLT8.buy({from: this.accs[0], value: amount});
    this.updateBalances([this.accs[0]]);
  }

  public onSellTokens8() {
    this.web3.SLT8.sell(this.tokamnt,{from:this.accs[0],gas: "100000"});
  }

}
