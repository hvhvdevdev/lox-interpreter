import { TokenType } from "./TokenType.ts";

export class Token {
    public constructor(
        public type: TokenType, public lexeme: string,
        public literal: unknown, public line: number
    ) { }

    public toString(): string {
        return `${this.type} ${this.lexeme} ${this.literal}`
    }
}