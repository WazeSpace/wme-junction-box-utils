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
  cityId?: number | null,
): BigJunctionAddress {
  return {
    cityName,
    stateName,
    countryName,
    cityId,
  };
}

export function convertWMEAddressToBigJunctionAddress(
  address: AddressDataModel,
): BigJunctionAddress {
  if (!address || address.isEmpty()) return createEmptyAddress();
  const cityObj = address.getCity();
  const city = cityObj?.getName?.();
  const cityId = cityObj?.getCityID?.();
  const state = address.getState()?.getName?.();
  const country = address.getCountry()?.getName?.();
  return createAddress(city, state, country, cityId);
}
