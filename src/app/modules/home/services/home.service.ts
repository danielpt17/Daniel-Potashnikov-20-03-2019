import {Injectable} from '@angular/core';
import {ApiService} from '../../../core/services/api.service';
import {LocationsTransformer} from '../transformers/locations.transformer';
import {map} from 'rxjs/operators';
import {Location} from '../models/location';
import {QueryParams} from '../models/query-params';
import {Observable} from 'rxjs';
import {CurrentWeatherDto} from '../models/current-weather.dto';
import {WeatherTransformer} from '../transformers/weather.transformer';
import {Weather} from '../models/weather';
import {ForecastTransformer} from '../transformers/forecast-transformer';

@Injectable()
export class HomeService {

  constructor(private readonly apiService: ApiService) {
  }

  getLocationsAutoComplete(queryParams: QueryParams): Promise<Location[]> {
    return this.apiService.getLocationsAutoComplete(queryParams)
      .pipe(
        map(
          (response: any) => {
            return LocationsTransformer.transformResponse(response);
          }
        )
      ).toPromise();
  }

  getCurrentWeather(queryParams: QueryParams): Observable<Weather[]> {
    return this.apiService.getCurrentWeather(queryParams)
      .pipe(
        map(
          (response: CurrentWeatherDto[]) => {
            return WeatherTransformer.transformResponse(response);
          }
        )
      );
  }

  getGeoLocaiton(queryParams: QueryParams): Observable<Location[]> {
    return this.apiService.getWeatherByGeoPosition(queryParams)
      .pipe(
        map(
          (response: any) => {
            return LocationsTransformer.transformResponse(response);
          }
        )
      );
  }

  getNextDaysWeather(queryParams: QueryParams): Observable<Weather[]> {
    return this.apiService.getNextDaysWeather(queryParams)
      .pipe(
        map(
          (response: CurrentWeatherDto[]) => {
            return ForecastTransformer.transformResponse(response);
          }
        )
      );
  }
}
