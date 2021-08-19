import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";
import { Lox } from './main.ts'

export class Scanner {
    private tokens: Token[] = []
    private start = 0
    private current = 0
    private line = 1

    public constructor(private source: string) { }

    public scanTokens() {
        while (!this.isAtEnd()) {
            this.start = this.current
            this.scanToken()
        }
        this.tokens.push(new Token(TokenType.Eof, "", null, this.line))
        return this.tokens
    }

    private isAtEnd(): boolean {
        return this.current >= this.source.length
    }

    private scanToken(): void {
        const c = this.advance()
        switch (c) {
            case '(': this.addToken(TokenType.LeftParen, null); break
            case ')': this.addToken(TokenType.RightParen, null); break
            case '{': this.addToken(TokenType.LeftBrace, null); break
            case '}': this.addToken(TokenType.RightBrace, null); break
            case ',': this.addToken(TokenType.Comma, null); break
            case '.': this.addToken(TokenType.Dot, null); break
            case '-': this.addToken(TokenType.Minus, null); break
            case '+': this.addToken(TokenType.Plus, null); break
            case ';': this.addToken(TokenType.SemiColon, null); break
            case '*': this.addToken(TokenType.Star, null); break
            case '!': this.addToken(this.match('=') ? TokenType.BangEqual : TokenType.Bang, null); break
            case '=': this.addToken(this.match('=') ? TokenType.BangEqual : TokenType.Equal, null); break
            case '<': this.addToken(this.match('=') ? TokenType.BangEqual : TokenType.LessEqual, null); break
            case '>': this.addToken(this.match('=') ? TokenType.BangEqual : TokenType.GreaterEqual, null); break
            case '/':
                if (this.match('/')) {
                    while (this.peek() != '\n' && !this.isAtEnd()) this.advance()
                } else { this.addToken(TokenType.Slash, null) }
                break;
            case ' ': break;
            case '\t': break;
            case '\r': break;
            case '\n': this.line++; break;
            case '"': this.string(); break;
            default: Lox.error(this.line, "Unexpected character."); break
        }
    }

    private string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == "\n") this.line += 1;
            this.advance()
        }

        if (this.isAtEnd()) {
            Lox.error(this.line, "Unterminated string.")
            return
        }

        // Closing ".
        this.advance()

        const value = this.source.slice(this.start + 1, this.current - 1)
        this.addToken(TokenType.String, value)

    }

    private peek() {
        if (this.isAtEnd()) return '\0'
        return this.source[(this.current)]
    }

    private match(expected: string) {
        if (this.isAtEnd()) return false
        if (this.source[this.current] != expected) return false
        this.current += 1
        return true
    }

    private advance() {
        const c = this.source[this.current];
        this.current += 1
        return c
    }

    private addToken(type: TokenType, literal: unknown) {
        const text = this.source.slice(this.start, this.current)
        this.tokens.push(new Token(type, text, literal, this.line))
    }
}