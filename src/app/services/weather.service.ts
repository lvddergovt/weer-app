import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WeatherService {
  constructor(private http: HttpClient) {}

  getWeather(lat: number | null, lon: number | null, city?: string) {
    let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=6a0df29c6861f2edb7251014b4adbd2f`;
    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    } else if (city) {
      url += `&q=${city}`;
    }
    return this.http.get(url);
  }

  getForecast(lat: number | null, lon: number | null, city?: string) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?appid=6a0df29c6861f2edb7251014b4adbd2f&units=metric`;
    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    } else if (city) {
      url += `&q=${city}`;
    }
    return this.http.get(url);
  }
}