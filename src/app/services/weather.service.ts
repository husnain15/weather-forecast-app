// import { inject, Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class WeatherService {
//   private http = inject(HttpClient);

//   constructor() { }
//   getForecast(id: string): Observable<any> {
//     let url = '';
//     if (id === 'TOP') {
//       url = 'https://api.weather.gov/gridpoints/TOP/31,80/forecast';
//     } else if (id === 'LWX') {
//       url = 'https://api.weather.gov/gridpoints/LWX/31,80/forecast';
//     }
//     return this.http.get(url);
//   }
// }

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getForecast(id: string): Observable<any> {
    let url: string;

    switch (id) {
      case 'LWX':
        url = `${environment.apiUrl}/gridpoints/LWX/31,80/forecast`;
        break;
      case 'TOP':
        url = `${environment.apiUrl}/gridpoints/TOP/31,80/forecast`;
        break;
      default:
        throw new Error('Unknown ID');
    }

    return this.http.get<any>(url);
  }
}
