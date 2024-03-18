import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { RoundaboutNormalizationForbiddenReason } from '@/roundabout-normalization-engine/roundabout-normalization-forbidden-reason';

export class RoundaboutNormalizationForbiddenError extends Error {
  constructor(
    public readonly fromSegment: SegmentDataModel,
    public readonly drivingDirection: 'forward' | 'reverse',
    public readonly userLanguageExplanationKey: string,
  ) {
    super(
      `Instruction normalization of ${fromSegment.getAttribute('id')}${drivingDirection[0]} is prohibited`,
    );
  }

  static createFactory(
    fromSegment: SegmentDataModel,
    drivingDirection: 'forward' | 'reverse',
  ) {
    return (humanLanguageExplanationKey: string) =>
      new RoundaboutNormalizationForbiddenError(
        fromSegment,
        drivingDirection,
        humanLanguageExplanationKey,
      );
  }

  static createReasonableFactory(
    fromSegment: SegmentDataModel,
    drivingDirection: 'forward' | 'reverse',
    userLanguageExplanationKeyBuilder: (
      reason: RoundaboutNormalizationForbiddenReason,
    ) => string,
  ) {
    const factory = this.createFactory(fromSegment, drivingDirection);

    return (reason: RoundaboutNormalizationForbiddenReason) => {
      const explanationKey = userLanguageExplanationKeyBuilder(reason);
      return factory(explanationKey);
    };
  }
}
