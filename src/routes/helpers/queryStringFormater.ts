/**
 * Normalize a query string and escape SQL LIKE wildcards.
 *
 * @param queryString - A string or an array whose first element is a string; surrounding double quotes are removed before escaping.
 * @returns The normalized string with `%` and `_` escaped as `\%` and `\_`, or `undefined` when the input type is not supported.
 */
function formatQueryString(queryString: unknown): string | undefined {
    if(typeof queryString === 'string') {
        return escapeLikeWildcards(queryString.replace(/^"(.*)"$/, '$1'));
    }
    if (Array.isArray(queryString) && typeof queryString[0] === 'string') {
        return escapeLikeWildcards(queryString[0].replace(/^"(.*)"$/, '$1'));
    }
    return undefined
}
/**
 * Escape SQL LIKE wildcard characters (`%` and `_`) in a string by prefixing them with a backslash.
 *
 * @param queryString - The input string that may contain `%` or `_` wildcards
 * @returns The string with every `%` and `_` replaced by `\%` and `\_`, respectively
 */
function escapeLikeWildcards(queryString: string) {
    return queryString = queryString.replace(/[%_]/g, '\\$&');
}
export { formatQueryString };