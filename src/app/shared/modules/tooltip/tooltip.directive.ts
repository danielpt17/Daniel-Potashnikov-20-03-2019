import {ComponentRef, Directive, ElementRef, HostListener, Input, OnDestroy, OnInit} from '@angular/core';
import {ConnectedPosition, Overlay, OverlayPositionBuilder, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';
import {TooltipComponent} from './tooltip.component';
import {ObservableSubscriptionComponent} from '../../../utils/observable-subscription-component.util';
import {TooltipEnum} from '../../enums/tooltip.enum';


@Directive({selector: '[appTooltip]'})
export class TooltipDirective extends ObservableSubscriptionComponent implements OnInit, OnDestroy {
  @Input('appTooltip') text: string = '';
  private showAlways: boolean = false;
  private tooltipRef: ComponentRef<TooltipComponent>;
  private overlayRef: OverlayRef;


  constructor(private readonly overlay: Overlay,
              private readonly overlayPositionBuilder: OverlayPositionBuilder,
              private readonly elementRef: ElementRef,
  ) {
    super();
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  private createPositionStrategy(): void {
    const poistions: ConnectedPosition[] = [{
      originX: TooltipEnum.END,
      originY: TooltipEnum.CENTER,
      overlayX: TooltipEnum.START,
      overlayY: TooltipEnum.CENTER,
      offsetX: 4
    }];
    const positionStrategy = this.overlayPositionBuilder
      .flexibleConnectedTo(this.elementRef)
      .withPositions(poistions);
    this.overlayRef = this.overlay.create({positionStrategy});
  }

  @HostListener('mouseover', ['$event'])
  show(): void {
    if (this.text) {
      this.generateToolTip();
    }
  }

  @HostListener('mouseout', ['$event'])
  removeOnMouseOut(event: MouseEvent): void {
    if (event.relatedTarget && this.tooltipRef && this.showAlways &&
      this.tooltipRef.location.nativeElement.contains(event.relatedTarget)) {
      return;
    }

    this.removeToolTip();
  }

  private generateToolTip(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
    this.createPositionStrategy();
    this.tooltipRef = this.overlayRef.attach(new ComponentPortal(TooltipComponent));
    this.tooltipRef.instance.text = this.text;
  }

  private removeToolTip(): void {
    if (this.overlayRef) {
      this.overlayRef.detach();
    }
    this.tooltipRef = null;
  }

  ngOnDestroy() {
    super.ngOnDestroy();
    this.removeToolTip();
  }
}


