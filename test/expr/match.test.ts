// match.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    const cases = {

        MatchExprMustSucceed: [
            // Simple match with one case
            {
                name: 'match expression with one case',
                input: 'match x { 1 => { "one" } }',
                success: true,
                output: AST.ExprNode.asMatch(
                    { start: 0, end: 26 },
                    AST.ExprNode.asIdent({ start: 6, end: 7 }, 'x'),
                    [
                        AST.CaseNode.create(
                            { start: 10, end: 24 },
                            AST.ExprNode.asInteger({ start: 10, end: 11 }, 1),
                            AST.StmtNode.asBlock({ start: 15, end: 24 }, [
                                AST.StmtNode.asExpr({ start: 17, end: 22 }, AST.ExprNode.asString({ start: 17, end: 22 }, 'one'))
                            ])
                        )
                    ],
                    null
                )
            },

            // Simple with default
            {
                name: 'match expression with default',
                input: 'match x { default => { "default" } }',
                success: true,
                output: AST.ExprNode.asMatch(
                    { start: 0, end: 36 },
                    AST.ExprNode.asIdent({ start: 6, end: 7 }, 'x'),
                    [],
                    AST.DefaultNode.create(
                        { start: 10, end: 34 },
                        AST.StmtNode.asBlock({ start: 21, end: 34 }, [
                            AST.StmtNode.asExpr({ start: 23, end: 32 }, AST.ExprNode.asString({ start: 23, end: 32 }, 'default'))
                        ]),
                        undefined
                    )
                )
            },

        ],

        MatchExprMustFails: [
            // Missing expression
            {
                name: 'Missing expression',
                input: 'match',
                success: false,
                output: [{
                    msg: "Expected expression after `match` keyword",
                    span: { start: 0, end: 5 }
                }]
            },

            // Missing open brace
            {
                name: 'Missing open brace',
                input: 'match x',
                success: false,
                output: [{
                    msg: "Expected `{` after match expression",
                    span: { start: 6, end: 7 }
                }]
            },

            // Missing cases
            {
                name: 'Missing cases',
                input: 'match x {}',
                success: false,
                output: [{
                    msg: "Expected match cases",
                    span: { start: 8, end: 9 } // TODO: start from `{` end with `}`
                }]
            },

            // Case missing arrow
            {
                name: 'Case missing arrow',
                input: 'match x { 1  { "one" } }',
                success: false,
                output: [{
                    msg: "Expected arrow after expression",
                    span: { start: 10, end: 11 }
                }]
            },

            // Case missing statement
            {
                name: 'Case missing statement',
                input: 'match x { 1 => }',
                success: false,
                output: [{
                    msg: "Expected statement after arrow",
                    span: { start: 12, end: 14 }
                }]
            },

            // Default missing arrow
            {
                name: 'Default missing arrow',
                input: 'match x { default { "one" } }',
                success: false,
                output: [{
                    msg: "Expected arrow after `default` keyword",
                    span: { start: 10, end: 17 }
                }]
            },

            // Default missing statement
            {
                name: 'Default missing statement',
                input: 'match x { default => }',
                success: false,
                output: [{
                    msg: "Expected statement after arrow",
                    span: { start: 18, end: 20 }
                }]
            },
        ]

    };

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝