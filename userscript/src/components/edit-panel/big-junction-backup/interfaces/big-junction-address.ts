interface EmptyBigJunctionAddress {
  isEmpty: true;
  cityName?: never;
  stateName?: never;
  countryName?: never;
  cityId?: never;
}
interface FilledBigJunctionAddress {
  isEmpty?: false;
  cityName?: string;
  stateName?: string;
  countryName: string;
  cityId?: number | null;
}

export type BigJunctionAddress =
  | EmptyBigJunctionAddress
  | FilledBigJunctionAddress;
