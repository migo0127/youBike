import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BikeStation } from 'src/app/model';

@Component({
  selector: 'app-sider',
  templateUrl: './sider.component.html',
  styleUrls: ['./sider.component.scss'],
})

export class SiderComponent implements OnInit {

  @Input() stopResult!: BikeStation[];
  @Output() clickSideStation: EventEmitter<BikeStation> = new EventEmitter<BikeStation>();
  @Output() clickSideBack: EventEmitter<boolean> = new EventEmitter<boolean>();

  public isDesignatedStation: boolean = false;

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
  }

  // 當雙擊側邊欄中的隨意一個站點訊息，會定位到該指定站點
  public onClickSideStation(stop: BikeStation): void{
    this.clickSideStation.emit(stop);
    this.isDesignatedStation = true;
  }

  // 點擊側邊欄返回選項，將返回上一頁(目前縣市所在區所有站點資訊)
  public onClickSideBack(isBack: boolean): void{
    this.clickSideBack.emit(isBack);
    this.isDesignatedStation = false;
  }

}
