import { Token } from "./Token.ts";

export abstract class Expr {

}

export class Binary extends Expr {
    public constructor(public left: Expr, public op: Token, public right: Expr) {
        super()
    }
}

export class Unary extends Expr {
    public constructor(public op: Token, public expr: Expr) {
        super()
    }
}

export class Literal extends Expr {
    public constructor(public value: unknown) {
        super()
    }
}

export class Grouped extends Expr {
    public constructor(public expr: Expr) {
        super()
    }
}