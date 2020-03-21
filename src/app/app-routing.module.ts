import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';


const routes: Routes = [
  {
    path: '',
    loadChildren: () => import ('./modules/home/home.module').then(module => module.HomeModule)
  },
  {
    path: 'favorites',
    loadChildren: () => import ('./modules/favorites/favorites.module').then(module => module.FavoritesModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
