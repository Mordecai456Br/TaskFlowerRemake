function formatQueryString(queryString: unknown): string | undefined {
    if(typeof queryString === 'string') {
        return escapeLikeWildcards(queryString.replace(/^"(.*)"$/, '$1'));
    }
    if (Array.isArray(queryString) && typeof queryString[0] === 'string') {
        return escapeLikeWildcards(queryString[0].replace(/^"(.*)"$/, '$1'));
    }
    return undefined
}
function escapeLikeWildcards(queryString: string) {
    return queryString = queryString.replace(/[%_]/g, '\\$&');
}
export { formatQueryString };