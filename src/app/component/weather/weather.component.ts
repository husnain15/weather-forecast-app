import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { WeatherService } from '../../services/weather.service';
import { Chart, ChartConfiguration } from 'chart.js';
import moment from 'moment';
import { BrowserModule } from '@angular/platform-browser';
@Component({
  selector: 'app-weather',
  standalone: true,
  imports: [],
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.css'
})
export class WeatherComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router); // Inject Router
  private weatherService = inject(WeatherService); // Inject WeatherService

  chart: any;

  constructor() { }
  ngOnInit() {
    this.fetchData();
  }

  fetchData() {
    const id = this.route.snapshot.paramMap.get('id')!;
    const apiResponse = this.weatherService.getForecast(id).subscribe((apiResponse: any) => {
      const periods = apiResponse.properties.periods;
      const temperatures = periods.map((period: any) => period.temperature);
      const times = periods.map((period: any) =>
        moment(period.startTime).format('MMM D, hA') // Formatting the date
      );
      this.createChart(times, temperatures);
    })
  }

  goBack() {
    this.router.navigate(['/']); // Navigate to home page
  }

  createChart(labels: string[], data: number[]) {
    const ctx = document.getElementById("myChart") as HTMLCanvasElement;
    this.chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperature (°F)',
            data: data,
            borderColor: '#3cba9f',
            backgroundColor: 'rgba(60, 186, 159, 0.3)',
            fill: true,
            tension: 0.4,
            borderWidth: 2,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time',
              color: '#333',
              font: {
                weight: 'bold',
              },
            },
            grid: {
              color: '#ddd', // Lighter grid lines
            }
          },
          y: {
            title: {
              display: true,
              text: 'Temperature (°F)',
              color: '#333',
              font: {
                weight: 'bold',
              },
            },
            beginAtZero: true,
            suggestedMin: 0,
            suggestedMax: 100,
            grid: {
              color: '#ddd', // Lighter grid lines
            }
          }
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            titleColor: '#fff',
            bodyColor: '#fff',
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw} °F`;
              }
            }
          }
        }
      }
    });
  }

}
