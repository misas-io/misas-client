import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';


@Pipe({name: 'localeDate'})
export class LocaleDate implements PipeTransform {
  transform(value: string, format: string): string {
    let preTranslatedDate = moment(value, "ddd MMM DD YYYY HH:mm:ss");
    let date = moment(preTranslatedDate.toISOString());
    date.locale('es');
    return date.format(format);
  }
}
