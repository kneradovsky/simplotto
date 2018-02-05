import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Injectable()
export class ErrorService {
  public onError = new Subject<any>();
  
  constructor() { }

  next(event:any) {
    this.onError.next(event);
  }

}
