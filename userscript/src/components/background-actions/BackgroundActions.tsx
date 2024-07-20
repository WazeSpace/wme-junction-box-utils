import { EnlargeBigJunction } from '@/components/background-actions/actions/EnlargeBigJunction';
import { ReactElement } from 'react';
import { AutoCloneRoundaboutGeometryBackgroundAction } from './actions/AutoCloneRoundaboutGeom';
import { AutoBackupBigJunctionBeforeDelete } from './actions/AutoBackupBigJunctionBeforeDelete';
import { AutoRestoreBigJunction } from './actions/AutoRestoreBigJunction';

export function BackgroundActions(): ReactElement {
  return (
    <>
      <AutoCloneRoundaboutGeometryBackgroundAction />
      <AutoBackupBigJunctionBeforeDelete />
      <AutoRestoreBigJunction />
      <EnlargeBigJunction />
    </>
  );
}
