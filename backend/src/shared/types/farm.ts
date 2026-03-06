export interface CreateFarmRequest {
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  area: number;
  soilType: string;
  irrigationType: string;
}

export interface UpdateFarmRequest {
  name?: string;
  location?: string;
  latitude?: number;
  longitude?: number;
  area?: number;
  soilType?: string;
  irrigationType?: string;
}

export interface FarmResponse {
  id: string;
  name: string;
  location: string;
  latitude: number;
  longitude: number;
  area: number;
  soilType: string;
  irrigationType: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}