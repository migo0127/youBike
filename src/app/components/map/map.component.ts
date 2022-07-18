import { AfterViewInit, Component } from '@angular/core';
import { BikeAvailability, BikeStation, City } from 'src/app/model';
import { YouBickService } from 'src/app/service';
import * as L from 'leaflet';
import 'leaflet.markercluster';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})

export class MapComponent implements AfterViewInit {

  // 地圖
  private map: any;
  // 圖標群組變量
  private markers: any;
  // 台灣縣市列表
  public cityList: City[] = [
    { name: "台北市", id: 'Taipei'},
    { name: "新北市", id: 'NewTaipei' },
    { name: "新竹市", id: 'Hsinchu' },
    { name: "桃園市", id: 'Taoyuan' },
    { name: "苗栗縣", id: 'MiaoliCounty' },
    { name: "台中市", id: 'Taichung' },
    { name: "嘉義市", id: 'Chiayi' },
    { name: "台南市", id: 'Tainan' },
    { name: "高雄市", id: 'Kaohsiung' },
    { name: "金門縣", id: 'KinmenCounty' },
    { name: "屏東縣", id: 'PingtungCounty' },
  ];
  // 選擇城市: 初始默認為列表第一個
  public selectedCity: City = this.cityList[0];
  // 輸入框變數: 模糊搜尋
  public districtInput: string = '';
  // 指定城市/區裡的所有YouBike站點資料
  public stopResult!: BikeStation[];
  //
  public titleInfo: string = '';

  constructor(
    private youBickService: YouBickService,
   ) { }

  ngAfterViewInit(): void {
    this.initMap();
  }

  // 地圖初始化
  private initMap(): void{
    // 地圖初始化位置
    this.map = L.map('map', {
      center: [ 25.0408578889, 121.567904444],
      zoom: 15
    });

    // 載入圖資、地圖切片及縮放比例設定
    const tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      maxZoom: 18,
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1,
      accessToken: 'pk.eyJ1IjoiY2xhdWRpYS10ZW5nIiwiYSI6ImNrd3lrazF1dTBtMmoyd3FydDV5Nnl1NTEifQ.ZSu5vhxmu4uy3BXWrQVInQ'
    }).addTo(this.map);

    this.getStationByCity();
  }

  // 獲取所有城市的站點資訊，但不包含可還數量及可借數量
  public getStationByCity(city?: City, input?: string): void{
    if(city) this.selectedCity = city;
    if(input?.trim()){
      // 搜索包括輸入框變數: 模糊搜尋
      this.youBickService.getStationByCity(this.selectedCity.id, input?.trim()).subscribe({
        next: (res: BikeStation[]) => {
          this.stopResult = res;
        },
        error: () => {
          // 因API有查詢次數的限制，若已達限制次數則使用假資料JSON
          this.youBickService.getStationByData(this.selectedCity.id.toLocaleLowerCase()).subscribe((res: BikeStation[]) => {
            this.stopResult = this.fuzzySearchByData(input?.trim(), res);
            this.bindCityStopAvailability();
            // alert('很抱歉，已超過每日使用次數，暫時無法使用關字查詢，請隔日在使用，謝謝！ \n\n Search rate limit exceeded');
          });
        },
        complete: () => {
          this.bindCityStopAvailability();
        }
      });
    }else{
      this.youBickService.getStationByCity(this.selectedCity.id).subscribe({
        next: (res) => {
          this.stopResult = res;
        },
        error: () => {
          // 因API有查詢次數的限制，若已達限制次數則使用假資料JSON
          this.youBickService.getStationByData(this.selectedCity.id.toLocaleLowerCase()).subscribe((res: BikeStation[]) => {
            this.stopResult = res;
            this.bindCityStopAvailability();
          });
        },
        complete: () => {
          this.bindCityStopAvailability();
        }
      });
    }
  }

  // 獲取所有站點的可還數量及可借數量
  private bindCityStopAvailability(): void{
    this.youBickService.getAvailabilityByCity(this.selectedCity.id).subscribe({
      next: (res: BikeAvailability[]) => {
        this.mergeStopInfo(res);
      },
      error: () => {
        // 因API有查詢次數的限制，若已達限制次數則使用假資料JSON
        this.youBickService.getAvailabilityByData(this.selectedCity.id.toLocaleLowerCase()).subscribe((res: BikeAvailability[]) => {
          this.mergeStopInfo(res);
          this.initLayer();
        });
      },
      complete: () => {
        this.initLayer();
      }
    });
  }

  // 結合所有站點與尚餘車位資訊
  private mergeStopInfo(availabilitys: BikeAvailability[]): void{
    this.stopResult.map( stop => {
      availabilitys.forEach( availabilityStop => {
        if(stop.StationUID === availabilityStop.StationUID){
          stop.AvailableRentBikes = availabilityStop.AvailableRentBikes;
          stop.AvailableReturnBikes = availabilityStop.AvailableReturnBikes;
          this.titleInfo = `${ this.titleInfo ? this.titleInfo + ',' : '' } ${ stop.StationName.Zh_tw.split('_')[1] }`;
        }
      });
    });
  }

  // 假資料進行模糊搜尋
  private fuzzySearchByData(keyword: string, stopRes: BikeStation[]): BikeStation[] {
    const bikeStation: BikeStation[] = [];
    for(let stop of stopRes){
      if(stop.StationName.Zh_tw.includes(keyword)){
        bikeStation.push(stop);
      }
    }
    return bikeStation;
  }

  // 設置圖標
  private initLayer(): void {
    // 清除上次圖標
    this.markers?.clearLayers();
    // 將附近圖標群組起來，避免過多圖標，導致效能問題
    this.markers = L?.markerClusterGroup({
        polygonOptions: {
          fillColor: 'transparent',
          color: 'transparent',
        }
    });

    // 移動到搜索資料第一筆的地點
    this.map.setView([this.stopResult[0].StationPosition.PositionLat, this.stopResult[0].StationPosition.PositionLon], 15);

    // 循環站點，各別綁定站點資訊及圖標
    this.stopResult?.forEach( stop => {
      // 綁定各站資訊
      let popupInfo: string =
      `<p>${ stop.StationName.Zh_tw.replace('_', ' ') }</p>
       <p class=${ stop.AvailableRentBikes > 10 ? 'text-success' : 'text-danger'}>可借數量：${ stop.AvailableRentBikes  }</p>
       <p class=${ stop.AvailableReturnBikes > 10 ? 'text-success' : 'text-danger' }>可停空位：${ stop.AvailableReturnBikes }</p>`;

      // 綁定圖標
      let marker = L
        .marker([stop.StationPosition.PositionLat, stop.StationPosition.PositionLon ], {
          icon: new L.DivIcon({
            className: 'marker-icon',
            html:
              `<div>
                <img src="assets/card-marker.png"/>
              </div>`
          })
        }).bindPopup(popupInfo);

        // 將圖標添加群組圖層
        this.markers?.addLayer(marker);
    });
    // 將圖標添加到map圖層裡
    this.map?.addLayer(this.markers);
  }

  // 定位到側邊欄點擊的站點位置
  public clickSideStation(stop: BikeStation): void{
    if(this.stopResult.length === 1 && this.stopResult[0].StationID === stop.StationID) return;
    this.stopResult = [stop];
    this.initLayer();
  }

}

