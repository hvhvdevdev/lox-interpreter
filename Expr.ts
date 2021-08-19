import { TokenType } from "./TokenType.ts";

export abstract class Expr {

}

export class Binary extends Expr {
    public constructor(public left: Expr, public op: TokenType, public right: Expr) {
        super()
    }
}

export class Grouped extends Expr {
    public constructor(public expr: Expr) {
        super()
    }
}