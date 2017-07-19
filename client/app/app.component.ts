import { Component } from '@angular/core';

import { ToggleNavService } from './core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [ToggleNavService]
})
export class AppComponent {
  isToggled: boolean;
  isNormalScreen = true;
  constructor(
    private ToggleNavService: ToggleNavService) {
    // subscribe toggle service
    this.ToggleNavService.toggle().subscribe(toggled => {
      this.isToggled = toggled;
    });
  }
}
