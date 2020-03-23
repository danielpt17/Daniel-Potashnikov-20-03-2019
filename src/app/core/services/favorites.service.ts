import {Injectable} from '@angular/core';
import {Location} from '../../modules/home/models/location';
import {ApiService} from './api.service';
import {forkJoin, Observable} from 'rxjs';
import {CurrentWeatherDto} from '../../modules/home/models/current-weather.dto';
import {WeatherTransformer} from '../../modules/home/transformers/weather.transformer';
import {Weather} from '../../modules/home/models/weather';
import {map} from 'rxjs/operators';

@Injectable()
export class FavoritesService {

  constructor(private readonly apiService: ApiService) {
  }

  setFavoriteLocation(favoriteLocation: Location): void {
    let favoriteLocationArray: Location[];
    try {
      favoriteLocationArray = JSON.parse(localStorage.getItem('favorites'));
      if (!favoriteLocationArray || !favoriteLocationArray.length) {
        favoriteLocationArray = [favoriteLocation];
      } else {
        if (this.checkIfInFavorites(favoriteLocation.key)) {
          favoriteLocationArray.push(favoriteLocation);
        }
      }
      localStorage.setItem('favorites', JSON.stringify(favoriteLocationArray));
    } catch (err) {
      console.error(err);
    }
  }

  removeFromFavorites(favoriteLocation: Location): void {
    let favoriteLocationArray: Location[];
    try {
      favoriteLocationArray = JSON.parse(localStorage.getItem('favorites'));
      if (favoriteLocationArray && favoriteLocationArray.length) {
        favoriteLocationArray = favoriteLocationArray.filter((location: Location) => {
          return location.key !== favoriteLocation.key;
        });
        localStorage.setItem('favorites', JSON.stringify(favoriteLocationArray));
      }
    } catch (err) {
      console.error(err);
    }
  }

  checkIfInFavorites(key: string): boolean {
    let favoriteLocationArray: Location[];
    try {
      favoriteLocationArray = JSON.parse(localStorage.getItem('favorites'));
      if (favoriteLocationArray && favoriteLocationArray.length) {
        const favoriteLocation = favoriteLocationArray.find(location => location.key === key);
        return !!favoriteLocation;
      }
    } catch (err) {
      console.error(err);
    }
  }

  getFavoriteLocations(): Location[] {
    let favoriteLocationArray: Location[];
    try {
      favoriteLocationArray = JSON.parse(localStorage.getItem('favorites'));
      if (!favoriteLocationArray || !favoriteLocationArray.length) {
        favoriteLocationArray = [];
      }
      return favoriteLocationArray;
    } catch (err) {
      console.error(err);
    }
  }

  getFavoritesCurrentWeather(locations: Location[]): Observable<Weather[]> {
    const arrayOfResponse = [];
    for (const location of locations) {
      arrayOfResponse.push(this.apiService.getCurrentWeather({locationKey: location.key}));
    }
    return forkJoin(arrayOfResponse).pipe(
      map(
        (response: CurrentWeatherDto[]) => {
          return WeatherTransformer.transformResponse(response);
        }
      )
    );
  }
}
