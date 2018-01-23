import { Component, OnInit, ChangeDetectorRef, SimpleChanges, Input } from '@angular/core';
import { Web3Service } from '../services/web3.service';
import { CurrencyPipe } from '@angular/common';
import { LastresultsComponent } from '../lastresults/lastresults.component';

@Component({
  selector: 'app-gameresults',
  templateUrl: './gameresults.component.html',
  styleUrls: ['./gameresults.component.css']
})
export class GameresultsComponent extends LastresultsComponent implements OnInit {
  @Input() account: string;
  lastGameNumber: number;
  currentGameNumber: number;
  currentTour: any = {};
  winners: string[] = [];
  payouts: number[] = [];
  games: number[] = [];

  constructor(protected web3: Web3Service, protected ref: ChangeDetectorRef) {
    super(web3, ref);
  }

  ngOnInit() {
    var self = this;
    this.web3.tourClosed.subscribe(event => {
      self.games.push(event.args.tourNumber);
      self.lastGameNumber = event.args.tourNumber;
    })
    this.lastGameNumber = 0;
    this.currentGameNumber = -1;
    if (this.account != "") {
      this.updateGames().then(() => { });
      this.updateTourData().then(() => { });
    }

  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes.account != undefined && changes.account.currentValue != "") {
      this.updateGames().then(() => this.updateTourData().then(() => { }));
    }
  }

  async updateCurrentGameNumber(event: any) {
    this.currentGameNumber = event;
    await this.updateTourData();
  }

  protected async updateTourData() {
    if (this.currentGameNumber >= 0) {
      let tourAddress = await this.web3.SLT8.prevTours(this.currentGameNumber);
      this.currentTour = this.web3.GameTourType.at(tourAddress);
      this.winners = await this.currentTour.getWinners();
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


  protected async updateGames() {
    this.lastGameNumber = await this.web3.SLT8.currentGameNumber() - 1;
    if (this.currentGameNumber == -1) this.currentGameNumber = this.lastGameNumber;
    this.games = Array(this.lastGameNumber + 1).fill(0).map((x, i) => i);
  }

}
