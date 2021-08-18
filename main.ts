class Lox {
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
}

window.onload = (_e) => Lox.main([])