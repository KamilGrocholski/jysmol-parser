import { describe, expect, test } from 'bun:test'

import Jysmol from '../src'

describe("performance - compared to json", () => {
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

            const stringifyStartJYSMOL = performance.now()
            const stringifiedJYSMOL = Jysmol.stringify(data)
            const stringifyEndJYSMOL = performance.now()

            const parseStartJYSMOL = performance.now()
            const parsedJYSMOL = Jysmol.parse(stringifiedJYSMOL)
            const parseEndJYSMOL = performance.now()

            expect(parsedJYSMOL).toEqual(data)

            //////////////////////////////////////////////////////

            const stringifyStartJSON = performance.now()
            const stringifiedJSON = JSON.stringify(data)
            const stringifyEndJSON = performance.now()

            const parseStartJSON = performance.now()
            JSON.parse(stringifiedJSON)
            const parseEndJSON = performance.now()

            const stringifyPerfJYSMOL = stringifyEndJYSMOL - stringifyStartJYSMOL
            const parsePerfJYSMOL = parseEndJYSMOL - parseStartJYSMOL

            const stringifyPerfJSON = stringifyEndJSON - stringifyStartJSON
            const parsePerfJSON = parseEndJSON - parseStartJSON

            //////////////////////////////////////////////////////

            console.log({
                items,
                stringify: {
                    JYSMOL: stringifyPerfJYSMOL,
                    JSON: stringifyPerfJSON,
                    'JYSMOL - JSON': stringifyPerfJYSMOL - stringifyPerfJSON,
                    'JYSMOL / JSON': stringifyPerfJYSMOL / stringifyPerfJSON
                },
                parse: {
                    JYSMOL: parsePerfJYSMOL,
                    JSON: parsePerfJSON,
                    'JYSMOL - JSON': parsePerfJYSMOL - parsePerfJSON,
                    'JYSMOL / JSON': parsePerfJYSMOL / parsePerfJSON
                },
            })
        })
    })
})

