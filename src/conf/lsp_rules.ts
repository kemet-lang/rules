// lsp_rules.ts — LSP configuration for Kemet language
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import type { LSPConfig, KeywordDoc } from '@je-es/syntax';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    export const lspConfig: LSPConfig = {
        // ═══ Keywords ═══
        keywords: {
            declarations: [
                'let', 'fn', 'def', 'use', 'pub', 'test'
            ],

            types: [
                // Signed integers
                'i8', 'i16', 'i32', 'i64', 'i128', 'i256', 'isize',
                // Unsigned integers
                'u8', 'u16', 'u32', 'u64', 'u128', 'u256', 'usize',
                // Floating point
                'f16', 'f32', 'f64', 'f80', 'f128',
                // C interop
                'cint', 'cflt',
                // Basic types
                'bool', 'void', 'type', 'any', 'err',
                // Type constructors
                'struct', 'enum', 'errset',
                // Special types
                'null_t', 'und_t',
                // Type aliases
                'char', 'cpoint'
            ],

            controlFlow: [
                'if', 'else', 'switch', 'case', 'default',
                'for', 'while', 'do',
                'break', 'continue', 'return', 'defer', 'throw'
            ],

            modifiers: [
                'mut', 'pub', 'static', 'inline', 'comptime'
            ],

            operators: [
                'as', 'typeof', 'sizeof', 'try', 'catch',
                'and', 'or', 'new', 'from'
            ],

            literals: [
                'true', 'false', 'null', 'und'
            ],

            builtins: [
                '@print', '@i', '@assert', 'self', 'selferr'
            ]
        },

        // ═══ Keyword Documentation ═══
        keywordDocs: {
            // Declarations
            'let': {
                signature: '[pub|static] [comptime] let [mut] name[: type] [= value]',
                description: 'Declare a variable with optional type annotation and initializer. Variables are immutable by default unless marked with `mut`.',
                example: 'let mut counter: i32 = 0;\nlet name = "Alice"; // type inferred'
            },

            'fn': {
                signature: '[pub|static] [comptime] [inline] fn name(params) [-> [ErrorType!]ReturnType] body',
                description: 'Declare a function. Functions can have error types, return types, or both. If no return type specified, defaults to void.',
                example: 'pub fn divide(a: i32, b: i32) -> err!i32 {\n  if (b == 0) { throw err; }\n  return a / b;\n}'
            },

            'def': {
                signature: '[pub|static] def Name = type',
                description: 'Define a type alias or named type',
                example: 'pub def Point = struct { x: i32; y: i32 };\ndef MyInt = i32;'
            },

            'use': {
                signature: 'use target [as alias] from "path" | use * as alias from "path"',
                description: 'Import symbols from another module. Can import specific symbols, or use wildcard (*) to import all public symbols with an alias.',
                example: 'use Point from "./types.k";\nuse * as utils from "./utils.k";\nutils.print("hello");'
            },

            'pub': {
                signature: 'pub',
                description: 'Make a declaration public (exported from module)',
                example: 'pub let API_KEY = "...";\npub fn process() {}'
            },

            'static': {
                signature: 'static',
                description: 'Declare a static member (available on type, not instance). Static methods can only access other static members.',
                example: 'def Point = struct {\n  static count: i32 = 0;\n  static fn getCount() -> i32 { return self.count; }\n}'
            },

            'test': {
                signature: 'test ["name"] { }',
                description: 'Define a test block with optional name',
                example: 'test "addition works" {\n  @assert(1 + 1 == 2);\n}'
            },

            // Type keywords
            'struct': {
                signature: 'struct { fields..., methods... }',
                description: 'Define a structure type with fields and optional methods. Fields can have default values.',
                example: 'struct {\n  pub x: i32 = 0;\n  pub y: i32 = 0;\n  pub fn distance(self) -> f32 { ... }\n}'
            },

            'enum': {
                signature: 'enum { Variant1[:Type1], Variant2, ... }',
                description: 'Define an enumeration type with optional associated types for each variant',
                example: 'enum { Some: i32, None }\nenum { Red, Green, Blue }'
            },

            'errset': {
                signature: 'errset { Error1, Error2, ... }',
                description: 'Define an error set type containing named error variants',
                example: 'errset { FileNotFound, AccessDenied, InvalidInput }'
            },

            // Primitive types - Integer types
            'i8': {
                signature: 'i8',
                description: 'Signed 8-bit integer (-128 to 127)'
            },

            'i16': {
                signature: 'i16',
                description: 'Signed 16-bit integer (-32,768 to 32,767)'
            },

            'i32': {
                signature: 'i32',
                description: 'Signed 32-bit integer (-2,147,483,648 to 2,147,483,647)'
            },

            'i64': {
                signature: 'i64',
                description: 'Signed 64-bit integer'
            },

            'i128': {
                signature: 'i128',
                description: 'Signed 128-bit integer'
            },

            'i256': {
                signature: 'i256',
                description: 'Signed 256-bit integer'
            },

            'isize': {
                signature: 'isize',
                description: 'Signed pointer-sized integer (platform dependent, typically 64-bit)'
            },

            'u8': {
                signature: 'u8',
                description: 'Unsigned 8-bit integer (0 to 255)'
            },

            'u16': {
                signature: 'u16',
                description: 'Unsigned 16-bit integer (0 to 65,535)'
            },

            'u32': {
                signature: 'u32',
                description: 'Unsigned 32-bit integer (0 to 4,294,967,295)'
            },

            'u64': {
                signature: 'u64',
                description: 'Unsigned 64-bit integer'
            },

            'u128': {
                signature: 'u128',
                description: 'Unsigned 128-bit integer'
            },

            'u256': {
                signature: 'u256',
                description: 'Unsigned 256-bit integer'
            },

            'usize': {
                signature: 'usize',
                description: 'Unsigned pointer-sized integer (platform dependent, typically 64-bit)'
            },

            // Floating point types
            'f16': {
                signature: 'f16',
                description: 'Half-precision 16-bit floating point'
            },

            'f32': {
                signature: 'f32',
                description: 'Single-precision 32-bit floating point'
            },

            'f64': {
                signature: 'f64',
                description: 'Double-precision 64-bit floating point'
            },

            'f80': {
                signature: 'f80',
                description: 'Extended-precision 80-bit floating point'
            },

            'f128': {
                signature: 'f128',
                description: 'Quadruple-precision 128-bit floating point'
            },

            // C interop types
            'cint': {
                signature: 'cint',
                description: 'Compile-time integer type (for compile-time computation and FFI compatibility)'
            },

            'cflt': {
                signature: 'cflt',
                description: 'Compile-time float type (for compile-time computation and FFI compatibility)'
            },

            // Other primitive types
            'bool': {
                signature: 'bool',
                description: 'Boolean type (true or false)'
            },

            'void': {
                signature: 'void',
                description: 'Void type (represents no value)'
            },

            'type': {
                signature: 'type',
                description: 'Type of types (metatype)'
            },

            'any': {
                signature: 'any',
                description: 'Any type (accepts any value, runtime type checking)'
            },

            'err': {
                signature: 'err',
                description: 'Generic error type. Can be used as error union type (err!) or variable type to hold any error.'
            },

            'null_t': {
                signature: 'null_t',
                description: 'Type of null value'
            },

            'und_t': {
                signature: 'und_t',
                description: 'Type of undefined value'
            },

            // Type Aliases
            'char': {
                signature: 'char (u8)',
                description: 'ASCII character type (alias for u8). Character literals with ASCII values infer to this type.'
            },

            'cpoint': {
                signature: 'cpoint (u21)',
                description: 'Unicode code point type (alias for u21). Character literals with non-ASCII values infer to this type.'
            },

            // Control flow
            'if': {
                signature: 'if condition stmt [else stmt]',
                description: 'Conditional expression/statement. Condition must be a boolean expression.',
                example: 'if (x > 0) {\n  @print("positive");\n} else {\n  @print("non-positive");\n}'
            },

            'else': {
                signature: 'else',
                description: 'Alternative branch for if statement'
            },

            'switch': {
                signature: 'switch expr { case value: stmt ... [default: stmt] }',
                description: 'Switch statement for pattern matching. Must be exhaustive for enum types or include default case.',
                example: 'switch (value) {\n  case 1: { @print("one"); }\n  case 2: { @print("two"); }\n  default: { @print("other"); }\n}'
            },

            'case': {
                signature: 'case value: stmt',
                description: 'Case branch in switch statement',
                example: 'case 42: { @print("found"); }'
            },

            'default': {
                signature: 'default: stmt',
                description: 'Default case in switch statement (fallback when no other case matches)'
            },

            'while': {
                signature: 'while condition stmt',
                description: 'Loop while condition is true',
                example: 'while (i < 10) {\n  i = i + 1;\n}'
            },

            'for': {
                signature: 'for range stmt',
                description: 'Iterate over a range. Use @i to access current iteration index.',
                example: 'for (0..10) {\n  @print(@i);\n}'
            },

            'do': {
                signature: 'do stmt while condition',
                description: 'Do-while loop (executes at least once)',
                example: 'do {\n  @print("hello");\n} while (false);'
            },

            'return': {
                signature: 'return [expr]',
                description: 'Return from a function with optional value',
                example: 'return x + y;'
            },

            'defer': {
                signature: 'defer expr',
                description: 'Defer expression execution until scope exit (LIFO order)',
                example: 'defer file.close();'
            },

            'throw': {
                signature: 'throw error',
                description: 'Throw an error. Function must have an error union return type. Error must match function error type.',
                example: 'fn process() -> MyError!void {\n  throw MyError.Failed;\n}'
            },

            'break': {
                signature: 'break',
                description: 'Break out of a loop'
            },

            'continue': {
                signature: 'continue',
                description: 'Continue to next loop iteration'
            },

            // Modifiers
            'mut': {
                signature: 'mut',
                description: 'Make a variable, parameter, or reference mutable. Variables are immutable by default.',
                example: 'let mut counter = 0;\ncounter = counter + 1;'
            },

            'inline': {
                signature: 'inline',
                description: 'Hint to inline function calls',
                example: 'inline fn add(a: i32, b: i32) -> i32 { return a + b; }'
            },

            'comptime': {
                signature: 'comptime',
                description: 'Evaluate at compile time',
                example: 'comptime let SIZE = 100;'
            },

            // Operators
            'as': {
                signature: 'expr as type',
                description: 'Type cast operator (explicit type conversion). Also used with single-argument type constructors like i32(value).',
                example: 'let x = 42 as f32;\nlet y = i32(3.14);'
            },

            'typeof': {
                signature: 'typeof expr',
                description: 'Get the type of an expression (returns a type value)',
                example: 'let T = typeof x;\nlet arr: [sizeof i32]T;'
            },

            'sizeof': {
                signature: 'sizeof type',
                description: 'Get the size of a type in bytes (compile-time constant)',
                example: 'let size = sizeof i32; // 4\nlet arr: [sizeof i64]u8;'
            },

            'try': {
                signature: 'try expr',
                description: 'Try an expression that may error. If error occurs, propagates it to caller (caller must have compatible error type).',
                example: 'let result = try riskyOperation();'
            },

            'catch': {
                signature: 'expr catch [(tag)] stmt',
                description: 'Handle errors from expression. Optional tag captures the error value.',
                example: 'let x = operation() catch { return 0; };\nlet y = operation() catch (e) { @print(e); return -1; };'
            },

            'and': {
                signature: 'expr and expr',
                description: 'Logical AND operator (short-circuiting). Both operands must be boolean.',
                example: 'if (x > 0 and x < 10) { ... }'
            },

            'or': {
                signature: 'expr or expr',
                description: 'Logical OR operator (short-circuiting). Both operands must be boolean.',
                example: 'if (x == 0 or x == 1) { ... }'
            },

            'new': {
                signature: 'new Type { fields... }',
                description: 'Allocate and initialize a struct. Can be used with or without explicit type name in context.',
                example: 'let ptr = new Point { x: 10, y: 20 };\nlet p: Point = { x: 5, y: 5 };'
            },

            'from': {
                signature: 'from',
                description: 'Specify module path in use statement',
                example: 'use MyType from "./types.k";\nuse * as utils from "./utils.k";'
            },

            // Literals
            'true': {
                signature: 'true',
                description: 'Boolean true value'
            },

            'false': {
                signature: 'false',
                description: 'Boolean false value'
            },

            'null': {
                signature: 'null',
                description: 'Null value (absence of value). Can be assigned to optional types and pointers.'
            },

            'und': {
                signature: 'und',
                description: 'Undefined value (uninitialized). Can be assigned to optional types.'
            }
        },

        // ═══ Builtin Documentation ═══
        builtinDocs: {
            '@print': 
                '```kemet\nfn @print(text: any) -> void\n```\n\n' +
                'Built-in function to print text to standard output.\n\n' +
                '**Example:**\n```kemet\n@print("Hello, World!");\n@print(42);\n```',

            '@i':
                '```kemet\n@i: usize\n```\n\n' +
                'Loop iteration index (available in `for` loops).\n\n' +
                '**Example:**\n```kemet\nfor (0..10) {\n  @print(@i); // prints 0, 1, 2, ..., 9\n}\n```',

            '@assert':
                '```kemet\nfn @assert(condition: bool) -> void\n```\n\n' +
                'Built-in assertion function for testing. Panics if condition is false.\n\n' +
                '**Example:**\n```kemet\ntest "math" {\n  @assert(1 + 1 == 2);\n  @assert(5 * 5 == 25);\n}\n```',

            'self':
                '```kemet\nself\n```\n\n' +
                'Reference to the current instance (available in struct methods). Static methods can only use `self` to access static members.\n\n' +
                '**Example:**\n```kemet\nstruct {\n  x: i32;\n  y: i32;\n  \n  fn distance(self) -> f32 {\n    return sqrt(self.x * self.x + self.y * self.y);\n  }\n  \n  static count: i32 = 0;\n  static fn getCount() -> i32 {\n    return self.count; // OK: accessing static member\n  }\n}\n```',

            'selferr':
                '```kemet\nselferr\n```\n\n' +
                'Reference to the function\'s self-group error set. Only available in functions with inline error set syntax (errset{...}!).\n\n' +
                '**Example:**\n```kemet\nfn process() -> errset{IOError, ParseError}!void {\n  if (failed) {\n    throw selferr.IOError;\n  }\n}\n```'
        },

        // ═══ LSP Settings ═══
        triggerCharacters: ['.', ':', '@', ' ', '(', '{'],
        fileExtension: '.k'
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝