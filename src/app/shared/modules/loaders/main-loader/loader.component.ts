import {ChangeDetectionStrategy, Component} from '@angular/core';
import {loaderConfig} from '../loader.constant';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  public lottieConfig: Object;

  constructor() {
    this.lottieConfig = loaderConfig;
  }

}
