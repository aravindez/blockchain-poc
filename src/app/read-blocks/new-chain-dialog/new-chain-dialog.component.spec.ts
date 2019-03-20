import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewChainDialogComponent } from './new-chain-dialog.component';

describe('NewChainDialogComponent', () => {
  let component: NewChainDialogComponent;
  let fixture: ComponentFixture<NewChainDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewChainDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewChainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
