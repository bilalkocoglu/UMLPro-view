import {Directive, ElementRef, HostBinding, HostListener, Input, OnInit} from '@angular/core';
import {DraggableDirective} from './draggable.directive';
import {DomSanitizer, SafeStyle} from '@angular/platform-browser';

interface Position {
  x: number;
  y: number;
}

@Directive({
  selector: '[abeMovable]'
})
export class MovableDirective extends DraggableDirective {

  // tanımladığımız position değerleri elementin style'ına uygulanır.
  @HostBinding('style.transform') get transform(): SafeStyle {
    return this.sanitizer.bypassSecurityTrustStyle(
      'translateX(' + this.position.x + 'px) translateY(' + this.position.y + 'px)'
    );
  }

  @HostBinding('class.movable') movable = true;

  position: Position = {x: 0 , y: 0};
  private startPosition: Position;

  // sürükleme işlemi bittiğinde elementin başlangıç noktasına geri dönmesini istiyorsak true olmalı
  // Input diyerek bunu div oluştururken belirlenebilir hale getirdik.
  // Şöyle ki; <div appMovable [appMovableReset]="true"> şeklinde tanımlayabiliriz.
  // Tanımlamazsak default olarak false gelir. (yani bırakıldığında eski haline dönmez)
  @Input('appMovableReset') reset = false;

  constructor(private sanitizer: DomSanitizer,
              public element: ElementRef) {
    super();
  }

  @HostListener('dragStart', ['$event'])
  onDragStart(event: PointerEvent): void {
    // console.log('Start Moving !');
    this.startPosition = {  // Başlangıç konumu alındı.
      x: event.clientX - this.position.x,
      y: event.clientY - this.position.y
    };
  }

  @HostListener('dragMove', ['$event'])
  onDragMove(event: PointerEvent): void {
    // console.log('Moving... !');
    // bu satırla beraber X eksenine doğru hareket etmeye başlar.
    // Eğer clientX yerine clientY yazarsak boxa bastıktan sonra aşağı itersek sağa yukarı itersek yola kayar.
    this.position.x = event.clientX - this.startPosition.x;
    this.position.y = event.clientY - this.startPosition.y;

  }

  @HostListener('dragEnd', ['$event'])
  onDragEnd(event: PointerEvent): void {
    // console.log('Stop End !');
    if (this.reset){
      this.position = {x: 0, y: 0};
    }
  }

}
