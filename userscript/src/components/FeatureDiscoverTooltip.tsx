import { RefObject } from 'react';
import { TippyModal } from './tippy';
import { WzButton } from '@wazespace/wme-react-components';
import { TippyProps } from '@tippyjs/react';
import styled from '@emotion/styled';

const FeatureDiscoverContent = styled('div')({
  padding: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
  alignItems: 'start',
});
const Sparkles = styled('i')({
  WebkitTextStroke: '2px black',
  marginInlineEnd: 8,
  fontsize: 32,
  color: 'var(--cautious)',
});

interface FeatureDiscoverTooltipProps {
  target: RefObject<HTMLElement>;
  placement?: TippyProps['placement'];
  headline: string;
  body: string;
  primaryButtonText: string;
  onPrimaryButtonClick?(): void;
}
export function FeatureDiscoverTooltip(props: FeatureDiscoverTooltipProps) {
  const mapElement = document.getElementById('map');
  return (
    <TippyModal
      getReferenceClientRect={() => {
        const targetRect = props.target.current?.getBoundingClientRect?.();
        if (!targetRect) return null;
        const mapRect = mapElement.getBoundingClientRect();

        const targetEndX = targetRect.x + targetRect.width;
        const x = Math.max(targetRect.x, mapRect.x);
        const endX = Math.max(x, targetEndX);

        return new DOMRect(x, targetRect.y - 24, endX - x, targetRect.height); // compensate for arrow offset
      }}
      popperOptions={{
        modifiers: [
          {
            name: 'arrow',
            options: {
              padding: {
                top: 30,
              },
            },
          },
        ],
      }}
      appendTo={mapElement}
      placement={props.placement}
      showOnCreate
      arrow
      interactive
      hideOnClick={false}
      theme="map-tooltip"
      trigger="manual"
      ignoreAttributes
    >
      <FeatureDiscoverContent>
        <wz-h4>
          <Sparkles className="w-icon w-icon-themes-fill" />
          {props.headline}
        </wz-h4>
        <wz-body>{props.body}</wz-body>
        <WzButton color="text" size="sm" onClick={props.onPrimaryButtonClick}>
          {props.primaryButtonText}
        </WzButton>
      </FeatureDiscoverContent>
    </TippyModal>
  );
}
