// SockJS expects a Node-like global in some bundling scenarios.
if (typeof globalThis.global === 'undefined') {
  globalThis.global = globalThis;
}
