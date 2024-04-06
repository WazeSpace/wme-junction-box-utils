import { usePreference } from '@/hooks';
import { WzButton } from '@wazespace/wme-react-components';

export function DisableScriptToggle() {
  const [isDisabled, setIsDisabled] = usePreference('master_disable');

  const toggle = () => setIsDisabled((state) => !state);

  return (
    <WzButton color="secondary" alarming={isDisabled} onClick={toggle}>
      <i className="w-icon fa fa-power-off"></i>
    </WzButton>
  );
}
