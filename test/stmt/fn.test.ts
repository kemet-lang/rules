// fn.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {
        FnStmtMustSucceed: [
            // Basic function
            {
                name: 'Basic function',
                input: 'fn main() {}',
                success: true,
                output: AST.StmtNode.asFunc(
                    { start: 0, end: 12 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    false,
                    AST.IdentNode.create({ start: 3, end: 7 }, 'main'),
                    [],
                    undefined,
                    undefined,
                    AST.StmtNode.asBlock({ start: 10, end: 12 }, [])
                )
            },

            // Function with parameters
            {
                name: 'Function with parameters',
                input: 'fn add(x: i32, y: i32) {}',
                success: true,
                output: AST.StmtNode.asFunc(
                    { start: 0, end: 25 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    false,
                    AST.IdentNode.create({ start: 3, end: 6 }, 'add'),
                    [
                        AST.FieldNode.create(
                            { start: 7, end: 14 },
                            {
                                kind: 'Private',
                                span: undefined,
                            },
                            { kind: 'Runtime', },
                            {
                                kind: 'Immutable',
                                span: undefined,
                            },
                            AST.IdentNode.create({ start: 7, end: 8 }, 'x'),
                            AST.TypeNode.asSigned({ start: 10, end: 13 }, 'i32', 32),
                            undefined
                        ),
                        AST.FieldNode.create(
                            { start: 15, end: 22 },
                            {
                                kind: 'Private',
                                span: undefined,
                            },
                            { kind: 'Runtime', },
                            {
                                kind: 'Immutable',
                                span: undefined,
                            },
                            AST.IdentNode.create({ start: 15, end: 16 }, 'y'),
                            AST.TypeNode.asSigned({ start: 18, end: 21 }, 'i32', 32),
                            undefined
                        )
                    ],
                    undefined,
                    undefined,
                    AST.StmtNode.asBlock({ start: 23, end: 25 }, [])
                )
            },

            // Public inline function with return type
            {
                name: 'Public inline function with return type',
                input: 'pub inline fn calc() -> f64 {}',
                success: true,
                output: AST.StmtNode.asFunc(
                    { start: 0, end: 30 },
                    {
                        kind: 'Public',
                        span: { start: 0, end: 3 },
                    },
                    { kind: 'Runtime', },
                    true,
                    AST.IdentNode.create({ start: 14, end: 18}, 'calc'),
                    [],
                    undefined,
                    AST.TypeNode.asFloat({ start: 24, end: 27 }, 'f64', 64),
                    AST.StmtNode.asBlock({ start: 28, end: 30 }, [])
                )
            },

            // Function with error type
            {
                name: 'Function with error type',
                input: 'fn process() -> IoError!void {}',
                success: true,
                output: AST.StmtNode.asFunc(
                    { start: 0, end: 31 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    false,
                    AST.IdentNode.create({ start: 3, end: 10 }, 'process'),
                    [],
                    AST.TypeNode.asIdentifier({ start: 16, end: 23 }, 'IoError'),
                    AST.TypeNode.asVoid({ start: 24, end: 28 }),
                    AST.StmtNode.asBlock({ start: 29, end: 31 }, [])
                )
            },

            // Function with mutable parameter and default value
            {
                name: 'Function with mutable parameter and default value',
                input: 'fn setup(mut config: Config = xxxxxxx) {}',
                success: true,
                output: AST.StmtNode.asFunc(
                    { start: 0, end: 41 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    false,
                    AST.IdentNode.create({ start: 3, end: 8 }, 'setup'),
                    [
                        AST.FieldNode.create(
                            { start: 9, end: 37 },
                            {
                                kind: 'Private',
                                span: undefined,
                            },
                            { kind: 'Runtime', },
                            {
                                kind: 'Mutable',
                                span: { start: 9, end: 12 },
                            },
                            AST.IdentNode.create({ start: 13, end: 19 }, 'config'),
                            AST.TypeNode.asIdentifier({ start: 21, end: 27 }, 'Config'),
                            AST.ExprNode.asIdent({ start: 30, end: 37 }, 'xxxxxxx')
                        )
                    ],
                    undefined,
                    undefined,
                    AST.StmtNode.asBlock({ start: 39, end: 41 }, [])
                )
            },

            // will never happend after this update.
            // ! without error type
            {
                name: '! without error type',
                input: 'fn main( ) -> !void {}',
                success: true,
                output: AST.StmtNode.asFunc(
                    { start: 0, end: 22 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    false,
                    AST.IdentNode.create({ start: 3, end: 7 }, 'main'),
                    [],
                    AST.TypeNode.asErr(),
                    AST.TypeNode.asVoid({ start: 15, end: 19 }),
                    AST.StmtNode.asBlock({ start: 20, end: 22 }, [])
                )
            },
        ],

        FnStmtMustFails: [
            // Missing function name
            {
                name        : 'Missing function name',
                input       : 'fn() {}',
                success     : false,
                output      : [
                    {
                        span    : { start: 0, end: 2 },
                        msg     : "Expected identifier after `fn` keyword",
                    },
                ],
            },

            // Missing parameter list parentheses
            {
                name: 'Missing parameter list parentheses',
                input: 'fn main {}',
                success: false,
                output      : [
                    {
                        span    : { start: 3, end: 7 },
                        msg     : "Expected `(` after function name",
                    },
                ],
            },

            // Unclosed empty parameter list
            {
                name: 'Unclosed empty parameter list',
                input: 'fn  main  ( ',
                success: false,
                output      : [
                    {
                        span    : { start: 10, end: 11 },
                        msg     : "Expected parameters or `)` after `(`",
                    },
                ],
            },

            // Unclosed parameter list
            {
                name: 'Unclosed parameter list',
                input: 'fn  main  ( a: i32, b = false  ',
                success: false,
                output      : [
                    {
                        span    : { start: 10, end: 29 },
                        msg     : "Expected `)` after parameters",
                    },
                ],
            },

            // Arrow without return type
            {
                name: 'Arrow without return type',
                input: 'fn  main ( )  ->   { }',
                success: false,
                output: [
                    {
                        span    : { start: 14, end: 16 },
                        msg     : "Expected return type after `->`",
                    }
                ]
            },

            // Return type without arrow
            {
                name: 'Return type without arrow',
                input: 'fn  main ( )  void  {}',
                success: false,
                output: [
                    {
                        span    : { start: 14, end: 18 },
                        msg     : "Expected `->` before return type",
                    }
                ]
            },

            // Error type without !
            {
                name: 'Error type without !',
                input: ' fn  main()   ->  Error   void  {} ',
                success: false,
                output: [
                    {
                        span    : { start: 18, end: 23 },
                        msg     : "Expected `!` after error type",
                    }
                ]
            },

            // Invalid Error Type
            {
                name: 'Invalid Error Type',
                input: 'fn  main() -> i32!void  {} ',
                success: false,
                output: [
                    {
                        span    : { start: 14, end: 17 },
                        msg     : "Error type must be error name or error set",
                    }
                ]
            },

            // Missing function body
            {
                name: 'Missing function body',
                input: 'fn  main ()  ',
                success: false,
                output: [
                    {
                        span    : { start: 11, end: 12 },
                        msg     : "Expected function body",
                    }
                ]
            },

            // Static param
            {
                name: 'Static keyword with params',
                input: 'fn main (static a: i32) {}',
                success: false,
                output: [
                    {
                        span    : { start: 9, end: 15 },
                        msg     : "`static` keyword is not allowed in this context",
                    }
                ]
            },

            // Public param
            {
                name: 'Pub keyword with params',
                input: 'fn main (pub a: i32) {}',
                success: false,
                output: [
                    {
                        span    : { start: 9, end: 12 },
                        msg     : "`pub` keyword is not allowed in this context",
                    }
                ]
            },

            // Param with no type/init just like (a)
            {
                name: 'Param with no type/init just like (a)',
                input: 'fn main (a) {}',
                success: false,
                output: [
                    {
                        span    : { start: 9, end: 10 },
                        msg     : "Expected type or initializer after parameter name",
                    }
                ]
            },
        ]
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Stmt', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝