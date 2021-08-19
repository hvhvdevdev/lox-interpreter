import { Binary, Expr, ExprVisitor, Grouped, Literal, Unary } from "./Expr.ts";
import { Lox } from "./main.ts";
import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";

export class Interpreter implements ExprVisitor {
    visitUnary(obj: Unary): unknown {
        const expr = this.evaluate(obj.expr)

        switch (obj.op.type) {
            case TokenType.Minus:
                if (typeof expr === 'number')
                    return - expr
                break;
            case TokenType.Bang:
                if (typeof expr === 'boolean')
                    return !this.isTruthy(expr)
        }

        throw new Error("Unreachable.")
    }

    visitBinary(obj: Binary): unknown {
        const left = this.evaluate(obj.left)
        const right = this.evaluate(obj.right)

        switch (obj.op.type) {
            case TokenType.Minus:
                if (typeof left === 'number' && typeof right === 'number')
                    return left - right
                this.checkNumberOperand(obj.op, left)
                this.checkNumberOperand(obj.op, right)
                break

            case TokenType.Plus:
                if (typeof left === 'number' && typeof right === 'number')
                    return left + right
                if (typeof left === 'string' && typeof right === 'string')
                    return left + right
                this.checkNumberOperand(obj.op, left)
                this.checkNumberOperand(obj.op, right)
                break
            case TokenType.Star:
                if (typeof left === 'number' && typeof right === 'number')
                    return left * right
                this.checkNumberOperand(obj.op, left)
                this.checkNumberOperand(obj.op, right)

                break;
            case TokenType.Slash:
                if (typeof left === 'number' && typeof right === 'number')
                    return left / right
                this.checkNumberOperand(obj.op, left)
                this.checkNumberOperand(obj.op, right)
                break;
            case TokenType.EqualEqual:
                return left === right
            case TokenType.BangEqual:
                return !(left === right)
            case TokenType.Greater:
                this.checkNumberOperand(obj.op, left)
                this.checkNumberOperand(obj.op, right)
                if (typeof left === 'number' && typeof right === 'number')
                    return left > right
                break
            case TokenType.Less:
                this.checkNumberOperand(obj.op, left)
                this.checkNumberOperand(obj.op, right)
                if (typeof left === 'number' && typeof right === 'number')
                    return left < right
                break
            case TokenType.GreaterEqual:
                this.checkNumberOperand(obj.op, left)
                this.checkNumberOperand(obj.op, right)
                if (typeof left === 'number' && typeof right === 'number')
                    return left >= right
                break
            case TokenType.LessEqual:
                this.checkNumberOperand(obj.op, left)
                this.checkNumberOperand(obj.op, right)
                if (typeof left === 'number' && typeof right === 'number')
                    return left <= right
        }
    }

    visitLiteral(obj: Literal) {
        return obj.value
    }

    visitGrouped(obj: Grouped): unknown {
        return this.evaluate(obj.expr)
    }


    interpret(expr: Expr) {
        try {
            const value = this.evaluate(expr)
            console.log(`result: ${value}`)
        } catch (e) {
            Lox.runError(e)
        }
    }

    private evaluate(expr: Expr) {
        return expr.accept(this)
    }

    private isTruthy(obj: unknown): boolean {
        if (obj === null) return false
        if (typeof obj === 'boolean') return obj
        return true
    }

    private checkNumberOperand(operator: Token, operand: unknown): number {
        if (typeof operand === 'number') return operand
        throw new Error(`${operator} operand must be a number.`)
    }
}