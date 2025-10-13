// while.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {
        WhileStmtMustSucceed: [
            // Simple while with boolean
            {
                input: 'while true { x }',
                success: true,
                output: AST.StmtNode.asWhile(
                    { start: 0, end: 16 },
                    AST.ExprNode.asBool({ start: 6, end: 10 }, true),
                    AST.StmtNode.asBlock({ start: 11, end: 16 }, [
                        AST.StmtNode.asExpr({ start: 13, end: 14 }, AST.ExprNode.asIdent({ start: 13, end: 14 }, 'x', false))
                    ])
                )
            },

            // While with condition expression
            {
                input: 'while (x < 10) { x = (x + 1) }',
                success: true,
                output: AST.StmtNode.asWhile(
                    { start: 0, end: 30 },
                    asParenBinary(
                        { start: 6, end: 14 },
                        AST.ExprNode.asIdent({ start: 7, end: 8 }, 'x', false),
                        '<',
                        AST.ExprNode.asInteger({ start: 11, end: 13 }, 10)
                    ),
                    AST.StmtNode.asBlock({ start: 15, end: 30 }, [
                        AST.StmtNode.asExpr({ start: 17, end: 28 },
                            AST.ExprNode.asBinary(
                                { start: 17, end: 28 },
                                AST.ExprNode.asIdent({ start: 17, end: 18 }, 'x', false),
                                '=',
                                asParenBinary(
                                    { start: 21, end: 28 },
                                    AST.ExprNode.asIdent({ start: 22, end: 23 }, 'x', false),
                                    '+',
                                    AST.ExprNode.asInteger({ start: 26, end: 27 }, 1)
                                )
                            )
                        )
                    ])
                )
            },

            // While with identifier condition
            {
                input: 'while running { process() }',
                success: true,
                output: AST.StmtNode.asWhile(
                    { start: 0, end: 27 },
                    AST.ExprNode.asIdent({ start: 6, end: 13 }, 'running', false),
                    AST.StmtNode.asBlock({ start: 14, end: 27 }, [
                        AST.StmtNode.asExpr({ start: 16, end: 25 },
                            AST.ExprNode.asCall(
                                { start: 16, end: 25 },
                                AST.ExprNode.asIdent({ start: 16, end: 23 }, 'process', false),
                                []
                            )
                        )
                    ])
                )
            },
        ],

        WhileStmtMustFails: [
            // Missing expression
            {
                name        : 'Missing expression',
                input       : 'while',
                success     : false,
                output      : [
                    {
                        span    : { start: 0, end: 5 },
                        msg     : "Expected expression after `while` keyword",
                    },
                ],
            },

            // Missing statement
            {
                name        : 'Missing statement',
                input       : 'while true',
                success     : false,
                output      : [
                    {
                        span    : { start: 6, end: 10 },
                        msg     : "Expected statement after expression",
                    },
                ],
            },

            // have stmt but missing expr
            {
                name        : 'Missing expression',
                input       : 'while { x }',
                success     : false,
                output      : [
                    {
                        span    : { start: 0, end: 5 },
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