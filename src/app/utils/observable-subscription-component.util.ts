/***
 * This Component manages unsubscribing from observables automatically
 */
import {Subject} from 'rxjs';
import {OnDestroy, OnInit} from '@angular/core';

export abstract class ObservableSubscriptionComponent implements OnInit, OnDestroy {

  protected observableUnsubscriber: Subject<any>;

  /***
   * remember to call super in case you override this method in child class
   */
  ngOnInit() {
    this.observableUnsubscriber = new Subject();
  }


  /***
   * remember to call super in case you override this method in child class
   */
  ngOnDestroy() {
    if (this.observableUnsubscriber) {
      this.observableUnsubscriber.next();
      this.observableUnsubscriber.complete();
    }
  }
}
