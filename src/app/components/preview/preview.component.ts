import { Component, OnInit, OnDestroy } from "@angular/core";
import { DragAndDropService } from "src/app/services/drag-and-drop/drag-and-drop.service";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";

@Component({
  selector: "app-preview",
  templateUrl: "./preview.component.html",
  styleUrls: ["./preview.component.scss"]
})
export class PreviewComponent implements OnInit, OnDestroy {
  innerBoxPreviousPositionData = {
    xCoOrdinate: 0,
    yCoOrdinate: 0,
    height: 0,
    width: 0
  };
  destroySubscriptions$ = new Subject();
  dragStartCoOrdinates = { pageX: 0, pageY: 0 };

  constructor(private dragAndDropService: DragAndDropService) {}

  ngOnInit(): void {
    this.dragAndDropService.innerBoxPositionData
      .pipe(takeUntil(this.destroySubscriptions$))
      .subscribe(innerBoxPositionData => {
        this.repositionInnerBox(innerBoxPositionData);
      });
  }

  /**
   * Reposition and Resize the inner box based on the values provided
   * @param param0 is and object that contains xCoOrdinate, yCoOrdinate, width, height properties
   * @author Praveen S
   */
  repositionInnerBox({ xCoOrdinate, yCoOrdinate, width, height }) {
    const innerBoxElement = document.querySelector(".inner-box") as HTMLElement;
    if (
      innerBoxElement &&
      xCoOrdinate - width / 2 >= 0 &&
      xCoOrdinate + width / 2 <= 400 &&
      yCoOrdinate - height / 2 >= 0 &&
      yCoOrdinate + height / 2 <= 200
    ) {
      innerBoxElement.style.left = xCoOrdinate + "px";
      innerBoxElement.style.bottom = yCoOrdinate + "px";
      innerBoxElement.style.width = width + "px";
      innerBoxElement.style.height = height + "px";
      this.innerBoxPreviousPositionData = {
        xCoOrdinate,
        yCoOrdinate,
        width,
        height
      };
      return true;
    } else {
      this.dragAndDropService.innerBoxPositionData.next(
        this.innerBoxPreviousPositionData
      );
      return false;
    }
  }

  dragStarted(event: MouseEvent) {
    event.stopPropagation();
    this.dragStartCoOrdinates.pageX = event.pageX;
    this.dragStartCoOrdinates.pageY = event.pageY;
  }

  dropped(event: MouseEvent) {
    event.stopPropagation();
    let xCoOrdinate, yCoOrdinate;
    xCoOrdinate =
      this.innerBoxPreviousPositionData.xCoOrdinate +
      (event.pageX - this.dragStartCoOrdinates.pageX);
    yCoOrdinate =
      this.innerBoxPreviousPositionData.yCoOrdinate -
      (event.pageY - this.dragStartCoOrdinates.pageY);
    console.log(xCoOrdinate, yCoOrdinate);
    if (
      this.repositionInnerBox({
        ...this.innerBoxPreviousPositionData,
        xCoOrdinate,
        yCoOrdinate
      })
    ) {
      this.dragAndDropService.innerBoxPositionData.next(
        this.innerBoxPreviousPositionData
      );
    }
  }

  ngOnDestroy(): void {
    this.destroySubscriptions$.next(true);
  }
}
