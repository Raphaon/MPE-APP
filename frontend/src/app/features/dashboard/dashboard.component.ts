import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Store } from '@ngrx/store';

import { selectStatisticsState } from '../../core/state/statistics.selectors';
import { StatisticsOverviewComponent } from '../../shared/components/statistics-overview/statistics-overview.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [NgIf, NgFor, AsyncPipe, StatisticsOverviewComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DashboardComponent {
  private readonly store = inject(Store);
  readonly state$ = this.store.select(selectStatisticsState);
}
