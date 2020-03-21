import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TooltipModule} from './modules/tooltip/tooltip.module';
import {LoaderModule} from './modules/loaders/loader.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [],
  exports: [TooltipModule, LoaderModule],
})
export class SharedModule {
}
