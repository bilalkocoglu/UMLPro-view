import {AfterContentInit, ContentChildren, Directive, ElementRef, OnInit, QueryList} from '@angular/core';
import {MovableDirective} from './movable.directive';
import {Subscription} from 'rxjs';

interface Boundaries {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
}

@Directive({
  selector: '[abeMovableArea]'
})
export class MovableAreaDirective implements AfterContentInit {
  @ContentChildren(MovableDirective) movables: QueryList<MovableDirective>;

  private boundaries: Boundaries; // sınırlar
  private subsciptions: Subscription[] = [];

  constructor(private element: ElementRef) { }

  ngAfterContentInit(): void {
    // console.log(this.movables.length); // area box içindeki item sayısını öğrenebiliriz.

    this.movables.changes.subscribe(() => {
      this.subsciptions.forEach(s => s.unsubscribe());

      this.movables.forEach(movable => {
        this.subsciptions.push(movable.dragStart.subscribe(() => this.measureBoundaries(movable)));
        this.subsciptions.push(movable.dragMove.subscribe(() => this.maintainBoundaries(movable)));
      });
    });

    this.movables.notifyOnChanges();
  }
  // sınırları ölç
  private measureBoundaries(movable: MovableDirective) {
    const areaBoxRect: ClientRect = this.element.nativeElement.getBoundingClientRect(); // area boxın sınırlarını bulmamızı sağlar.
    const movableClientRect: ClientRect = movable.element.nativeElement.getBoundingClientRect();

    // area box'ın sınır noktaları ile sürüklenen elementin sınır noktaları arasındaki farklar
    // yani sürükleme işleminin x ve y eksenindeki sınırlarıdır.
    this.boundaries = {
      minX: areaBoxRect.left - movableClientRect.left + movable.position.x,
      maxX: areaBoxRect.right - movableClientRect.right + movable.position.x,
      minY: areaBoxRect.top - movableClientRect.top + movable.position.y,
      maxY: areaBoxRect.bottom - movableClientRect.bottom + movable.position.y,
    };

    // console.log('Area Box Boundaris => ', this.boundaries); // bu satırı çalıştırıp ilk iteme tıklamamız hesabı açıklar (margin:10px)
  }

  // sınırları koru
  private maintainBoundaries(movable: MovableDirective) {
    movable.position.x = Math.max(this.boundaries.minX, movable.position.x);
    movable.position.x = Math.min(this.boundaries.maxX, movable.position.x);
    movable.position.y = Math.max(this.boundaries.minY, movable.position.y);
    movable.position.y = Math.min(this.boundaries.maxY, movable.position.y);
  }
}
