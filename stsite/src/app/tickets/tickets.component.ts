import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  
  @Input() account : string;
  @Input() bits : number;
  tickets : number;
  curGameNumber : number;
  currentTour : any;
  SLT : any;

  constructor(private web3:  Web3Service,private ref: ChangeDetectorRef) { }

  async ngOnInit() {
    var self = this;
    this.web3.tourStarted[this.bits].subscribe(event => {
      self.updateTourData().then(()=>{});
    })
    
    if(this.account!="") 
      await this.updateTourData();

    this.web3.ticketBought[this.bits].subscribe(event => {
      if(self.currentTour===undefined) return;
      self.currentTour.numticks(this.account).then(ticks => this.tickets=ticks);
    });
    this.web3.tourClosed[this.bits].subscribe(event => this.tickets=0)
  }

  async ngOnChanges(changes: SimpleChanges) {
    if(changes.account!=undefined && changes.account.currentValue!="") {
      await this.updateTourData();
      this.tickets = await this.currentTour.numticks(this.account);
    }
  }

  private async updateTourData() {
    switch(this.bits) {
      case 8 : this.SLT = this.web3.SLT8;break;
      case 10 : this.SLT = this.web3.SLT10;break;
      case 12 : this.SLT = this.web3.SLT12;break;
      default: throw("Invalid bits parameter");
    }
    this.curGameNumber = await this.SLT.currentGameNumber();
    let tourAddress = await this.SLT.tour();
    this.currentTour = this.SLT.at(tourAddress);
  }

  public async buyTicket() {
    try {
      await this.SLT.buyTicket({from: this.account, gas: 1500000});
    } catch(err) {
      console.log(err);
    }
  }
}
