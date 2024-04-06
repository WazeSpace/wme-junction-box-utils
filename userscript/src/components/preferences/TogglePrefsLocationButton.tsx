import { usePreference, useTranslate } from '@/hooks';
import { Preferences } from '@/preferences';
import { WzButton } from '@wazespace/wme-react-components';

function flipLocation(
  location: Preferences['prefs_location'],
): Preferences['prefs_location'] {
  switch (location) {
    case 'tab':
      return 'wme-prefs';
    case 'wme-prefs':
      return 'tab';
    default:
      throw new Error('Invalid location ' + location);
  }
}

export function TogglePrefsLocationButton() {
  const t = useTranslate();
  const [prefsLocation, setPrefsLocation] = usePreference('prefs_location');
  const moveToLocation = flipLocation(prefsLocation);

  const togglePrefsLocation = () => {
    setPrefsLocation(moveToLocation);
  };

  return (
    <WzButton
      onClick={togglePrefsLocation}
      size="sm"
      color="secondary"
      style={{ width: '100%' }}
    >
      {t(`jb_utils.user.prefs.prefs_location.move_to.${moveToLocation}`)}
    </WzButton>
  );
}
