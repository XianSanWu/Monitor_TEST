import { CommonModule } from '@angular/common';
import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart, ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective, NgChartsModule } from 'ng2-charts';
import { Option } from '../../../core/models/common/base.model';

@Component({
  selector: 'dynamic-pie',
  standalone: true,
  imports: [NgChartsModule, CommonModule],
  templateUrl: './dynamic-pie.component.html',
  styleUrls: ['./dynamic-pie.component.scss'],
})
export class DynamicPieComponent implements OnChanges, AfterViewInit {
  @Input() data: Option[] = [];
  @Input() title = '';

  labels: string[] = [];
  values: number[] = [];
  total = 0;

  pieChartType: 'pie' = 'pie';

  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      animateRotate: true,
      animateScale: true,
      duration: 800,
    },
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 14,
          padding: 10,
          font: { size: 14 },
          // legend 長文字換行
          generateLabels: (chart) => {
            const original =
              Chart.overrides.pie.plugins!.legend!.labels!.generateLabels!(
                chart
              );
            return original.map((l) => ({
              ...l,
              text: l.text,
              lineHeight: 1.2,
            }));
          },
        },
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label ?? '';
            const value = context.parsed ?? 0;
            const pct = this.total
              ? ((Number(value) / this.total) * 100).toFixed(1)
              : '0';
            return `${label}: ${value} (${pct}%)`;
          },
        },
      },
    },
  };

  pieChartData: ChartData<'pie', number[], string> = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [],
        borderColor: '#fff',
        borderWidth: 2,
        hoverOffset: 12,
      },
    ],
  };

  ngAfterViewInit(): void {
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.updateChart();
    }
  }

  private updateChart() {
    this.labels = this.data.map((d) => d.key ?? '');
    this.values = this.data.map((d) => Number(d.value ?? 0));
    this.total = this.values.reduce((s, v) => s + v, 0);

    this.pieChartData = {
      labels: this.labels,
      datasets: [
        {
          data: this.values,
          backgroundColor: this.generateColors(this.labels.length),
          borderColor: '#fff',
          borderWidth: 2,
          hoverOffset: 12,
        },
      ],
    };

    this.chart?.update();
  }

  // 自動產生 n 個高彩色，不重複
  private generateColors(n: number): string[] {
    const colors: string[] = [];
    const saturation = 75; // 飽和度
    const lightness = 60; // 明度

    for (let i = 0; i < n; i++) {
      // 黃金角分配，避免鄰近顏色太相近
      const hue = (i * 137.5) % 360;
      colors.push(`hsl(${hue}, ${saturation}%, ${lightness}%)`);
    }

    return colors;
  }
}
