import {NgModule} from '@angular/core';
import {FavoritesService} from './services/favorites.service';
import {ApiService} from './services/api.service';

@NgModule({
  declarations: [],
  imports: [],
  providers: [FavoritesService, ApiService],
  exports: [],
})
export class CoreModule {
}
