import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  private configUrl = 'assets/configs/config.json';
  private configDataSubject = new BehaviorSubject<any>(null);
  public configData$ = this.configDataSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<any> {
    return this.http.get(this.configUrl).pipe(
      tap((data) => {
        this.configDataSubject.next(data);
        // console.log('Config Loaded:', data);
      }),
      catchError((error) => {
        // console.error('Error loading config:', error);
        return [];
      })
    );
  }

  getConfig() {
    return this.configDataSubject.getValue();
  }
}
