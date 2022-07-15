export interface BikeAvailability {
  StationUID: string,
  StationID: string,
  ServiceStatus: number,
  ServiceType: number,
  AvailableRentBikes: number,
  AvailableReturnBikes: number,
  SrcUpdateTime: string,
  UpdateTime: string
}
