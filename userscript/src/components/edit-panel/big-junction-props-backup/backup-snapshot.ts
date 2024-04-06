import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { Turn } from '@/@waze/Waze/Model/turn';
import { BigJunctionSignature } from '@/types/big-junction-signature';
import { createVertexFromSegment } from '@/utils/wme-entities/segment-vertex';

export interface BigJunctionBackupSnapshotAddress {
  city?: string;
  state?: string;
  country: string;
}
export interface BigJunctionBackupSnapshot {
  address: BigJunctionBackupSnapshotAddress;
  name?: string;
  turns: Turn[];
  signature: BigJunctionSignature;
  isRestored: boolean;
  createdFrom: BigJunctionDataModel;
}

export function createBackupSnapshotFromBigJunction(
  bigJunction: BigJunctionDataModel,
): BigJunctionBackupSnapshot {
  const address = bigJunction.getAddress(bigJunction.model);

  const bjSignature = BigJunctionSignature.fromBigJunction(bigJunction);

  return {
    address: {
      city: address.getCityName(),
      state: address.getStateName(),
      country: address.getCountryName(),
    },
    name: bigJunction.getAttribute('name'),
    turns: bjSignature.getEntranceSegments().flatMap((entranceSegment) => {
      const entranceDirection = entranceSegment
        .getAttribute('toCrossroads')
        .includes(bigJunction.getAttribute('id'))
        ? 'forward'
        : 'reverse';
      return bigJunction.getTurnsFrom(
        bigJunction.model,
        createVertexFromSegment(entranceSegment, entranceDirection),
      );
    }),
    signature: bjSignature,
    isRestored: false,
    createdFrom: bigJunction,
  };
}
