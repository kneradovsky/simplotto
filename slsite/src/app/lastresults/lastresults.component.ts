import { Component, OnInit, Input, ChangeDetectorRef, SimpleChanges } from '@angular/core';
import { Web3Service } from '../services/web3.service';

@Component({
  selector: 'app-lastresults',
  templateUrl: './lastresults.component.html',
  styleUrls: ['./lastresults.component.css']
})
export class LastresultsComponent implements OnInit {
  @Input() account: string;
  lastGameNumber: number = 0;
  lastTour: any = {};
  winners: string[] = [];
  payouts: number[] = [];

  constructor(protected web3: Web3Service, protected ref: ChangeDetectorRef) { }

  ngOnInit() {
    var self = this;
    this.web3.tourStarted.subscribe(event => {
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
    this.lastGameNumber = await this.web3.SLT8.currentGameNumber() - 1;
    if (this.lastGameNumber >= 0) {
      let tourAddress = await this.web3.SLT8.prevTours(this.lastGameNumber);
      this.lastTour = this.web3.GameTourType.at(tourAddress);
      this.updateWinners(this.lastTour);
    } else this.lastGameNumber = 0;

  }

  protected async updateWinners(gameTour: any) {
    this.winners = await gameTour.getWinners();
    var bits = await this.web3.SLT8.bits();
    var tickCount = Math.pow(2, bits);
    if (this.payouts.length != this.winners.length) {
      for (var i = 0; i < this.winners.length; i++) {
        var p = await this.web3.SLT8.payouts(i);
        this.payouts[i] = Math.ceil(p * tickCount / 100);
      }
    }
  }
}
