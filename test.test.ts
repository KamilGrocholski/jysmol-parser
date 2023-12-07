import { describe, expect, test } from "bun:test";

import { JSONParser } from './'

describe('keywords', () => {
    test('null', () => {
        expect(JSONParser.parse('null')).toBe(null)
    })

    test('false', () => {
        expect(JSONParser.parse('false')).toBe(false)
    })

    test('true', () => {
        expect(JSONParser.parse('true')).toBe(true)
    })
})

describe('numbers', () => {
    test('positive integer', () => {
        expect(JSONParser.parse('1234')).toBe(1234)
    })

    test('negative integer', () => {
        expect(JSONParser.parse('-1234')).toBe(-1234)
    })

    test('positive float', () => {
        expect(JSONParser.parse('1234.1234')).toBe(1234.1234)
    })

    test('negative float', () => {
        expect(JSONParser.parse('-1234.1234')).toBe(-1234.1234)
    })

    test('hmmm', () => {
        expect(JSONParser.parse('2f')).toBe(2)
    })
})

describe('strings', () => {
    test('empty string', () => {
        expect(JSONParser.parse('""')).toBe('')
    })

    test('not empty string', () => {
        expect(JSONParser.parse('"string"')).toBe("string")
    })

    test('not empty string with whitespace', () => {
        expect(JSONParser.parse('" string ok "')).toBe(" string ok ")
    })
})

describe('arrays', () => {
    test('empty array', () => {
        expect(JSONParser.parse('[]')).toEqual([])
    })

    test('array with numbers', () => {
        expect(JSONParser.parse('[1,2,3,-4,51.2,-13.2,]'))
            .toEqual([1,2,3,-4,51.2,-13.2])
    })

    test('array with strings', () => {
        expect(JSONParser.parse('["some string", "next string",]'))
            .toEqual(["some string", "next string"])
    })

    test('array with arrays', () => {
        expect(JSONParser.parse('[[], ["string",], [1,],]'))
            .toEqual([[], ["string"], [1]])
    })

    test('array with objects', () => {
        expect(JSONParser.parse('[{}, {"key": "value",},]'))
            .toEqual([{}, {key: "value"}])
    }) 
})

describe('objects', () => {
    test('empty object', () => {
        expect(JSONParser.parse('{}')).toEqual({})
    })

    test('object with numbers', () => {
        expect(JSONParser.parse('{"val1": 1, "val2": 2,}'))
            .toEqual({val1: 1, val2: 2})
    })

    test('object with strings', () => {
        expect(JSONParser.parse('{"val1": "str1", "val2": "str2",}'))
            .toEqual({"val1": "str1", "val2": "str2"})
    })

    test('object with arrays', () => {
        expect(JSONParser.parse('{"val1": [], "val2": [1,], "val3": ["str",],}'))
            .toEqual({val1: [], val2: [1], val3: ["str"]})
    })

    test('object with objects', () => {
        expect(JSONParser.parse('{"val1": {}, "val2": {"val1": 1,}, "val3": {"val1": "str",},}'))
            .toEqual({val1: {}, val2: {val1: 1}, val3: {val1:"str"}})
    }) 
})
