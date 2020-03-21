export class CurrentWeatherDto {
  public LocalObservationDateTime: string;

  public EpochTime: number;

  public WeatherText: string;

  public WeatherIcon: number;

  public HasPrecipitation: boolean;

  public PrecipitationType: any;

  public IsDayTime: boolean;

  public Temperature: any;
}
