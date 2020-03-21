import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoaderComponent} from './main-loader/loader.component';
import {LottieAnimationViewModule} from 'ng-lottie';
import {VideoLoaderComponent} from './video-loader/video-loader.component';

@NgModule({
    declarations: [
        LoaderComponent,
        VideoLoaderComponent
    ],
    imports: [CommonModule, LottieAnimationViewModule.forRoot()],
    providers: [],
    exports: [LoaderComponent, VideoLoaderComponent],


})
export class LoaderModule {

}
