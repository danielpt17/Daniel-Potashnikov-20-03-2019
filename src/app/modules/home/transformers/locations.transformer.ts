import {Location} from '../models/location';

export class LocationsTransformer {

  public static transformResponse(locations: any): Location[] {
    if (locations) {
      if (!Array.isArray(locations)) {
        locations = [locations];
      }
      return locations.map(location => {
        return {key: location.Key, name: location.LocalizedName};
      });
    } else {
      return [];
    }
  }
}
