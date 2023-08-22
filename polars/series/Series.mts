import {
    SeriesConstructor,
    isSeries,
    from,
    of,
} from './index.mjs';

export const Series: SeriesConstructor = Object.assign(SeriesConstructor, {
    isSeries,
    from,
    of,
    deserialize: (buf, fmt) => _Series(pli.JsSeries.deserialize(buf, fmt)),
});
