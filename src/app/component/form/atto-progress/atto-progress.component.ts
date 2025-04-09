import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, signal } from '@angular/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'atto-progress',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  templateUrl: './atto-progress.component.html',
  styleUrl: './atto-progress.component.scss'
})
export class AttoProgressComponent implements OnDestroy {
  @Input() items: Array<string> = new Array<string>();
  currentIndex = signal(0);
  progress = signal(0);

  private intervalId!: ReturnType<typeof setInterval>;

  constructor() {
    this.startLoop();
  }

  startLoop() {
    const duration = 1500; // 每個圈圈停留 1.5 秒

    // 控制循環到下一個圈圈
    this.intervalId = setInterval(() => {
      const nextIndex = (this.currentIndex() + 1) % this.items.length;
      this.currentIndex.set(nextIndex);
      this.progress.set(0); // 重新開始進度條
    }, duration);

  }

  ngOnDestroy() {
    clearInterval(this.intervalId);
  }
}
