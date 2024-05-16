interface EmptyBigJunctionAddress {
  isEmpty: true;
  cityName?: never;
  stateName?: never;
  countryName?: never;
}
interface FilledBigJunctionAddress {
  isEmpty?: false;
  cityName?: string;
  stateName?: string;
  countryName: string;
}

export type BigJunctionAddress =
  | EmptyBigJunctionAddress
  | FilledBigJunctionAddress;
