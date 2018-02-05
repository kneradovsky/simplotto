import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ErrorService } from '../services/error.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-errors',
  templateUrl: './errors.component.html',
  styleUrls: ['./errors.component.css']
})
export class ErrorsComponent implements OnInit {
  title:string ="";
  text:string ="";
  
  constructor(private actModal : NgbActiveModal) { 
  }

  ngOnInit() {
  }

}
