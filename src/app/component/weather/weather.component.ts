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
  private route = inject(ActivatedRoute); // Inject ActivatedRoute for accessing route parameters
  private router = inject(Router); // Inject Router for navigation
  private weatherService = inject(WeatherService); // Inject WeatherService for API calls

  chart: any; // Variable to hold the Chart.js instance

  constructor() { }

  ngOnInit() {
    this.fetchData(); // Fetch weather data when the component initializes
  }

  // Function to fetch weather data based on the provided ID from the route
  fetchData() {
    const id = this.route.snapshot.paramMap.get('id')!; // Get the ID from the route parameters
    const apiResponse = this.weatherService.getForecast(id).subscribe((apiResponse: any) => {
      const periods = apiResponse.properties.periods; // Extract the periods from the API response
      const temperatures = periods.map((period: any) => period.temperature); // Map temperatures from periods
      const times = periods.map((period: any) =>
        moment(period.startTime).format('MMM D, hA') // Format the start time using moment.js
      );
      this.createChart(times, temperatures); // Create the chart with formatted times and temperatures
    });
  }

  // Function to navigate back to the home page
  goBack() {
    this.router.navigate(['/']); // Navigate to home page
  }

  // Function to create a line chart using Chart.js
  createChart(labels: string[], data: number[]) {
    const ctx = document.getElementById("myChart") as HTMLCanvasElement; // Get the canvas element for the chart
    this.chart = new Chart(ctx, {
      type: 'line', // Set chart type to line
      data: {
        labels: labels, // Set the labels (formatted times)
        datasets: [
          {
            label: 'Temperature (°F)', // Label for the dataset
            data: data, // Set the temperature data
            borderColor: '#3cba9f', // Color of the line
            backgroundColor: 'rgba(60, 186, 159, 0.3)', // Background color under the line
            fill: true, // Fill area under the line
            tension: 0.4, // Smoothness of the line
            borderWidth: 2, // Width of the line
          }
        ]
      },
      options: {
        responsive: true, // Make the chart responsive
        scales: {
          x: {
            title: {
              display: true,
              text: 'Time', // Title for the x-axis
              color: '#333',
              font: {
                weight: 'bold',
              },
            },
            grid: {
              color: '#ddd', // Lighter grid lines for x-axis
            }
          },
          y: {
            title: {
              display: true,
              text: 'Temperature (°F)', // Title for the y-axis
              color: '#333',
              font: {
                weight: 'bold',
              },
            },
            beginAtZero: true, // Start y-axis at 0
            suggestedMin: 0, // Suggested minimum value for y-axis
            suggestedMax: 100, // Suggested maximum value for y-axis
            grid: {
              color: '#ddd', // Lighter grid lines for y-axis
            }
          }
        },
        plugins: {
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Tooltip background color
            titleColor: '#fff', // Tooltip title color
            bodyColor: '#fff', // Tooltip body color
            callbacks: {
              label: (tooltipItem) => {
                return `${tooltipItem.dataset.label}: ${tooltipItem.raw} °F`; // Format tooltip label
              }
            }
          }
        }
      }
    });
  }
}
