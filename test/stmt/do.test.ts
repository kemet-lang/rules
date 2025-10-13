// do.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {
        DoStmtMustSucceed: [
            // Simple do with boolean
            {
                input: 'do { x } while true',
                success: true,
                output: AST.StmtNode.asDo(
                    { start: 0, end: 19 },
                    AST.ExprNode.asBool({ start: 15, end: 19 }, true),
                    AST.StmtNode.asBlock({ start: 3, end: 8 }, [
                        AST.StmtNode.asExpr({ start: 5, end: 6 }, AST.ExprNode.asIdent({ start: 5, end: 6 }, 'x', false))
                    ])
                )
            },
        ],

        DoStmtMustFails: [
            // Missing statement
            {
                name        : 'Missing statement',
                input       : 'do',
                success     : false,
                output      : [
                    {
                        span    : { start: 0, end: 2 },
                        msg     : "Expected statement after `do` keyword",
                    },
                ],
            },

            // Missing while
            {
                name        : 'Missing expression',
                input       : 'do { x }',
                success     : false,
                output      : [
                    {
                        span    : { start: 3, end: 8 },
                        msg     : "Expected `while` keyword after statement",
                    },
                ],
            },

            // Missing expression
            {
                name        : 'Missing while keyword',
                input       : 'do { x } while',
                success     : false,
                output      : [
                    {
                        span    : { start: 9, end: 14 },
                        msg     : "Expected expression after `while` keyword",
                    },
                ],
            },
        ]
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Stmt', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝