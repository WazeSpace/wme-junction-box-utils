import { useOnRemove, usePreference, useTranslate } from '@/hooks';
import {
  isSegmentDirectionAllowed,
  isSegmentConnectsToRoundabout,
} from '@/utils/wme-entities/segment';
import { useDebounceCallback } from 'usehooks-ts';
import { SetTurnArrowsButton } from './components';
import { FeatureDiscoverTooltip } from '@/components/FeatureDiscoverTooltip';
import { SegmentDataModel } from '@/@waze/Waze/DataModels/SegmentDataModel';
import { useState } from 'react';

interface MainProps {
  segment: SegmentDataModel;
}
export default function Main({ segment }: MainProps) {
  const [autoDiscoverBtn, setAutoDiscoverBtn] =
    useState<HTMLButtonElement>(null);
  const debouncedSetAutoDiscoverBtn = useDebounceCallback(
    setAutoDiscoverBtn,
    500,
  );
  useOnRemove(autoDiscoverBtn, () => setAutoDiscoverBtn(null));
  const [isAutoDiscovered, setAutoDiscovered] = usePreference(
    'feat_discovers.auto_roundabout_lane_guidance_turn_arrows',
  );
  const featDiscoverT = useTranslate('jb_utils.lanes.set_turn_arrows_fd');

  return (
    <>
      {renderForDirection('fwd', debouncedSetAutoDiscoverBtn, segment)}
      {renderForDirection('rev', debouncedSetAutoDiscoverBtn, segment)}
      {!isAutoDiscovered && autoDiscoverBtn && (
        <FeatureDiscoverTooltip
          target={{ current: autoDiscoverBtn }}
          placement="right-start"
          headline={featDiscoverT('title')}
          body={featDiscoverT('body')}
          primaryButtonText={featDiscoverT('button')}
          onPrimaryButtonClick={() => {
            setAutoDiscoverBtn(null);
            debouncedSetAutoDiscoverBtn(null);
            setAutoDiscovered(true);
          }}
        />
      )}
    </>
  );
}

function renderForDirection(
  direction: 'fwd' | 'rev',
  setAutoDiscoverBtn: (button: HTMLButtonElement) => void,
  segment: SegmentDataModel,
) {
  const fullDirection = (
    {
      fwd: 'forward',
      rev: 'reverse',
    } as const
  )[direction];

  if (!isSegmentDirectionAllowed(segment, fullDirection)) return null;
  if (!isSegmentConnectsToRoundabout(segment, fullDirection)) return null;

  return (
    <SetTurnArrowsButton
      lanesDirection={direction}
      onTurnArrowsSetAutomatically={(event) =>
        setAutoDiscoverBtn(event.detail.associatedButton)
      }
    />
  );
}
