import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { BikeStation } from 'src/app/model';

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss'],
})

export class SiderComponent implements OnInit {

  @Input() stopResult!: BikeStation[];

  constructor(private elmf: ElementRef) {
   }

  ngOnInit(): void {
  }

  public activeSider(arrow: HTMLSpanElement): void{

    if( arrow.className.includes('rArrow')){
      this.elmf.nativeElement.classList.remove('slideOpen');
      this.elmf.nativeElement.classList.add('slideClose');
      arrow.classList.remove('rArrow');
    }else{
      this.elmf.nativeElement.classList.add('slideOpen');
      this.elmf.nativeElement.classList.remove('slideClose');
      arrow.classList.add('rArrow');
    }
    // this.elmf.nativeElement.style.left = this.elmf.nativeElement.style.left === '-15vw' ? '0' : '-15vw';
  }

}
