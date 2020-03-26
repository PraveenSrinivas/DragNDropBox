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
    } else {
      this.dragAndDropService.innerBoxPositionData.next(
        this.innerBoxPreviousPositionData
      );
    }
  }

  dragStarted(event: MouseEvent) {
    console.log("Drag Started", event);
    event.stopPropagation();
  }

  dragEnded(event: MouseEvent) {
    console.log("Drag Ended", event);
    event.stopPropagation();
  }

  dropped(event: MouseEvent) {
    console.log("Dropped", event);
    event.stopPropagation();
    const innerBoxElement = document.querySelector(".inner-box") as HTMLElement;
    innerBoxElement.setAttribute("screenX", `${event.screenX}`);
    innerBoxElement.setAttribute("screenY", `${event.screenY}`);
  }

  ngOnDestroy(): void {
    this.destroySubscriptions$.next(true);
  }
}
