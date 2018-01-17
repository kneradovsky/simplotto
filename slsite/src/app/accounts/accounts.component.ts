import { Component, OnInit, ChangeDetectorRef, Input, SimpleChanges } from '@angular/core';
import { Web3Service} from '../services/web3.service';
import BigNumber = require('bignumber.js');
import { fromWei, toWei } from 'web3-utils';


@Component({
  selector: 'app-account',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountComponent implements OnInit {

  balances :any = {};
  accs : string[];
  tokamnt: number =0;
  buyPrice =  new BigNumber(0) ;
  sellPrice = new  BigNumber(0);
  eth= new BigNumber(0);
  slt8= new BigNumber(0);

  @Input() account : string;
  

  constructor(private web3:  Web3Service,private ref: ChangeDetectorRef) { 

  }

  async ngOnInit() {
    this.accs = [];
    this.balances = {};
    var self = this;
    if(this.account!="")
      this.updateBalances();
    
     this.web3.pricesChange.subscribe( event => {
      self.updatePrices([event.args.sellPrice,event.args.buyPrice])
    });
    this.web3.onTransfer.subscribe(event => {
      var accLowCase = self.account.toLowerCase();
      if(event.args.from.toLowerCase()==accLowCase || event.args.to.toLowerCase()==accLowCase) {
        self.updateBalances();
      }
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if(changes.account!=undefined) {
      this.updateBalances();
      if(changes.account.previousValue=="") {
        var prices = await this.web3.SLT8.getPrices();
        this.updatePrices(prices);
      }
    }
  }

  private updatePrices(prices: BigNumber[]) {
      this.sellPrice = prices[0];
      this.buyPrice = prices[1];
  }
  private updateBalances() {
    var self = this;
    var web3api = this.web3.getApi();
    if(this.account=="") return;
    if(self.balances[this.account] === undefined) self.balances[this.account]={};
    web3api.eth.getBalance(this.account).then(b => {
      if(b == null) b=0;
      self.eth=b;
      this.ref.detectChanges();    
    });
    self.web3.SLT8.balanceOf(this.account).then(tokens => {
      self.slt8=tokens;
      this.ref.detectChanges();
    });
    this.ref.detectChanges();
  }

  public async onBuyTokens8() {
    var amount = this.buyPrice.times(this.tokamnt).toString(10);
    await this.web3.SLT8.buy({from: this.account, value: amount});
    this.updateBalances();
  }

  public async onSellTokens8() {
    await this.web3.SLT8.sell(this.tokamnt,{from:this.account,gas: "100000"});
    this.updateBalances();
  } 

}
