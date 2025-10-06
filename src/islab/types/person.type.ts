import { Color } from '../enums/color.enum';
import { Country } from '../enums/country.enum';
import { Location } from './location.type';

export type Person = {
  name: string;
  eyeColor: Color;
  hairColor: Color;
  location: Location;
  height: number;
  nationality: Country;
};
