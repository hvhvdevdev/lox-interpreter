export enum TokenType {
    // Single character
    LeftParen = "(",
    RightParen = ")",
    LeftBrace = "{",
    RightBrace = "}",
    Comma = ",",
    Dot = ".",
    Minus = "-",
    Plus = "+",
    SemiColon = ";",
    Slash = "/",
    Star = "*",
    // One or two
    Bang = "!",
    BangEqual = "!=",
    Equal = "=",
    EqualEqual = "==",
    Greater = ">",
    GreaterEqual = ">=",
    Less = "<",
    LessEqual = "<=",
    // Literals
    Identifier = "<id>",
    String = "<string>",
    Number = "<number>",
    // Keywords 
    And = "KW And",
    Class = "KW Class",
    Else = "KW Else",
    False = "KW False",
    Fun = "KW Fun",
    For = "KW For",
    If = "KW If",
    Nil = "KW Nil",
    Or = "KW Or",
    Print = "KW Print",
    Return = "KW Return",
    Super = "KW Super",
    This = "KW This",
    True = "KW True",
    Var = "KW Var",
    While = "KW While",
    // Misc
    Eof = "Eof",
}