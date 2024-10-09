import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { HomeComponent } from './component/home/home.component';
import { WeatherComponent } from './component/weather/weather.component';
import { provideHttpClient } from '@angular/common/http';
import { provideCharts } from 'ng2-charts';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter([
      { path: '', component: HomeComponent },
      { path: 'weather/:id', component: WeatherComponent },
    ]),
    provideHttpClient(),
    provideCharts(),
  ],
};
