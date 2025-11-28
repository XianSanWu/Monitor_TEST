import { Component, Input, OnChanges } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { NgChartsModule } from 'ng2-charts';
import { Option } from '../../../core/models/common/base.model';

@Component({
  selector: 'dynamic-bar',
  standalone: true,
  imports: [NgChartsModule],
  templateUrl: './dynamic-bar.component.html',
  styleUrl: './dynamic-bar.component.scss',
})
export class DynamicBarComponent implements OnChanges {

  @Input() options: Option[] = [];
  @Input() title: string = '';
  @Input() color?: string; // ⭐ 外部單一顏色

  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      {
        label: '',
        data: [],
        backgroundColor: [],
        hoverBackgroundColor: [],
        borderRadius: {
          topLeft: 12,
          topRight: 12,
          bottomLeft: 4,
          bottomRight: 4,
        },
        maxBarThickness: 50,
      }
    ]
  };

  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: '',
        font: { size: 20, weight: 'bold' },
        padding: { top: 10, bottom: 20 },
        color: '#333'
      },
      tooltip: {
        enabled: true,
        backgroundColor: 'rgba(255,255,255,0.95)',
        borderColor: '#ccc',
        borderWidth: 1,
        titleColor: '#333',
        bodyColor: '#333',
        padding: 10,
        cornerRadius: 10,
        bodyFont: { size: 14 },
        titleFont: { size: 15, weight: 'bold' },
        displayColors: false
      }
    },
    scales: {
      x: {
        ticks: {
          color: '#333',
          font: { size: 14 },
          padding: 8
        },
        grid: { display: false }
      },
      y: {
        ticks: {
          color: '#666',
          font: { size: 13 }
        },
        grid: {
          color: 'rgba(0,0,0,0.06)',
          lineWidth: 1
        }
      }
    }
  };

  ngOnChanges(): void {
    const labels = this.options.map(x => x.key ?? '');
    const values = this.options.map(x => Number(x.value ?? 0));
    const count = values.length;

    let barColors: string[];
    let hoverColors: string[];

    // ⭐ 有傳單一顏色 → 全部 bar 用同一個顏色
    if (this.color) {
      barColors = Array(count).fill(this.color);
      hoverColors = Array(count).fill(this.darkenColor(this.color, 15));
    }
    // ❗ 沒有傳 → 使用循環色票
    else {
      barColors = this.getBarColors(count);
      hoverColors = barColors.map(c => this.darkenColor(c, 15));
    }

    this.barChartData = {
      labels,
      datasets: [
        {
          label: this.title,
          data: values,
          backgroundColor: barColors,
          hoverBackgroundColor: hoverColors,
          borderRadius: {
            topLeft: 12,
            topRight: 12,
            bottomLeft: 4,
            bottomRight: 4
          },
          maxBarThickness: 50
        }
      ]
    };

    if (this.barChartOptions.plugins?.title) {
      this.barChartOptions.plugins.title.text = this.title;
    }
  }

  /** 每個 Bar 使用不同顏色（循環色票） */
  getBarColors(count: number): string[] {
    const palette = [
      '#4F9AF7', // 藍
      '#7D62F2', // 紫
      '#E85BB1', // 粉
      '#F4A261', // 橘
      '#2A9D8F', // 綠
      '#E76F51', // 紅
      '#6C757D'  // 灰藍
    ];

    return Array.from({ length: count }, (_, i) => palette[i % palette.length]);
  }

  /** hover 深化顏色 */
  darkenColor(hex: string, percent: number): string {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);

    const R = Math.max(0, (num >> 16) - amt);
    const G = Math.max(0, ((num >> 8) & 0x00FF) - amt);
    const B = Math.max(0, (num & 0x0000FF) - amt);

    return (
      '#' +
      (0x1000000 + R * 0x10000 + G * 0x100 + B)
        .toString(16)
        .slice(1)
        .toUpperCase()
    );
  }
}
