// cond.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        Conditional: [
            // Simple conditional
            {
                input: 'true ? 1 : 2',
                success     : true,
                output: AST.ExprNode.asConditional(
                    { start: 0, end: 12 },
                    AST.ExprNode.asBool({ start: 0, end: 4 }, true),
                    AST.ExprNode.asInteger({ start: 7, end: 8 }, 1),
                    AST.ExprNode.asInteger({ start: 11, end: 12 }, 2)
                )
            },

            // Nested conditional
            {
                input: 'a ? b ? c : d : e',
                success     : true,
                output: AST.ExprNode.asConditional(
                    { start: 0, end: 17 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'a', false),
                    AST.ExprNode.asConditional(
                        { start: 4, end: 13 },
                        AST.ExprNode.asIdent({ start: 4, end: 5 }, 'b', false),
                        AST.ExprNode.asIdent({ start: 8, end: 9 }, 'c', false),
                        AST.ExprNode.asIdent({ start: 12, end: 13 }, 'd', false)
                    ),
                    AST.ExprNode.asIdent({ start: 16, end: 17 }, 'e', false)
                )
            },

            // Conditional with arithmetic
            {
                input: '((x + 1) > 0) ? (y * 2) : (z / 3)',
                success     : true,
                output: AST.ExprNode.asConditional(
                    { start: 0, end: 33 },
                    asParenBinary(
                        { start: 0, end: 13 },
                        asParenBinary(
                            { start: 1, end: 8 },
                            AST.ExprNode.asIdent({ start: 2, end: 3 }, 'x', false),
                            '+',
                            AST.ExprNode.asInteger({ start: 6, end: 7 }, 1)
                        ),
                        '>',
                        AST.ExprNode.asInteger({ start: 11, end: 12 }, 0)
                    ),
                    asParenBinary(
                        { start: 16, end: 23 },
                        AST.ExprNode.asIdent({ start: 17, end: 18 }, 'y', false),
                        '*',
                        AST.ExprNode.asInteger({ start: 21, end: 22 }, 2)
                    ),
                    asParenBinary(
                        { start: 26, end: 33 },
                        AST.ExprNode.asIdent({ start: 27, end: 28 }, 'z', false),
                        '/',
                        AST.ExprNode.asInteger({ start: 31, end: 32 }, 3)
                    )
                )
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝