import { ParkingSpot } from 'db/models/parking-spot.model';
import { Reservation } from 'db/models/reservation.model';
import { PROVIDERS_CONSTANTS } from 'src/database/providers.constants';

export const parkingSpotProviders = [
  {
    provide: PROVIDERS_CONSTANTS.PARKING_SPOTS_REPOSITORY,
    useValue: ParkingSpot,
  },
  {
    provide: PROVIDERS_CONSTANTS.RESERVATIONS_REPOSITORY,
    useValue: Reservation,
  },
];
