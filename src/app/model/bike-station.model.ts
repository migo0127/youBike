export interface BikeStation {
  StationUID: string,
  StationID: string,
  AuthorityID: string,
  StationName: NameType,
  StationPosition: PointType,
  StationAddress: NameType,
  StopDescription: string,
  BikesCapacity: number,
  ServiceType: number,
  SrcUpdateTime: string,
  UpdateTime: string,
  AvailableRentBikes: number,
  AvailableReturnBikes: number,
}

interface NameType {
  Zh_tw: string,
  En: string
}

interface PointType {
  PositionLon: number
  PositionLat: number,
  GeoHash: string
}
