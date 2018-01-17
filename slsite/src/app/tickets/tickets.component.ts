import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  
  @Input() account : string;
  tickets : number;
  curGameNumber : number;
  currentTour : any;

  constructor(private web3:  Web3Service,private ref: ChangeDetectorRef) { }

  async ngOnInit() {
    var self = this;
    this.web3.tourStarted.subscribe(event => {
      self.updateTourData().then(()=>{});
    })
    
    if(this.account!="") 
      await this.updateTourData();

    this.web3.ticketBought.subscribe(event => {
      if(self.currentTour===undefined) return;
      self.currentTour.numticks(this.account).then(ticks => this.tickets=ticks);
    });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if(changes.account!=undefined && changes.account.currentValue!="") {
      await this.updateTourData();
      this.tickets = await this.currentTour.numticks(this.account);
    }
  }

  private async updateTourData() {
    this.curGameNumber = await this.web3.SLT8.currentGameNumber();
    let tourAddress = await this.web3.SLT8.tour();
    this.currentTour = this.web3.GameTourType.at(tourAddress);
  }

  public async buyTicket() {
    try {
      await this.web3.SLT8.buyTicket({from: this.account, gas: 1500000});
    } catch(err) {
      console.log(err);
    }
  }
}
