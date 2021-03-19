import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {
  links = ['class-settings', 'payment-settings'];
  activeLink = this.links[0];
  constructor() { }

  ngOnInit(): void {
  }

}
