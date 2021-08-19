import { Interpreter } from "./Interpreter.ts";
import { Parser } from "./Parser.ts";
import { Scanner } from "./Scanner.ts";
import { Token } from "./Token.ts";
import { TokenType } from "./TokenType.ts";


export class Lox {
    private static hadError = false
    private static hadRunError = false
    private static interpreter = new Interpreter()

    public static main(args: string[]): void {
        if (args.length > 1) {
            console.log("Usage: tslox [script]")
            throw new Error("64")
        } else if (args.length == 1) {
            this.runFile(args[0])
        } else {
            this.runPrompt()
        }
    }

    private static runFile(path: string): void {
        const text = Deno.readTextFileSync(path)
        this.run(text)
        if (this.hadError) {
            throw new Error("65")
        }
        if (this.hadRunError) {
            throw new Error("70")
        }
    }

    private static runPrompt(): void {
        while (true) {
            const input = prompt("> ")
            if (!input) {
                break
            }
            this.run(input)
            this.hadError = false
        }
    }

    private static run(source: string): void {
        const scanner = new Scanner(source)
        const tokens = scanner.scanTokens();
        const ast = new Parser(tokens).parse()
        console.log(ast)
        if (ast !== null)
            this.interpreter.interpret(ast)
    }

    static error(token: Token, message: string): void {
        if (token.type == TokenType.Eof) {
            Lox.report(token.line, " at end", message)
        } else {
            this.report(token.line, " at '" + token.lexeme + "'", message)
        }
    }

    static runError(e: Error) {
        console.error(`Runtime error: ${e}`)
        Lox.hadRunError = true
    }

    private static report(line: number, where: string, message: string): void {
        console.error(`[line ${line}] Error: ${where}: ${message}`)
        this.hadError = true
    }
}

window.onload = (_e) => Lox.main(Deno.args)