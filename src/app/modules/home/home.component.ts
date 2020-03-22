import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ObservableSubscriptionComponent} from '../../utils/observable-subscription-component.util';
import {FormControl} from '@angular/forms';
import {HomeService} from './services/home.service';
import {debounceTime, startWith, takeUntil, tap} from 'rxjs/operators';
import {Location} from './models/location';
import {FavoritesService} from '../../core/services/favorites.service';
import {ToastrService} from 'ngx-toastr';
import {Weather} from './models/weather';
import {forkJoin, Observable} from 'rxjs';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {FavoritesTooltipMessageEnum} from './enums/favorites-tooltip-message.enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomeComponent extends ObservableSubscriptionComponent implements OnInit {
  searchLineControl: FormControl = new FormControl();
  locations: Location[];
  selectedLocation: Location;
  selectedLocationWeather: Weather;
  locationWeatherForecast: Weather[];
  defaultSearchLocationKey: string = '215854';
  ERROR_MESSAGE: string = 'Oops something wrong happened. Please try again:)';
  INPUT_ERROR_MESSAGE: string = 'No special characters or numbers allowed';
  DEFAULT_CITY_NAME: string = 'Tel Aviv';
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
    if (history.state.data) {
      this.selectedLocation = history.state.data;
      //  this.subscribeToLocationChanges();
    } else {
      this.setLocationByDefault();
    }
    // this.subscribeToSearchLineControl();
  }

  private subscribeToLocationChanges(): void {
    console.log(this.selectedLocation.key);
    this.subscribeToWeatherData(this.selectedLocation.key).subscribe((result) => {
      if (Array.isArray(result) && result.length > 1) {
        this.selectedLocationWeather = result[0][0];
        this.selectedLocationWeather.name = this.selectedLocation.name;
        this.locationWeatherForecast = result[1];
        this.ngxLoader.stop();
        this.cdr.detectChanges();
      } else {
        this.ngxLoader.start();
        this.toastr.error(this.ERROR_MESSAGE);
      }
    });
  }

  private subscribeToWeatherData(locationKey: string): Observable<any[]> {
    return forkJoin(
      this.homeService.getCurrentWeather({locationKey}),
      this.homeService.getNextDaysWeather({locationKey})
    ).pipe(
      takeUntil(this.observableUnsubscriber)
    );
  }

  private setLocationByDefault(): void {
    this.subscribeToWeatherData(this.defaultSearchLocationKey).subscribe((result) => {
      if (Array.isArray(result) && result.length) {
        this.selectedLocation = {key: this.defaultSearchLocationKey, name: this.DEFAULT_CITY_NAME};
        this.checkSelectedLocationFavoritesStatus();
        this.selectedLocationWeather = result[0][0];
        this.selectedLocationWeather.name = this.DEFAULT_CITY_NAME;
        this.locationWeatherForecast = result[1];
        this.ngxLoader.stop();
        this.cdr.detectChanges();
      } else {
        this.ngxLoader.start();
        this.toastr.error(this.ERROR_MESSAGE);
      }
    });
  }

  public onFavoriteClick(): void {
    this.selectedLocation.inFavorites = !this.selectedLocation.inFavorites;
    if (this.selectedLocation.inFavorites) {
      this.favoritesService.setFavoriteLocation(this.selectedLocation);
      this.favoritesTooltipString = FavoritesTooltipMessageEnum.REMOVE;
    } else {
      this.favoritesService.removeFromFavorites(this.selectedLocation);
      this.favoritesTooltipString = FavoritesTooltipMessageEnum.ADD;
    }
  }

  private subscribeToSearchLineControl(): void {
    this.searchLineControl.valueChanges
      .pipe(
        takeUntil(this.observableUnsubscriber),
        startWith(null),
        debounceTime(400),
        tap((val: string) => {
          if (val && (typeof val === 'string') && /^[A-Z]+$/i.test(val)) {
            // //this.homeService.getLocationsAutoComplete({q: val}).then((locations: Location[]) => {
            //   this.locations = locations;
            // });
          } else {
            if (val != null) {
              this.toastr.error(this.INPUT_ERROR_MESSAGE);
            }
          }
        })
      )
      .subscribe();
  }

  public onLocationSelected(location: Location): void {
    this.subscribeToWeatherData(location.key).subscribe((result) => {
      if (result.length) {
        this.selectedLocation = location;
        this.checkSelectedLocationFavoritesStatus();
        this.selectedLocationWeather = result[0][0];
        this.selectedLocationWeather.name = location.name;
        this.locationWeatherForecast = result[1];
        this.cdr.detectChanges();
        this.ngxLoader.stop();
      } else {
        this.ngxLoader.start();
        this.toastr.error(this.ERROR_MESSAGE);
      }
    });
  }

  private checkSelectedLocationFavoritesStatus(): void {
    this.selectedLocation.inFavorites = this.favoritesService.checkIfInFavorites(this.defaultSearchLocationKey);
    if (this.selectedLocation.inFavorites) {
      this.favoritesTooltipString = FavoritesTooltipMessageEnum.REMOVE;
    } else {
      this.favoritesTooltipString = FavoritesTooltipMessageEnum.ADD;
    }
  }
}
