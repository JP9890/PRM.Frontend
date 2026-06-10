import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface SystemSettings {
  llmProvider: string;
  llmApiKeyMasked: string;
  schedulerIntervalHours: number;
  maxWeeklyHours: number;
}

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private apiUrl = `${environment.apiUrl}/api/systemsettings`;

  constructor(private http: HttpClient) {}

  getSettings(): Observable<SystemSettings> {
    return this.http.get<SystemSettings>(this.apiUrl);
  }

  updateLlmApiKey(apiKey: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/llm-api-key`, { apiKey });
  }

  updateLlmProvider(provider: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/llm-provider`, { provider });
  }

  updateSchedulerInterval(intervalHours: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/scheduler-interval`, { intervalHours });
  }

  updateMaxWeeklyHours(maxWeeklyHours: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/max-weekly-hours`, { maxWeeklyHours });
  }
}
