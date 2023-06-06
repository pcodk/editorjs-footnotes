function cleanChars(chars, regex) {
    return chars.match(regex).join('');
}
function getChars(n) {
    function getSomeChars() {
        var min = 1000 * 1000 * 1000;
        var max = 10 * min - 1;
        return (Math.random() * (max - min) + min).toString(36);
    }
    var ret = '';
    while (ret.length < n) {
        ret = ret.concat(cleanChars(getSomeChars().toLowerCase(), /[a-z0-9]/g));
    }
    return ret.slice(0, n);
}
export function generateID(options) {
    var prefix = 'fn-';
    var length = 10;
    // Set user-provided values
    if (options && (options.prefix || options.prefix === '')) {
        prefix = options.prefix;
    }
    if (options && (options.length || options.length === 0)) {
        length = options.length;
    }
    // Check for invalid input
    if (length < 0) {
        throw new Error('options.length cannot be negative');
    }
    if (!Number.isInteger(length)) {
        throw new Error('options.length must be integer');
    }
    return "".concat(prefix).concat(getChars(length));
}
//# sourceMappingURL=generateID.js.map