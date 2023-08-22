import { Series, SeriesConstructor } from './index.mjs';

export const from = (name, values?: ArrayLike<any>): Series => {
    if (Array.isArray(name)) {
      return SeriesConstructor("", values);
    } else {
      return SeriesConstructor(name, values);
    }
  };
