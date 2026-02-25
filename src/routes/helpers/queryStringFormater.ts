function formatQueryString(queryString: unknown): string | undefined {
    if(typeof queryString === 'string') {
        return queryString.replace(/^"(.*)"$/, '$1')
    }
    if (Array.isArray(queryString) && typeof queryString[0] === 'string') {
        return queryString[0].replace(/^"(.*)"$/, '$1');
    }
    return undefined
}

export { formatQueryString };