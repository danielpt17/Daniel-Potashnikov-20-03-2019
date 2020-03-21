import {NgModule} from '@angular/core';
import {TooltipComponent} from './tooltip.component';
import {TooltipDirective} from './tooltip.directive';
import {CommonModule} from '@angular/common';

@NgModule({
    declarations: [
        TooltipComponent,
        TooltipDirective,
    ],
    imports: [CommonModule],
    providers: [],
    exports: [TooltipComponent, TooltipDirective],
    entryComponents: [TooltipComponent]

})
export class TooltipModule {

}
