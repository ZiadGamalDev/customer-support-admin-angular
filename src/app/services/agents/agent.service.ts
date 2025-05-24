import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Agent } from '../../interfaces/agentProfile.interface';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AgentService {
  private URL = `${environment.apiUrl}/admin/users`;

  constructor(private _http: HttpClient) {}
  getAgents(token: string): Observable<Agent[]> {
    return this._http.get<Agent[]>(this.URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
