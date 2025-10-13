// switch.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    const cases = {

        SwitchExprMustSucceed: [
            // Simple switch with one case
            {
                name: 'switch expression with one case',
                input: 'switch x { case 1: { "one" } }',
                success: true,
                output: AST.ExprNode.asSwitch(
                    { start: 0, end: 30 },
                    AST.ExprNode.asIdent({ start: 7, end: 8 }, 'x'),
                    [
                        AST.CaseNode.create(
                            { start: 11, end: 28 },
                            AST.ExprNode.asInteger({ start: 16, end: 17 }, 1),
                            AST.StmtNode.asBlock({ start: 19, end: 28 }, [
                                AST.StmtNode.asExpr({ start: 21, end: 26 }, AST.ExprNode.asString({ start: 21, end: 26 }, 'one'))
                            ])
                        )
                    ],
                    null
                )
            },

            // Simple with default
            {
                name: 'switch expression with default',
                input: 'switch x { default: { "default" } }',
                success: true,
                output: AST.ExprNode.asSwitch(
                    { start: 0, end: 35 },
                    AST.ExprNode.asIdent({ start: 7, end: 8 }, 'x'),
                    [],
                    AST.DefaultNode.create(
                        { start: 11, end: 33 },
                        AST.StmtNode.asBlock({ start: 20, end: 33 }, [
                            AST.StmtNode.asExpr({ start: 22, end: 31 }, AST.ExprNode.asString({ start: 22, end: 31 }, 'default'))
                        ]),
                        undefined
                    )
                )
            },

        ],

        SwitchExprMustFails: [
            // Missing expression
            {
                name: 'Missing expression',
                input: 'switch',
                success: false,
                output: [{
                    msg: "Expected expression after `switch` keyword",
                    span: { start: 0, end: 6 }
                }]
            },

            // Missing open brace
            {
                name: 'Missing open brace',
                input: 'switch x',
                success: false,
                output: [{
                    msg: "Expected `{` after switch expression",
                    span: { start: 7, end: 8 }
                }]
            },

            // Missing cases
            {
                name: 'Missing cases',
                input: 'switch x {}',
                success: false,
                output: [{
                    msg: "Expected switch cases",
                    span: { start: 9, end: 10 } // TODO: start from `{` end with `}`
                }]
            },

            // Case missing expression
            {
                name: 'Case missing expression',
                input: 'switch x { case: { "one" } }',
                success: false,
                output: [{
                    msg: "Expected expression after `case` keyword",
                    span: { start: 11, end: 15 }
                }]
            },

            // Case missing colon
            {
                name: 'Case missing colon',
                input: 'switch x { case 1 { "one" } }',
                success: false,
                output: [{
                    msg: "Expected colon after expression",
                    span: { start: 16, end: 17 }
                }]
            },

            // Case missing statement
            {
                name: 'Case missing statement',
                input: 'switch x { case 1: }',
                success: false,
                output: [{
                    msg: "Expected statement after colon",
                    span: { start: 17, end: 18 }
                }]
            },

            // Default missing colon
            {
                name: 'Default missing colon',
                input: 'switch x { default { "one" } }',
                success: false,
                output: [{
                    msg: "Expected colon after `default` keyword",
                    span: { start: 11, end: 18 }
                }]
            },

            // Default missing statement
            {
                name: 'Default missing statement',
                input: 'switch x { default: }',
                success: false,
                output: [{
                    msg: "Expected statement after colon",
                    span: { start: 18, end: 19 }
                }]
            },
        ]

    };

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝