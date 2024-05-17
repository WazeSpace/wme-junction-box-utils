import clsx from 'clsx';
import { WzListItem } from '@wazespace/wme-react-components';
import { TurnListViewEntryStreetNames } from './TurnListViewEntryStreetNames';

interface TurnListViewEntryProps {
  fromStreetName: string;
  toStreetName: string;
  showFromStreet: boolean;
  isTurnAllowed: boolean;
  onClick?(): void;
  onMouseOver?(): void;
  onMouseOut?(): void;
}
export function TurnListViewEntry({
  fromStreetName,
  toStreetName,
  showFromStreet,
  isTurnAllowed,
  onClick,
  onMouseOver,
  onMouseOut,
}: TurnListViewEntryProps) {
  const itemKeyChildren = (
    <div>
      <div
        className={clsx(
          'arrow fa fa-arrow-right',
          isTurnAllowed ? 'allowed' : 'disallowed',
        )}
      />
      <TurnListViewEntryStreetNames
        fromStreet={fromStreetName}
        toSteet={toStreetName}
        showFromStreet={showFromStreet}
      />
    </div>
  );

  return (
    <WzListItem
      className="exit-item"
      itemKey={itemKeyChildren}
      disabled={'false' as any} // required as the underlying WME stylesheet looks for a "false" string in this property
      onClick={onClick}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
    />
  );
}
