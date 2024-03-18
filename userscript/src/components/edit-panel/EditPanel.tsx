import { useSelectedDataModelsContext } from '@/contexts/SelectedDataModelsContext';
import { createPortal } from 'react-dom';
import { EditPanelTemplateConstructor } from './edit-panel-template';
import { useSelectedDataModelsType } from './hooks/useSelectedDataModelsType';
import { useMemo } from 'react';

interface EditPanelProps {
  templates: EditPanelTemplateConstructor[];
}
export function EditPanel(props: EditPanelProps) {
  const selectedElements = useSelectedDataModelsContext();
  const selectedElementsType = useSelectedDataModelsType();
  const availableTemplatesForType = useMemo(
    () =>
      props.templates.filter(
        (template) =>
          template.getSupportedElementTypes().includes(selectedElementsType) &&
          template.isEnabledForElements(selectedElements),
      ),
    [props.templates, selectedElements, selectedElementsType],
  );
  const templates = useMemo(() => {
    return availableTemplatesForType.map((templateConstructor) => {
      return new templateConstructor(selectedElements);
    });
  }, [availableTemplatesForType, selectedElements]);

  const templatesRenderedInPortals = useMemo(() => {
    return templates.map((template) => {
      return createPortal(template.render(), template.getTargetElement());
    });
  }, [templates]);

  return <>{templatesRenderedInPortals}</>;
}
