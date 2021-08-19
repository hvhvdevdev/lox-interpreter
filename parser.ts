import { Binary, Expr, Grouped, Literal, Unary } from "./Expr.ts";
import { Lox } from "./main.ts";
import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";

export class Parser {
    private current = 0

    public constructor(private tokens: Token[]) {

    }

    private expression() {
        return this.equality();
    }

    private equality() {
        let expr = this.comparison();
        while (this.match([TokenType.BangEqual, TokenType.EqualEqual])) {
            const operator = this.previous()
            const right = this.comparison();
            expr = new Binary(expr, operator, right)
        }

        return expr
    }

    private comparison() {
        let expr = this.term();
        while (this.match([TokenType.GreaterEqual, TokenType.Greater, TokenType.LessEqual, TokenType.Less])) {
            const operator = this.previous()
            const right = this.term()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    private term() {
        let expr = this.factor();
        while (this.match([TokenType.Minus, TokenType.Plus])) {
            const operator = this.previous()
            const right = this.factor()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }

    private factor() {
        let expr = this.unary();
        while (this.match([TokenType.Star, TokenType.Slash])) {
            const operator = this.previous()
            const right = this.unary()
            expr = new Binary(expr, operator, right)
        }
        return expr
    }


    private unary(): Expr {
        if (this.match([TokenType.Bang, TokenType.Minus])) {
            const operator = this.previous()
            const right = this.unary();
            return new Unary(operator, right)
        }
        return this.primary()
    }

    private primary(): Expr {
        if (this.match([TokenType.False])) return new Literal(false)
        if (this.match([TokenType.True])) return new Literal(true)
        if (this.match([TokenType.Nil])) return new Literal(null)
        if (this.match([TokenType.Number, TokenType.String])) {
            return new Literal(this.previous().literal)
        }
        if (this.match([TokenType.LeftParen])) {
            const expr = this.expression()
            this.consume(TokenType.RightParen, "Expected ')' after expression.");
            return new Grouped(expr)
        }
        throw this.error(this.peek(), "Should not be here.")
    }


    private advance() {
        if (!this.isAtEnd()) this.current += 1
        return this.previous()
    }

    private consume(type: TokenType, message: string) {
        if (this.check(type)) return this.advance()
        throw this.error(this.peek(), message)
    }

    private error(token: Token, message: string) {
        Lox.error(token, message)
        return Error("Parse error.")
    }

    private check(type: TokenType) {
        if (this.isAtEnd()) return false;
        return this.peek().type == type
    }

    private isAtEnd() {
        return this.peek().type == TokenType.Eof
    }

    private peek() {
        return this.tokens[this.current]
    }

    private previous() {
        return this.tokens[this.current - 1]
    }

    private match(types: TokenType[]): boolean {
        for (const type of types) {
            if (this.check(type)) {
                this.advance()
                return true
            }
        }
        return false
    }
}