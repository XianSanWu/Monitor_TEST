import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  show() {
    // console.log("Showing Loading Spinner");
    this.loadingSubject.next(true);  // 設定為 true
  }

  hide() {
    // console.log("Hiding Loading Spinner");
    setTimeout(() => {
      this.loadingSubject.next(false);  // 設定為 false
    }, 300);
  }
}
