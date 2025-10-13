// def.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        DefStmtMustSucceed: [
            // Simple private define
            {
                input: 'def MyInt = i32',
                success: true,
                output: AST.StmtNode.asDefine(
                    { start: 0, end: 15 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    AST.IdentNode.create({ start: 4, end: 9 }, 'MyInt'),
                    AST.TypeNode.asPrimitive({ start: 12, end: 15 }, 'signed', 'i32', 32)
                )
            },

            // Public define
            {
                input: 'pub def MyString = str',
                success: true,
                output: AST.StmtNode.asDefine(
                    { start: 0, end: 22 },
                    {
                        kind: 'Public',
                        span: { start: 0, end: 3 },
                    },
                    AST.IdentNode.create({ start: 8, end: 16 }, 'MyString'),
                    AST.TypeNode.asIdentifier({ start: 19, end: 22 }, 'str')
                )
            },

            // Define with boolean type
            {
                input: 'def Flag = bool',
                success: true,
                output: AST.StmtNode.asDefine(
                    { start: 0, end: 15 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    AST.IdentNode.create({ start: 4, end: 8 }, 'Flag'),
                    AST.TypeNode.asPrimitive({ start: 11, end: 15 }, 'bool')
                )
            },

            // Define with void type
            {
                input: 'pub def Nothing = void',
                success: true,
                output: AST.StmtNode.asDefine(
                    { start: 0, end: 22 },
                    {
                        kind: 'Public',
                        span: { start: 0, end: 3 },
                    },
                    AST.IdentNode.create({ start: 8, end: 15 }, 'Nothing'),
                    AST.TypeNode.asPrimitive({ start: 18, end: 22 }, 'void')
                )
            },

            // Define with unsigned type
            {
                input: 'def Counter = u64',
                success: true,
                output: AST.StmtNode.asDefine(
                    { start: 0, end: 17 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    AST.IdentNode.create({ start: 4, end: 11 }, 'Counter'),
                    AST.TypeNode.asPrimitive({ start: 14, end: 17 }, 'unsigned', 'u64', 64)
                )
            },

            // Define with float type
            {
                input: 'pub def Precision = f64',
                success: true,
                output: AST.StmtNode.asDefine(
                    { start: 0, end: 23 },
                    {
                        kind: 'Public',
                        span: { start: 0, end: 3 },
                    },
                    AST.IdentNode.create({ start: 8, end: 17 }, 'Precision'),
                    AST.TypeNode.asPrimitive({ start: 20, end: 23 }, 'float', 'f64', 64)
                )
            },
        ],

        DefStmtMustFails: [
            // Missing identifier
            {
                name: 'Missing identifier',
                input: 'def = i32',
                success: false,
                output: [
                    {
                        span: { start: 0, end: 3 },
                        msg: "Expected identifier after `def` keyword",
                    },
                ],
            },

            // Missing equals sign
            {
                name: 'Missing equals sign',
                input: 'def MyType i32',
                success: false,
                output: [
                    {
                        span: { start: 10, end: 11 },
                        msg: "Expected `=` before type",
                    },
                ],
            },

            // Missing type
            {
                name: 'Missing type',
                input: 'def MyType =',
                success: false,
                output: [
                    {
                        span: { start: 11, end: 12 },
                        msg: "Expected type after `=`",
                    },
                ],
            },
        ]

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Stmt', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝