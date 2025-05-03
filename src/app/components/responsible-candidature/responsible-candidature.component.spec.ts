import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponsibleCandidatureComponent } from './responsible-candidature.component';

describe('ResponsibleCandidatureComponent', () => {
  let component: ResponsibleCandidatureComponent;
  let fixture: ComponentFixture<ResponsibleCandidatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsibleCandidatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResponsibleCandidatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
