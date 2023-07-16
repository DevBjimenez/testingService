import { TestBed } from '@angular/core/testing';

import { MapService } from './map.service';

describe('MapService', () => {
  let service: MapService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MapService
      ]
    });
    service = TestBed.inject(MapService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCurrentPosition method test', () => {
    it('should save data in center property', () => {
      const mockData: GeolocationPosition = {
        coords: {
          accuracy: 0,
          altitude: 0,
          altitudeAccuracy: 0,
          heading: 0,
          latitude: 200,
          longitude: 250,
          speed: 0
        },
        timestamp: 0
      }
      spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((succesCallback) => {
        succesCallback(mockData)
      })

      service.getCurrentPosition()

      expect(service.center.lat).toEqual(mockData.coords.latitude)
      expect(service.center.lng).toEqual(mockData.coords.longitude)
    });
    
  });
});
