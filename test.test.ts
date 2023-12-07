import { describe, expect, test } from "bun:test";

import { JysmolParser } from './'

describe('keywords', () => {
    test('null', () => {
        expect(JysmolParser.parse('null')).toBe(null)
    })

    test('false', () => {
        expect(JysmolParser.parse('false')).toBe(false)
    })

    test('true', () => {
        expect(JysmolParser.parse('true')).toBe(true)
    })
})

describe('numbers', () => {
    test('positive integer', () => {
        expect(JysmolParser.parse('1234')).toBe(1234)
    })

    test('negative integer', () => {
        expect(JysmolParser.parse('-1234')).toBe(-1234)
    })

    test('positive float', () => {
        expect(JysmolParser.parse('1234.1234')).toBe(1234.1234)
    })

    test('negative float', () => {
        expect(JysmolParser.parse('-1234.1234')).toBe(-1234.1234)
    })

    test('hmmm', () => {
        expect(JysmolParser.parse('2f')).toBe(2)
    })
})

describe('strings', () => {
    test('empty string', () => {
        expect(JysmolParser.parse('""')).toBe('')
    })

    test('not empty string', () => {
        expect(JysmolParser.parse('"string"')).toBe("string")
    })

    test('not empty string with whitespace', () => {
        expect(JysmolParser.parse('" string ok "')).toBe(" string ok ")
    })
})

describe('arrays', () => {
    test('empty array', () => {
        expect(JysmolParser.parse('[]')).toEqual([])
    })

    test('array with numbers', () => {
        expect(JysmolParser.parse('[1,2,3,-4,51.2,-13.2,]'))
            .toEqual([1,2,3,-4,51.2,-13.2])
    })

    test('array with strings', () => {
        expect(JysmolParser.parse('["some string", "next string",]'))
            .toEqual(["some string", "next string"])
    })

    test('array with arrays', () => {
        expect(JysmolParser.parse('[[], ["string",], [1,],]'))
            .toEqual([[], ["string"], [1]])
    })

    test('array with objects', () => {
        expect(JysmolParser.parse('[{}, {"key": "value",},]'))
            .toEqual([{}, {key: "value"}])
    }) 
})

describe('objects', () => {
    test('empty object', () => {
        expect(JysmolParser.parse('{}')).toEqual({})
    })

    test('object with numbers', () => {
        expect(JysmolParser.parse('{"val1": 1, "val2": 2,}'))
            .toEqual({val1: 1, val2: 2})
    })

    test('object with strings', () => {
        expect(JysmolParser.parse('{"val1": "str1", "val2": "str2",}'))
            .toEqual({"val1": "str1", "val2": "str2"})
    })

    test('object with arrays', () => {
        expect(JysmolParser.parse('{"val1": [], "val2": [1,], "val3": ["str",],}'))
            .toEqual({val1: [], val2: [1], val3: ["str"]})
    })

    test('object with objects', () => {
        expect(JysmolParser.parse('{"val1": {}, "val2": {"val1": 1,}, "val3": {"val1": "str",},}'))
            .toEqual({val1: {}, val2: {val1: 1}, val3: {val1:"str"}})
    }) 
})

describe('errors', () => {
    test('comma in array error', () => {
        expect(() => JysmolParser.parse('\n[2]')).toThrow(new Error(
        "expected: ',', got: ']', at line 2 position 3"))
    })

    test('unexpected token in main', () => {
        expect(() => JysmolParser.parse('\n[2,}')).toThrow(new Error(
        "unexpected token: '}', at line 2 position 4"))
    })

    test('unexpected token first character', () => {
        expect(() => JysmolParser.parse(';')).toThrow(new Error(
        "unexpected token: ';', at line 1 position 1"))
    })
})
