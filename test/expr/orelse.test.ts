// orelse.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        OrelseExprMustSucceed: [
            // Simple null coalescing
            {
                input: 'x ?? y',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 6 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'x', false),
                    AST.ExprNode.asIdent({ start: 5, end: 6 }, 'y', false)
                )
            },

            // Null coalescing with literals
            {
                input: 'null ?? 42',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 10 },
                    AST.ExprNode.asNull({ start: 0, end: 4 }),
                    AST.ExprNode.asInteger({ start: 8, end: 10 }, 42)
                )
            },

            // Null coalescing with undefined
            {
                input: 'und ?? "default"',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 16 },
                    AST.ExprNode.asUndefined({ start: 0, end: 3 }),
                    AST.ExprNode.asString({ start: 7, end: 16 }, 'default')
                )
            },

            // Null coalescing with variables
            {
                input: 'value ?? defaultValue',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 21 },
                    AST.ExprNode.asIdent({ start: 0, end: 5 }, 'value', false),
                    AST.ExprNode.asIdent({ start: 9, end: 21 }, 'defaultValue', false)
                )
            },

            // Multiple null coalescing (left-associative)
            {
                input: 'a ?? b ?? c',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 11 },
                    AST.ExprNode.asOrelse(
                        { start: 0, end: 6 },
                        AST.ExprNode.asIdent({ start: 0, end: 1 }, 'a', false),
                        AST.ExprNode.asIdent({ start: 5, end: 6 }, 'b', false)
                    ),
                    AST.ExprNode.asIdent({ start: 10, end: 11 }, 'c', false)
                )
            },

            // Long chain
            {
                input: 'first ?? second ?? third ?? "fallback"',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 38 },
                    AST.ExprNode.asOrelse(
                        { start: 0, end: 24 },
                        AST.ExprNode.asOrelse(
                            { start: 0, end: 15 },
                            AST.ExprNode.asIdent({ start: 0, end: 5 }, 'first', false),
                            AST.ExprNode.asIdent({ start: 9, end: 15 }, 'second', false)
                        ),
                        AST.ExprNode.asIdent({ start: 19, end: 24 }, 'third', false)
                    ),
                    AST.ExprNode.asString({ start: 28, end: 38 }, 'fallback')
                )
            },

            // Null coalescing with function calls
            {
                input: 'getValue() ?? getDefault()',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 26 },
                    AST.ExprNode.asCall(
                        { start: 0, end: 10 },
                        AST.ExprNode.asIdent({ start: 0, end: 8 }, 'getValue', false),
                        []
                    ),
                    AST.ExprNode.asCall(
                        { start: 14, end: 26 },
                        AST.ExprNode.asIdent({ start: 14, end: 24 }, 'getDefault', false),
                        []
                    )
                )
            },

            // Null coalescing with member access
            {
                input: 'user.name ?? "Anonymous"',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 24 },
                    AST.ExprNode.asMemberAccess(
                            { start: 0, end: 9 },
                            AST.ExprNode.asIdent({ start: 0, end: 4 }, 'user', false),
                            AST.ExprNode.asIdent({ start: 5, end: 9 }, 'name', false)
                    ),
                    AST.ExprNode.asString({ start: 13, end: 24 }, 'Anonymous'),
                )
            },

            // Null coalescing with arithmetic
            {
                input: '(x + y) ?? 0',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 12 },
                    asParenBinary(
                        { start: 0, end: 7 },
                        AST.ExprNode.asIdent({ start: 1, end: 2 }, 'x', false),
                        '+',
                        AST.ExprNode.asIdent({ start: 5, end: 6 }, 'y', false)
                    ),
                    AST.ExprNode.asInteger({ start: 11, end: 12 }, 0)
                )
            },

            // Null coalescing with array access
            {
                input: 'arr[0] ?? defaultItem',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 21 },
                    AST.ExprNode.asArrayAccess(
                        { start: 0, end: 6 },
                        AST.ExprNode.asIdent({ start: 0, end: 3 }, 'arr', false),
                        AST.ExprNode.asInteger({ start: 4, end: 5 }, 0)
                    ),
                    AST.ExprNode.asIdent({ start: 10, end: 21 }, 'defaultItem', false)
                )
            },

            // Typical usage with optional types
            {
                input: 'optionalValue ?? 100',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 20 },
                    AST.ExprNode.asIdent({ start: 0, end: 13 }, 'optionalValue', false),
                    AST.ExprNode.asInteger({ start: 17, end: 20 }, 100)
                )
            },

            // With boolean default
            {
                input: 'maybeFlag ?? false',
                success     : true,
                output: AST.ExprNode.asOrelse(
                    { start: 0, end: 18 },
                    AST.ExprNode.asIdent({ start: 0, end: 9 }, 'maybeFlag', false),
                    AST.ExprNode.asBool({ start: 13, end: 18 }, false)
                )
            },
        ],

        OrelseExprMustFails: [
            // Simple as casting
            {
                input       : 'true ??',
                success     : false,
                output      : [
                    {
                        span    : { start: 5, end: 7 },
                        msg     : "Expected expression after `??`",
                    },
                ],
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝