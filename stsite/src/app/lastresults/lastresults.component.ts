import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-lastresults',
  templateUrl: './lastresults.component.html',
  styleUrls: ['./lastresults.component.css']
})
export class LastresultsComponent implements OnInit {
  @Input() account: string;
  @Input() bits : number;
  lastGameNumber: number = 0;
  lastTour: any = {};
  winners: string[] = [];
  payouts: number[] = [];
  SLT : any;

  constructor(protected web3: Web3Service, protected ref: ChangeDetectorRef) { }

  ngOnInit() {
    var self = this;
    this.web3.tourStarted[this.bits].subscribe(event => {
      self.updateTourData().then(() => { });
    })
    if (this.account != "") this.updateTourData().then(() => { });
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.account != undefined && changes.account.currentValue != "") {
      await this.updateTourData();
    }
  }

  protected async updateTourData() {
    switch(this.bits) {
      case 8 : this.SLT = this.web3.SLT8;break;
      case 10 : this.SLT = this.web3.SLT10;break;
      case 12 : this.SLT = this.web3.SLT12;break;
      default: throw("Invalid bits parameter");
    }    
    this.lastGameNumber = await this.SLT.currentGameNumber() - 1;
    if (this.lastGameNumber >= 0) {
      let tourAddress = await this.SLT.prevTours(this.lastGameNumber);
      this.lastTour = this.web3.GameTourType.at(tourAddress);
      this.updateWinners(this.lastTour);
    } else this.lastGameNumber = 0;

  }

  protected async updateWinners(gameTour: any) {
    this.winners = await gameTour.getWinners();
    var bits = await this.SLT.bits();
    var tickCount = Math.pow(2, bits);
    if (this.payouts.length != this.winners.length) {
      for (var i = 0; i < this.winners.length; i++) {
        var p = await this.SLT.payouts(i);
        this.payouts[i] = Math.ceil(p * tickCount / 100);
      }
    }
  }
}
