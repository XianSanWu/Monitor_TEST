import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class ConfigService {
  private configDataSubject = new BehaviorSubject<any>(null);
  public configData$ = this.configDataSubject.asObservable();

  constructor(private http: HttpClient) { }

  loadConfig(): Observable<any> {
    const version = new Date().getTime(); // 加上版本參數避免快取
    const configUrl = `assets/configs/config.json?v=${version}`;  //放這，避免不更新
    return this.http.get(configUrl).pipe(
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
