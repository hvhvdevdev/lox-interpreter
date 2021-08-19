import { Token } from "./Token.ts";

export abstract class Expr {
    public abstract accept(visitor: ExprVisitor): unknown
}

export interface ExprVisitor {
    visitBinary(expr: Binary): unknown
    visitUnary(expr: Unary): unknown
    visitLiteral(expr: Literal): unknown
    visitGrouped(expr: Grouped): unknown
}

export class Binary extends Expr {
    public constructor(public left: Expr, public op: Token, public right: Expr) {
        super()
    }

    accept(v: ExprVisitor) {
        return v.visitBinary(this)
    }
}

export class Unary extends Expr {
    public constructor(public op: Token, public expr: Expr) {
        super()
    }


    accept(v: ExprVisitor) {
        return v.visitUnary(this)
    }
}

export class Literal extends Expr {
    public constructor(public value: unknown) {
        super()
    }

    accept(v: ExprVisitor) {
        return v.visitLiteral(this)
    }
}

export class Grouped extends Expr {
    public constructor(public expr: Expr) {
        super()
    }


    accept(v: ExprVisitor) {
        return v.visitGrouped(this)
    }
}