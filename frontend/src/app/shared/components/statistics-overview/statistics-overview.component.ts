import { AsyncPipe, NgIf } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { StatisticsActions } from '../../../core/state/statistics.actions';
import { selectStatisticsState } from '../../../core/state/statistics.selectors';

@Component({
  selector: 'app-statistics-overview',
  standalone: true,
  imports: [NgIf, AsyncPipe],
  templateUrl: './statistics-overview.component.html',
  styleUrls: ['./statistics-overview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatisticsOverviewComponent implements OnChanges {
  @Input() scope: 'NATIONAL' | 'REGION' | 'DISTRICT' | 'ASSEMBLY' = 'NATIONAL';
  @Input() scopeId?: string;

  private readonly store = inject(Store);
  readonly state$ = this.store.select(selectStatisticsState);

  ngOnChanges(_changes: SimpleChanges): void {
    this.store.dispatch(StatisticsActions.load({ scope: this.scope, scopeId: this.scopeId }));
  }
}
