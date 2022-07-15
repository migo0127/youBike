import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { BikeAvailability } from "../model";
import { BikeStation } from "../model/bike-station.model";

@Injectable({ providedIn: 'root' })

export class YouBickService {

  constructor(private http: HttpClient){ }

  public getStationByCity(city: string, input?: string): Observable<BikeStation[]>{
    if (!input) {
      return this.http.get<BikeStation[]>(`https://ptx.transportdata.tw/MOTC/v2/Bike/Station/${city}`);
    } else {
      return this.http.get<BikeStation[]>(`https://ptx.transportdata.tw/MOTC/v2/Bike/Station/${city}?$filter=contains(StationName/Zh_tw,'${input}')&$format=JSON`);
    }
  }

  public getAvailabilityByCity(city: string): Observable<BikeAvailability[]>{
    return this.http.get<BikeAvailability[]>(`https://ptx.transportdata.tw/MOTC/v2/Bike/Availability/${city}`);
  }

  public getStationByData(city: string): Observable<BikeStation[]>{
    return this.http.get<BikeStation[]>(`assets/data/station/${city}.json`);
  }

  public getAvailabilityByData(city: string): Observable<BikeAvailability[]>{
    return this.http.get<BikeAvailability[]>(`assets/data/availability/${city}-availability.json`);
  }

}
