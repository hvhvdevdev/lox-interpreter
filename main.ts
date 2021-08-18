import { ok } from './a.ts'

function main() {
    console.log("Hello, world!")
    ok()
}

window.onload = (_e: Event) => {
    main()
}