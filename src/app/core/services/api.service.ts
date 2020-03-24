import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment';
import {map} from 'rxjs/operators';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';
import {QueryParams} from '../../modules/home/models/query-params';
import {throwError} from 'rxjs';

const API_URL = environment.apiUrl;
const API_KEY = '82h1TppjYMnYsseVDPIzmJhpJbMlM8G9';

@Injectable()
export class ApiService {
  constructor(
    private http: HttpClient,
  ) {
  }

  getLocationsAutoComplete(queryParams: QueryParams): Observable<any> {
    return this.http
      .get(`${API_URL}/locations/v1/cities/autocomplete`, {
        params: {
          apikey: API_KEY,
          q: queryParams.q
        }
      }).pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getCurrentWeather(queryParams: QueryParams): Observable<any> {
    return this.http
      .get(`${API_URL}/currentconditions/v1/${queryParams.locationKey}`, {
        params: {
          apikey: API_KEY,
        }
      }).pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getWeatherByGeoPosition(queryParams: QueryParams): Observable<any> {
    return this.http
      .get(`${API_URL}/locations/v1/cities/geoposition/search`, {
        params: {
          apikey: API_KEY,
          q: queryParams.q
        }
      }).pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }

  getNextDaysWeather(queryParams: QueryParams): Observable<any> {
    return this.http
      .get(`${API_URL}/forecasts/v1/daily/5day/${queryParams.locationKey}`, {
        params: {
          apikey: API_KEY,
        }
      }).pipe(
        map((response) => {
          return response;
        }),
        catchError(this.handleError)
      );
  }


  private handleError(error: Response | any) {
    console.error('ApiService::handleError', error);
    return throwError(error);
  }


}
