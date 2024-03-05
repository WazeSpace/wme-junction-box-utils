function getWindow() {
  if ('unsafeWindow' in window) return window.unsafeWindow;
  return window;
}

module.exports = new Proxy(
  {},
  {
    get(_target, prop) {
      return getWindow().React[prop];
    },
    set(_target, prop, value) {
      return (getWindow().React[prop] = value);
    },
  },
);
