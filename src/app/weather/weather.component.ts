import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
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
  @ViewChild('heartIcon') heartIcon!: ElementRef;
  favoriteCity: string;
  errorOccurred: boolean = false;

  // Definieer de constructor
  constructor(private weatherService: WeatherService) {
    this.city = '';
    this.favoriteCity = localStorage.getItem('favoriteCity') || '';
  }

  /* 
    Hierin wordt gecontroleerd of de favoriete stad is opgeslagen in localStorage en wordt de bijbehorende weergegevens geladen.
  */
  ngOnInit(): void {
    if (this.favoriteCity) {
      this.city = this.favoriteCity;
      this.getWeatherByCity();
    }
  }

  /*
    Hierin wordt gecontroleerd of geolocatie wordt ondersteund door de browser.
    Zo ja, dan worden de weergegevens en voorspellingsgegevens voor de huidige locatie geladen.
    Anders wordt een foutmelding weergegeven.
  */
  getWeatherByLocation() {
    this.errorOccurred = false;

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

  /* 
    Hierin worden de weervoorspellingsgegevens voor de opgegeven stad geladen.
  */
  getWeatherByCity() {
    this.errorOccurred = false;
    if (this.city) {
      this.getWeatherData(null, null, this.city);
      this.getForecastData(null, null, this.city);
      this.contentLoaded = true;
    }
  }

  /*
    Hierin wordt de weerservice aangeroepen en de resulterende gegevens worden verwerkt.
  */
  getWeatherData(lat: number | null, lon: number | null, city?: string) {
    const weatherObserver = {
      next: (data: any) => {
        this.weatherData = data;
      },
      error: (err: HttpErrorResponse) => {
        if (!this.errorOccurred) {
          this.errorOccurred = true;
          alert(
            'De locatie kon niet worden gevonden. Controleer op spelfouten en probeer opnieuw.'
          );
        }
      },
    };
    this.weatherService.getWeather(lat, lon, city).subscribe(weatherObserver);
  }

  /*
    Hierin wordt de voorspellingservice aangeroepen en de resulterende gegevens worden verwerkt.
  */
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
        if (!this.errorOccurred) {
          this.errorOccurred = true;
          alert(
            'De locatie kon niet worden gevonden. Controleer op spelfouten en probeer opnieuw.'
          );
        }
      },
    };
    this.weatherService.getForecast(lat, lon, city).subscribe(forecastObserver);
  }

  /*
    Toggle favoriete stad op basis van 'favoriteCity' sleutel in localStorage
    Als de huidige stad al in de localStorage is opgeslagen als favoriete stad, wordt deze verwijderd
    Als de huidige stad niet in de localStorage is opgeslagen als favoriete stad, wordt deze toegevoegd
  */
  toggleFavorite(city: string) {
    if (this.favoriteCity && this.favoriteCity === city) {
      localStorage.removeItem('favoriteCity');
      this.favoriteCity = '';
    } else {
      localStorage.setItem('favoriteCity', city);
      this.favoriteCity = city;
    }
  }

  /**
   * Geeft de CSS-klasse terug op basis van de favoriete stad.
   * Als de stad favoriet is, wordt de klasse voor een vol hartpictogram geretourneerd.
   * Anders wordt de klasse voor een leeg hartpictogram geretourneerd.
   */
  getHeartIconClass(city: string): string {
    return this.favoriteCity === city
      ? 'fa-solid fa-heart'
      : 'fa-regular fa-heart';
  }
}
