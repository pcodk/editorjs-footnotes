var generateID = require('./generateID').generateID;
it('generates a string', function () {
    expect(typeof generateID()).toBe('string');
});
it('default length = 10 + 3', function () {
    expect(generateID().length).toEqual(13);
});
it('can get custom length string', function () {
    expect(generateID({ length: 5 }).length).toBe(3 + 5);
});
it('can use custom prefix', function () {
    var id = generateID({
        prefix: 'footnote-',
    });
    expect(id.startsWith('footnote-')).toBe(true);
    expect(id.length).toBe(10 + 'footnote-'.length);
});
it('can use empty prefix', function () {
    var id = generateID({
        prefix: '',
        length: 22,
    });
    expect(id.length).toBe(22);
});
it('can use custom prefix and length', function () {
    var prefix = 'pref-';
    var length = 100;
    var id = generateID({
        prefix: prefix,
        length: length,
    });
    expect(id.startsWith(prefix));
    expect(id.length).toBe(prefix.length + length);
});
function testLength(length) {
    it("can generate ".concat(length, "-length id"), function () {
        expect(generateID({ length: length }).length).toBe('fn-'.length + length);
    });
}
testLength(0);
testLength(1);
testLength(100);
testLength(1000);
testLength(1000 * 1000);
function testCharacters(length) {
    it("returns only valid characters (length=".concat(length, ")"), function () {
        var id = generateID({
            prefix: 'prefix-',
            length: length,
        });
        expect(id).toEqual(expect.stringMatching(/prefix-[a-z0-9]*/));
    });
}
testCharacters(1);
testCharacters(10);
testCharacters(100);
it('raises exception for negative lengths', function () {
    expect(function () {
        return generateID({
            length: -1,
        });
    }).toThrowError();
});
it('raises exception if length is float', function () {
    expect(function () { return generateID({ length: 10.01 }); }).toThrowError();
});
//# sourceMappingURL=generateID.test.js.map