import { BigJunctionEditPanelButton } from '../../BigJunctionEditPanelButton';
import { useTranslate } from '@/hooks';
import { MouseEventHandler, useMemo, useState } from 'react';
import { useSelectedDataModelsContext } from '@/contexts/SelectedDataModelsContext';
import { BigJunctionDataModel } from '@/@waze/Waze/DataModels/BigJunctionDataModel';
import { Logger } from '@/logger';
import { ConditionalTooltip } from '@/components/ConditionalTooltip';
import { gtag } from '@/google-analytics';
import {
  checkBigJunctionPathsCompatibility,
  convertBigJunctionToPaths,
} from '@/utils/wme-entities/convert-big-junction-to-paths';

export function ConvertToPathsButton() {
  const t = useTranslate();
  const [bigJunction] = useSelectedDataModelsContext<BigJunctionDataModel>();
  const [isConverting, setIsConverting] = useState(false);

  const compatibility = useMemo(() => {
    if (!bigJunction) return { isCompatible: false, incompatibleTurns: [] };
    const result = checkBigJunctionPathsCompatibility(bigJunction);
    if (!result.isCompatible) {
      Logger.info(
        'Big Junction conversion to paths is disabled due to incompatible turns:',
        result.incompatibleTurns,
      );
    }
    return result;
  }, [bigJunction]);

  const isDisabled = !compatibility.isCompatible || isConverting;

  const handleButtonClick: MouseEventHandler<HTMLButtonElement> = async (e) => {
    e.currentTarget.blur();
    gtag('event', 'click_convert_to_paths', {
      event_category: 'big_junction_conversion',
    });

    if (!bigJunction || isDisabled) return;

    try {
      setIsConverting(true);
      await convertBigJunctionToPaths(bigJunction);
      gtag('event', 'convert_to_paths_success', {
        event_category: 'big_junction_conversion',
      });
    } catch (error) {
      Logger.error('Failed to convert Big Junction to paths:', error);
    } finally {
      setIsConverting(false);
    }
  };

  return (
    <ConditionalTooltip
      show={!compatibility.isCompatible}
      tooltipContent={t(
        'jb_utils.big_junction.convert_to_paths_disabled_reason',
      )}
    >
      <BigJunctionEditPanelButton
        disabled={isDisabled}
        onClick={handleButtonClick}
      >
        {t('jb_utils.big_junction.actions.convert_to_paths')}
      </BigJunctionEditPanelButton>
    </ConditionalTooltip>
  );
}
