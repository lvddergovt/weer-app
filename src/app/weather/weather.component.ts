import { Component, OnInit } from '@angular/core';
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
        this.weatherService.getWeather(lat, lon).subscribe((data) => {
          this.weatherData = data;
          console.log(data);
        });
        this.weatherService.getForecast(lat, lon).subscribe((data) => {
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
        });
      });
      this.contentLoaded = true;

    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  getWeatherByCity() {
    if (this.city) {
      this.weatherService.getWeather(null, null, this.city).subscribe((data) => {
        this.weatherData = data;
      });
      this.weatherService.getForecast(null, null, this.city).subscribe((data) => {
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
      });

      this.contentLoaded = true;
    }
  }
}
