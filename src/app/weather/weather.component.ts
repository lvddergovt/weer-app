import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { WeatherService } from '../services/weather.service';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  city: string;
  weatherData: any;
  forecastData: any;
  contentLoaded: boolean = false;

  constructor(private weatherService: WeatherService) {
    this.city = '';
  }

  ngOnInit(): void {}

  getWeatherByLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.getWeatherData(lat, lon);
        this.getForecastData(lat, lon);
      });
      this.contentLoaded = true;
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  getWeatherByCity() {
    if (this.city) {
      this.getWeatherData(null, null, this.city);
      this.getForecastData(null, null, this.city);
      this.contentLoaded = true;
    }
  }

  getWeatherData(lat: number | null, lon: number | null, city?: string) {
    const weatherObserver = {
      next: (data: any) => {
        this.weatherData = data;
        console.log(data);
      },
      error: (err: HttpErrorResponse) => {
        alert(
          'De locatie kon niet worden gevonden. Controleer op spelfouten en probeer opnieuw.'
        );
      },
    };
    this.weatherService.getWeather(lat, lon, city).subscribe(weatherObserver);
  }

  getForecastData(lat: number | null, lon: number | null, city?: string) {
    const forecastObserver = {
      next: (data: any) => {
        this.forecastData = data;
        this.forecastData.list = this.forecastData.list.filter(
          (forecast: any) => {
            const date = new Date(forecast.dt_txt);
            return (
              date.getHours() === 0 &&
              date.getMinutes() === 0 &&
              date.getSeconds() === 0
            );
          }
        );
      },
      error: (err: HttpErrorResponse) => {
        alert(
          'De locatie kon niet worden gevonden. Controleer op spelfouten en probeer opnieuw.'
        );
      },
    };
    this.weatherService.getForecast(lat, lon, city).subscribe(forecastObserver);
  }
}
