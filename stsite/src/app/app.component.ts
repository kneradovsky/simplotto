import { Component, ChangeDetectorRef, OnInit, Directive, ViewChild, ElementRef, Renderer2, TemplateRef, AfterViewInit } from '@angular/core';
import {Web3Service} from './services/web3.service';
import { ErrorService } from './services/error.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ErrorsComponent } from './errors/errors.component';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  accounts:string[] = [];
  account: string = "";
  contractAddress = "";
  
  @ViewChild('errorDialog') errdlg : any;

  constructor(private web3:  Web3Service,private ref: ChangeDetectorRef,private errsrv : ErrorService,private rd: Renderer2,private modalSvc : NgbModal) { 
    web3.accountsObservable.subscribe(accs => {
      this.contractAddress = this.web3.SLT8.address;
      this.accounts = accs;
      if(this.account==undefined || this.account == "") this.account=accs[0];
    });
    errsrv.onError.subscribe(errevt => {
      this.showError(errevt);
    }) 
    if(this.web3.initFailed) {
      this.showError({title: "Web3 init failed", text: "Web3 initialization failed, please consider using metamask https://metamask.io/"})
    }
  }

  ngOnInit() {

  }

 

  showError(errevt) {
    let modalref = this.modalSvc.open(ErrorsComponent);
    modalref.componentInstance.title = errevt.title;
    modalref.componentInstance.text = errevt.text;
  }

}
