export class JysmolStringifier {
    static stringify(input: unknown): string {
        return JysmolStringifier.stringifyByValue(input)
    }

    static stringifyByValue(value: unknown): string {
        if (value === undefined) throw new Error('unsupported type')

        const type = typeof(value)

        switch (type) {
            case 'string': return this.stringifyString(value as string)
            case 'number': return this.stringifyNumber(value as number)
            case 'boolean': return this.stringifyKeyword(value as boolean)
        }

        if (value === null) return this.stringifyKeyword(value)
        if (Array.isArray(value)) return this.stringifyArray(value)
        if (type === 'object') return this.stringifyObject(value)

        throw new Error('unsupported type')
    }

    static stringifyObject(obj: object): string {
        let out = '{'

        for (const [key, value] of Object.entries(obj)) {
            const stringifiedKey = JysmolStringifier.stringifyString(key)
            const stringifiedValue = JysmolStringifier.stringifyByValue(value)

            out += stringifiedKey
            out += ":"
            out += stringifiedValue
            out += ','
        }

        out += '}'

        return out
    }

    static stringifyArray(arr: unknown[]): string {
        let out = "["

        for (const el of arr) {
            out += JysmolStringifier.stringifyByValue(el)
            out += ','
        }

        out += ']'

        return out
    }

    static stringifyString(str: string): string {
        return `"${str}"`
    }

    static stringifyNumber(num: number): string {
        return `${num}`
    }

    static stringifyKeyword(val: boolean | null): string {
        switch (val) {
            case true: return 'true'
            case false: return 'false'
            case null: return 'null'
        }
    }
}

