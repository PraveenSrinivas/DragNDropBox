import { Component, OnInit, OnDestroy, ChangeDetectorRef } from "@angular/core";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

import { DragAndDropService } from "src/app/services/drag-and-drop/drag-and-drop.service";

@Component({
  selector: "app-form-input",
  templateUrl: "./form-input.component.html",
  styleUrls: ["./form-input.component.scss"]
})
export class FormInputComponent implements OnInit, OnDestroy {
  innerBoxPositionData = {
    xCoOrdinate: 0,
    yCoOrdinate: 0,
    height: 0,
    width: 0
  };
  destroySubscriptions$ = new Subject();

  constructor(
    private dragAndDropService: DragAndDropService,
    private changeDetector: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.dragAndDropService.innerBoxPositionData
      .pipe(takeUntil(this.destroySubscriptions$))
      .subscribe(innerBoxPositionData => {
        this.innerBoxPositionData = innerBoxPositionData;
        this.changeDetector.detectChanges();
      });
  }

  /**
   * Updates the property of innerBoxPositionData present in DragAndDropService
   * @param updatedProperty The property name to be updated
   * @param updatedValue The value of the property to be updated
   * @author Praveen S
   */
  updateInnerBoxPositionData(updatedProperty: string, updatedValue: number) {
    this.dragAndDropService.innerBoxPositionData.next({
      ...this.innerBoxPositionData,
      [updatedProperty]: Number(updatedValue)
    });
  }

  ngOnDestroy(): void {
    this.destroySubscriptions$.next(true);
  }
}
