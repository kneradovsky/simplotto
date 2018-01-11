import { Injectable } from '@angular/core';

function _window() : any {
  return window;
}

@Injectable()
export class WindowRefService {

  constructor() { }
  get browser() : any {
    return _window();
  }
}
