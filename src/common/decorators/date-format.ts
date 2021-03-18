const date_format = require('dateformat');

export function DateFromat(date: Date, format: string) {
  return function format(target: any, key: string) {
    var _val = key;

    var getter = function () {
      return date_format(date, format)
    };

    var setter = function (newVal: string) {
      _val = newVal;
    };

    Object.defineProperty(target, key, {
      get: getter,
      set: setter,
      enumerable: true,
      configurable: true
    });
  }

}