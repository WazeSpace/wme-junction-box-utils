import { ReactElement } from 'react';

function wrapStreetName(streetName: string): ReactElement {
  return <span className="street-name">{streetName}</span>;
}

interface TurnListViewEntryStreeetNamesProps {
  fromStreet: string;
  toStreet: string;
  showFromStreet: boolean;
}
export function TurnListViewEntryStreetNames({
  fromStreet,
  toStreet,
  showFromStreet,
}: TurnListViewEntryStreeetNamesProps): ReactElement {
  const fromStreetChildren = wrapStreetName(fromStreet);
  if (!showFromStreet) return fromStreetChildren;

  const toStreetChildren = wrapStreetName(toStreet);
  return (
    <>
      {fromStreetChildren}
      {' to '}
      {toStreetChildren}
    </>
  );
}
