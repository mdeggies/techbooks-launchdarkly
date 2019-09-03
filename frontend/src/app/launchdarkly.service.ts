// Courtesy of Arnold Trakhtenberg: https://launchdarkly.com/blog/integrating-feature-flags-in-angular-v4/

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs'
import { initialize, LDClient, LDFlagSet, LDUser } from 'ldclient-js';
import { environment } from './../environments/environment';
import { CardsComponent } from './cards/cards.component';

@Injectable()
export class LaunchDarklyService {
  ldClient: LDClient;
  flags: LDFlagSet;
  flagChange: Subject<Object> = new Subject<Object>();

  constructor() {
    this.flags = { 'infinite-scroll': false };

    this.ldClient = initialize(environment.LAUNCH_DARKLY_API_KEY,
      { key: "QA", anonymous: true });

    this.ldClient.on('initialized', (flags) => {
      if (flags['infinite-scroll'] !== undefined) {
        this.flags['infinite-scroll'] = flags['infinite-scroll'];
      }
      this.flagChange.next(this.flags);
    });

    this.ldClient.on('change', (flags) => {
      if (flags['infinite-scroll'] !== undefined) {
        this.flags['infinite-scroll'] = flags['infinite-scroll'];
      }
      this.flagChange.next(this.flags);
    });

    this.ldClient.on('ready', () => {
      this.setFlags();
    })
  }

  setFlags() {
    this.flags = this.ldClient.allFlags();
  }

  changeUser(userKey) {
    this.ldClient.identify({ key: userKey, name: userKey, anonymous: true });
  }
}
