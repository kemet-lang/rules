// try_catch.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        Try: [
            // Simple try expression
            {
                input: 'try foo()',
                success     : true,
                output: AST.ExprNode.asTry(
                    { start: 0, end: 9 },
                    AST.ExprNode.asCall(
                        { start: 4, end: 9 },
                        AST.ExprNode.asIdent({ start: 4, end: 7 }, 'foo', false),
                        []
                    )
                )
            },

            // Try with complex expression
            {
                input: 'try (x + y)',
                success     : true,
                output: AST.ExprNode.asTry(
                    { start: 0, end: 11 },
                    asParenBinary(
                        { start: 4, end: 11 },
                        AST.ExprNode.asIdent({ start: 5, end: 6 }, 'x', false),
                        '+',
                        AST.ExprNode.asIdent({ start: 9, end: 10 }, 'y', false)
                    )
                )
            },

            // Try with member access
            {
                input: 'try obj.method()',
                success     : true,
                output: AST.ExprNode.asTry(
                    { start: 0, end: 16 },
                    AST.ExprNode.asCall(
                        { start: 4, end: 16 },
                        AST.ExprNode.asMemberAccess(
                            { start: 4, end: 14 },
                            AST.ExprNode.asIdent({ start: 4, end: 7 }, 'obj', false),
                            AST.ExprNode.asIdent({ start: 8, end: 14 }, 'method', false),
                        ),
                        []
                    )
                )
            },
        ],

        Catch: [
            // Simple catch expression
            {
                input: 'x catch y',
                success     : true,
                output: AST.ExprNode.asCatch(
                    { start: 0, end: 9 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'x', false),
                    null,
                    AST.StmtNode.asExpr({ start: 8, end: 9 }, AST.ExprNode.asIdent({ start: 8, end: 9 }, 'y', false))
                )
            },
            {
                input: 'x() catch y',
                success     : true,
                output: AST.ExprNode.asCatch(
                    { start: 0, end: 11 },
                    AST.ExprNode.asCall(
                        { start: 0, end: 3 },
                        AST.ExprNode.asIdent({ start: 0, end: 1 }, 'x', false),
                        []
                    ),
                    null,
                    AST.StmtNode.asExpr({ start: 10, end: 11 }, AST.ExprNode.asIdent({ start: 10, end: 11 }, 'y', false))
                )
            },

            {
                input: 'x catch {y}',
                success     : true,
                output: AST.ExprNode.asCatch(
                    { start: 0, end: 11 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'x', false),
                    null,
                    AST.StmtNode.asBlock({ start: 8, end: 11 }, [
                        AST.StmtNode.asExpr({ start: 9, end: 10 }, AST.ExprNode.asIdent({ start: 9, end: 10 }, 'y', false))
                    ])
                )
            },
            {
                input: 'foo() catch { "error" }',
                success     : true,
                output: AST.ExprNode.asCatch(
                    { start: 0, end: 23 },
                    AST.ExprNode.asCall(
                        { start: 0, end: 5 },
                        AST.ExprNode.asIdent({ start: 0, end: 3 }, 'foo', false),
                        []
                    ),
                    null,
                    AST.StmtNode.asBlock({ start: 12, end: 23 }, [
                        AST.StmtNode.asExpr({ start: 14, end: 21 }, AST.ExprNode.asString({ start: 14, end: 21 }, "error"))
                        ]
                    )
                )
            },

            // Catch with tag
            {
                input: 'bar() catch (e) { handle(e) }',
                success     : true,
                output: AST.ExprNode.asCatch(
                    { start: 0, end: 29 },
                    AST.ExprNode.asCall(
                        { start: 0, end: 5 },
                        AST.ExprNode.asIdent({ start: 0, end: 3 }, 'bar', false),
                        []
                    ),
                    AST.ExprNode.asIdent({ start: 13, end: 14 }, 'e', false),
                    AST.StmtNode.asBlock({ start: 16, end: 29 }, [
                        AST.StmtNode.asExpr(
                            { start: 18, end: 27 },
                            AST.ExprNode.asCall(
                                { start: 18, end: 27 },
                                AST.ExprNode.asIdent({ start: 18, end: 24 }, 'handle', false),
                                [AST.ExprNode.asIdent({ start: 25, end: 26 }, 'e', false)]
                            )
                        )
                    ])
                )
            },

            // Catch with complex expression
            {
                input: '(x + y) catch { fallback }',
                success     : true,
                output: AST.ExprNode.asCatch(
                    { start: 0, end: 26 },
                    asParenBinary(
                        { start: 0, end: 7 },
                        AST.ExprNode.asIdent({ start: 1, end: 2 }, 'x', false),
                        '+',
                        AST.ExprNode.asIdent({ start: 5, end: 6 }, 'y', false)
                    ),
                    null,
                    AST.StmtNode.asBlock({ start: 14, end: 26 }, [
                        AST.StmtNode.asExpr(
                            { start: 16, end: 24 },
                            AST.ExprNode.asIdent({ start: 16, end: 24 }, 'fallback', false)
                        )
                    ])
                )
            },
        ],

        TryCatchCombined: [
            // Try-catch combination
            {
                input: 'try foo() catch { "failed" }',
                success     : true,
                output: AST.ExprNode.asTry(
                    { start: 0, end: 28 },
                    AST.ExprNode.asCatch(
                        { start: 4, end: 28 },
                        AST.ExprNode.asCall(
                            { start: 4, end: 9 },
                            AST.ExprNode.asIdent({ start: 4, end: 7 }, 'foo', false),
                            []
                        ),
                        null,
                        AST.StmtNode.asBlock({ start: 16, end: 28 }, [
                            AST.StmtNode.asExpr({ start: 18, end: 26 }, AST.ExprNode.asString({ start: 18, end: 26 }, "failed"))
                        ])
                    )
                )
            },

            // Try-catch with tag
            {
                input: 'try bar() catch (ERR) { log(ERR) }',
                success     : true,
                output: AST.ExprNode.asTry(
                    { start: 0, end: 34 },
                    AST.ExprNode.asCatch(
                        { start: 4, end: 34 },
                        AST.ExprNode.asCall(
                            { start: 4, end: 9 },
                            AST.ExprNode.asIdent({ start: 4, end: 7 }, 'bar', false),
                            []
                        ),
                        AST.ExprNode.asIdent({ start: 17, end: 20 }, 'ERR', false),
                        AST.StmtNode.asBlock({ start: 22, end: 34 }, [
                            AST.StmtNode.asExpr(
                                { start: 24, end: 32 },
                                AST.ExprNode.asCall(
                                    { start: 24, end: 32 },
                                    AST.ExprNode.asIdent({ start: 24, end: 27 }, 'log', false),
                                    [AST.ExprNode.asIdent({ start: 28, end: 31 }, 'ERR', false)]
                                )
                            )
                        ])
                    )
                )
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝