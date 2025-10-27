import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { statisticsReducer } from '../../../core/state/statistics.reducer';
import { StatisticsOverviewComponent } from './statistics-overview.component';

describe('StatisticsOverviewComponent', () => {
  let component: StatisticsOverviewComponent;
  let fixture: ComponentFixture<StatisticsOverviewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StatisticsOverviewComponent],
      providers: [provideStore({ statistics: statisticsReducer })],
    }).compileComponents();

    fixture = TestBed.createComponent(StatisticsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
