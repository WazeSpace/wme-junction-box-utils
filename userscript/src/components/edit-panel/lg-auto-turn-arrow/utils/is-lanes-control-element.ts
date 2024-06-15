export function isLanesControlElement(element: Element): boolean {
  return (
    element &&
    element.classList.contains('controls') &&
    element.classList.contains('direction-lanes-edit')
  );
}
