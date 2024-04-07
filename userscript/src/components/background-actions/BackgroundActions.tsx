import { ReactElement } from 'react';
import { AutoCloneRoundaboutGeometryBackgroundAction } from './actions/AutoCloneRoundaboutGeom';
import { AutoBackupBigJunctionBeforeDelete } from './actions/AutoBackupBigJunctionBeforeDelete';

export function BackgroundActions(): ReactElement {
  return (
    <>
      <AutoCloneRoundaboutGeometryBackgroundAction />
      <AutoBackupBigJunctionBeforeDelete />
    </>
  );
}
