import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Web3Service} from '../services/web3.service';



@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {

  balances :any = {};
  accs : string[];

  constructor(private web3:  Web3Service,private ref: ChangeDetectorRef) { 

  }

  ngOnInit() {
    this.accs = [];
    this.balances = {};
    var self = this;
    this.web3.accountsObservable.subscribe(accs => {
      //self.accs = accs;
      self.accs = accs;
      self.updateBalances(accs);
    })  
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
      self.web3.Simplotoken.balanceOf(acc).then(tokens => {
        self.balances[acc]=Object.assign(self.balances[acc],{slt:tokens});
        this.ref.detectChanges();
      });
    })
    this.ref.detectChanges();
  }

}
