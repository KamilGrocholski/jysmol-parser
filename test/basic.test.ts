import { describe, expect, test } from "bun:test";

import { Jysmol } from '../src'

describe('keywords', () => {
    test('null', () => {
        expect(Jysmol.parse('null')).toBe(null)
    })

    test('false', () => {
        expect(Jysmol.parse('false')).toBe(false)
    })

    test('true', () => {
        expect(Jysmol.parse('true')).toBe(true)
    })
})

describe('numbers', () => {
    test('positive integer', () => {
        expect(Jysmol.parse('1234')).toBe(1234)
    })

    test('negative integer', () => {
        expect(Jysmol.parse('-1234')).toBe(-1234)
    })

    test('positive float', () => {
        expect(Jysmol.parse('1234.1234')).toBe(1234.1234)
    })

    test('negative float', () => {
        expect(Jysmol.parse('-1234.1234')).toBe(-1234.1234)
    })

    test('hmmm', () => {
        expect(Jysmol.parse('2f')).toBe(2)
    })
})

describe('strings', () => {
    test('empty string', () => {
        expect(Jysmol.parse('""')).toBe('')
    })

    test('not empty string', () => {
        expect(Jysmol.parse('"string"')).toBe("string")
    })

    test('not empty string with whitespace', () => {
        expect(Jysmol.parse('" string ok "')).toBe(" string ok ")
    })
})

describe('arrays', () => {
    test('empty array', () => {
        expect(Jysmol.parse('[]')).toEqual([])
    })

    test('array with numbers', () => {
        expect(Jysmol.parse('[1,2,3,-4,51.2,-13.2,]'))
            .toEqual([1,2,3,-4,51.2,-13.2])
    })

    test('array with strings', () => {
        expect(Jysmol.parse('["some string", "next string",]'))
            .toEqual(["some string", "next string"])
    })

    test('array with arrays', () => {
        expect(Jysmol.parse('[[], ["string",], [1,],]'))
            .toEqual([[], ["string"], [1]])
    })

    test('array with objects', () => {
        expect(Jysmol.parse('[{}, {"key": "value",},]'))
            .toEqual([{}, {key: "value"}])
    }) 
})

describe('objects', () => {
    test('empty object', () => {
        expect(Jysmol.parse('{}')).toEqual({})
    })

    test('object with numbers', () => {
        expect(Jysmol.parse('{"val1": 1, "val2": 2,}'))
            .toEqual({val1: 1, val2: 2})
    })

    test('object with strings', () => {
        expect(Jysmol.parse('{"val1": "str1", "val2": "str2",}'))
            .toEqual({"val1": "str1", "val2": "str2"})
    })

    test('object with arrays', () => {
        expect(Jysmol.parse('{"val1": [], "val2": [1,], "val3": ["str",],}'))
            .toEqual({val1: [], val2: [1], val3: ["str"]})
    })

    test('object with objects', () => {
        expect(Jysmol.parse('{"val1": {}, "val2": {"val1": 1,}, "val3": {"val1": "str",},}'))
            .toEqual({val1: {}, val2: {val1: 1}, val3: {val1:"str"}})
    }) 
})

describe('errors', () => {
    test('comma in array error', () => {
        expect(() => Jysmol.parse('\n[2]')).toThrow(new Error(
        "expected: ',', got: ']', at line 2 position 3"))
    })

    test('unexpected token in main', () => {
        expect(() => Jysmol.parse('\n[2,}')).toThrow(new Error(
        "unexpected token: '}', at line 2 position 4"))
    })

    test('unexpected token first character', () => {
        expect(() => Jysmol.parse(';')).toThrow(new Error(
        "unexpected token: ';', at line 1 position 1"))
    })
})

describe('from file', () => {

    test('read and parse jysmol file', async () => {
        const file = Bun.file('./test/jysmol-files/example.jysmol')
        const input = await file.text()

        expect(() => Jysmol.parse(input)).not.toThrow()
    })
})

describe('strinfigy and parse', () => {
    test("array", () => {
        const arr = [
            "okej",
            2,
            {ok: 1, nie: true}
        ]

        const strigified = Jysmol.stringify(arr)
        const parsed = Jysmol.parse(strigified)

        expect(parsed).toEqual(arr)
    })

    test('object', () => {
        const obj = {
            name: "ktos",
            age: 2,
            isOk: false,
            wu: null,
            pets: [{pet: {name: "k", age: 2}}]
        }

        const strigified = Jysmol.stringify(obj)
        const parsed = Jysmol.parse(strigified)

        expect(parsed).toEqual(obj)
    })

    test('string', () => {
        const str = "okej"

        const strigified = Jysmol.stringify(str)
        const parsed = Jysmol.parse(strigified)

        expect(parsed).toEqual(str)
    })

    test('negative float', () => {
        const num = -1124.123

        const strigified = Jysmol.stringify(num)
        const parsed = Jysmol.parse(strigified)

        expect(parsed).toEqual(num)
    })

    test('posivite float', () => {
        const num = 1124.123

        const strigified = Jysmol.stringify(num)
        const parsed = Jysmol.parse(strigified)

        expect(parsed).toEqual(num)
    })

    test('positive integer', () => {
        const num = 1124123

        const strigified = Jysmol.stringify(num)
        const parsed = Jysmol.parse(strigified)

        expect(parsed).toEqual(num)
    })

    test('negative integer', () => {
        const num = -1124123

        const strigified = Jysmol.stringify(num)
        const parsed = Jysmol.parse(strigified)

        expect(parsed).toEqual(num)
    })
})
