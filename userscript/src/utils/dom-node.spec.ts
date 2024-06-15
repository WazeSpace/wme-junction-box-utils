import { isElementNode } from './dom-node';

describe('isElementNode', () => {
  it('should return true for an element node', () => {
    const element = document.createElement('div');
    expect(isElementNode(element)).toBe(true);
  });

  it('should return false for a text node', () => {
    const textNode = document.createTextNode('Hello');
    expect(isElementNode(textNode)).toBe(false);
  });

  it('should return false for a comment node', () => {
    const commentNode = document.createComment('This is a comment');
    expect(isElementNode(commentNode)).toBe(false);
  });
});
