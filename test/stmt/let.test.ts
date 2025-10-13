// let.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        LetStmtMustSucceed: [
            // Variable with type
            {
                name        : 'Variable with type',
                input       : 'let x: i32',
                success     : true,
                output      : AST.StmtNode.asLet(
                    { start: 0, end: 10 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    {
                        kind: 'Immutable',
                        span: undefined,
                    },
                    AST.IdentNode.create({ start: 4, end: 5 }, 'x'),
                    AST.TypeNode.asPrimitive({ start: 7, end: 10 }, 'signed', 'i32', 32),
                    undefined
                )
            },

            // Variable with initializer
            {
                name        : 'Variable with initializer',
                input       : 'let x = 42',
                success     : true,
                output      : AST.StmtNode.asLet(
                    { start: 0, end: 10 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    {
                        kind: 'Immutable',
                        span: undefined,
                    },
                    AST.IdentNode.create({ start: 4, end: 5 }, 'x'),
                    undefined,
                    AST.ExprNode.asInteger({ start: 8, end: 10 }, 42)
                )
            },

            // Variable with type and initializer
            {
                name        : 'Variable with type and initializer',
                input       : 'let x: i32 = 42',
                success     : true,
                output      : AST.StmtNode.asLet(
                    { start: 0, end: 15 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    {
                        kind: 'Immutable',
                        span: undefined,
                    },
                    AST.IdentNode.create({ start: 4, end: 5 }, 'x'),
                    AST.TypeNode.asPrimitive({ start: 7, end: 10 }, 'signed', 'i32', 32),
                    AST.ExprNode.asInteger({ start: 13, end: 15 }, 42)
                )
            },

            // Mutable variable
            {
                name        : 'Mutable variable',
                input       : 'let mut x = 42',
                success     : true,
                output      : AST.StmtNode.asLet(
                    { start: 0, end: 14 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    {
                        kind: 'Mutable',
                        span: { start: 4, end: 7 },
                    },
                    AST.IdentNode.create({ start: 8, end: 9 }, 'x'),
                    undefined,
                    AST.ExprNode.asInteger({ start: 12, end: 14 }, 42)
                )
            },

            // Public variable
            {
                name        : 'Public variable',
                input       : 'pub let x = 42',
                success     : true,
                output      : AST.StmtNode.asLet(
                    { start: 0, end: 14 },
                    {
                        kind: 'Public',
                        span: { start: 0, end: 3 },
                    },
                    { kind: 'Runtime', },
                    {
                        kind: 'Immutable',
                        span: undefined,
                    },
                    AST.IdentNode.create({ start: 8, end: 9 }, 'x'),
                    undefined,
                    AST.ExprNode.asInteger({ start: 12, end: 14 }, 42)
                )
            },

            // Public mutable variable with type
            {
                name        : 'Public mutable variable with type',
                input       : 'pub let mut x: i32 = 42',
                success     : true,
                output      : AST.StmtNode.asLet(
                    { start: 0, end: 23 },
                    {
                        kind: 'Public',
                        span: { start: 0, end: 3 },
                    },
                    { kind: 'Runtime', },
                    {
                        kind: 'Mutable',
                        span: { start: 8, end: 11 },
                    },
                    AST.IdentNode.create({ start: 12, end: 13 }, 'x'),
                    AST.TypeNode.asPrimitive({ start: 15, end: 18 }, 'signed', 'i32', 32),
                    AST.ExprNode.asInteger({ start: 21, end: 23 }, 42)
                )
            },

            // Variable with string initializer
            {
                name        : 'Variable with string initializer',
                input       : 'let name = "Ahmed"',
                success     : true,
                output      : AST.StmtNode.asLet(
                    { start: 0, end: 18 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    {
                        kind: 'Immutable',
                        span: undefined,
                    },
                    AST.IdentNode.create({ start: 4, end: 8 }, 'name'),
                    undefined,
                    AST.ExprNode.asString({ start: 11, end: 18 }, 'Ahmed')
                )
            },

            // Variable with boolean type and initializer
            {
                name        : 'Variable with boolean type and initializer',
                input       : 'let flag: bool = true',
                success     : true,
                output      : AST.StmtNode.asLet(
                    { start: 0, end: 21 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    { kind: 'Runtime', },
                    {
                        kind: 'Immutable',
                        span: undefined,
                    },
                    AST.IdentNode.create({ start: 4, end: 8 }, 'flag'),
                    AST.TypeNode.asPrimitive({ start: 10, end: 14 }, 'bool'),
                    AST.ExprNode.asBool({ start: 17, end: 21 }, true)
                )
            },
        ],

        LetStmtMustFails: [
            // Missing identifier
            {
                name        : 'Missing identifier',
                input       : 'let  ',
                success     : false,
                output      : [
                    {
                        span    : { start: 0, end: 3 },
                        msg     : "Expected identifier after `let` keyword",
                    },
                ],
            },

            // Missing identifier with mut
            {
                name        : 'Missing identifier with mut',
                input       : 'let mut  ',
                success     : false,
                output      : [
                    {
                        span    : { start: 4, end: 7 },
                        msg     : "Expected identifier after `mut` keyword",
                    },
                ],
            },

            // Type without colon
            {
                name        : 'Type without colon',
                input       : 'let   x   i32',
                success     : false,
                output      : [
                    {
                        span    : { start: 10, end: 13 },
                        msg     : "Expected `:` before type",
                    },
                ],
            },

            // Colon without type
            {
                name        : 'Colon without type',
                input       : 'let   x  :  ',
                success     : false,
                output      : [
                    {
                        span    : { start: 9, end: 10 },
                        msg     : "Expected type after `:`",
                    },
                ],
            },

            // Initializer without equal sign
            {
                name        : 'Initializer without equal sign',
                input       : 'let   x   42',
                success     : false,
                output      : [
                    {
                        span    : { start: 10, end: 12 },
                        msg     : "Expected `=` before initializer",
                    },
                ],
            },

            // Equal sign without initializer
            {
                name        : 'Equal sign without initializer',
                input       : 'let   x   = ',
                success     : false,
                output      : [
                    {
                        span    : { start: 10, end: 11 },
                        msg     : "Expected initializer after `=`",
                    },
                ],
            },

            // let with no type/init just like `let a`
            {
                name: 'let with no type/init just like `let a`',
                input: 'let a',
                success: false,
                output: [
                    {
                        span    : { start: 4, end: 5 },
                        msg     : "Expected type or initializer after variable name",
                    }
                ]
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Stmt', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝