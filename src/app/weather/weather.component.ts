import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-weather',
  templateUrl: './weather.component.html',
  styleUrls: ['./weather.component.scss'],
})
export class WeatherComponent implements OnInit {
  city: string;
  weatherData: any;
  forecastData: any;

  constructor(private http: HttpClient) {
    this.city = '';
  }

  ngOnInit(): void {}

  getWeatherByLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        this.getWeather(lat, lon);
        this.getForecast(lat, lon);
      });
    } else {
      console.log('Geolocation is not supported by this browser.');
    }
  }

  getWeatherByCity() {
    this.getWeather(null, null, this.city);
    this.getForecast(null, null, this.city);
  }

  getWeather(lat: number | null, lon: number | null, city?: string) {
    let url = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=6a0df29c6861f2edb7251014b4adbd2f`;
    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    } else if (city) {
      url += `&q=${city}`;
    }
    this.http.get(url).subscribe((data) => (this.weatherData = data));
  }

  getForecast(lat: number | null, lon: number | null, city?: string) {
    let url = `https://api.openweathermap.org/data/2.5/forecast?appid=6a0df29c6861f2edb7251014b4adbd2f&units=metric`;
    if (lat && lon) {
      url += `&lat=${lat}&lon=${lon}`;
    } else if (city) {
      url += `&q=${city}`;
    }
    this.http.get(url).subscribe((data) => {
      this.forecastData = data;
      this.forecastData.list = this.forecastData.list.filter((forecast: any) => {
        const date = new Date(forecast.dt_txt);
        return date.getHours() === 0 && date.getMinutes() === 0 && date.getSeconds() === 0;
      });
    });
  }
}




// Deze code is geschreven in TypeScript en lijkt een onderdeel te zijn van een Angular-toepassing waarmee een gebruiker de weergegevens voor zijn huidige locatie of een bepaalde stad kan bekijken.

// De component begint met het importeren van de benodigde Angular-modules en een HttpClient-module, waarmee de component HTTP-verzoeken kan doen om weergegevens op te halen van een externe API.

// De component heeft een klasse genaamd WeatherComponent die de OnInit-interface implementeert, een levenscyclushaak in Angular die wordt aangeroepen nadat de component is geïnitialiseerd. De component heeft een constructor die de HttpClient-service injecteert, die wordt gebruikt om HTTP-verzoeken te doen aan de weer-API.

// De component heeft verschillende methoden:

// ngOnInit(): Deze methode wordt aangeroepen wanneer de component wordt geïnitialiseerd en bevat geen code in deze implementatie.

// getWeatherByLocation(): Deze methode wordt aangeroepen wanneer de gebruiker de weergegevens voor zijn huidige locatie wil bekijken. Het gebruikt het navigator.geolocation-object om de huidige lengte- en breedtegraad van de gebruiker op te halen en roept vervolgens de methoden getWeather() en getForecast() aan met deze coördinaten als argumenten.

// getWeatherByCity(): Deze methode wordt aangeroepen wanneer de gebruiker de weergegevens voor een specifieke stad wil bekijken. Het roept de methoden getWeather() en getForecast() aan met de plaatsnaam als argument.

// getWeather(lat: number | null, lon: number | null, city?: string): Deze methode stuurt een HTTP-verzoek naar de weer-API om de huidige weergegevens voor de opgegeven locatie op te halen (hetzij op lengte- en breedtegraad of op stadsnaam) . Het antwoord wordt opgeslagen in de eigenschap weatherData van de component.

// getForecast(lat: number | null, lon: number | null, city?: string): Deze methode stuurt een HTTP-verzoek naar de weer-API om de voorspellingsgegevens voor de opgegeven locatie op te halen (ofwel op lengte- en breedtegraad of op stadsnaam). Het antwoord wordt opgeslagen in de eigenschap forecastData van de component en vervolgens wordt de lijst met prognoses gefilterd om alleen die met een tijdstempel van middernacht op te nemen.

// Zowel de methode getWeather() als de methode getForecast() doen HTTP-verzoeken met behulp van de HttpClient-service en abonneren zich op het waarneembare dat wordt geretourneerd door de methode get(), waardoor ze de gegevens kunnen verwerken wanneer deze worden ontvangen. De gegevens die van de API worden ontvangen, worden respectievelijk opgeslagen in de eigenschappen weatherData en forecastData en kunnen worden geopend en weergegeven in de sjabloon van de component.