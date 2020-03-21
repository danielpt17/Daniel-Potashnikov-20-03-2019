import {Location} from '../models/location';

export class LocationsTransformer {

  public static transformResponse(locations: any): Location[] {
    return locations.map(location => {
      return {key: location.Key, name: location.LocalizedName};
    });
  }
}
