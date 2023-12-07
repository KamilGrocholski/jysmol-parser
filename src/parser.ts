export type JysmolType = JysmolObject | JysmolArray | JysmolPrimitive
export type JysmolPrimitive = number | string | null | boolean
export type JysmolObject = {[key: string]: JysmolType}
export type JysmolArray = JysmolType[]

export class JysmolParser {
    private position: number
    private ch!: string
    private coords: {line: number, positionAtLine: number}

    constructor(private input: string) {
        this.position = -1
        this.coords = {line: 1, positionAtLine: 0}

        this.advance()
    }

    static parse(input: string): JysmolType | undefined {
        const p = new JysmolParser(input)

        return p.parseValue()
    }

    private parseValue(): JysmolType {
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
        
        throw new Error(`unexpected token: '${this.ch}', at line ${this.coords.line} position ${this.coords.positionAtLine}`)
    }

    private parseKeywordValue(): null | boolean {
        let keyword = ""

        while (isAlpha(this.ch) && this.position < this.input.length) {
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

    private parseObject(): JysmolObject {
        const obj: JysmolObject = {}
        this.advance()
        this.skipWhitespace()

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

    private parseArray(): JysmolArray {
        const arr: JysmolArray = []
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
        if (this.ch !== ch) throw new Error(
            `expected: '${ch}', got: '${this.ch}', at line ${this.coords.line} position ${this.coords.positionAtLine}`
        )
        this.advance()
    }

    private advance(): void {
        this.position++
        if (this.position > this.input.length) {
            this.ch = '\0'
        } else {
            this.ch = this.input[this.position]
        }

        if (this.ch === '\n') {
            this.coords.line++
            this.coords.positionAtLine = 0
        } else {
            this.coords.positionAtLine++
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
