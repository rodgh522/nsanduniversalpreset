import { join } from 'path';
import { Observable } from 'rxjs';
import { TranslateLoader } from '@ngx-translate/core';
import {
  makeStateKey,
  StateKey,
  TransferState
} from '@angular/platform-browser';
import * as fs from 'fs';

export class TranslateServerLoader implements TranslateLoader {

  projectNm = 'movila'; // Your project name here

  constructor(
    private transferState: TransferState,
    private prefix: string = 'i18n',
    private suffix: string = '.json'
  ) {}

  public getTranslation(lang: string): Observable<any> {
    return new Observable((observer) => {
      let path : string = process.cwd() != '/' ? process.cwd() : '/home/hosting_users/pointmobile25/apps/pointmobile25_pointmobile/';
      const assets_folder = join(
        path,
        'dist',
        this.projectNm,
        'browser',
        'assets',
        this.prefix
      );

      const jsonData = JSON.parse(
        fs.readFileSync(`${assets_folder}/${lang}${this.suffix}`, 'utf8')
      );

      // Here we save the translations in the transfer-state
      const key: StateKey<number> = makeStateKey<number>(
        'transfer-translate-' + lang
      );
      this.transferState.set(key, jsonData);

      observer.next(jsonData);
      observer.complete();
    });
  }
}

export function translateServerLoaderFactory(transferState: TransferState) {
  return new TranslateServerLoader(transferState);
}