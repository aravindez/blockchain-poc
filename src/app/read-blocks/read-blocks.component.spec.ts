import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadBlocksComponent } from './read-blocks.component';

describe('ReadBlocksComponent', () => {
  let component: ReadBlocksComponent;
  let fixture: ComponentFixture<ReadBlocksComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadBlocksComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadBlocksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
