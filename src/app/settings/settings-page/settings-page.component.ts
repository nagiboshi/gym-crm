import { Component, OnInit } from '@angular/core';
import {ClassModel} from '../../classes/class.model';
import {CommunicationService} from '@shared/communication.service';

@Component({
  selector: 'app-settings-page',
  templateUrl: './settings-page.component.html',
  styleUrls: ['./settings-page.component.scss']
})
export class SettingsPageComponent implements OnInit {


  constructor(private communicationService: CommunicationService) {
  }

  ngOnInit(): void {
  }

}
