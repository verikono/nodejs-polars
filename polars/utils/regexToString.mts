export const regexToString = (r: string | RegExp): string => {
    if (isRegExp(r)) {
        return r.source;
    }

    return r;
};
