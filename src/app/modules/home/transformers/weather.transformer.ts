import {CurrentWeatherDto} from '../models/current-weather.dto';
import {Weather} from '../models/weather';

export class WeatherTransformer {

  public static transformResponse(weathers: CurrentWeatherDto[]): Weather[] {
    return weathers.map((weather: CurrentWeatherDto) => {
      if (Array.isArray(weather)) {
        weather = weather[0];
      }
      return {
        date: weather.LocalObservationDateTime,
        weatherText: weather.WeatherText,
        temperature: {
          metric: {
            value: weather.Temperature.Metric.Value,
            unit: weather.Temperature.Metric.Unit
          },
          imperial: {
            value: weather.Temperature.Imperial.Value,
            unit: weather.Temperature.Imperial.Unit
          }
        }
      };
    });
  }
}
