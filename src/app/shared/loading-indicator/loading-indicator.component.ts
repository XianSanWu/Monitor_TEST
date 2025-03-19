import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LoadingService } from '../../core/services/loading.service';

@Component({
  selector: 'loading-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-indicator.component.html',
  styleUrls: ['./loading-indicator.component.scss'],
})
export class LoadingIndicatorComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;
  private loadingSubscription!: Subscription;

  constructor(private loadingService: LoadingService) {}

  ngOnInit(): void {
    // 訂閱 loading$ 來監聽 loading 狀態變化
    this.loadingSubscription = this.loadingService.loading$.subscribe(
      (loadingStatus: boolean) => {
        // console.log("Loading status changed:", loadingStatus);  // 檢查 loading$ 的變化
        this.isLoading = loadingStatus;
      }
    );
  }

  ngOnDestroy(): void {
    if (this.loadingSubscription) {
      this.loadingSubscription.unsubscribe();  // 記得清理訂閱
    }
  }
}
