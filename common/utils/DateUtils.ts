import { Moment, utc } from 'moment';

export class DateUtils {
  static toMoment(date: string | number): Moment {
    // Parse timestamp and return a date with a UTC offset that is the same as the local computer
    // See: https://momentjs.com/guides/#/parsing/local-utc-zone/
    return utc(date);
  }

  static toDateString(date: Moment): string {
    // Return the localized string representation of the date in the timezone of the user
    // See: https://momentjs.com/docs/#/displaying/
    return date.local().format('L');
  }

  static toDateTimeString(date: Moment): string {
    // Return the localized string representation of the date and time in the timezone of the user
    // See: https://momentjs.com/docs/#/displaying/
    return date.local().format('L LTS');
  }
}
