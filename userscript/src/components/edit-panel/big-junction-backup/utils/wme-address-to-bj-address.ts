import { AddressDataModel } from '@/@waze/Waze/DataModels/AddressDataModel';
import { BigJunctionAddress } from '../interfaces';

function createEmptyAddress(): BigJunctionAddress {
  return {
    isEmpty: true,
  };
}

function createAddress(
  cityName: string,
  stateName: string,
  countryName: string,
): BigJunctionAddress {
  return {
    cityName,
    stateName,
    countryName,
  };
}

export function convertWMEAddressToBigJunctionAddress(
  address: AddressDataModel,
): BigJunctionAddress {
  if (!address || address.isEmpty()) return createEmptyAddress();
  const city = address.getCity()?.getName?.();
  const state = address.getState()?.getName?.();
  const country = address.getCountry()?.getName?.();
  return createAddress(city, state, country);
}
