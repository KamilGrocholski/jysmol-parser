import { describe, expect, test } from 'bun:test'

import Jysmol from '../src'

describe("performance", () => {
    function generateItemData(n: number) {
        return {
            aaaaa: n,
            bbbbbasdf: `fasdfsa ${n}`,
            number: n,
            name: 'nazwadfasdfdsad'.repeat(n)
        }
    }

    function generateArrayData(n: number, inner: number) {
        return Array.from({length: n}, () => generateItemData(inner))
    }

    const cases = [1_000, 10_000, 100_000]

    test('array', () => {
        cases.forEach((items) => {
        const data = generateArrayData(items, 10)

        const stringifyStart = performance.now()
        const stringified = Jysmol.stringify(data)
        const stringifyEnd = performance.now()

        const parseStart = performance.now()
        const parsed = Jysmol.parse(stringified)
        const parseEnd = performance.now()

        expect(parsed).toEqual(data)

        console.log(items)
        console.log('stringifying', stringifyEnd - stringifyStart, 'ms')
        console.log('parsing', parseEnd - parseStart, 'ms')
        })
    })
})

