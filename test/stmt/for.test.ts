// for.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {
        ForStmtMustSucceed: [
            // Simple for with range
            {
                input: 'for 1..10 { x }',
                success: true,
                output: AST.StmtNode.asFor(
                    { start: 0, end: 15 },
                    AST.ExprNode.asRange(
                        { start: 4, end: 9 },
                        AST.ExprNode.asInteger({ start: 4, end: 5 }, 1),
                        'exclusive',
                        AST.ExprNode.asInteger({ start: 7, end: 9 }, 10)
                    ),
                    AST.StmtNode.asBlock({ start: 10, end: 15 }, [
                        AST.StmtNode.asExpr({ start: 12, end: 13 }, AST.ExprNode.asIdent({ start: 12, end: 13 }, 'x', false))
                    ])
                )
            },

            // For with inclusive range
            {
                input: 'for 0..=5 { print(i) }',
                success: true,
                output: AST.StmtNode.asFor(
                    { start: 0, end: 22 },
                    AST.ExprNode.asRange(
                        { start: 4, end: 9 },
                        AST.ExprNode.asInteger({ start: 4, end: 5 }, 0),
                        'inclusive',
                        AST.ExprNode.asInteger({ start: 8, end: 9 }, 5)
                    ),
                    AST.StmtNode.asBlock({ start: 10, end: 22 }, [
                        AST.StmtNode.asExpr({ start: 12, end: 20 },
                            AST.ExprNode.asCall(
                                { start: 12, end: 20 },
                                AST.ExprNode.asIdent({ start: 12, end: 17 }, 'print', false),
                                [AST.ExprNode.asIdent({ start: 18, end: 19 }, 'i', false)]
                            )
                        )
                    ])
                )
            },

            // For with variable range
            {
                input: 'for start..end { work() }',
                success: true,
                output: AST.StmtNode.asFor(
                    { start: 0, end: 25 },
                    AST.ExprNode.asRange(
                        { start: 4, end: 14 },
                        AST.ExprNode.asIdent({ start: 4, end: 9 }, 'start', false),
                        'exclusive',
                        AST.ExprNode.asIdent({ start: 11, end: 14 }, 'end', false)
                    ),
                    AST.StmtNode.asBlock({ start: 15, end: 25 }, [
                        AST.StmtNode.asExpr({ start: 17, end: 23 },
                            AST.ExprNode.asCall(
                                { start: 17, end: 23 },
                                AST.ExprNode.asIdent({ start: 17, end: 21 }, 'work', false),
                                []
                            )
                        )
                    ])
                )
            },
        ],

        ForStmtMustFails: [
            // Missing expression
            {
                name        : 'Missing expression',
                input       : 'for',
                success     : false,
                output      : [
                    {
                        span    : { start: 0, end: 3 },
                        msg     : "Expected range expression after `for` keyword",
                    },
                ],
            },

            // Missing statement
            {
                name        : 'Missing statement',
                input       : 'for ((0..5))',
                success     : false,
                output      : [
                    {
                        span    : { start: 4, end: 12 },
                        msg     : "Expected statement after range expression",
                    },
                ],
            },

            // have stmt but missing expr
            {
                name        : 'Missing range expression',
                input       : 'for { x }',
                success     : false,
                output      : [
                    {
                        span    : { start: 0, end: 3 },
                        msg     : "Expected range expression after `for` keyword",
                    },
                ],
            },

            // Invalid expression type (not range)
            {
                name        : 'Invalid expression type',
                input       : 'for 1 { x }',
                success     : false,
                output      : [
                    {
                        span    : { start: 4, end: 5 },
                        msg     : "Expected range expression after `for` keyword",
                    },
                ],
            }
        ]
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Stmt', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝