import { isLanesControlElement } from './is-lanes-control-element';

function fromHTML(html: string, trim = true) {
  // Process the HTML string.
  html = trim ? html.trim() : html;
  if (!html) return null;

  // Then set up a new template element.
  const template = document.createElement('template');
  template.innerHTML = html;
  const result = template.content.children;

  // Then return either an HTMLElement or HTMLCollection,
  // based on whether the input HTML had one or more roots.
  if (result.length === 1) return result[0];
  return result;
}

const validLanesControlHtmlString = `<div class="controls direction-lanes-edit">
  <div class="form-group">
    <label class="control-label">Number of Lanes</label>
    <div class="controls-container">
      <input class="form-control" max="32" min="0" name="laneCount" size="3" type="number" value="0">
    </div>
  </div>
  <div class="button-container">
    <wz-button color="secondary" size="sm" class="cancel-button">Cancel</wz-button>
    <wz-button disabled="" size="sm" class="apply-button">Apply</wz-button>
  </div>
</div>`;

const validLanesControlDomNode = fromHTML(
  validLanesControlHtmlString,
) as Element;

describe('isLanesControlElement', () => {
  it("should return true for an element with class 'lanes-control'", () => {
    console.log(validLanesControlDomNode.className);
    expect(isLanesControlElement(validLanesControlDomNode)).toBe(true);
  });

  it("should return false for an element without class 'lanes-control'", () => {
    const element = document.createElement('div');
    expect(isLanesControlElement(element)).toBe(false);
  });
});
