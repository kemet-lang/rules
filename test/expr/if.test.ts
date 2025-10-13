// if.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    const cases = {

        IfExprMustSucceed: [
            // Simple if expression
            {
                name: 'Simple if expression',
                input: 'if true 42',
                success: true,
                output: AST.ExprNode.asIf(
                    { start: 0, end: 10 },
                    AST.ExprNode.asBool({ start: 3, end: 7 }, true),
                    AST.StmtNode.asExpr({ start: 8, end: 10 }, AST.ExprNode.asInteger({ start: 8, end: 10 }, 42)),
                    null
                )
            },

            // If with else
            {
                input: 'if (x > 0) { 1 } else { 55 }',
                success: true,
                output: AST.ExprNode.asIf(
                    { start: 0, end: 28 },
                    asParenBinary({ start: 3, end: 10 },
                        AST.ExprNode.asIdent({ start: 4, end: 5 }, 'x'),
                        '>',
                        AST.ExprNode.asInteger({ start: 8, end: 9 }, 0)
                    ),
                    AST.StmtNode.asBlock({ start: 11, end: 16 }, [
                        AST.StmtNode.asExpr({ start: 13, end: 14 }, AST.ExprNode.asInteger({ start: 13, end: 14 }, 1)),
                    ]),

                    AST.StmtNode.asBlock({ start: 22, end: 28 }, [
                        AST.StmtNode.asExpr({ start: 24, end: 26 }, AST.ExprNode.asInteger({ start: 24, end: 26 }, 55))
                    ])
                )
            },

            // Nested if expressions
            {
                input: 'if (a) { if (b) { 1 } else { 2 } } else { 3 }',
                success: true,
                output: AST.ExprNode.asIf(
                    { start: 0, end: 45 },
                    AST.ExprNode.asParen({ start: 3, end: 6 }, AST.ExprNode.asIdent({ start: 4, end: 5 }, 'a')),
                    AST.StmtNode.asBlock({ start: 7, end: 34 }, [
                        AST.StmtNode.asExpr(
                            { start: 9, end: 32 },
                            AST.ExprNode.asIf(
                                { start: 9, end: 32 },
                                AST.ExprNode.asParen({ start: 12, end: 15 }, AST.ExprNode.asIdent({ start: 13, end: 14 }, 'b')),
                                AST.StmtNode.asBlock({ start: 16, end: 21 }, [
                                    AST.StmtNode.asExpr({ start: 18, end: 19 }, AST.ExprNode.asInteger({ start: 18, end: 19 }, 1)),
                                ]),
                                AST.StmtNode.asBlock({ start: 27, end: 32 }, [
                                    AST.StmtNode.asExpr({ start: 29, end: 30 }, AST.ExprNode.asInteger({ start: 29, end: 30 }, 2)),
                                ])
                            )
                        )
                    ]),
                    AST.StmtNode.asBlock({ start: 40, end: 45 }, [
                        AST.StmtNode.asExpr({ start: 42, end: 43 }, AST.ExprNode.asInteger({ start: 42, end: 43 }, 3)),
                    ])
                )
            },

            // If with complex condition
            {
                input: 'if ((x > 0) and (y < 10)) { result }',
                success: true,
                output: AST.ExprNode.asIf(
                    { start: 0, end: 36 },
                    asParenBinary(
                        { start: 3, end: 25 },
                        asParenBinary(
                            { start: 4, end: 11 },
                            AST.ExprNode.asIdent({ start: 5, end: 6 }, 'x'),
                            '>',
                            AST.ExprNode.asInteger({ start: 9, end: 10 }, 0)
                        ),
                        'and',
                        asParenBinary(
                            { start: 16, end: 24 },
                            AST.ExprNode.asIdent({ start: 17, end: 18 }, 'y'),
                            '<',
                            AST.ExprNode.asInteger({ start: 21, end: 23 }, 10)
                        )
                    ),
                    AST.StmtNode.asBlock({ start: 26, end: 36 }, [
                        AST.StmtNode.asExpr({ start: 28, end: 34 }, AST.ExprNode.asIdent({ start: 28, end: 34 }, 'result'))
                    ]),
                    null
                )
            },
        ],

        IfExprMustFails: [
            // Missing expression
            {
                name: 'Missing expression',
                input: 'if',
                success: false,
                output: [{
                    msg: "Expected expression after `if` keyword",
                    span: { start: 0, end: 2 }
                }]
            },

            // Missing statement after expression
            {
                name: 'Missing statement after expression',
                input: 'if true',
                success: false,
                output: [{
                    msg: "Expected statement after expression",
                    span: { start: 3, end: 7 }
                }]
            },

            // Missing statement after else
            {
                name: 'Missing statement after else',
                input: 'if true 42 else',
                success: false,
                output: [{
                    msg: "Expected statement after `else` keyword",
                    span: { start: 11, end: 15 }
                }]
            },
        ]

    };

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝