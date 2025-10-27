import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '@app/environments/environment';

export interface StatisticsResponse {
  totalMembers: number;
  gender: {
    male: number;
    female: number;
  };
}

@Injectable({ providedIn: 'root' })
export class StatisticsApiService {
  private readonly http = inject(HttpClient);

  fetch(scope: string, scopeId?: string): Observable<StatisticsResponse> {
    const params = new URLSearchParams();
    if (scopeId) {
      const key = scope === 'REGION' ? 'regionId' : scope === 'DISTRICT' ? 'districtId' : 'assemblyId';
      params.set(key, scopeId);
    }
    const query = params.toString();
    const url = query ? `${environment.apiUrl}/statistics?${query}` : `${environment.apiUrl}/statistics`;
    return this.http.get<StatisticsResponse>(url);
  }
}
