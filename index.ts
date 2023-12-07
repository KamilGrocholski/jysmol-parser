type JSONType = JSONObject | JSONArray | JSONPrimitive
type JSONPrimitive = number | string | null | boolean
type JSONObject = {[key: string]: JSONType}
type JSONArray = JSONType[]

export class JSONParser {
    private position: number
    private ch!: string

    constructor(private input: string) {
        this.position = -1

        this.advance()
    }

    static parse(input: string): JSONType | undefined {
        const p = new JSONParser(input)

        return p.parseValue()
    }

    private parseValue(): JSONType {
        this.skipWhitespace()

        switch (this.ch) {
            case '"':
                return this.parseString()
            case '{':
                return this.parseObject()
            case '[':
                return this.parseArray()
        }

        if (isDigit(this.ch)) return this.parseNumber('+')
        if (this.ch === '-') {
            this.advance()
            return this.parseNumber('-')
        }

        if (isAlpha(this.ch)) return this.parseKeywordValue()

        throw new Error("no value")
    }

    private parseKeywordValue(): null | boolean {
        let keyword = ""

        while (isAlpha(this.ch)) {
            keyword += this.ch
            this.advance()
        }

        switch (keyword) {
            case 'null': return null
            case 'true': return true
            case 'false': return false
        }

        throw new Error(`not allowed keyword: ${keyword}`)
    }

    private parseObject(): JSONObject {
        const obj: JSONObject = {}
        this.advance()

        while(this.ch !== '}' && this.position < this.input.length) {
            const key = this.parseString()
            this.skipWhitespace()
            this.eat(':')
            const value = this.parseValue()

            obj[key] = value

            this.skipWhitespace()
            this.eat(',')
            this.skipWhitespace()
        }

        this.eat('}')

        return obj
    }

    private parseArray(): JSONArray {
        const arr: JSONArray = []
        this.advance()

        while(this.ch !== ']' && this.position < this.input.length) {
            const value = this.parseValue()
            arr.push(value)

            this.skipWhitespace()
            this.eat(',')
            this.skipWhitespace()
        }

        this.eat(']')

        return arr
    }

    private parseNumber(sign: '+' | '-' = '+'): number {
        const numberComponents: string[] = [this.parseIntegerLiteral()]

        while (this.ch === '.' && this.position < this.input.length) {
            this.advance()
            numberComponents.push('.')
            const newIntegerLiteral = this.parseIntegerLiteral()
            if (!newIntegerLiteral) throw new Error(`an integer must be followed by: '.'`)
            numberComponents.push(newIntegerLiteral)
        }

        const number = Number(numberComponents.join(''))

        return sign === '-' ? -number : number
    }

    private parseIntegerLiteral(): string {
        let lit = ""

        while(isDigit(this.ch) && this.position < this.input.length) {
            lit += this.ch
            this.advance()
        }

        return lit
    }

    private parseString(): string {
        let lit = ""
        this.advance()

        while(this.ch !== '"' && this.position < this.input.length) {
            lit += this.ch
            this.advance()
        }

        this.advance()

        return lit
    }

    private eat(ch: string): void {
        if (this.ch !== ch) throw new Error(`expected: '${ch}', got: '${this.ch}', at: ${this.position}`)
        this.advance()
    }

    private advance(): void {
        this.position++
        if (this.position > this.input.length) {
            this.ch = '\0'
        } else {
            this.ch = this.input[this.position]
        }
    }

    private skipWhitespace(): void {
        while (isWhitespace(this.ch)) {
            this.advance()
        }
    }
}

function isWhitespace(ch: string): boolean {
    return ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r'
}

function isDigit(ch: string): boolean {
    return ch >= '0' && ch <= '9'
}

function isAlpha(ch: string): boolean {
    return ch >= 'a' && ch <= 'z' || ch >= 'A' && ch <= 'Z'
}
