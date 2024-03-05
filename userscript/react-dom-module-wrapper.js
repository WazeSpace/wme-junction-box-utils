function getWindow() {
  if ('unsafeWindow' in window) return window.unsafeWindow;
  return window;
}

module.exports = new Proxy(
  {},
  {
    get(_target, prop) {
      return getWindow().ReactDOM[prop];
    },
    set(_target, prop, value) {
      return (getWindow().ReactDOM[prop] = value);
    },
  },
);
