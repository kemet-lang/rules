// range.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        Range: [
            // Basic exclusive range
            {
                input: '1..5',
                success     : true,
                output: AST.ExprNode.asRange(
                    { start: 0, end: 4 },
                    AST.ExprNode.asInteger({ start: 0, end: 1 }, 1),
                    'exclusive',
                    AST.ExprNode.asInteger({ start: 3, end: 4 }, 5)
                ),
            },

            // Basic inclusive range
            {
                input: '1..=5',
                success     : true,
                output: AST.ExprNode.asRange(
                    { start: 0, end: 5 },
                    AST.ExprNode.asInteger({ start: 0, end: 1 }, 1),
                    'inclusive',
                    AST.ExprNode.asInteger({ start: 4, end: 5 }, 5)
                ),
            },

            // Range with identifiers
            {
                input: 'start..end',
                success     : true,
                output: AST.ExprNode.asRange(
                    { start: 0, end: 10 },
                    AST.ExprNode.asIdent({ start: 0, end: 5 }, 'start', false),
                    'exclusive',
                    AST.ExprNode.asIdent({ start: 7, end: 10 }, 'end', false)
                ),
            },

            // Open-ended range (without right operand)
            {
                input: '1..',
                success     : true,
                output: AST.ExprNode.asRange(
                    { start: 0, end: 3 },
                    AST.ExprNode.asInteger({ start: 0, end: 1 }, 1),
                    'exclusive',
                    null
                ),
            },

            // Range with expressions
            {
                input: '(1 + 2)..(3 * 4)',
                success     : true,
                output: AST.ExprNode.asRange(
                    { start: 0, end: 16 },
                    asParenBinary(
                        { start: 0, end: 7 },
                        AST.ExprNode.asInteger({ start: 1, end: 2 }, 1),
                        '+',
                        AST.ExprNode.asInteger({ start: 5, end: 6 }, 2)
                    ),
                    'exclusive',
                    asParenBinary(
                        { start: 9, end: 16 },
                        AST.ExprNode.asInteger({ start: 10, end: 11 }, 3),
                        '*',
                        AST.ExprNode.asInteger({ start: 14, end: 15 }, 4)
                    )
                ),
            },

            // Open-ended inclusive range
            {
                input: '5..=',
                success     : true,
                output: AST.ExprNode.asRange(
                    { start: 0, end: 4 },
                    AST.ExprNode.asInteger({ start: 0, end: 1 }, 5),
                    'inclusive',
                    null
                ),
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝