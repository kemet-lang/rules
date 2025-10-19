// fn.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST  from '@je-es/ast';
    import { testParser }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    const cases = {

        FnTypeMustSucceed: [
            // simple
            {
                name: 'simple fn type',
                input: 'fn()',
                success: true,
                output: AST.TypeNode.asFunction({ start: 0, end: 4 }, [], undefined, undefined),
            },

            // with return type
            {
                name: 'fn type with return type',
                input: 'fn() -> i32',
                success: true,
                output: AST.TypeNode.asFunction({ start: 0, end: 11 }, [], AST.TypeNode.asSigned({ start: 8, end: 11 }, 'i32', 32), undefined),
            },

            // with params
            {
                name: 'fn type with params',
                input: 'fn(i32, String)',
                success: true,
                output: AST.TypeNode.asFunction({ start: 0, end: 15 }, [
                    AST.TypeNode.asSigned({ start: 3, end: 6 }, 'i32', 32),
                    AST.TypeNode.asIdentifier({ start: 8, end: 14 }, 'String')
                ], undefined, undefined),
            },

            // with error type
            {
                name: 'fn type with error type',
                input: 'fn() -> Error!i32',
                success: true,
                output: AST.TypeNode.asFunction({ start: 0, end: 17 }, [],
                    AST.TypeNode.asSigned({ start: 14, end: 17 }, 'i32', 32),
                    AST.TypeNode.asIdentifier({ start: 8, end: 13 }, 'Error')
                ),
            },

            // AFTER UPDATE: should be default error type
            // ! without error type
            {
                name: '! without error type',
                input: 'fn() -> !void',
                success: true,
                output: AST.TypeNode.asFunction({ start: 0, end: 13 }, [],
                    AST.TypeNode.asVoid({ start: 9, end: 13 }),
                    AST.TypeNode.asErr()
                ),
            },
        ],

        FnTypeMustFails: [
            // Missing opening parenthesis
            {
                name: 'Missing opening parenthesis',
                input: 'fn',
                success: false,
                output: [{
                    msg: "Expected `(` after `fn` keyword for function type",
                    span: { start: 0, end: 2 }
                }]
            },

            // Missing closing parenthesis
            {
                name: 'Missing closing parenthesis',
                input: 'fn(',
                success: false,
                output: [{
                    msg: "Expected parameters or `)` after `(`",
                    span: { start: 2, end: 3 }
                }]
            },

            // Unclosed parameter list
            {
                name: 'Unclosed parameter list',
                input: 'fn(i32, String',
                success: false,
                output: [{
                    msg: "Expected `)` after parameters",
                    span: { start: 2, end: 14 }
                }]
            },

            // Arrow without return type
            {
                name: 'Arrow without return type',
                input: 'fn() ->',
                success: false,
                output: [{
                    msg: "Expected return type after `->`",
                    span: { start: 5, end: 7 }
                }]
            },

            // Return type without arrow
            {
                name: 'Return type without arrow',
                input: 'fn() void',
                success: false,
                output: [{
                    msg: "Expected `->` before return type",
                    span: { start: 5, end: 9 }
                }]
            },

            // Error type without !
            {
                name: 'Error type without !',
                input: 'fn() -> Error void',
                success: false,
                output: [{
                    msg: "Expected `!` after error type",
                    span: { start: 8, end: 13 }
                }]
            },

            // Invalid error type (using primitive type)
            {
                name: 'Invalid error type',
                input: 'fn() -> i32!void',
                success: false,
                output: [{
                    msg: "Error type must be error name or error set",
                    span: { start: 8, end: 11 }
                }]
            }
        ]
    };

    testParser('Type', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝