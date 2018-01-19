import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GameresultsComponent } from './gameresults.component';

describe('GameresultsComponent', () => {
  let component: GameresultsComponent;
  let fixture: ComponentFixture<GameresultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GameresultsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GameresultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
