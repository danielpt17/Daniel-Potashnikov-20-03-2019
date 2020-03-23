import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ObservableSubscriptionComponent} from '../../utils/observable-subscription-component.util';
import {FavoritesService} from '../../core/services/favorites.service';
import {Location} from '../home/models/location';
import {takeUntil} from 'rxjs/operators';
import {Weather} from '../home/models/weather';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class FavoritesComponent extends ObservableSubscriptionComponent implements OnInit {

  favoriteLocations: Location[];
  favoritesCurrentWeather: Weather[];
  CLICK_FOR_DETAILS: string = 'Click for details';

  constructor(private readonly favoritesService: FavoritesService,
              private readonly cdr: ChangeDetectorRef,
              private readonly toastr: ToastrService,
              private readonly ngxLoader: NgxUiLoaderService) {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
    this.ngxLoader.start();
    this.favoriteLocations = this.favoritesService.getFavoriteLocations();
    if (this.favoriteLocations.length) {
      this.subscribeToFavoritesCurrentWeather();
    } else {
      this.ngxLoader.stop();
      this.toastr.show('No favorites yet. Please set location as bookmark at first');
    }
  }


  private subscribeToFavoritesCurrentWeather(): void {
    this.favoritesService.getFavoritesCurrentWeather(this.favoriteLocations)
      .pipe(
        takeUntil(this.observableUnsubscriber)
      )
      .subscribe(
        (favoritesCurrentWeather: Weather[]) => {
          this.favoritesCurrentWeather = favoritesCurrentWeather;
          for (let i = 0; i < this.favoriteLocations.length; i++) {
            this.favoritesCurrentWeather[i].name = this.favoriteLocations[i].name;
            this.favoritesCurrentWeather[i].key = this.favoriteLocations[i].key;
          }
          this.ngxLoader.stop();
          this.cdr.detectChanges();
        },
        (error) => {
          this.toastr.error(error);
        });
  }
}
