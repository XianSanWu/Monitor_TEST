import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgChartsModule } from 'ng2-charts';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { DialogService } from '../../../core/services/dialog.service';

@Component({
  selector: 'dynamic-line-chart-component',
  standalone: true,
  imports: [CommonModule, NgChartsModule],
  templateUrl: './dynamic-line-chart-component.component.html',
  styleUrl: './dynamic-line-chart-component.component.scss',
})
export class DynamicLineChartComponent {
  constructor(private dialogService: DialogService) {}

  @Input() title: string = '';
  @Input() chartHeight: number = 1000;
  @Input() data: any[] = [];
  @Input() xKey: string = '';
  @Input() yKey: string = '';

  @ViewChild('chartWrapper') chartWrapper!: ElementRef;

  public lineChartType: 'line' = 'line';
  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [],
  };

  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        // position: 'top',
        title: { display: true, text: this.xKey },
      },
      y: {
        title: { display: true, text: this.yKey },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: true, position: 'top' },
    },
  };

  ngOnChanges() {
    if (this.data && this.xKey) {
      this.lineChartData.labels = this.data.map((d) => d[this.xKey]);
      this.lineChartData.datasets = [];

      const keys = Object.keys(this.data[0] || {}).filter(
        (k) => k !== this.xKey
      );
      keys.forEach((key) => {
        this.lineChartData.datasets.push({
          data: this.data.map((d) => d[key]),
          label: key,
          fill: false,
          tension: 0.3,
        });
      });

      // 更新 Y 軸標題
      this.lineChartOptions.scales!['y']!.title!.text = this.yKey;
    }
  }

  exportAsImage() {
    this.dialogService.openCustomSnackbar({
      message: `正在匯出${this.title}圖檔，請勿重複點擊`,
    });

    if (!this.chartWrapper) {
      this.dialogService.openCustomSnackbar({
        message: `匯出${this.title}圖檔，失敗`,
      });
      return;
    }
    setTimeout(() => {
      html2canvas(this.chartWrapper.nativeElement, {
        backgroundColor: null, // 讓我們用自訂白底
        onclone: (doc) => {
          // 在截圖用的 DOM 複本裡，手動插入白色背景div，覆蓋整區
          const wrapper = doc.querySelector('.chart-wrapper') as HTMLElement;
          if (wrapper) {
            const bgDiv = doc.createElement('div');
            bgDiv.style.position = 'absolute';
            bgDiv.style.top = '0';
            bgDiv.style.left = '0';
            bgDiv.style.width = '100%';
            bgDiv.style.height = '100%';
            bgDiv.style.backgroundColor = 'white';
            bgDiv.style.zIndex = '-1'; // 放後面，不擋東西
            wrapper.style.position = 'relative';
            wrapper.prepend(bgDiv);
          }
        },
      }).then((canvas) => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `${this.title}.png`;
        link.click();
      });
    }, 0);
  }

  exportAsPDF() {
    this.dialogService.openCustomSnackbar({
      message: `正在匯出${this.title}檔案，請勿重複點擊`,
    });

    if (!this.chartWrapper) {
      this.dialogService.openCustomSnackbar({
        message: `匯出${this.title}檔案，失敗`,
      });
      return;
    }

    setTimeout(() => {
      html2canvas(this.chartWrapper.nativeElement, {
        backgroundColor: null,
        onclone: (doc) => {
          const wrapper = doc.querySelector('.chart-wrapper') as HTMLElement;
          if (wrapper) {
            const bgDiv = doc.createElement('div');
            bgDiv.style.position = 'absolute';
            bgDiv.style.top = '0';
            bgDiv.style.left = '0';
            bgDiv.style.width = '100%';
            bgDiv.style.height = '100%';
            bgDiv.style.backgroundColor = 'white';
            bgDiv.style.zIndex = '-1';
            wrapper.style.position = 'relative';
            wrapper.prepend(bgDiv);
          }
        },
      }).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('landscape');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`${this.title}.pdf`);
      });
    }, 0);
  }
}
