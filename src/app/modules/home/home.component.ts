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

  constructor(private readonly homeService: HomeService,
              private readonly favoritesService: FavoritesService,
              private readonly cdr: ChangeDetectorRef,
              private readonly toastr: ToastrService
  ) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    if (history.state.data) {
      console.log(history.state.data)
      this.selectedLocation = history.state.data;
    //  this.subscribeToLocationChanges();
    } else {
   //   this.setLocationByDefault();
    }
   // this.subscribeToSearchLineControl();
  }

  private subscribeToLocationChanges(): void {
    console.log(this.selectedLocation.key)
    this.subscribeToWeatherData(this.selectedLocation.key).subscribe((result) => {
      if (Array.isArray(result) && result.length > 1) {
        this.selectedLocationWeather = result[0][0];
        this.selectedLocationWeather.name = this.selectedLocation.name;
        this.locationWeatherForecast = result[1];
        this.cdr.detectChanges();
      } else {
        this.toastr.error('Oops something wrong happened. Please try again:)');
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
        this.selectedLocation = {key: this.defaultSearchLocationKey, name: 'Tel Aviv'};
        this.selectedLocation.inFavorites = this.favoritesService.checkIfInFavorites(this.defaultSearchLocationKey);
        this.selectedLocationWeather = result[0][0];
        this.selectedLocationWeather.name = 'Tel Aviv';
        this.locationWeatherForecast = result[1];
        this.cdr.detectChanges();
      } else {
        this.toastr.error('Oops something wrong happened. Please try again:)');
      }
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
          if (val && (typeof val === 'string') && /^[A-Z]+$/i.test(val)) {
            // //this.homeService.getLocationsAutoComplete({q: val}).then((locations: Location[]) => {
            //   this.locations = locations;
            // });
          } else {
            if (val != null) {
              this.toastr.error('No special characters or numbers allowed');
            }
          }
        })
      )
      .subscribe();
  }

  public onLocationSelected(location: Location): void {
    this.subscribeToWeatherData(location.key).subscribe((result) => {
      if (result.length) {
        this.selectedLocationWeather = result[0][0];
        this.selectedLocationWeather.name = location.name;
        this.locationWeatherForecast = result[1];
        this.cdr.detectChanges();
      }
    });
  }
}
