import { gtag } from '@/google-analytics';
import { usePreference } from '@/hooks';
import { WzButton } from '@wazespace/wme-react-components';

export function DisableScriptToggle() {
  const [isDisabled, setIsDisabled] = usePreference('master_disable');

  const toggle = () => {
    const newState = !isDisabled;
    setIsDisabled(newState);
    gtag('event', 'change_preference', {
      event_category: 'preferences',
      preference_id: 'master_disable',
      new_value: newState
    });
  };

  return (
    <WzButton color="secondary" alarming={isDisabled} onClick={toggle}>
      <i className="w-icon fa fa-power-off"></i>
    </WzButton>
  );
}
