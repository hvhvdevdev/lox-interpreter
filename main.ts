import { Scanner } from "./Scanner.ts";


export class Lox {
    private static hadError = false

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
        let scanner = new Scanner(source)
        let tokens = scanner.scanTokens();
        for (let token of tokens) {
            console.log(token)
        }
    }

    static error(line: number, message: string): void {
        this.report(line, "", message)
    }

    private static report(line: number, where: string, message: string): void {
        console.error(`[line] ${line}] Error: ${where}: ${message}`)
        this.hadError = true
    }
}

window.onload = (_e) => Lox.main(Deno.args)