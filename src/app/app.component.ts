import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'The Weather Forecast';
  isDarkTheme = false;

  toggleDarkTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    document.documentElement.classList.toggle('dark-theme');
    document.documentElement.classList.add('transition');

    window.setTimeout(() => {
      document.documentElement.classList.remove('transition');
    }, 1000);
  }
}
