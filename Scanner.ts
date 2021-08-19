import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";
import { Lox } from './main.ts'

export class Scanner {
    private tokens: Token[] = []
    private start = 0
    private current = 0
    private line = 1
    private keywords: { [key: string]: TokenType } = {
        "and": TokenType.And,
        "else": TokenType.Else,
        "false": TokenType.False,
        "for": TokenType.For,
        "fun": TokenType.Fun,
        "if": TokenType.If,
        "nil": TokenType.Nil,
        "or": TokenType.Or,
        "print": TokenType.Print,
        "return": TokenType.Return,
        "super": TokenType.Super,
        "this": TokenType.This,
        "true": TokenType.True,
        "var": TokenType.Var,
        "while": TokenType.While
    }

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
            case '=': this.addToken(this.match('=') ? TokenType.EqualEqual : TokenType.Equal, null); break
            case '<': this.addToken(this.match('=') ? TokenType.LessEqual : TokenType.Less, null); break
            case '>': this.addToken(this.match('=') ? TokenType.GreaterEqual : TokenType.Greater, null); break
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
            default:
                if (this.isDigit(c)) {
                    this.number()
                } else if (this.isAlpha(c)) {
                    this.identifier()
                }
                else
                    Lox.error(new Token(TokenType.Identifier, c, null, this.line), "Unexpected character."); break
        }
    }

    private isAlpha(c: string) {
        return (c >= 'a' && c <= 'z') ||
            (c >= 'A' && c <= 'Z') || c == '_'
    }

    private isAlphaNumeric(c: string): boolean {
        return this.isAlpha(c) || this.isDigit(c)
    }

    private isDigit(c: string) {
        return ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'].includes(c)
    }

    private identifier() {
        while (this.isAlphaNumeric(this.peek())) this.advance()
        const text = this.source.slice(this.start, this.current)
        if (text in this.keywords) {
            this.addToken(this.keywords[text], null)
        } else
            this.addToken(TokenType.Identifier, null)
    }

    private number() {
        while (this.isDigit(this.peek())) this.advance()
        if (this.peek() == '.' && this.isDigit(this.peekNext())) {
            this.advance()
            while (this.isDigit(this.peek())) this.advance()
        }
        this.addToken(TokenType.Number, parseFloat(this.source.slice(this.start, this.current)))
    }

    private peekNext() {
        if (this.current + 1 >= this.source.length) return '\0'
        return this.source[this.current + 1]
    }

    private string() {
        while (this.peek() != '"' && !this.isAtEnd()) {
            if (this.peek() == "\n") this.line += 1;
            this.advance()
        }

        if (this.isAtEnd()) {
            Lox.error(new Token(TokenType.String, this.source.slice(this.start, this.current), "", this.line), "Unterminated string.")
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