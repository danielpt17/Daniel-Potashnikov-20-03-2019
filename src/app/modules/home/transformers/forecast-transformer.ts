import {Weather} from '../models/weather';

export class ForecastTransformer {
  public static transformResponse(weathers: any): Weather[] {
    return weathers.DailyForecasts.map((weather) => {
      return {
        date: weather.Date,
        weatherText: weather.Day.IconPhrase,
        temperature: {
          metric: {
            value: Math.round((5 / 9) * (+weather.Temperature.Maximum.Value - 32)),
            unit: 'C'
          },
          imperial: {
            value: weather.Temperature.Maximum.Value,
            unit: weather.Temperature.Maximum.Unit
          }
        }
      };
    });
  }
}
