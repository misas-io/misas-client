
import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';
import 'moment/locale/es';

@Pipe({name: 'localeDate'})
export class LocaleDate implements PipeTransform {
  transform(value: string, format: string): string {
    let time = moment(value, "ddd MMM DD YYYY HH:mm:ss");
    time.locale('es');
    return time.format(format);
  }
}
