import { TokenType } from "./TokenType.ts";

export class Token {
    public constructor(
        private type: TokenType, private lexeme: string,
        private literal: unknown, private line: number
    ) { }

    public toString(): string {
        return `${this.type} ${this.lexeme} ${this.literal}`
    }
}