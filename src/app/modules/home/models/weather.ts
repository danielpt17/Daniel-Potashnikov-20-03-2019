export class Weather {
  public weatherText?: string;
  public temperature: { metric: { value: number; unit: string }; imperial: { value: number; unit: string } };
  public date: string;
  public name?: string;
  public key?: string;
}
