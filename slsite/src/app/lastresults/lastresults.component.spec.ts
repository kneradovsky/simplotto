import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LastresultsComponent } from './lastresults.component';

describe('LastresultsComponent', () => {
  let component: LastresultsComponent;
  let fixture: ComponentFixture<LastresultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LastresultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LastresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
