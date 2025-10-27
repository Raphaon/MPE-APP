import { TestBed } from '@angular/core/testing';
import { provideStore } from '@ngrx/store';

import { statisticsReducer } from './core/state/statistics.reducer';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [provideStore({ statistics: statisticsReducer })],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });
});
