import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class DragAndDropService {
  innerBoxPositionData = new BehaviorSubject({
    xCoOrdinate: 10,
    yCoOrdinate: 10,
    height: 20,
    width: 20
  });
  constructor() {}
}
