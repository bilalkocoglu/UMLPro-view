import {Directive, EventEmitter, HostBinding, HostListener, Output} from '@angular/core';

@Directive({
  selector: '[abeDraggable]'
})
export class DraggableDirective {
  @HostBinding('class.draggable') draggable = true;
  @HostBinding('class.dragging') dragging = false; // Sürüklenme başlamadan önce ilk tıklanmada true yapılacak

  @Output() dragStart = new EventEmitter<PointerEvent>();
  @Output() dragMove = new EventEmitter<PointerEvent>();
  @Output() dragEnd = new EventEmitter<PointerEvent>();

  // Drag Start Event Listener
  @HostListener('pointerdown', ['$event'])
  onPointerDown(event: PointerEvent): void {
    this.dragging = true;
    event.stopPropagation();  // bu satır iç içe sürüklenebilir divler kullandığımız zaman işe yar
    this.dragStart.emit(event);
  }

  // Drag Move Event Listener
  @HostListener('document:pointermove', ['$event'])
  onPointerMove(event: PointerEvent): void {
    if ( !this.dragging ) {
      return;
    }
    this.dragMove.emit(event);
  }

  // Drag End Event Listener
  @HostListener('document:pointerup', ['$event'])
  onPointerUp(event: PointerEvent): void {
    if ( !this.dragging ) {
      return;
    }
    this.dragging = false;
    this.dragEnd.emit(event);
  }

}
