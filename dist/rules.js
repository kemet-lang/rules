"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/rules.ts
var rules_exports = {};
__export(rules_exports, {
  KemetSyntax: () => KemetSyntax
});
module.exports = __toCommonJS(rules_exports);
var syntax = __toESM(require("@je-es/syntax"));

// src/conf/lexer_rules.ts
var lexerRules = {
  // ═══ Whitespace ═══
  ws: /\s+/,
  // ═══ Comments ═══
  document: { match: /\/\/\/[!/]?.*/, value: (text) => text.slice(3).trim() },
  comment: { match: /\/\/[!/]?.*/, value: (text) => text.slice(2).trim() },
  // ═══ Literals ═══
  flt: /[0-9]+\.[0-9]+(?:[eE][+-]?[0-9]+)?/,
  bin: /0b[01]+/,
  oct: /0o[0-7]+/,
  hex: /0x[0-9a-fA-F]+/,
  dec: /[0-9]+/,
  slice: { match: /"(?:[^"\\]|\\.)*"/, value: (text) => text.slice(1, -1) },
  char: { match: /'(?:[^'\\]|\\.)*'/, value: (text) => text.slice(1, -1) },
  true: "true",
  false: "false",
  null: "null",
  null_t: "null_t",
  und: "und",
  und_t: "und_t",
  // ═══ Keywords ═══
  test: "test",
  new: "new",
  try: "try",
  catch: "catch",
  use: "use",
  as: "as",
  from: "from",
  pub: "pub",
  def: "def",
  let: "let",
  fn: "fn",
  mut: "mut",
  inline: "inline",
  static: "static",
  struct: "struct",
  enum: "enum",
  errset: "errset",
  typeof: "typeof",
  sizeof: "sizeof",
  if: "if",
  else: "else",
  while: "while",
  for: "for",
  do: "do",
  return: "return",
  defer: "defer",
  throw: "throw",
  break: "break",
  continue: "continue",
  switch: "switch",
  case: "case",
  default: "default",
  comptime: "comptime",
  // ═══ Types ═══
  i_type: { match: /i[0-9]+/ },
  u_type: { match: /u[0-9]+/ },
  f_type: ["f16", "f32", "f64", "f80", "f128"],
  cint: "cint",
  cflt: "cflt",
  isize: "isize",
  usize: "usize",
  bool: "bool",
  void: "void",
  type: "type",
  any: "any",
  err: "err",
  // ═══ Operators ═══
  "->": "->",
  // Function Return operator
  ".*": ".*",
  // Dereference operator
  "??": "??",
  // Null coalescing operator
  "..=": "..=",
  // Range operator (Inclusive)
  "..": "..",
  // Range operator (Exclusive)
  "@": "@",
  // Builtin operator
  "==": "==",
  "!=": "!=",
  "<=": "<=",
  ">=": ">=",
  "+=": "+=",
  "-=": "-=",
  "*=": "*=",
  "/=": "/=",
  "%=": "%=",
  "**": "**",
  "++": "++",
  "--": "--",
  "<<": "<<",
  ">>": ">>",
  "and": "and",
  "or": "or",
  "<": "<",
  ">": ">",
  "|": "|",
  "^": "^",
  "&": "&",
  "=": "=",
  "+": "+",
  "-": "-",
  "*": "*",
  "/": "/",
  "%": "%",
  "?": "?",
  "!": "!",
  "~": "~",
  ":": ":",
  ";": ";",
  ",": ",",
  ".": ".",
  "(": "(",
  ")": ")",
  "{": "{",
  "}": "}",
  "[": "[",
  "]": "]",
  // ═══ Identifier ═══
  ident: /[a-zA-Z_][a-zA-Z0-9_]*/
};

// src/conf/lsp_rules.ts
var lspConfig = {
  // ═══ Keywords ═══
  keywords: {
    declarations: [
      "let",
      "fn",
      "def",
      "use",
      "pub",
      "test"
    ],
    types: [
      // Signed integers
      "i8",
      "i16",
      "i32",
      "i64",
      "i128",
      "i256",
      "isize",
      // Unsigned integers
      "u8",
      "u16",
      "u32",
      "u64",
      "u128",
      "u256",
      "usize",
      // Floating point
      "f16",
      "f32",
      "f64",
      "f80",
      "f128",
      // C interop
      "cint",
      "cflt",
      // Basic types
      "bool",
      "void",
      "type",
      "any",
      "err",
      // Type constructors
      "struct",
      "enum",
      "errset",
      // Special types
      "null_t",
      "und_t"
    ],
    controlFlow: [
      "if",
      "else",
      "switch",
      "case",
      "default",
      "for",
      "while",
      "do",
      "break",
      "continue",
      "return",
      "defer",
      "throw"
    ],
    modifiers: [
      "mut",
      "pub",
      "static",
      "inline",
      "comptime"
    ],
    operators: [
      "as",
      "typeof",
      "sizeof",
      "try",
      "catch",
      "and",
      "or",
      "new",
      "from"
    ],
    literals: [
      "true",
      "false",
      "null",
      "und"
    ],
    builtins: [
      "@print",
      "@i",
      "@assert",
      "self"
    ]
  },
  // ═══ Keyword Documentation ═══
  keywordDocs: {
    // Declarations
    "let": {
      signature: "[pub|static] [comptime] let [mut] name: type = value",
      description: "Declare a variable with optional type annotation and initializer",
      example: "let mut counter: i32 = 0;"
    },
    "fn": {
      signature: "[pub|static] [comptime] [inline] fn name(params) -> [ErrType!]ReturnType { }",
      description: "Declare a function with optional error type and return type",
      example: "pub fn divide(a: i32, b: i32) -> DivideByZero!i32 { ... }"
    },
    "def": {
      signature: "[pub|static] def Name = type",
      description: "Define a type alias",
      example: "pub def MyInt = i32;"
    },
    "use": {
      signature: '[pub|static] use target [as alias] from "path"',
      description: "Import symbols from another module. Target can be identifier, access path, or * for all",
      example: 'use MyType as T from "./types.k";\nuse * from "./utils.k";'
    },
    "pub": {
      signature: "pub",
      description: "Make a declaration public (exported from module)",
      example: 'pub let API_KEY = "...";'
    },
    "static": {
      signature: "static",
      description: "Give a declaration static storage duration",
      example: "static let CONFIG = loadConfig();"
    },
    "test": {
      signature: 'test ["name"] { }',
      description: "Define a test block with optional name",
      example: 'test "addition works" { @assert(1 + 1 == 2); }'
    },
    // Type keywords
    "struct": {
      signature: "struct { fields..., methods... }",
      description: "Define a structure type with fields and methods",
      example: "struct {\n  x: i32,\n  y: i32,\n  fn distance(self) -> f32 { ... }\n}"
    },
    "enum": {
      signature: "enum { Variant1: Type1, Variant2, ... }",
      description: "Define an enumeration type with optional associated types",
      example: "enum { Some: i32, None }"
    },
    "errset": {
      signature: "errset { Error1, Error2, ... }",
      description: "Define an error set type",
      example: "errset { FileNotFound, AccessDenied, InvalidInput }"
    },
    // Primitive types - Integer types
    "i8": {
      signature: "i8",
      description: "Signed 8-bit integer (-128 to 127)"
    },
    "i16": {
      signature: "i16",
      description: "Signed 16-bit integer (-32,768 to 32,767)"
    },
    "i32": {
      signature: "i32",
      description: "Signed 32-bit integer (-2,147,483,648 to 2,147,483,647)"
    },
    "i64": {
      signature: "i64",
      description: "Signed 64-bit integer"
    },
    "i128": {
      signature: "i128",
      description: "Signed 128-bit integer"
    },
    "i256": {
      signature: "i256",
      description: "Signed 256-bit integer"
    },
    "isize": {
      signature: "isize",
      description: "Signed pointer-sized integer (platform dependent)"
    },
    "u8": {
      signature: "u8",
      description: "Unsigned 8-bit integer (0 to 255)"
    },
    "u16": {
      signature: "u16",
      description: "Unsigned 16-bit integer (0 to 65,535)"
    },
    "u32": {
      signature: "u32",
      description: "Unsigned 32-bit integer (0 to 4,294,967,295)"
    },
    "u64": {
      signature: "u64",
      description: "Unsigned 64-bit integer"
    },
    "u128": {
      signature: "u128",
      description: "Unsigned 128-bit integer"
    },
    "u256": {
      signature: "u256",
      description: "Unsigned 256-bit integer"
    },
    "usize": {
      signature: "usize",
      description: "Unsigned pointer-sized integer (platform dependent)"
    },
    // Floating point types
    "f16": {
      signature: "f16",
      description: "Half-precision 16-bit floating point"
    },
    "f32": {
      signature: "f32",
      description: "Single-precision 32-bit floating point"
    },
    "f64": {
      signature: "f64",
      description: "Double-precision 64-bit floating point"
    },
    "f80": {
      signature: "f80",
      description: "Extended-precision 80-bit floating point"
    },
    "f128": {
      signature: "f128",
      description: "Quadruple-precision 128-bit floating point"
    },
    // C interop types
    "cint": {
      signature: "cint",
      description: "C integer type (compile-time integer for FFI compatibility)"
    },
    "cflt": {
      signature: "cflt",
      description: "C float type (compile-time float for FFI compatibility)"
    },
    // Other primitive types
    "bool": {
      signature: "bool",
      description: "Boolean type (true or false)"
    },
    "void": {
      signature: "void",
      description: "Void type (represents no value)"
    },
    "type": {
      signature: "type",
      description: "Type of types (metatype)"
    },
    "any": {
      signature: "any",
      description: "Any type (accepts any value, runtime type checking)"
    },
    "err": {
      signature: "err",
      description: "Generic error type"
    },
    "null_t": {
      signature: "null_t",
      description: "Type of null value"
    },
    "und_t": {
      signature: "und_t",
      description: "Type of undefined value"
    },
    // Control flow
    "if": {
      signature: "if condition stmt [else stmt]",
      description: "Conditional expression/statement",
      example: 'if x > 0 { @print("positive"); } else { @print("non-positive"); }'
    },
    "else": {
      signature: "else",
      description: "Alternative branch for if statement"
    },
    "switch": {
      signature: "switch expr { case value: stmt ... default: stmt }",
      description: "Switch statement for pattern matching",
      example: 'switch value {\n  case 1: { @print("one"); }\n  case 2: { @print("two"); }\n  default: { @print("other"); }\n}'
    },
    "case": {
      signature: "case value: stmt",
      description: "Case branch in switch statement",
      example: 'case 42: { @print("found"); }'
    },
    "default": {
      signature: "default: stmt",
      description: "Default case in switch statement"
    },
    "while": {
      signature: "while condition stmt",
      description: "Loop while condition is true",
      example: "while i < 10 { i = i + 1; }"
    },
    "for": {
      signature: "for range stmt",
      description: "Iterate over a range (use @i for index)",
      example: "for 0..10 { @print(@i); }"
    },
    "do": {
      signature: "do stmt while condition",
      description: "Do-while loop (executes at least once)",
      example: 'do { @print("hello"); } while false;'
    },
    "return": {
      signature: "return [expr]",
      description: "Return from a function with optional value",
      example: "return x + y;"
    },
    "defer": {
      signature: "defer expr",
      description: "Defer expression execution until scope exit",
      example: "defer file.close();"
    },
    "throw": {
      signature: "throw error",
      description: "Throw an error",
      example: "throw FileNotFound;"
    },
    "break": {
      signature: "break",
      description: "Break out of a loop"
    },
    "continue": {
      signature: "continue",
      description: "Continue to next loop iteration"
    },
    // Modifiers
    "mut": {
      signature: "mut",
      description: "Make a variable or reference mutable",
      example: "let mut counter = 0;\n*mut i32"
    },
    "inline": {
      signature: "inline",
      description: "Hint to inline function calls",
      example: "inline fn add(a: i32, b: i32) -> i32 { return a + b; }"
    },
    "comptime": {
      signature: "comptime",
      description: "Evaluate at compile time",
      example: "comptime let SIZE = 100;"
    },
    // Operators
    "as": {
      signature: "expr as type",
      description: "Type cast operator (explicit type conversion)",
      example: "let x = 42 as f32;"
    },
    "typeof": {
      signature: "typeof expr",
      description: "Get the type of an expression",
      example: "let T = typeof x;"
    },
    "sizeof": {
      signature: "sizeof type",
      description: "Get the size of a type in bytes",
      example: "let size = sizeof i32;"
    },
    "try": {
      signature: "try expr",
      description: "Try an expression that may error, propagates error if it occurs",
      example: "let result = try riskyOperation();"
    },
    "catch": {
      signature: "expr catch [(tag)] stmt",
      description: "Handle errors from try expression with optional error tag",
      example: 'try riskyOp() catch (e) { @print("error"); }'
    },
    "and": {
      signature: "expr and expr",
      description: "Logical AND operator (short-circuiting)",
      example: "if x > 0 and x < 10 { ... }"
    },
    "or": {
      signature: "expr or expr",
      description: "Logical OR operator (short-circuiting)",
      example: "if x == 0 or x == 1 { ... }"
    },
    "new": {
      signature: "new Type { fields... }",
      description: "Allocate memory for a type (used with struct initialization)",
      example: "let ptr = new Point { x: 10, y: 20 };"
    },
    "from": {
      signature: "from",
      description: "Specify module path in use statement",
      example: 'use MyType from "./types.k";'
    },
    // Literals
    "true": {
      signature: "true",
      description: "Boolean true value"
    },
    "false": {
      signature: "false",
      description: "Boolean false value"
    },
    "null": {
      signature: "null",
      description: "Null value (absence of value)"
    },
    "und": {
      signature: "und",
      description: "Undefined value (uninitialized)"
    }
  },
  // ═══ Builtin Documentation ═══
  builtinDocs: {
    "@print": '```kemet\nfn @print(text: any) -> void\n```\n\nBuilt-in function to print text to standard output.\n\n**Example:**\n```kemet\n@print("Hello, World!");\n@print(42);\n```',
    "@i": "```kemet\n@i: usize\n```\n\nLoop iteration index (available in `for` loops).\n\n**Example:**\n```kemet\nfor 0..10 {\n  @print(@i); // prints 0, 1, 2, ..., 9\n}\n```",
    "@assert": '```kemet\nfn @assert(condition: bool) -> void\n```\n\nBuilt-in assertion function for testing. Panics if condition is false.\n\n**Example:**\n```kemet\ntest "math" {\n  @assert(1 + 1 == 2);\n  @assert(5 * 5 == 25);\n}\n```',
    "self": "```kemet\nself\n```\n\nReference to the current instance (available in struct methods).\n\n**Example:**\n```kemet\nstruct Point {\n  x: i32,\n  y: i32,\n  \n  fn distance(self) -> f32 {\n    return sqrt(self.x * self.x + self.y * self.y);\n  }\n}\n```"
  },
  // ═══ LSP Settings ═══
  triggerCharacters: [".", ":", "@", " ", "(", "{"],
  fileExtension: ".k"
};

// src/conf/parser_rules.ts
var ParserLib4 = __toESM(require("@je-es/parser"));
var AST4 = __toESM(require("@je-es/ast"));

// src/rules/Expr.ts
var ParserLib = __toESM(require("@je-es/parser"));
var AST = __toESM(require("@je-es/ast"));
var Expr = [
  // ════════════ ROOT ════════════
  ParserLib.createRule(
    "Expr",
    ParserLib.seq(
      ParserLib.optional(
        ParserLib.choice(
          ParserLib.token("typeof"),
          ParserLib.token("sizeof")
        )
      ),
      ParserLib.rule("AsExpr")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isSpecial = seq_array[0].isOptionalPassed();
        const specialType = isSpecial ? seq_array[0].getOptionalResult().getChoiceResult().getTokenValue() : null;
        const specialSan = isSpecial ? seq_array[0].getOptionalResult().getChoiceResult().span : void 0;
        const exprResult = seq_array[1];
        const expr = exprResult.getCustomData();
        if (specialType === "sizeof" && !expr.isType()) {
          throw {
            msg: "Expected type expression after `sizeof`",
            span: expr.span
          };
        }
        const result = specialType === "typeof" ? AST.ExprNode.asTypeof(data.span, expr) : specialType === "sizeof" ? AST.ExprNode.asSizeof(data.span, expr) : expr;
        return ParserLib.Result.createAsCustom("passed", "expr", result, data.span);
      },
      errors: [ParserLib.error(() => true, "Expected expression")]
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "AsExpr",
    ParserLib.seq(
      // base <CatchPoint>
      ParserLib.rule("OrelseExpr"),
      // as type
      ParserLib.optional(
        ParserLib.seq(
          ParserLib.token("as"),
          ParserLib.optional(ParserLib.choice(
            ParserLib.rule("Type"),
            // only ident
            ParserLib.rule("Stmt")
            // reject
          ))
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const baseResult = seq_array[0];
        const isAs = seq_array[1].isOptionalPassed();
        const isType = seq_array[1].isOptionalPassed() ? seq_array[1].getOptionalResult().getSequenceResult()[1].isOptionalPassed() && seq_array[1].getOptionalResult().getSequenceResult()[1].getOptionalResult().getChoiceIndex() === 0 : false;
        if (!seq_array[1].isOptionalPassed()) {
          return baseResult;
        }
        const base = baseResult.getCustomData();
        const type = isType ? seq_array[1].getOptionalResult().getSequenceResult()[1].getOptionalResult().getChoiceResult().getCustomData() : void 0;
        const asSpan = isAs ? seq_array[1].getOptionalResult().getSequenceResult()[0].span : data.span;
        {
          if (isAs && !isType) {
            throw {
              msg: "Expected type after `as` keyword",
              span: asSpan
            };
          }
        }
        const result = AST.ExprNode.asAs(data.span, base, type);
        return ParserLib.Result.createAsCustom("passed", "as-expr", result, result.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "OrelseExpr",
    ParserLib.seq(
      // base <CatchPoint>
      ParserLib.rule("RangeExpr"),
      // ?? expr ...
      ParserLib.zeroOrMore(
        ParserLib.seq(
          // ?? <CatchPoint>
          ParserLib.token("??"),
          // expr
          ParserLib.optional(ParserLib.rule("RangeExpr"))
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const rest = seq_array[1].getRepeatResult();
        if (rest.length === 0) {
          return base;
        }
        let current = base.getCustomData();
        for (const item of rest) {
          const seq4 = item.getSequenceResult();
          const isRight = seq4[1].isOptionalPassed();
          const right = isRight ? seq4[1].getOptionalResult().getCustomData() : void 0;
          const signSpan = seq4[0].span;
          const span = {
            start: current.span.start,
            end: isRight ? right.span.end : current.span.end
          };
          if (!isRight) {
            throw {
              msg: "Expected expression after `??`",
              span: signSpan
            };
          }
          current = AST.ExprNode.asOrelse(span, current, right);
        }
        return ParserLib.Result.createAsCustom("passed", "null-coalescing-expr", current, current.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "RangeExpr",
    ParserLib.seq(
      ParserLib.rule("TryExpr"),
      ParserLib.optional(
        ParserLib.seq(
          ParserLib.choice(
            ParserLib.token(".."),
            ParserLib.token("..=")
          ),
          ParserLib.optional(ParserLib.rule("Expr"))
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isRangePassed = seq_array[1].isOptionalPassed();
        if (!isRangePassed) {
          return seq_array[0];
        } else {
          const left = seq_array[0].getCustomData();
          const opt_seq_array = seq_array[1].getOptionalResult().getSequenceResult();
          const operator = opt_seq_array[0].getChoiceResult().getTokenValue();
          const rangeType = operator === ".." ? "exclusive" : "inclusive";
          const isRightPassed = opt_seq_array[1].isOptionalPassed();
          const right = isRightPassed ? opt_seq_array[1].getOptionalResult().getCustomData() : null;
          return ParserLib.Result.createAsCustom(
            "passed",
            "range-expr",
            AST.ExprNode.asRange(data.span, left, rangeType, right),
            data.span
          );
        }
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "TryExpr",
    ParserLib.seq(
      ParserLib.optional(ParserLib.token("try")),
      ParserLib.rule("CatchExpr")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isTry = seq_array[0].isOptionalPassed();
        if (!isTry) return seq_array[1];
        const expr = seq_array[1].getCustomData();
        const result = AST.ExprNode.asTry(data.span, expr);
        return ParserLib.Result.createAsCustom("passed", "try-expr", result, data.span);
      },
      errors: [ParserLib.error(() => true, "Expected expression")]
    }
  ),
  ParserLib.createRule(
    "CatchExpr",
    ParserLib.seq(
      ParserLib.rule("ControlFlowExpr"),
      ParserLib.optional(
        ParserLib.seq(
          ParserLib.token("catch"),
          ParserLib.optional(
            ParserLib.seq(
              ParserLib.token("("),
              ParserLib.rule("Expr"),
              ParserLib.token(")")
            )
          ),
          ParserLib.rule("Stmt")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        if (!seq_array[1].isOptionalPassed()) return seq_array[0];
        const opt_seq_array = seq_array[1].getOptionalResult().getSequenceResult();
        const leftExpr = seq_array[0].getCustomData();
        const isTagged = opt_seq_array[1].isOptionalPassed();
        const tag = isTagged ? opt_seq_array[1].getOptionalResult().getSequenceResult()[1].getCustomData() : null;
        const rightStmt = opt_seq_array[2].getCustomData();
        const result = AST.ExprNode.asCatch(
          { start: leftExpr.span.start, end: rightStmt.span.end },
          leftExpr,
          tag,
          rightStmt
        );
        return ParserLib.Result.createAsCustom("passed", "catch-expr", result, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "ControlFlowExpr",
    ParserLib.choice(
      ParserLib.rule("IfExpr"),
      ParserLib.rule("SwitchExpr"),
      ParserLib.rule("AssignmentExpr")
    ),
    {
      build: (data) => data.getChoiceResult()
    }
  ),
  ParserLib.createRule(
    "IfExpr",
    ParserLib.seq(
      // if <CatchPoint>
      ParserLib.token("if"),
      // expression
      ParserLib.optional(ParserLib.rule("Expr")),
      // statement
      ParserLib.optional(ParserLib.rule("Stmt")),
      // else
      ParserLib.optional(
        ParserLib.seq(
          // else <CatchPoint>
          ParserLib.token("else"),
          // statement
          ParserLib.optional(ParserLib.rule("Stmt"))
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isIfExpr = seq_array[1].isOptionalPassed();
        const isIfStmt = seq_array[2].isOptionalPassed();
        const iElse = seq_array[3].isOptionalPassed();
        const isElseStmt = iElse ? seq_array[3].getOptionalResult().getSequenceResult()[1].isOptionalPassed() : false;
        const ifSpan = seq_array[0].span;
        const elseSpan = iElse ? seq_array[3].getOptionalResult().getSequenceResult()[0].span : void 0;
        const ifExpr = isIfExpr ? seq_array[1].getOptionalResult().getCustomData() : void 0;
        const ifStmt = isIfStmt ? seq_array[2].getOptionalResult().getCustomData() : void 0;
        const elseStmt = isElseStmt ? seq_array[3].getOptionalResult().getSequenceResult()[1].getOptionalResult().getCustomData() : null;
        if (!isIfExpr) {
          throw {
            msg: "Expected expression after `if` keyword",
            span: ifSpan
          };
        }
        if (!isIfStmt) {
          throw {
            msg: "Expected statement after expression",
            span: ifExpr.span
          };
        }
        if (iElse && !isElseStmt) {
          throw {
            msg: "Expected statement after `else` keyword",
            span: elseSpan
          };
        }
        const result = AST.ExprNode.asIf(data.span, ifExpr, ifStmt, elseStmt);
        return ParserLib.Result.createAsCustom("passed", "if-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "SwitchExpr",
    ParserLib.seq(
      // switch <catchPoint>
      ParserLib.token("switch"),
      // expression
      ParserLib.optional(ParserLib.rule("Expr")),
      // {
      ParserLib.optional(ParserLib.token(`{`)),
      // cases
      ParserLib.zeroOrMore(ParserLib.rule("Case")),
      // default
      ParserLib.optional(ParserLib.rule("DefaultCase")),
      // }
      ParserLib.optional(ParserLib.token(`}`))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isSwitchExpr = seq_array[1].isOptionalPassed();
        const isOpeningParen = seq_array[2].isOptionalPassed();
        const isCases = seq_array[3].getRepeatCount() > 0;
        const isDefaultCase = seq_array[4].isOptionalPassed();
        const isClosingParen = seq_array[5].isOptionalPassed();
        const switchSpan = seq_array[0].span;
        const openingParenSpan = isOpeningParen ? seq_array[2].span : void 0;
        const closingParenSpan = isClosingParen ? seq_array[5].span : void 0;
        const switchExpr = isSwitchExpr ? seq_array[1].getOptionalResult().getCustomData() : void 0;
        const casesArray = isCases ? seq_array[3].getRepeatResult().map((member) => member.getCustomData()) : [];
        const defaultCase = isDefaultCase ? seq_array[4].getOptionalResult().getCustomData() : null;
        if (!isSwitchExpr) {
          throw {
            msg: "Expected expression after `switch` keyword",
            span: switchSpan
          };
        }
        if (!isOpeningParen) {
          throw {
            msg: "Expected `{` after switch expression",
            span: switchExpr.span
          };
        }
        if (!isCases && !isDefaultCase) {
          throw {
            msg: "Expected switch cases",
            span: openingParenSpan
          };
        }
        if (!isClosingParen) {
          let last_span = openingParenSpan;
          if (casesArray.length > 0) {
            last_span = casesArray[casesArray.length - 1].span;
          } else if (defaultCase) {
            last_span = defaultCase.span;
          }
          throw {
            msg: "Expected `}` after switch cases",
            span: last_span
          };
        }
        const result = AST.ExprNode.asSwitch(data.span, switchExpr, casesArray, defaultCase);
        return ParserLib.Result.createAsCustom("passed", "switch-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "Case",
    ParserLib.seq(
      // case <catchPoint>
      ParserLib.token("case"),
      // expression
      ParserLib.optional(ParserLib.rule("Expr")),
      // :
      ParserLib.optional(ParserLib.token(":")),
      // statement
      ParserLib.optional(ParserLib.rule("Stmt"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isCaseExpr = seq_array[1].isOptionalPassed();
        const isColon = seq_array[2].isOptionalPassed();
        const isStmt = seq_array[3].isOptionalPassed();
        const caseSpan = seq_array[0].span;
        const caseExpr = isCaseExpr ? seq_array[1].getOptionalResult().getCustomData() : void 0;
        const colonSpan = isColon ? seq_array[2].span : void 0;
        const stmt = isStmt ? seq_array[3].getOptionalResult().getCustomData() : null;
        if (!isCaseExpr) {
          throw {
            msg: "Expected expression after `case` keyword",
            span: caseSpan
          };
        }
        if (!isColon) {
          throw {
            msg: "Expected colon after expression",
            span: caseExpr.span
          };
        }
        if (!isStmt) {
          throw {
            msg: "Expected statement after colon",
            span: colonSpan
          };
        }
        const result = AST.CaseNode.create(data.span, caseExpr, stmt);
        return ParserLib.Result.createAsCustom("passed", "case", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "DefaultCase",
    ParserLib.seq(
      // default <catchPoint>
      ParserLib.token("default"),
      // :
      ParserLib.optional(ParserLib.token(":")),
      // statement
      ParserLib.optional(ParserLib.rule("Stmt"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isColon = seq_array[1].isOptionalPassed();
        const isStmt = seq_array[2].isOptionalPassed();
        const defaultSpan = seq_array[0].span;
        const colonSpan = isColon ? seq_array[1].span : void 0;
        const stmt = isStmt ? seq_array[2].getOptionalResult().getCustomData() : null;
        if (!isColon) {
          throw {
            msg: "Expected colon after `default` keyword",
            span: defaultSpan
          };
        }
        if (!isStmt) {
          throw {
            msg: "Expected statement after colon",
            span: colonSpan
          };
        }
        const result = AST.DefaultNode.create(data.span, stmt);
        return ParserLib.Result.createAsCustom("passed", "default-case", result, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "AssignmentExpr",
    ParserLib.seq(
      ParserLib.rule("ConditionalExpr"),
      ParserLib.optional(
        ParserLib.seq(
          ParserLib.choice(
            ParserLib.token("="),
            ParserLib.token("+="),
            ParserLib.token("-="),
            ParserLib.token("*="),
            ParserLib.token("/="),
            ParserLib.token("%=")
          ),
          ParserLib.rule("Expr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        if (!seq_array[1].isOptionalPassed()) return seq_array[0];
        const opt_seq_array = seq_array[1].getOptionalResult().getSequenceResult();
        const left = seq_array[0].getCustomData();
        const operator = opt_seq_array[0].getChoiceResult().getTokenValue();
        const right = opt_seq_array[1].getCustomData();
        const result = AST.ExprNode.asBinary(
          { start: left.span.start, end: right.span.end },
          left,
          operator,
          right
        );
        return ParserLib.Result.createAsCustom("passed", "assignment-expr", result, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "ConditionalExpr",
    ParserLib.seq(
      ParserLib.rule("LogicalOrExpr"),
      ParserLib.optional(
        ParserLib.seq(
          ParserLib.token("?"),
          ParserLib.rule("Expr"),
          ParserLib.token(":"),
          ParserLib.rule("Expr")
        )
      )
    ),
    {
      build: (data) => {
        const data_seq_array = data.getSequenceResult();
        if (!data_seq_array[1].isOptionalPassed()) return data_seq_array[0];
        const seq_array = data_seq_array[1].getOptionalResult().getSequenceResult();
        const condition = data_seq_array[0].getCustomData();
        const trueExpr = seq_array[1].getCustomData();
        const falseExpr = seq_array[3].getCustomData();
        const result = AST.ExprNode.asConditional(
          { start: condition.span.start, end: falseExpr.span.end },
          condition,
          trueExpr,
          falseExpr
        );
        return ParserLib.Result.createAsCustom("passed", "conditional-expr", result, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "PrefixExpr",
    ParserLib.seq(
      ParserLib.zeroOrMore(
        ParserLib.choice(
          ParserLib.token("++"),
          ParserLib.token("--"),
          ParserLib.token("&"),
          ParserLib.token("+"),
          ParserLib.token("-"),
          ParserLib.token("!"),
          ParserLib.token("~")
        )
      ),
      ParserLib.rule("PostfixExpr")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const or_this = seq_array[1];
        const repeat_array = seq_array[0].getRepeatResult();
        if (!repeat_array.length) {
          return or_this;
        }
        let result = or_this.getCustomData();
        const operations = repeat_array;
        for (const _op of operations) {
          const op = _op.getChoiceResult();
          if (op.getTokenValue() === "++") {
            result = AST.ExprNode.asPreIncrement(
              { start: op.span.start, end: result.span.end },
              result
            );
          } else if (op.getTokenValue() === "--") {
            result = AST.ExprNode.asPreDecrement(
              { start: op.span.start, end: result.span.end },
              result
            );
          } else if (op.getTokenValue() === "&") {
            result = AST.ExprNode.asReference(
              { start: op.span.start, end: result.span.end },
              result
            );
          } else if (op.getTokenValue() === "+") {
            result = AST.ExprNode.asUnaryPlus(
              { start: op.span.start, end: result.span.end },
              result
            );
          } else if (op.getTokenValue() === "-") {
            result = AST.ExprNode.asUnaryMinus(
              { start: op.span.start, end: result.span.end },
              result
            );
          } else if (op.getTokenValue() === "!") {
            result = AST.ExprNode.asLogicalNot(
              { start: op.span.start, end: result.span.end },
              result
            );
          } else if (op.getTokenValue() === "~") {
            result = AST.ExprNode.asxBitwiseNot(
              { start: op.span.start, end: result.span.end },
              result
            );
          }
        }
        return ParserLib.Result.createAsCustom("passed", "prefix-expr", result, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "PostfixExpr",
    ParserLib.seq(
      ParserLib.rule("PrimaryExpr"),
      ParserLib.zeroOrMore(
        ParserLib.choice(
          ParserLib.rule("ArrayAccess"),
          ParserLib.rule("CallSuffix"),
          ParserLib.rule("MemberAccessSuffix"),
          ParserLib.token(".*"),
          ParserLib.token("++"),
          ParserLib.token("--")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const or_this = seq_array[0];
        const repeat_array = seq_array[1].getRepeatResult();
        if (!repeat_array.length) {
          return or_this;
        }
        let result = or_this.getCustomData();
        const operations = repeat_array;
        for (const choice_res of operations) {
          const op = choice_res.getChoiceResult();
          if (op.getTokenValue() === "++") {
            result = AST.ExprNode.asPreIncrement(
              { start: result.span.start, end: op.span.end },
              result
            );
          } else if (op.getTokenValue() === "--") {
            result = AST.ExprNode.asPostDecrement(
              { start: result.span.start, end: op.span.end },
              result
            );
          } else if (op.getTokenValue() === ".*") {
            result = AST.ExprNode.asDereference(
              { start: result.span.start, end: op.span.end },
              result
            );
          } else if (op.isCustom("member-access-suffix")) {
            const memberResult = op.getCustomData();
            result = AST.ExprNode.asMemberAccess(
              { start: result.span.start, end: op.span.end },
              result,
              memberResult.expr,
              memberResult.optional
            );
          } else if (op.isCustom("call-suffix")) {
            if (result.isType()) {
              if (op.getCustomData().length === 1) {
                result = AST.ExprNode.asAs(
                  { start: result.span.start, end: op.span.end },
                  op.getCustomData()[0],
                  result.getType()
                );
                return ParserLib.Result.createAsCustom("passed", "as-expr", result, result.span);
              }
              throw {
                msg: "Type cannot be called as function",
                span: result.span
              };
            }
            result = AST.ExprNode.asCall(
              { start: result.span.start, end: op.span.end },
              result,
              op.getCustomData()
            );
          } else if (op.isCustom("array-access")) {
            result = AST.ExprNode.asArrayAccess(
              { start: result.span.start, end: op.span.end },
              result,
              op.getCustomData()
            );
          }
        }
        return ParserLib.Result.createAsCustom("passed", "postfix-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "MemberAccessSuffix",
    ParserLib.seq(
      ParserLib.optional(ParserLib.token("?")),
      ParserLib.token("."),
      ParserLib.rule("PrimaryExpr")
    ),
    {
      build: (data) => {
        const isOptional = data.getSequenceResult()[0].isOptionalPassed();
        const expr = data.getSequenceResult()[2].getCustomData();
        return ParserLib.Result.createAsCustom("passed", "member-access-suffix", {
          expr,
          optional: isOptional
        }, data.span);
      },
      errors: [
        ParserLib.error(0, "Expected '.' for member access"),
        ParserLib.error(1, "Expected identifier after '.'")
      ]
    }
  ),
  ParserLib.createRule(
    "CallSuffix",
    ParserLib.seq(
      ParserLib.token("("),
      ParserLib.zeroOrOne(ParserLib.rule("ArgumentList")),
      // Edit :
      ParserLib.optional(ParserLib.token(")"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isClosed = seq_array[2].isOptionalPassed();
        const repeat_array = seq_array[1].getRepeatResult();
        const args = repeat_array.length > 0 ? repeat_array[0].getCustomData() : [];
        if (!isClosed) {
          throw {
            msg: "Expected ')' after argument list",
            span: data.span
          };
        }
        return ParserLib.Result.createAsCustom("passed", "call-suffix", args, data.span);
      },
      errors: [
        ParserLib.error(0, "Expected '(' for function call"),
        ParserLib.error(1, "Expected ')' for function call"),
        ParserLib.error(2, "Expected ')' for function call")
      ]
    }
  ),
  ParserLib.createRule(
    "ArgumentList",
    ParserLib.zeroOrMore(
      ParserLib.rule("Expr"),
      ParserLib.token(",")
    ),
    {
      build: (data) => {
        const repeat_array = data.getRepeatResult();
        const args = [];
        for (const x of repeat_array) {
          args.push(x.getCustomData());
        }
        return ParserLib.Result.createAsCustom("passed", "argument-list", args, data.span);
      },
      errors: [
        ParserLib.error(0, "Expected argument list")
      ]
    }
  ),
  ParserLib.createRule(
    "ArrayAccess",
    ParserLib.seq(
      ParserLib.token("["),
      ParserLib.rule("Expr"),
      ParserLib.token("]")
    ),
    {
      build: (data) => {
        return ParserLib.Result.createAsCustom("passed", "array-access", data.getSequenceResult()[1].getCustomData(), data.span);
      },
      errors: [
        ParserLib.error(0, "Expected '[' for array access"),
        ParserLib.error(1, "Expected Expr for array access"),
        ParserLib.error(2, "Expected ']' for array access")
      ]
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "PrimaryExpr",
    ParserLib.choice(
      ParserLib.rule("ParenExpr"),
      ParserLib.rule("TupleExpr"),
      ParserLib.rule("ObjectExpr"),
      ParserLib.rule("IdentExpr"),
      ParserLib.rule("TypeExpr"),
      ParserLib.rule("LiteralExpr")
    ),
    {
      build: (data) => ParserLib.Result.createAsCustom("passed", "primary-expr", data.getChoiceResult().getCustomData(), data.span)
    }
  ),
  ParserLib.createRule(
    "IdentExpr",
    ParserLib.seq(
      ParserLib.optional(ParserLib.token("@")),
      ParserLib.token("ident")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const is_builtin = seq_array[0].isOptionalPassed();
        const identResult = seq_array[1];
        return ParserLib.Result.createAsCustom(
          "passed",
          "ident-expr",
          AST.ExprNode.asIdent(data.span, identResult.getTokenValue(), is_builtin),
          data.span
        );
      },
      errors: [ParserLib.error(0, "Expected identifier")]
    }
  ),
  ParserLib.createRule(
    "LiteralExpr",
    ParserLib.choice(
      // Integer
      ParserLib.token("dec"),
      ParserLib.token("bin"),
      ParserLib.token("oct"),
      ParserLib.token("hex"),
      // Float
      ParserLib.token("flt"),
      // Boolean
      ParserLib.token("true"),
      ParserLib.token("false"),
      // String
      ParserLib.token("slice"),
      // Character
      ParserLib.token("char"),
      // Null/Undefined
      ParserLib.token("null"),
      ParserLib.token("und"),
      // Array
      ParserLib.seq(
        ParserLib.token("["),
        ParserLib.zeroOrMore(
          ParserLib.rule("Expr"),
          ParserLib.token(",")
        ),
        ParserLib.token("]")
      )
    ),
    {
      build: (data) => {
        var _a, _b;
        const selected = data.getChoiceResult();
        let expr = null;
        if (selected.isToken()) {
          const token5 = selected.getTokenData();
          switch (token5.kind) {
            // Integer
            case "dec":
            case "bin":
            case "oct":
            case "hex":
              expr = AST.ExprNode.asInteger(token5.span, Number(token5.value));
              break;
            // Float
            case "flt":
              expr = AST.ExprNode.asFloat(token5.span, Number(token5.value));
              break;
            // Boolean
            case "true":
            case "false":
              expr = AST.ExprNode.asBool(token5.span, token5.value === "true");
              break;
            // Slice
            case "slice":
              expr = AST.ExprNode.asString(token5.span, (_a = token5.value) != null ? _a : "");
              break;
            // Character
            case "char":
              expr = AST.ExprNode.asChar(token5.span, (_b = token5.value) != null ? _b : "");
              break;
            // Null
            case "null":
              expr = AST.ExprNode.asNull(token5.span);
              break;
            // Undefined
            case "und":
              expr = AST.ExprNode.asUndefined(token5.span);
              break;
            // --
            default:
              throw new Error(`Unknown literal kind: ${token5.kind}`);
          }
        } else if (selected.isSequence()) {
          const repeat_items = selected.getSequenceResult()[1].getRepeatResult();
          const exprs = [];
          if (repeat_items.length > 0) {
            for (const r_item of repeat_items) {
              const res = r_item.getCustomData();
              if (!res) continue;
              exprs.push(res);
            }
          }
          expr = AST.ExprNode.asArray(
            data.span,
            exprs
          );
        }
        return ParserLib.Result.createAsCustom("passed", "literal-expr", expr, data.span);
      },
      errors: [
        ParserLib.error(0, "Expected literal expression")
      ]
    }
  ),
  ParserLib.createRule(
    "ParenExpr",
    ParserLib.seq(
      ParserLib.token("("),
      ParserLib.rule("Expr"),
      ParserLib.token(")")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const paren_expr = AST.ExprNode.asParen(
          data.span,
          seq_array[1].getCustomData()
        );
        return ParserLib.Result.createAsCustom("passed", "paren-expr", paren_expr, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "TupleExpr",
    ParserLib.seq(
      ParserLib.token("."),
      ParserLib.token("{"),
      ParserLib.rule("Expr"),
      ParserLib.oneOrMore(
        ParserLib.seq(
          ParserLib.token(","),
          ParserLib.rule("Expr")
        )
      ),
      ParserLib.token("}")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const repeat_items = seq_array[3].getRepeatResult();
        const exprs = [
          seq_array[2].getCustomData()
        ];
        if (repeat_items.length > 0) {
          for (const r_item of repeat_items) {
            const res = r_item.getSequenceResult()[1].getCustomData();
            if (!res) continue;
            exprs.push(res);
          }
        }
        const tuple_expr = AST.ExprNode.asTuple(
          data.span,
          exprs
        );
        return ParserLib.Result.createAsCustom("passed", "tuple-expr", tuple_expr, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "ObjectExpr",
    ParserLib.seq(
      ParserLib.optional(ParserLib.seq(
        ParserLib.token("new"),
        ParserLib.rule("Ident")
      )),
      ParserLib.token("{"),
      ParserLib.zeroOrMore(
        ParserLib.rule("ObjectProperty"),
        ParserLib.token(",")
      ),
      ParserLib.token("}")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isIdent = seq_array[0].isOptionalPassed();
        const ident = isIdent ? seq_array[0].getOptionalResult().getSequenceResult()[1].getCustomData() : void 0;
        const repeat_items = seq_array[2].getRepeatResult();
        const props = [];
        if (repeat_items.length > 0) {
          for (const r_item of repeat_items) {
            const res = r_item.getCustomData();
            if (!res) continue;
            props.push(res);
          }
        }
        const expr = AST.ExprNode.asObject(data.span, props, ident);
        return ParserLib.Result.createAsCustom("passed", "object-expr", expr, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "ObjectProperty",
    ParserLib.seq(
      ParserLib.rule("Ident"),
      ParserLib.token(":"),
      // TODO: why not '=' ?
      ParserLib.rule("Expr")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const key = seq_array[0].getCustomData();
        const value = seq_array[2].getCustomData();
        return ParserLib.Result.createAsCustom(
          "passed",
          "object-property",
          AST.PropNode.create(data.span, key, value),
          data.span
        );
      },
      errors: [
        ParserLib.error(0, "Expected property name"),
        ParserLib.error(1, "Expected ':'"),
        ParserLib.error(2, "Expected property value")
      ]
    }
  ),
  // e.g. `let x = i32;`
  ParserLib.createRule(
    "TypeExpr",
    ParserLib.rule("Type"),
    {
      build: (data) => {
        const typeNode = data.getCustomData();
        if (typeNode.isUndefined()) {
          return ParserLib.Result.createAsCustom(
            "passed",
            "literal-expr",
            AST.ExprNode.asUndefined(typeNode.span),
            data.span
          );
        } else if (typeNode.isNull()) {
          return ParserLib.Result.createAsCustom(
            "passed",
            "literal-expr",
            AST.ExprNode.asNull(typeNode.span),
            data.span
          );
        } else return ParserLib.Result.createAsCustom(
          "passed",
          "type-expr",
          AST.ExprNode.asType(data.span, data.getCustomData()),
          data.span
        );
      },
      errors: [
        ParserLib.error(0, "Expected 'type'")
      ]
    }
  ),
  // e.g. `let x = i32(55);`
  ParserLib.createRule(
    "TypeCastExpr",
    ParserLib.seq(
      ParserLib.rule("Type"),
      ParserLib.token("("),
      ParserLib.rule("Expr"),
      ParserLib.token(")")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const typeNode = seq_array[0].getCustomData();
        const exprNode = seq_array[2].getCustomData();
        return ParserLib.Result.createAsCustom(
          "passed",
          "type-cast-expr",
          AST.ExprNode.asAs(data.span, exprNode, typeNode),
          data.span
        );
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib.createRule(
    "PowerExpr",
    ParserLib.seq(
      ParserLib.rule("PrefixExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.token("**"),
          ParserLib.rule("PrefixExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        const allOperands = [base.getCustomData()];
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          allOperands.push(opSeq[1].getCustomData());
        }
        let result = allOperands[allOperands.length - 1];
        for (let i = allOperands.length - 2; i >= 0; i--) {
          const left = allOperands[i];
          const span = { start: left.span.start, end: result.span.end };
          result = AST.ExprNode.asBinary(span, left, "**", result);
        }
        return ParserLib.Result.createAsCustom("passed", "power-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "MultiplicativeExpr",
    ParserLib.seq(
      ParserLib.rule("PowerExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.choice(
            ParserLib.token("*"),
            ParserLib.token("/"),
            ParserLib.token("%")
          ),
          ParserLib.rule("PowerExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        let result = base.getCustomData();
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          const operator = opSeq[0].getChoiceResult().getTokenValue();
          const right = opSeq[1].getCustomData();
          const span = { start: result.span.start, end: right.span.end };
          result = AST.ExprNode.asBinary(span, result, operator, right);
        }
        return ParserLib.Result.createAsCustom("passed", "multiplicative-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "AdditiveExpr",
    ParserLib.seq(
      ParserLib.rule("MultiplicativeExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.choice(
            ParserLib.token("+"),
            ParserLib.token("-")
          ),
          ParserLib.rule("MultiplicativeExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        let result = base.getCustomData();
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          const operator = opSeq[0].getChoiceResult().getTokenValue();
          const right = opSeq[1].getCustomData();
          const span = { start: result.span.start, end: right.span.end };
          result = AST.ExprNode.asBinary(span, result, operator, right);
        }
        return ParserLib.Result.createAsCustom("passed", "additive-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "ShiftExpr",
    ParserLib.seq(
      ParserLib.rule("AdditiveExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.choice(
            ParserLib.token("<<"),
            ParserLib.token(">>")
          ),
          ParserLib.rule("AdditiveExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        let result = base.getCustomData();
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          const operator = opSeq[0].getChoiceResult().getTokenValue();
          const right = opSeq[1].getCustomData();
          const span = { start: result.span.start, end: right.span.end };
          result = AST.ExprNode.asBinary(span, result, operator, right);
        }
        return ParserLib.Result.createAsCustom("passed", "shift-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "RelationalExpr",
    ParserLib.seq(
      ParserLib.rule("ShiftExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.choice(
            ParserLib.token("<="),
            ParserLib.token(">="),
            ParserLib.token("<"),
            ParserLib.token(">")
          ),
          ParserLib.rule("ShiftExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        let result = base.getCustomData();
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          const operator = opSeq[0].getChoiceResult().getTokenValue();
          const right = opSeq[1].getCustomData();
          const span = { start: result.span.start, end: right.span.end };
          result = AST.ExprNode.asBinary(span, result, operator, right);
        }
        return ParserLib.Result.createAsCustom("passed", "relational-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "EqualityExpr",
    ParserLib.seq(
      ParserLib.rule("RelationalExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.choice(
            ParserLib.token("=="),
            ParserLib.token("!=")
          ),
          ParserLib.rule("RelationalExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        let result = base.getCustomData();
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          const operator = opSeq[0].getChoiceResult().getTokenValue();
          const right = opSeq[1].getCustomData();
          const span = { start: result.span.start, end: right.span.end };
          result = AST.ExprNode.asBinary(span, result, operator, right);
        }
        return ParserLib.Result.createAsCustom("passed", "equality-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "BitwiseAndExpr",
    ParserLib.seq(
      ParserLib.rule("EqualityExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.token("&"),
          ParserLib.rule("EqualityExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        let result = base.getCustomData();
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          const right = opSeq[1].getCustomData();
          const span = { start: result.span.start, end: right.span.end };
          result = AST.ExprNode.asBinary(span, result, "&", right);
        }
        return ParserLib.Result.createAsCustom("passed", "bitwise-and-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "BitwiseXorExpr",
    ParserLib.seq(
      ParserLib.rule("BitwiseAndExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.token("^"),
          ParserLib.rule("BitwiseAndExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        let result = base.getCustomData();
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          const right = opSeq[1].getCustomData();
          const span = { start: result.span.start, end: right.span.end };
          result = AST.ExprNode.asBinary(span, result, "^", right);
        }
        return ParserLib.Result.createAsCustom("passed", "bitwise-xor-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "BitwiseOrExpr",
    ParserLib.seq(
      ParserLib.rule("BitwiseXorExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.token("|"),
          ParserLib.rule("BitwiseXorExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        let result = base.getCustomData();
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          const right = opSeq[1].getCustomData();
          const span = { start: result.span.start, end: right.span.end };
          result = AST.ExprNode.asBinary(span, result, "|", right);
        }
        return ParserLib.Result.createAsCustom("passed", "bitwise-or-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "LogicalAndExpr",
    ParserLib.seq(
      ParserLib.rule("BitwiseOrExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.token("and"),
          ParserLib.rule("BitwiseOrExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        let result = base.getCustomData();
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          const right = opSeq[1].getCustomData();
          const span = { start: result.span.start, end: right.span.end };
          result = AST.ExprNode.asBinary(span, result, "and", right);
        }
        return ParserLib.Result.createAsCustom("passed", "logical-and-expr", result, data.span);
      }
    }
  ),
  ParserLib.createRule(
    "LogicalOrExpr",
    ParserLib.seq(
      ParserLib.rule("LogicalAndExpr"),
      ParserLib.zeroOrMore(
        ParserLib.seq(
          ParserLib.token("or"),
          ParserLib.rule("LogicalAndExpr")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const base = seq_array[0];
        const operations = seq_array[1].getRepeatResult();
        if (operations.length === 0) {
          return base;
        }
        let result = base.getCustomData();
        for (const op of operations) {
          const opSeq = op.getSequenceResult();
          const right = opSeq[1].getCustomData();
          const span = { start: result.span.start, end: right.span.end };
          result = AST.ExprNode.asBinary(span, result, "or", right);
        }
        return ParserLib.Result.createAsCustom("passed", "logical-or-expr", result, data.span);
      }
    }
  )
];

// src/rules/Stmt.ts
var ParserLib2 = __toESM(require("@je-es/parser"));
var AST2 = __toESM(require("@je-es/ast"));
var Stmt = [
  // ════════════ ROOT ════════════
  ParserLib2.createRule(
    "Stmt",
    ParserLib2.seq(
      ParserLib2.choice(
        ParserLib2.rule("BlockStmt"),
        ParserLib2.rule("BreakStmt"),
        ParserLib2.rule("ContinueStmt"),
        ParserLib2.rule("FnStmt"),
        ParserLib2.rule("LetStmt"),
        ParserLib2.rule("UseStmt"),
        ParserLib2.rule("DefStmt"),
        ParserLib2.rule("WhileStmt"),
        ParserLib2.rule("DoStmt"),
        ParserLib2.rule("ForStmt"),
        ParserLib2.rule("ReturnStmt"),
        ParserLib2.rule("DeferStmt"),
        ParserLib2.rule("ThrowStmt"),
        ParserLib2.rule("TestStmt"),
        ParserLib2.rule("Expr")
      ),
      ParserLib2.optional(
        ParserLib2.token(";")
      )
    ),
    {
      build: (data) => {
        const FUCKING_LENGTH_BEFORE_FUCKING_EXPR = 13;
        const seq_array = data.getSequenceResult();
        const choise_ind = seq_array[0].getChoiceIndex();
        const choise_res = seq_array[0].getChoiceResult();
        const start_span = data.span.start;
        const end_span = seq_array[1].isOptionalPassed() ? seq_array[1].getOptionalResult().getTokenSpan().end : choise_res.span.end;
        const span = {
          start: start_span,
          end: end_span
        };
        if (choise_ind <= FUCKING_LENGTH_BEFORE_FUCKING_EXPR) {
          const stmt = choise_res.getCustomData();
          if (stmt) {
            stmt.span = span;
            return ParserLib2.Result.createAsCustom(choise_res.status, "stmt", stmt, span);
          } else {
            return choise_res;
          }
        } else {
          const expr = choise_res.getCustomData();
          const stmt = AST2.StmtNode.asExpr(span, expr);
          return ParserLib2.Result.createAsCustom("passed", "expr-stmt", stmt, span);
        }
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib2.createRule(
    "FnStmt",
    ParserLib2.seq(
      // pub | static
      ParserLib2.optional(ParserLib2.choice(
        ParserLib2.token("pub"),
        ParserLib2.token("static")
      )),
      // comptime
      ParserLib2.optional(ParserLib2.token("comptime")),
      // inline
      ParserLib2.optional(ParserLib2.token("inline")),
      // fn <CatchPoint>
      ParserLib2.token("fn"),
      // identifier
      ParserLib2.optional(ParserLib2.rule("Ident")),
      // (
      ParserLib2.optional(ParserLib2.token("(")),
      // parameters
      ParserLib2.optional(
        ParserLib2.oneOrMore(
          ParserLib2.rule("Parameter"),
          ParserLib2.token(",")
        )
      ),
      // )
      ParserLib2.optional(ParserLib2.token(")")),
      ParserLib2.optional(ParserLib2.token("->")),
      // error type can be : ident(MyError) or access(MySet.MyError) and later `errset { A, B }`
      ParserLib2.optional(ParserLib2.rule("Type")),
      ParserLib2.optional(ParserLib2.token("!")),
      ParserLib2.optional(ParserLib2.rule("Type")),
      // body (can be stmt or block of stmts)
      ParserLib2.optional(ParserLib2.rule("Stmt"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isAttr = seq_array[0].isOptionalPassed();
        const isPublic = isAttr && seq_array[0].getOptionalResult().getChoiceIndex() === 0;
        const isStatic = isAttr && seq_array[0].getOptionalResult().getChoiceIndex() === 1;
        const isComptime = seq_array[1].isOptionalPassed();
        const isInline = seq_array[2].isOptionalPassed();
        const isIdent = seq_array[4].isOptionalPassed();
        const isOpeningParen = seq_array[5].isOptionalPassed();
        const isParams = seq_array[6].isOptionalPassed();
        const isClosingParen = seq_array[7].isOptionalPassed();
        const isArrowSign = seq_array[8].isOptionalPassed();
        const isErrorType = seq_array[9].isOptionalPassed();
        const isNotSign = seq_array[10].isOptionalPassed();
        const isReturnType = seq_array[11].isOptionalPassed();
        const isBody = seq_array[12].isOptionalPassed();
        const visibilitySpan = isAttr ? seq_array[0].span : void 0;
        const comptimeSpan = isComptime ? seq_array[1].span : void 0;
        const fnSpan = seq_array[3].getTokenSpan();
        const openingParenSpan = isOpeningParen ? seq_array[5].span : void 0;
        const closingParenSpan = isClosingParen ? seq_array[7].span : void 0;
        const arrowSignSpan = isArrowSign ? seq_array[8].span : void 0;
        const notSignSpan = isNotSign ? seq_array[10].span : void 0;
        let ident = isIdent ? seq_array[4].getOptionalResult().getCustomData() : void 0;
        let parameters = [];
        let errorType = isErrorType ? seq_array[9].getOptionalResult().getCustomData() : void 0;
        let returnType = isReturnType ? seq_array[11].getOptionalResult().getCustomData() : void 0;
        let body = isBody ? seq_array[12].getOptionalResult().getCustomData() : void 0;
        if (isParams) {
          const paramList = seq_array[6].getOptionalResult().getRepeatResult();
          parameters = paramList.map((r) => r.getCustomData());
        }
        if (errorType && !returnType && !isNotSign) {
          if (!errorType.isErrset() && !isNotSign) {
            returnType = errorType;
            errorType = void 0;
          }
        }
        let lastElemSpan = data.span;
        {
          if (isBody) {
            lastElemSpan = body.span;
          } else if (returnType) {
            lastElemSpan = returnType.span;
          } else if (isNotSign) {
            lastElemSpan = notSignSpan;
          } else if (errorType) {
            lastElemSpan = errorType.span;
          } else if (isArrowSign) {
            lastElemSpan = arrowSignSpan;
          } else if (isClosingParen) {
            lastElemSpan = closingParenSpan;
          } else if (isParams && parameters.length) {
            lastElemSpan = parameters[parameters.length - 1].span;
          } else if (isOpeningParen) {
            lastElemSpan = openingParenSpan;
          } else if (isIdent) {
            lastElemSpan = ident.span;
          } else {
            lastElemSpan = fnSpan;
          }
        }
        if (!ident) {
          throw {
            msg: "Expected identifier after `fn` keyword",
            span: fnSpan
          };
        }
        if (!isOpeningParen) {
          throw {
            msg: "Expected `(` after function name",
            span: ident.span
          };
        }
        if (!isClosingParen) {
          throw {
            msg: isParams && parameters.length ? "Expected `)` after parameters" : "Expected parameters or `)` after `(`",
            span: isParams && parameters.length ? { start: openingParenSpan.start, end: parameters[parameters.length - 1].span.end } : openingParenSpan
          };
        }
        if (isArrowSign && !returnType) {
          throw {
            msg: "Expected return type after `->`",
            span: arrowSignSpan
          };
        }
        if (!isArrowSign && returnType) {
          throw {
            msg: "Expected `->` before return type",
            span: returnType.span
          };
        }
        if (errorType && !isNotSign) {
          throw {
            msg: "Expected `!` after error type",
            span: errorType.span
          };
        }
        if (!errorType && isNotSign) {
          throw {
            msg: "Expected error type before `!`",
            span: notSignSpan
          };
        }
        if (errorType && !errorType.isErrset() && !errorType.isErr() && !errorType.isIdent()) {
          throw {
            msg: "Error type must be error name or error set",
            span: errorType.span
          };
        }
        if (!body) {
          throw {
            msg: "Expected function body",
            span: {
              start: lastElemSpan.end,
              end: lastElemSpan.end + 1
            }
          };
        }
        const result = AST2.StmtNode.asFunc(
          data.span,
          {
            kind: isPublic ? "Public" : isStatic ? "Static" : "Private",
            span: visibilitySpan
          },
          {
            kind: isComptime ? "Comptime" : "Runtime",
            span: comptimeSpan
          },
          isInline,
          ident,
          parameters,
          errorType,
          returnType,
          body
        );
        return ParserLib2.Result.createAsCustom("passed", "function-stmt", result, data.span);
      },
      errors: [
        ParserLib2.error(1, "Expected `fn` keyword")
      ]
    }
  ),
  ParserLib2.createRule(
    "UseStmt",
    ParserLib2.seq(
      // pub | static
      ParserLib2.optional(ParserLib2.choice(
        ParserLib2.token("pub"),
        ParserLib2.token("static")
      )),
      // use  <CatchPoint>
      ParserLib2.token("use"),
      // target
      ParserLib2.optional(
        ParserLib2.choice(
          ParserLib2.token("*"),
          ParserLib2.oneOrMore(
            ParserLib2.rule("Ident"),
            ParserLib2.token(".")
          )
        )
      ),
      // as
      ParserLib2.optional(ParserLib2.token("as")),
      // alias
      ParserLib2.optional(
        ParserLib2.choice(
          ParserLib2.rule("Ident"),
          // allow
          ParserLib2.rule("Stmt")
          // reject
        )
      ),
      // from
      ParserLib2.optional(ParserLib2.token("from")),
      // path
      ParserLib2.optional(ParserLib2.token("slice"))
    ),
    {
      build: (data) => {
        var _a;
        const seq_array = data.getSequenceResult();
        const isVisibility = seq_array[0].isOptionalPassed();
        const isPublic = isVisibility && seq_array[0].getOptionalResult().getChoiceIndex() === 0;
        const isStatic = isVisibility && seq_array[0].getOptionalResult().getChoiceIndex() === 1;
        const isAs = seq_array[3].isOptionalPassed();
        const isAlias = seq_array[4].isOptionalPassed();
        const isAliasIdent = isAlias && seq_array[4].getOptionalResult().getChoiceIndex() === 0;
        const isFrom = seq_array[5].isOptionalPassed();
        const isPath = seq_array[6].isOptionalPassed();
        const useSpan = seq_array[1].span;
        const asSpan = isAs ? seq_array[3].span : void 0;
        const aliasSpan = isAlias ? seq_array[4].span : void 0;
        const fromSpan = isFrom ? seq_array[5].span : void 0;
        const pathSpan = isPath ? seq_array[6].span : void 0;
        const visibilitySpan = isVisibility ? seq_array[0].span : void 0;
        const isTargetPassed = seq_array[2].isOptionalPassed();
        const isTargetNotButNotAll = isTargetPassed && seq_array[2].getOptionalResult().getChoiceIndex() !== 0;
        const targetKind = isTargetPassed ? !isTargetNotButNotAll ? "all" : seq_array[2].getOptionalResult().getChoiceResult().getRepeatCount() === 1 ? "ident" : "access" : void 0;
        const isTarget = targetKind === "ident" || targetKind === "access" && seq_array[2].getOptionalResult().getChoiceResult().getRepeatCount() > 0;
        let targetArr = targetKind === "ident" || targetKind === "access" ? seq_array[2].getOptionalResult().getChoiceResult().getRepeatResult().map((x) => x.getCustomData()) : void 0;
        const isEndWithDot = isTargetNotButNotAll && seq_array[2].getOptionalResult().getChoiceResult().isRepeatEndsWithSep();
        const targetArrSpan = targetKind === "ident" || targetKind === "access" && targetArr.length ? {
          start: targetArr[0].span.start,
          end: isEndWithDot ? targetArr[targetArr.length - 1].span.end + 1 : targetArr[targetArr.length - 1].span.end
        } : void 0;
        let alias = isAliasIdent ? seq_array[4].getOptionalResult().getChoiceResult().getCustomData() : void 0;
        let path = isPath ? (_a = seq_array[6].getOptionalResult().getTokenData().value) != null ? _a : "" : void 0;
        if (targetKind === void 0) {
          throw {
            msg: "Expected identifier after `use` keyword",
            span: useSpan
          };
        }
        if (isEndWithDot) {
          throw {
            msg: "Expected identifier after `.` in target",
            span: targetArrSpan
          };
        }
        if (isFrom && !isPath) {
          throw {
            msg: "Expected module path after `from` keyword",
            span: fromSpan
          };
        }
        if (!isFrom && isPath) {
          throw {
            msg: "Expected `from` keyword before module path",
            span: pathSpan
          };
        }
        if (path === "") {
          throw {
            msg: "Module path cannot be empty",
            span: pathSpan
          };
        }
        if (isAs && !isAlias) {
          throw {
            msg: "Expected identifier after `as` keyword",
            span: asSpan
          };
        }
        if (!isAliasIdent && isAlias && isAs) {
          throw {
            msg: "Alias must be an identifier",
            span: aliasSpan
          };
        }
        if (isTarget && isAlias && !isAs) {
          throw {
            msg: "Expected `as` keyword after alias",
            span: aliasSpan
          };
        }
        if (!alias && !path) {
          throw {
            msg: "Must specify either an alias or a module path",
            span: targetArrSpan
          };
        }
        const result = AST2.StmtNode.asUse(
          data.span,
          {
            kind: isPublic ? "Public" : isStatic ? "Static" : "Private",
            span: visibilitySpan
          },
          targetKind === "all" ? void 0 : targetArr,
          alias,
          path,
          pathSpan
        );
        return ParserLib2.Result.createAsCustom("passed", "use-stmt", result, data.span);
      }
    }
  ),
  ParserLib2.createRule(
    "DefStmt",
    ParserLib2.seq(
      // pub | static
      ParserLib2.optional(ParserLib2.choice(
        ParserLib2.token("pub"),
        ParserLib2.token("static")
      )),
      // def <CatchPoint>
      ParserLib2.token(`def`),
      // ident
      ParserLib2.optional(ParserLib2.rule("Ident")),
      // =
      ParserLib2.optional(ParserLib2.token(`=`)),
      // type
      ParserLib2.optional(ParserLib2.rule("Type"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isAttr = seq_array[0].isOptionalPassed();
        const isPublic = isAttr && seq_array[0].getOptionalResult().getChoiceIndex() === 0;
        const isStatic = isAttr && seq_array[0].getOptionalResult().getChoiceIndex() === 1;
        const isIdent = seq_array[2].isOptionalPassed();
        const isEqualSign = seq_array[3].isOptionalPassed();
        const isType = seq_array[4].isOptionalPassed();
        let ident = isIdent ? seq_array[2].getOptionalResult().getCustomData() : void 0;
        let type = isType ? seq_array[4].getOptionalResult().getCustomData() : void 0;
        const defSpan = seq_array[1].span;
        const equalSignSpan = seq_array[3].span;
        const visibilitySpan = isAttr ? seq_array[0].span : void 0;
        if (!isIdent) {
          throw {
            msg: "Expected identifier after `def` keyword",
            span: defSpan
          };
        }
        if (type && !isEqualSign) {
          throw {
            msg: "Expected `=` before type",
            span: { start: type.span.start - 1, end: type.span.start }
          };
        }
        if (!type && isEqualSign) {
          throw {
            msg: "Expected type after `=`",
            span: equalSignSpan
          };
        }
        if (!type) {
          throw {
            msg: `Missing type`,
            span: defSpan
          };
        }
        if (type.isStruct()) type.getStruct().name = ident.name;
        return ParserLib2.Result.createAsCustom(
          "passed",
          "def-stmt",
          AST2.StmtNode.asDefine(
            data.span,
            {
              kind: isPublic ? "Public" : isStatic ? "Static" : "Private",
              span: visibilitySpan
            },
            ident,
            type
          ),
          data.span
        );
      }
    }
  ),
  ParserLib2.createRule(
    "BlockStmt",
    ParserLib2.seq(
      ParserLib2.token("{"),
      ParserLib2.zeroOrMore(ParserLib2.rule("Stmt")),
      ParserLib2.token("}")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const span = { start: seq_array[0].getTokenSpan().start, end: seq_array[2].getTokenSpan().end };
        const stmtsCount = seq_array[1].getRepeatCount();
        const stmts = stmtsCount > 0 ? seq_array[1].getRepeatResult().map((x) => x.getCustomData()) : [];
        const result = AST2.StmtNode.asBlock(span, stmts);
        return ParserLib2.Result.createAsCustom("passed", "block-stmt", result, span);
      }
    }
  ),
  ParserLib2.createRule(
    "TestStmt",
    ParserLib2.seq(
      ParserLib2.token("test"),
      ParserLib2.optional(ParserLib2.token("slice")),
      ParserLib2.optional(ParserLib2.rule("BlockStmt"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isNamePassed = seq_array[1].isOptionalPassed();
        const isBlockPassed = seq_array[2].isOptionalPassed();
        const nameToken = isNamePassed ? seq_array[1].getOptionalResult().getTokenData() : void 0;
        const blockStmt = isBlockPassed ? seq_array[2].getOptionalResult().getCustomData() : void 0;
        const testSpan = seq_array[0].span;
        if (!isBlockPassed) {
          if (isNamePassed) {
            throw {
              msg: "Expected block statement after test name",
              span: nameToken.span
            };
          } else {
            throw {
              msg: "Expected block statement or test name after `test` keyword",
              span: testSpan
            };
          }
        }
        const nameInfo = isNamePassed ? {
          name: nameToken.value,
          span: nameToken.span
        } : void 0;
        const result = AST2.StmtNode.asTest(data.span, nameInfo, blockStmt.getBlock());
        return ParserLib2.Result.createAsCustom("passed", "test-stmt", result, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib2.createRule(
    "WhileStmt",
    ParserLib2.seq(
      // while <Catchpoint>
      ParserLib2.token("while"),
      // expr
      ParserLib2.optional(ParserLib2.rule("Expr")),
      // stmt
      ParserLib2.optional(ParserLib2.rule("Stmt"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isExpr = seq_array[1].isOptionalPassed();
        const isStmt = seq_array[2].isOptionalPassed();
        const expr = isExpr ? seq_array[1].getOptionalResult().getCustomData() : void 0;
        const stmt = isStmt ? seq_array[2].getOptionalResult().getCustomData() : void 0;
        const whileSpan = seq_array[0].span;
        if (!isExpr) {
          throw {
            msg: "Expected expression after `while` keyword",
            span: whileSpan
          };
        }
        if (!isStmt) {
          throw {
            msg: "Expected statement after expression",
            span: expr.span
          };
        }
        const result = AST2.StmtNode.asWhile(data.span, expr, stmt);
        return ParserLib2.Result.createAsCustom("passed", "while-stmt", result, data.span);
      }
    }
  ),
  ParserLib2.createRule(
    "DoStmt",
    ParserLib2.seq(
      // do <Catchpoint>
      ParserLib2.token("do"),
      // stmt
      ParserLib2.optional(ParserLib2.rule("Stmt")),
      // while <Catchpoint>
      ParserLib2.optional(ParserLib2.token("while")),
      // expression
      ParserLib2.optional(ParserLib2.rule("Expr"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isStmt = seq_array[1].isOptionalPassed();
        const isWhile = seq_array[2].isOptionalPassed();
        const isExpr = seq_array[3].isOptionalPassed();
        const stmt = isStmt ? seq_array[1].getOptionalResult().getCustomData() : void 0;
        const expr = isExpr ? seq_array[3].getOptionalResult().getCustomData() : void 0;
        const doSpan = seq_array[0].span;
        const whileSpan = isWhile ? seq_array[2].span : void 0;
        if (!isStmt) {
          throw {
            msg: "Expected statement after `do` keyword",
            span: doSpan
          };
        }
        if (!isWhile) {
          throw {
            msg: "Expected `while` keyword after statement",
            span: stmt.span
          };
        }
        if (!isExpr) {
          throw {
            msg: "Expected expression after `while` keyword",
            span: whileSpan
          };
        }
        const result = AST2.StmtNode.asDo(data.span, expr, stmt);
        return ParserLib2.Result.createAsCustom("passed", "do-stmt", result, data.span);
      }
    }
  ),
  ParserLib2.createRule(
    "ForStmt",
    ParserLib2.seq(
      // for <Catchpoint>
      ParserLib2.token("for"),
      // expr
      ParserLib2.optional(ParserLib2.rule("Expr")),
      // stmt
      ParserLib2.optional(ParserLib2.rule("Stmt"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isExpr = seq_array[1].isOptionalPassed();
        const isStmt = seq_array[2].isOptionalPassed();
        const expr = isExpr ? seq_array[1].getOptionalResult().getCustomData() : void 0;
        const stmt = isStmt ? seq_array[2].getOptionalResult().getCustomData() : void 0;
        const forSpan = seq_array[0].span;
        if (!isExpr) {
          throw {
            msg: "Expected range expression after `for` keyword",
            span: forSpan
          };
        }
        if (!expr.isOrEndWith("Range")) {
          throw {
            msg: "Expected range expression after `for` keyword",
            span: expr.span
          };
        }
        if (!isStmt) {
          throw {
            msg: "Expected statement after range expression",
            span: expr.span
          };
        }
        const result = AST2.StmtNode.asFor(data.span, expr, stmt);
        return ParserLib2.Result.createAsCustom("passed", "for-stmt", result, data.span);
      }
    }
  ),
  ParserLib2.createRule(
    "ReturnStmt",
    ParserLib2.seq(
      // return <Catchpoint>
      ParserLib2.token("return"),
      // expr
      ParserLib2.optional(ParserLib2.rule("Expr"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isExpr = seq_array[1].isOptionalPassed();
        const expr = isExpr ? seq_array[1].getOptionalResult().getCustomData() : void 0;
        const result = AST2.StmtNode.asReturn(data.span, expr);
        return ParserLib2.Result.createAsCustom("passed", "return-stmt", result, data.span);
      }
    }
  ),
  ParserLib2.createRule(
    "DeferStmt",
    ParserLib2.seq(
      // defer <Catchpoint>
      ParserLib2.token("defer"),
      // expr
      ParserLib2.optional(ParserLib2.rule("Expr"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isExpr = seq_array[1].isOptionalPassed();
        const expr = isExpr ? seq_array[1].getOptionalResult().getCustomData() : void 0;
        const deferSpan = seq_array[0].span;
        if (!isExpr) {
          throw {
            msg: "Expected expression after `defer` keyword",
            span: deferSpan
          };
        }
        const result = AST2.StmtNode.asDefer(data.span, expr);
        return ParserLib2.Result.createAsCustom("passed", "defer-stmt", result, data.span);
      }
    }
  ),
  ParserLib2.createRule(
    "ThrowStmt",
    ParserLib2.seq(
      // throw <Catchpoint>
      ParserLib2.token("throw"),
      // expr
      ParserLib2.optional(ParserLib2.rule("Expr"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isExpr = seq_array[1].isOptionalPassed();
        const expr = isExpr ? seq_array[1].getOptionalResult().getCustomData() : void 0;
        const throwSpan = seq_array[0].span;
        if (!isExpr) {
          throw {
            msg: "Expected expression after `throw` keyword",
            span: throwSpan
          };
        }
        const result = AST2.StmtNode.asThrow(data.span, expr);
        return ParserLib2.Result.createAsCustom("passed", "throw-stmt", result, data.span);
      }
    }
  ),
  ParserLib2.createRule(
    "BreakStmt",
    // break <Catchpoint>
    ParserLib2.token("break"),
    {
      build: (data) => {
        const breakSpan = data.span;
        const result = AST2.StmtNode.asBreak(breakSpan);
        return ParserLib2.Result.createAsCustom("passed", "break-stmt", result, data.span);
      }
    }
  ),
  ParserLib2.createRule(
    "ContinueStmt",
    // continue <Catchpoint>
    ParserLib2.token("continue"),
    {
      build: (data) => {
        const continueSpan = data.span;
        const result = AST2.StmtNode.asContinue(continueSpan);
        return ParserLib2.Result.createAsCustom("passed", "continue-stmt", result, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  // one builder for ( variables / function parameters / structure fields)
  createCommonVariableRule("LetStmt"),
  createCommonVariableRule("Parameter"),
  createCommonVariableRule("StructField")
  // ════════════ ---- ════════════
];
function createCommonVariableRule(kind) {
  return ParserLib2.createRule(
    kind,
    ParserLib2.seq(
      // pub | static
      ParserLib2.optional(ParserLib2.choice(
        ParserLib2.token("pub"),
        ParserLib2.token("static")
      )),
      // comptime
      ParserLib2.optional(ParserLib2.token("comptime")),
      // let <CatchPoint> if Variable
      kind === "LetStmt" ? ParserLib2.token(`let`) : ParserLib2.optional(ParserLib2.token("let")),
      // mut
      ParserLib2.optional(ParserLib2.token("mut")),
      // ident  <CatchPoint> if not Variable
      kind === "LetStmt" ? ParserLib2.optional(ParserLib2.rule("Ident")) : ParserLib2.rule("Ident"),
      // :
      ParserLib2.optional(ParserLib2.token(`:`)),
      // type
      ParserLib2.optional(ParserLib2.rule("Type")),
      // =
      ParserLib2.optional(ParserLib2.token(`=`)),
      // expr
      ParserLib2.optional(ParserLib2.rule("Expr"))
    ),
    {
      build: (data) => {
        const catchPoint = kind === "LetStmt" ? "let" : "ident";
        const seq_array = data.getSequenceResult();
        const isAttr = seq_array[0].isOptionalPassed();
        const isPublic = isAttr && seq_array[0].getOptionalResult().getChoiceIndex() === 0;
        const isStatic = isAttr && seq_array[0].getOptionalResult().getChoiceIndex() === 1;
        const isComptime = seq_array[1].isOptionalPassed();
        const isLet = catchPoint === "let" ? true : seq_array[2].isOptionalPassed();
        const isMutable = seq_array[3].isOptionalPassed();
        const isIdent = catchPoint === "ident" ? true : seq_array[4].isOptionalPassed();
        const isColonSign = seq_array[5].isOptionalPassed();
        const isType = seq_array[6].isOptionalPassed();
        const isEqualSign = seq_array[7].isOptionalPassed();
        const isInitializer = seq_array[8].isOptionalPassed();
        let ident = catchPoint === "let" && isIdent ? seq_array[4].getOptionalResult().getCustomData() : catchPoint === "ident" && isIdent ? seq_array[4].getCustomData() : void 0;
        let type = isType ? seq_array[6].getOptionalResult().getCustomData() : void 0;
        let initializer = isInitializer ? seq_array[8].getOptionalResult().getCustomData() : void 0;
        const visibilitySpan = isAttr ? seq_array[0].span : void 0;
        const comptimeSpan = isComptime ? seq_array[1].span : void 0;
        const letSpan = catchPoint === "let" ? seq_array[2].span : isLet ? seq_array[2].span : void 0;
        const mutSpan = isMutable ? seq_array[3].span : void 0;
        const colonSignSpan = isColonSign ? seq_array[5].span : void 0;
        const equalSignSpan = isEqualSign ? seq_array[7].span : void 0;
        if (isAttr && kind === "Parameter") {
          if (isPublic) {
            throw {
              msg: "`pub` keyword is not allowed in this context",
              span: visibilitySpan
            };
          } else if (isStatic) {
            throw {
              msg: "`static` keyword is not allowed in this context",
              span: visibilitySpan
            };
          }
        }
        if (!ident && catchPoint === "let") {
          throw {
            msg: mutSpan ? "Expected identifier after `mut` keyword" : "Expected identifier after `let` keyword",
            span: mutSpan != null ? mutSpan : letSpan
          };
        }
        if (!ident) {
          throw new Error("unreachable code detected");
        }
        if (isLet && catchPoint !== "let") {
          throw {
            msg: "`let` keyword is not allowed in this context",
            span: letSpan
          };
        }
        if (type && !isColonSign) {
          throw {
            msg: "Expected `:` before type",
            span: type.span
          };
        }
        if (!type && isColonSign) {
          throw {
            msg: "Expected type after `:`",
            span: colonSignSpan
          };
        }
        if (initializer && !isEqualSign) {
          throw {
            msg: "Expected `=` before initializer",
            span: initializer.span
          };
        }
        if (!initializer && isEqualSign) {
          throw {
            msg: "Expected initializer after `=`",
            span: equalSignSpan
          };
        }
        if (!type && !initializer) {
          throw {
            msg: `Expected type or initializer after ${kind === "Parameter" ? "parameter" : kind === "StructField" ? "field" : "variable"} name`,
            span: ident.span
          };
        }
        const field = AST2.FieldNode.create(
          data.span,
          {
            kind: isPublic ? "Public" : isStatic ? "Static" : "Private",
            span: visibilitySpan
          },
          {
            kind: isComptime ? "Comptime" : "Runtime",
            span: comptimeSpan
          },
          {
            kind: isMutable ? "Mutable" : "Immutable",
            span: mutSpan
          },
          ident,
          type,
          initializer
        );
        if (kind === "StructField") {
          return ParserLib2.Result.createAsCustom("passed", "field-node", field, data.span);
        } else if (kind === "Parameter") {
          return ParserLib2.Result.createAsCustom("passed", "param-node", field, data.span);
        } else {
          return ParserLib2.Result.createAsCustom(
            "passed",
            "let-stmt-node",
            AST2.StmtNode.create(
              "Let",
              data.span,
              new AST2.LetStmtNode(data.span, field)
            ),
            data.span
          );
        }
      }
    }
  );
}

// src/rules/Type.ts
var ParserLib3 = __toESM(require("@je-es/parser"));
var AST3 = __toESM(require("@je-es/ast"));
var Type = [
  // TODO: There are some rules that need to be updated to work with the new style.
  // ════════════ ROOT ════════════
  ParserLib3.createRule(
    "Type",
    ParserLib3.rule("UnionType"),
    {
      build: (data) => data,
      errors: [ParserLib3.error(() => true, "Expected type")]
    }
  ),
  // ════════════ ---- ════════════
  ParserLib3.createRule(
    "UnionType",
    ParserLib3.seq(
      ParserLib3.rule("BaseType"),
      ParserLib3.zeroOrMore(
        ParserLib3.seq(
          ParserLib3.token("|"),
          ParserLib3.rule("BaseType")
        )
      )
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const first = seq_array[0];
        const rest = seq_array[1].getRepeatResult();
        if (rest.length === 0) {
          return first;
        }
        const types = [first.getCustomData()];
        for (const item of rest) {
          const seq4 = item.getSequenceResult();
          types.push(seq4[1].getCustomData());
        }
        const result = AST3.TypeNode.asUnion(data.span, types);
        return ParserLib3.Result.createAsCustom("passed", "union-type", result, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib3.createRule(
    "BaseType",
    ParserLib3.choice(
      ParserLib3.rule("FunctionType"),
      ParserLib3.rule("ErrsetType"),
      ParserLib3.rule("StructType"),
      ParserLib3.rule("EnumType"),
      ParserLib3.rule("TupleType"),
      ParserLib3.rule("ArrayType"),
      ParserLib3.rule("PointerType"),
      ParserLib3.rule("OptionalType"),
      ParserLib3.rule("PrimitiveType"),
      ParserLib3.rule("IdentifierType"),
      ParserLib3.rule("ParenType")
    ),
    {
      build: (data) => ParserLib3.Result.createAsCustom("passed", "base-type", data.getChoiceResult().getCustomData(), data.span)
    }
  ),
  // ════════════ ---- ════════════
  ParserLib3.createRule(
    "StructType",
    ParserLib3.seq(
      // struct <CatchPoint>
      ParserLib3.token("struct"),
      // {
      ParserLib3.optional(ParserLib3.token("{")),
      // members
      ParserLib3.zeroOrMore(ParserLib3.rule("StructMember")),
      // }
      ParserLib3.optional(ParserLib3.token("}"))
    ),
    {
      build: (data) => {
        var _a, _b;
        const seq_array = data.getSequenceResult();
        const isOpeningParen = seq_array[1].isOptionalPassed();
        const isClosingParen = seq_array[3].isOptionalPassed();
        const structSpan = seq_array[0].getTokenSpan();
        const openingParenSpan = isOpeningParen ? seq_array[1].getOptionalResult().getTokenSpan() : null;
        const closingParenSpan = isClosingParen ? seq_array[3].getOptionalResult().getTokenSpan() : null;
        const membersCount = seq_array[2].getRepeatCount();
        const members = membersCount > 0 ? seq_array[2].getRepeatResult().map((member) => member.getCustomData()) : [];
        if (!isOpeningParen) {
          throw {
            msg: "Expected '{' after `struct` keyword",
            span: {
              start: structSpan.end,
              end: structSpan.end + 1
            }
          };
        }
        if (!isClosingParen) {
          throw {
            msg: "Expected '}' after struct body",
            span: {
              start: ((_a = closingParenSpan == null ? void 0 : closingParenSpan.end) != null ? _a : membersCount > 0 && members[membersCount - 1]) ? members[membersCount - 1].span.end : openingParenSpan == null ? void 0 : openingParenSpan.end,
              end: ((_b = closingParenSpan == null ? void 0 : closingParenSpan.end) != null ? _b : membersCount > 0 && members[membersCount - 1]) ? members[membersCount - 1].span.end + 1 : openingParenSpan.end + 1
            }
          };
        }
        const result = AST3.TypeNode.asStruct(data.span, members);
        return ParserLib3.Result.createAsCustom("passed", "struct-type", result, data.span);
      }
    }
  ),
  ParserLib3.createRule(
    "StructMember",
    ParserLib3.seq(
      ParserLib3.choice(
        ParserLib3.rule("StructField"),
        ParserLib3.rule("FnStmt")
      ),
      ParserLib3.optional(ParserLib3.token(";"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const member = seq_array[0].getChoiceResult().getCustomData();
        if (!member) {
          throw {
            msg: "Expected valid member",
            span: data.span
          };
        }
        const result = member.kind === "Func" ? AST3.StructMemberNode.createMethod(member.span, member.getFunc()) : AST3.StructMemberNode.createField(member.span, member);
        return ParserLib3.Result.createAsCustom("passed", "struct-member", result, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib3.createRule(
    "EnumType",
    ParserLib3.seq(
      // enum <CatchPoint>
      ParserLib3.token("enum"),
      // {
      ParserLib3.optional(ParserLib3.token("{")),
      // members
      ParserLib3.zeroOrMore(ParserLib3.rule("EnumVariant"), ParserLib3.token(",")),
      // }
      ParserLib3.optional(ParserLib3.token("}"))
    ),
    {
      build: (data) => {
        var _a, _b;
        const seq_array = data.getSequenceResult();
        const isOpeningParen = seq_array[1].isOptionalPassed();
        const isClosingParen = seq_array[3].isOptionalPassed();
        const enumSpan = seq_array[0].getTokenSpan();
        const openingParenSpan = isOpeningParen ? seq_array[1].getOptionalResult().getTokenSpan() : null;
        const closingParenSpan = isClosingParen ? seq_array[3].getOptionalResult().getTokenSpan() : null;
        const variantsCount = seq_array[2].getRepeatCount();
        const variants = variantsCount > 0 ? seq_array[2].getRepeatResult().map((member) => member.getCustomData()) : [];
        if (!isOpeningParen) {
          throw {
            msg: "Expected '{' after `enum` keyword",
            span: {
              start: enumSpan.end,
              end: enumSpan.end + 1
            }
          };
        }
        if (!isClosingParen) {
          throw {
            msg: "Expected '}' after enum body",
            span: {
              start: ((_a = closingParenSpan == null ? void 0 : closingParenSpan.end) != null ? _a : variantsCount > 0) ? variants[variantsCount - 1].span.end : openingParenSpan == null ? void 0 : openingParenSpan.end,
              end: ((_b = closingParenSpan == null ? void 0 : closingParenSpan.end) != null ? _b : variantsCount > 0) ? variants[variantsCount - 1].span.end + 1 : openingParenSpan.end + 1
            }
          };
        }
        const result = AST3.TypeNode.asEnum(data.span, variants);
        return ParserLib3.Result.createAsCustom("passed", "enum-type", result, data.span);
      }
    }
  ),
  ParserLib3.createRule(
    "EnumVariant",
    ParserLib3.seq(
      // ident <CatchPoint>
      ParserLib3.rule("Ident"),
      // :
      ParserLib3.optional(ParserLib3.token(`:`)),
      // type
      ParserLib3.optional(ParserLib3.rule("Type"))
    ),
    {
      build: (data, parser) => {
        const seq_array = data.getSequenceResult();
        const ident = seq_array[0].getCustomData();
        const isColonSign = seq_array[1].isOptionalPassed();
        const isColonSignSpan = isColonSign ? seq_array[1].getOptionalResult().getTokenSpan() : void 0;
        const isType = seq_array[2].isOptionalPassed();
        const type = isType ? seq_array[2].getOptionalResult().getCustomData() : void 0;
        if (type && !isColonSign) {
          throw {
            msg: "Expected `:` before type",
            span: type.span
          };
        }
        if (!type && isColonSign) {
          throw {
            msg: "Expected type after `:`",
            span: isColonSignSpan
          };
        }
        const variantNode = AST3.EnumVariantNode.create(data.span, ident, type);
        return ParserLib3.Result.createAsCustom("passed", "enum-variant", variantNode, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib3.createRule(
    "FunctionType",
    ParserLib3.seq(
      // fn <CatchPoint>
      ParserLib3.token("fn"),
      // (
      ParserLib3.optional(ParserLib3.token("(")),
      // parameters
      ParserLib3.optional(
        ParserLib3.oneOrMore(
          ParserLib3.rule("Type"),
          ParserLib3.token(",")
        )
      ),
      // )
      ParserLib3.optional(ParserLib3.token(")")),
      // ->
      ParserLib3.optional(ParserLib3.token("->")),
      // error type
      ParserLib3.optional(ParserLib3.rule("Type")),
      // !
      ParserLib3.optional(ParserLib3.token("!")),
      // return type
      ParserLib3.optional(ParserLib3.rule("Type"))
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const isOpeningParen = seq_array[1].isOptionalPassed();
        const isParams = seq_array[2].isOptionalPassed();
        const isClosingParen = seq_array[3].isOptionalPassed();
        const isArrowSign = seq_array[4].isOptionalPassed();
        const isErrsetType = seq_array[5].isOptionalPassed();
        const isNotSign = seq_array[6].isOptionalPassed();
        const isReturnType = seq_array[7].isOptionalPassed();
        const fnSpan = seq_array[0].getTokenSpan();
        const openingParenSpan = isOpeningParen ? seq_array[1].span : void 0;
        const closingParenSpan = isClosingParen ? seq_array[3].span : void 0;
        const arrowSignSpan = isArrowSign ? seq_array[4].span : void 0;
        const notSignSpan = isNotSign ? seq_array[6].span : void 0;
        let parameters = [];
        let errorType = isErrsetType ? seq_array[5].getOptionalResult().getCustomData() : void 0;
        let returnType = isReturnType ? seq_array[7].getOptionalResult().getCustomData() : void 0;
        if (isParams) {
          const paramList = seq_array[2].getOptionalResult().getRepeatResult();
          parameters = paramList.map((r) => r.getCustomData());
        }
        if (errorType && !returnType && !isNotSign) {
          if (!errorType.isErrset() && !isNotSign) {
            returnType = errorType;
            errorType = void 0;
          }
        }
        let lastElemSpan = data.span;
        {
          if (returnType) {
            lastElemSpan = returnType.span;
          } else if (isNotSign) {
            lastElemSpan = notSignSpan;
          } else if (errorType) {
            lastElemSpan = errorType.span;
          } else if (isArrowSign) {
            lastElemSpan = arrowSignSpan;
          } else if (isClosingParen) {
            lastElemSpan = closingParenSpan;
          } else if (isParams && parameters.length) {
            lastElemSpan = parameters[parameters.length - 1].span;
          } else if (isOpeningParen) {
            lastElemSpan = openingParenSpan;
          } else {
            lastElemSpan = fnSpan;
          }
        }
        if (!isOpeningParen) {
          throw {
            msg: "Expected `(` after `fn` keyword for function type",
            span: fnSpan
          };
        }
        if (!isClosingParen) {
          throw {
            msg: isParams && parameters.length ? "Expected `)` after parameters" : "Expected parameters or `)` after `(`",
            span: isParams && parameters.length ? { start: openingParenSpan.start, end: parameters[parameters.length - 1].span.end } : openingParenSpan
          };
        }
        if (isArrowSign && !returnType) {
          throw {
            msg: "Expected return type after `->`",
            span: arrowSignSpan
          };
        }
        if (!isArrowSign && returnType) {
          throw {
            msg: "Expected `->` before return type",
            span: returnType.span
          };
        }
        if (errorType && !isNotSign) {
          throw {
            msg: "Expected `!` after error type",
            span: errorType.span
          };
        }
        if (!errorType && isNotSign) {
          throw {
            msg: "Expected error type before `!`",
            span: notSignSpan
          };
        }
        if (errorType && !errorType.isErrset() && !errorType.isErr() && !errorType.isIdent()) {
          throw {
            msg: "Error type must be error name or error set",
            span: errorType.span
          };
        }
        const result = AST3.TypeNode.asFunction(
          data.span,
          parameters,
          returnType,
          errorType
        );
        return ParserLib3.Result.createAsCustom("passed", "function-type", result, data.span);
      },
      errors: [
        ParserLib3.error(1, "Expected `fn` keyword")
      ]
    }
  ),
  // ════════════ ---- ════════════
  ParserLib3.createRule(
    "ErrsetType",
    ParserLib3.seq(
      // errset <CatchPoint>
      ParserLib3.token("errset"),
      // {
      ParserLib3.optional(ParserLib3.token("{")),
      // names
      ParserLib3.zeroOrMore(
        ParserLib3.rule("Ident"),
        ParserLib3.token(",")
      ),
      // }
      ParserLib3.optional(ParserLib3.token("}"))
    ),
    {
      build: (data) => {
        var _a, _b, _c, _d, _e;
        const seq_array = data.getSequenceResult();
        const isOpeningParen = seq_array[1].isOptionalPassed();
        const isClosingParen = seq_array[3].isOptionalPassed();
        const errorSpan = seq_array[0].getTokenSpan();
        const openingParenSpan = isOpeningParen ? seq_array[1].getOptionalResult().getTokenSpan() : null;
        const closingParenSpan = isClosingParen ? seq_array[3].getOptionalResult().getTokenSpan() : null;
        const membersCount = seq_array[2].getRepeatCount();
        const members = membersCount > 0 ? seq_array[2].getRepeatResult().map((member) => member.getCustomData()) : void 0;
        if (!isOpeningParen) {
          throw {
            msg: "Expected '{' after `errset` keyword",
            span: {
              start: errorSpan.end,
              end: errorSpan.end + 1
            }
          };
        }
        if (!membersCount) {
          throw {
            msg: "Expected members after `{`",
            span: {
              start: (_a = openingParenSpan == null ? void 0 : openingParenSpan.start) != null ? _a : errorSpan.start,
              end: (_c = (_b = closingParenSpan == null ? void 0 : closingParenSpan.end) != null ? _b : openingParenSpan == null ? void 0 : openingParenSpan.end) != null ? _c : errorSpan.end
            }
          };
        }
        if (!isClosingParen) {
          throw {
            msg: "Expected '}' after error set",
            span: {
              start: ((_d = closingParenSpan == null ? void 0 : closingParenSpan.end) != null ? _d : membersCount > 0) ? members[membersCount - 1].span.end : openingParenSpan == null ? void 0 : openingParenSpan.end,
              end: ((_e = closingParenSpan == null ? void 0 : closingParenSpan.end) != null ? _e : membersCount > 0) ? members[membersCount - 1].span.end + 1 : openingParenSpan.end + 1
            }
          };
        }
        const result = AST3.TypeNode.asErrset(data.span, members);
        return ParserLib3.Result.createAsCustom("passed", "error-type", result, data.span);
      }
    }
  ),
  // ════════════ ---- ════════════
  ParserLib3.createRule(
    "TupleType",
    ParserLib3.seq(
      ParserLib3.token("."),
      ParserLib3.token("{"),
      ParserLib3.zeroOrMore(
        ParserLib3.rule("Type"),
        ParserLib3.token(",")
      ),
      ParserLib3.token("}")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const repeat_items = seq_array[2].getRepeatResult();
        const types = [];
        for (const item of repeat_items) {
          types.push(item.getCustomData());
        }
        if (types.length === 1) {
          return ParserLib3.Result.createAsCustom("passed", "paren-type", types[0], data.span);
        }
        const result = AST3.TypeNode.asTuple(data.span, types);
        return ParserLib3.Result.createAsCustom("passed", "tuple-type", result, data.span);
      },
      errors: [
        ParserLib3.error(0, "Expected '.{' for tuple"),
        ParserLib3.error(2, "Expected '}' for tuple")
      ]
    }
  ),
  ParserLib3.createRule(
    "OptionalType",
    ParserLib3.seq(
      ParserLib3.token("?"),
      ParserLib3.rule("Type")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const targetType = seq_array[1].getCustomData();
        const result = AST3.TypeNode.asOptional(data.span, targetType);
        return ParserLib3.Result.createAsCustom("passed", "optional-type", result, data.span);
      },
      errors: [
        ParserLib3.error(0, "Expected '?' for optional type"),
        ParserLib3.error(1, "Expected target type for optional")
      ]
    }
  ),
  ParserLib3.createRule(
    "PointerType",
    ParserLib3.seq(
      ParserLib3.token("*"),
      ParserLib3.optional(ParserLib3.token("mut")),
      ParserLib3.rule("Type")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const mutable = seq_array[1].isOptionalPassed();
        const targetType = seq_array[2].getCustomData();
        const result = AST3.TypeNode.asPointer(data.span, targetType, mutable);
        return ParserLib3.Result.createAsCustom("passed", "pointer-type", result, data.span);
      },
      errors: [
        ParserLib3.error(0, "Expected '*' for pointer type"),
        ParserLib3.error(2, "Expected target type for pointer")
      ]
    }
  ),
  // ════════════ ---- ════════════
  ParserLib3.createRule(
    "PrimitiveType",
    ParserLib3.choice(
      // Basic types
      ParserLib3.token("type"),
      ParserLib3.token("void"),
      ParserLib3.token("bool"),
      ParserLib3.token("null_t"),
      ParserLib3.token("und_t"),
      // Signed
      ParserLib3.token("i_type"),
      ParserLib3.token("isize"),
      // Unsigned
      ParserLib3.token("u_type"),
      ParserLib3.token("usize"),
      // Float
      ParserLib3.token("f_type"),
      // ComptimeTypes
      ParserLib3.token("cint"),
      ParserLib3.token("cflt"),
      // Any
      ParserLib3.token("any"),
      ParserLib3.token("err")
    ),
    {
      build: (data) => {
        const selected = data.getChoiceResult();
        let type;
        if (selected.isToken()) {
          const token5 = selected.getTokenData();
          switch (token5.kind) {
            case "type":
              type = AST3.TypeNode.asType(token5.span);
              break;
            case "void":
              type = AST3.TypeNode.asVoid(token5.span);
              break;
            case "bool":
              type = AST3.TypeNode.asBool(token5.span);
              break;
            case "cint":
              type = AST3.TypeNode.asComptimeInt(token5.span, token5.value);
              break;
            case "cflt":
              type = AST3.TypeNode.asComptimeFloat(token5.span, token5.value);
              break;
            case "isize":
              type = AST3.TypeNode.asSigned(token5.span, token5.value, 64);
              break;
            case "i_type":
              type = AST3.TypeNode.asSigned(token5.span, token5.value, AST3.PrimitiveTypeNode.calcWidth("i", token5.value));
              break;
            case "u_type":
              type = AST3.TypeNode.asUnsigned(token5.span, token5.value, AST3.PrimitiveTypeNode.calcWidth("u", token5.value));
              break;
            case "usize":
              type = AST3.TypeNode.asUnsigned(token5.span, token5.value, 64);
              break;
            case "f_type":
              type = AST3.TypeNode.asFloat(token5.span, token5.value, AST3.PrimitiveTypeNode.calcWidth("f", token5.value));
              break;
            case "null_t":
              type = AST3.TypeNode.asNull(token5.span);
              break;
            case "und_t":
              type = AST3.TypeNode.asUndefined(token5.span);
              break;
            case "any":
              type = AST3.TypeNode.asAny(token5.span);
              break;
            case "err":
              type = AST3.TypeNode.asErr(token5.span);
              break;
            default:
              throw new Error(`Unknown primitive type: ${token5.kind}`);
          }
        } else {
          type = selected.getCustomData();
        }
        return ParserLib3.Result.createAsCustom("passed", "primitive-type", type, data.span);
      },
      errors: [
        ParserLib3.error(0, "Expected primitive type")
      ]
    }
  ),
  ParserLib3.createRule(
    "IdentifierType",
    ParserLib3.token("ident"),
    {
      build: (data) => {
        const token5 = data.getTokenData();
        const type = AST3.TypeNode.asIdentifier(token5.span, token5.value);
        return ParserLib3.Result.createAsCustom("passed", "identifier-type", type, data.span);
      },
      errors: [
        ParserLib3.error(0, "Expected type identifier")
      ]
    }
  ),
  ParserLib3.createRule(
    "ArrayType",
    ParserLib3.seq(
      ParserLib3.token("["),
      ParserLib3.optional(ParserLib3.rule("Expr")),
      ParserLib3.token("]"),
      ParserLib3.optional(ParserLib3.token("mut")),
      ParserLib3.rule("Type")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const size = seq_array[1].isOptionalPassed() ? seq_array[1].getOptionalResult().getCustomData() : void 0;
        const mutable = seq_array[3].isOptionalPassed();
        const elementType = seq_array[4].getCustomData();
        const result = AST3.TypeNode.asArray(data.span, elementType, size, mutable);
        return ParserLib3.Result.createAsCustom("passed", "array-type", result, data.span);
      },
      errors: [
        ParserLib3.error(0, "Expected '[' for array type"),
        ParserLib3.error(2, "Expected ']' for array type"),
        ParserLib3.error(4, "Expected element type for array")
      ]
    }
  ),
  ParserLib3.createRule(
    "ParenType",
    ParserLib3.seq(
      ParserLib3.token("("),
      ParserLib3.rule("Type"),
      ParserLib3.token(")")
    ),
    {
      build: (data) => {
        const seq_array = data.getSequenceResult();
        const parenType = AST3.ParenTypeNode.create(data.span, seq_array[1].getCustomData());
        return ParserLib3.Result.createAsCustom("passed", "paren-type", parenType, data.span);
      },
      errors: [
        ParserLib3.error(0, "Expected '(' for parenthesized type"),
        ParserLib3.error(2, "Expected ')' for parenthesized type")
      ]
    }
  )
  // ════════════ ---- ════════════
];

// src/conf/parser_rules.ts
var parserRules = [
  ParserLib4.createRule(
    "Root",
    ParserLib4.oneOrMore(ParserLib4.rule("Stmt")),
    {
      build: (data) => {
        const seq_array = data.getRepeatResult();
        const stmts = seq_array.map((x) => x.getCustomData());
        return ParserLib4.Result.createAsCustom("passed", "root", stmts, data.span);
      }
    }
  ),
  ParserLib4.createRule(
    "Ident",
    ParserLib4.token("ident"),
    {
      build: (data) => {
        const identResult = data.getTokenData();
        return ParserLib4.Result.createAsCustom(
          "passed",
          "ident",
          AST4.IdentNode.create(identResult.span, identResult.value, false),
          data.span
        );
      },
      errors: [ParserLib4.error(0, "Expected identifier")]
    }
  ),
  // Include required rules
  ...Type,
  ...Expr,
  ...Stmt
];
var parserSettings = {
  startRule: "Root",
  errorRecovery: { mode: "resilient", maxErrors: 99 },
  ignored: ["ws", "comment"],
  debug: "off",
  maxDepth: 9999,
  maxCacheSize: 1024
  // 1GB
};

// src/rules.ts
var KemetSyntax = syntax.create(
  {
    name: "Kemet",
    version: "0.0.1",
    lexer: lexerRules,
    parser: parserRules,
    lsp: lspConfig,
    settings: parserSettings
  }
);
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  KemetSyntax
});
//# sourceMappingURL=rules.js.map