import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ObservableSubscriptionComponent} from '../../utils/observable-subscription-component.util';
import {FormControl} from '@angular/forms';
import {HomeService} from './services/home.service';
import {debounceTime, startWith, switchMap, take, takeUntil, tap} from 'rxjs/operators';
import {Location} from './models/location';
import {FavoritesService} from '../../core/services/favorites.service';
import {ToastrService} from 'ngx-toastr';
import {Weather} from './models/weather';
import {forkJoin, Observable} from 'rxjs';
import {NgxUiLoaderService} from 'ngx-ui-loader';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends ObservableSubscriptionComponent implements OnInit {
  searchLineControl: FormControl = new FormControl();
  locations: Location[];
  lat: number;
  lon: number;
  selectedLocation: Location;
  selectedLocationWeather: Weather;
  locationWeatherForecast: Weather[];
  GENERAL_ERROR_MESSAGE: string = 'Oops something wrong happened. Please try again:)';
  INPUT_ERROR_MESSAGE: string = 'No special characters or numbers allowed';
  NAVIGATOR_ERROR: string = 'Geolocation is not supported by your browser';
  favoritesTooltipString: string;

  constructor(private readonly homeService: HomeService,
              private readonly favoritesService: FavoritesService,
              private readonly cdr: ChangeDetectorRef,
              private readonly toastr: ToastrService,
              private readonly ngxLoader: NgxUiLoaderService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.ngxLoader.start();
    this.setGeoLocations();
    this.subscribeToSearchLineControl();
  }

  private setGeoLocations(): void {
    if (!navigator || !navigator.geolocation) {
      this.toastr.error(this.NAVIGATOR_ERROR);
    }
    navigator.geolocation.getCurrentPosition((position) => {
      this.lat = position.coords.latitude;
      this.lon = position.coords.longitude;
      if (history.state.data) {
        this.selectedLocation = history.state.data;
        this.selectedLocation.inFavorites = true;
        this.subscribeToLocationChanges();
      } else {
        this.setLocationByDefault();
      }
    });
  }

  private subscribeToLocationChanges(): void {
    this.subscribeToWeatherData(this.selectedLocation.key)
      .subscribe(
        result => {
          if (Array.isArray(result) && result.length > 1) {
            this.selectedLocation.inFavorites = this.favoritesService.checkIfInFavorites(this.selectedLocation.key);
            this.selectedLocationWeather = result[0][0];
            this.selectedLocationWeather.name = this.selectedLocation.name;
            this.locationWeatherForecast = result[1];
            this.ngxLoader.stop();
            this.cdr.detectChanges();
          } else {
            this.ngxLoader.start();
            this.toastr.error(this.GENERAL_ERROR_MESSAGE);
          }
        },
        error => {
          this.toastr.error(error.message);
          this.ngxLoader.stop();
        }
      );
  }

  private subscribeToWeatherData(locationKey: string): Observable<any[]> {
    return forkJoin(
      this.homeService.getCurrentWeather({locationKey}),
      this.homeService.getNextDaysWeather({locationKey})
    ).pipe(
      takeUntil(this.observableUnsubscriber)
    );
  }

  private setLocationByDefault() {
    this.homeService.getGeoLocaiton({q: `${this.lat},${this.lon}`})
      .pipe(
        take(1),
        tap((locations: Location[]) => {
          this.selectedLocation = locations[0];
        }),
        switchMap((locations: Location[]) => {
          return this.subscribeToWeatherData(locations[0].key);
        })
      ).subscribe(
      (result) => {
        if (Array.isArray(result) && result.length) {
          this.selectedLocationWeather = result[0][0];
          this.selectedLocationWeather.name = this.selectedLocation.name;
          this.selectedLocation.inFavorites = this.favoritesService.checkIfInFavorites(this.selectedLocation.key);
          this.locationWeatherForecast = result[1];
          this.ngxLoader.stop();
          this.cdr.detectChanges();
        } else {
          this.ngxLoader.start();
          this.toastr.error(this.GENERAL_ERROR_MESSAGE);
        }
      },
      (error) => {
        this.toastr.error(error.message);
        this.ngxLoader.stop();
      });
  }

  public onFavoriteClick(): void {
    this.selectedLocation.inFavorites = !this.selectedLocation.inFavorites;
    if (this.selectedLocation.inFavorites) {
      this.favoritesService.setFavoriteLocation(this.selectedLocation);
    } else {
      this.favoritesService.removeFromFavorites(this.selectedLocation);
    }
  }

  private subscribeToSearchLineControl(): void {
    this.searchLineControl.valueChanges
      .pipe(
        takeUntil(this.observableUnsubscriber),
        startWith(null),
        debounceTime(400),
        tap((val: string) => {
          if (val && (typeof val === 'string') && /^[a-zA-Z ]+$/i.test(val)) {
            this.ngxLoader.start();
            this.homeService.getLocationsAutoComplete({q: val}).then((locations: Location[]) => {
              this.ngxLoader.stop();
              this.locations = locations;
            }).catch(error => {
              this.toastr.error(error);
            });
          } else {
            if (val !== null && typeof val !== 'object' && val.length > 0) {
              this.toastr.error(this.INPUT_ERROR_MESSAGE);
            }
          }
        })
      )
      .subscribe();
  }

  getOptionText(option): string {
    if (option) {
      return option.name;
    }
  }

  public onLocationSelected(location: Location): void {
    this.subscribeToWeatherData(location.key)
      .subscribe(
        (result) => {
          if (result.length) {
            this.selectedLocation = location;
            this.selectedLocation.inFavorites = this.favoritesService.checkIfInFavorites(this.selectedLocation.key);
            this.selectedLocationWeather = result[0][0];
            this.selectedLocationWeather.name = location.name;
            this.locationWeatherForecast = result[1];
            this.cdr.detectChanges();
            this.ngxLoader.stop();
          } else {
            this.ngxLoader.start();
            this.toastr.error(this.GENERAL_ERROR_MESSAGE);
          }
        },
        (error) => {
          this.toastr.error(error.message);
          this.ngxLoader.stop();
        });
  }


}

