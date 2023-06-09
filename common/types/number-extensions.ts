let initialized = false;

/**
 * Extend the native Number prototype with useful helpers we are using across the system.
 */
export const setupNumberExtensions = () => {
  if (initialized) {
    return;
  }

  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Number.prototype, 'format', {
    value(locale = 'en-US') {
      return new Intl.NumberFormat([locale]).format(this);
    },
    writable: false,
    enumerable: false,
  });

  initialized = true;
};
