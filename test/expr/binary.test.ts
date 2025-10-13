// binary.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        BinaryExprPower: [
            // single
            {
                input       : '(2 ** 3)',
                success     : true,
                output      : asParenBinary({ start: 0, end: 8 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 2),
                    '**',
                    AST.ExprNode.asInteger({ start: 6, end: 7 }, 3)
                ),
            },

            // Multiple
            {
                input       : '((2 ** 3) ** 4)',
                success     : true,
                output      : asParenBinary({ start: 0, end: 15 },
                    asParenBinary({ start: 1, end: 9 },
                        AST.ExprNode.asInteger({ start: 2, end: 3 }, 2),
                        '**',
                        AST.ExprNode.asInteger({ start: 7, end: 8 }, 3)
                    ),
                    '**',
                    AST.ExprNode.asInteger({ start: 13, end: 14 }, 4)
                ),
            }
        ],

        BinaryExprArithmetic: [
            // Single multiplication
            {
                input: '(2 * 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 7 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 2),
                    '*',
                    AST.ExprNode.asInteger({ start: 5, end: 6 }, 3)
                ),
            },

            // Chained multiplication
            {
                input: '((2 * 3) * 4)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 13 },
                    asParenBinary(
                        { start: 1, end: 8 },
                        AST.ExprNode.asInteger({ start: 2, end: 3 }, 2),
                        '*',
                        AST.ExprNode.asInteger({ start: 6, end: 7 }, 3)
                    ),
                    '*',
                    AST.ExprNode.asInteger({ start: 11, end: 12 }, 4)
                ),
            },

            // Addition with multiplication precedence
            {
                input: '(2 + (3 * 4))',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 13 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 2),
                    '+',
                    asParenBinary(
                        { start: 5, end: 12 },
                        AST.ExprNode.asInteger({ start: 6, end: 7 }, 3),
                        '*',
                        AST.ExprNode.asInteger({ start: 10, end: 11 }, 4)
                    )
                )
            },

            // Division with subtraction
            {
                input: '(10 - (6 / 2))',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 14 },
                    AST.ExprNode.asInteger({ start: 1, end: 3 }, 10),
                    '-',
                    asParenBinary(
                        { start: 6, end: 13 },
                        AST.ExprNode.asInteger({ start: 7, end: 8 }, 6),
                        '/',
                        AST.ExprNode.asInteger({ start: 11, end: 12 }, 2)
                    )
                )
            },

            // Modulo operation
            {
                input: '(7 % 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 7 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 7),
                    '%',
                    AST.ExprNode.asInteger({ start: 5, end: 6 }, 3)
                )
            },
        ],

        BinaryExprShift: [
            // Left shift
            {
                input: '(4 << 2)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 8 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 4),
                    '<<',
                    AST.ExprNode.asInteger({ start: 6, end: 7 }, 2)
                )
            },

            // Right shift
            {
                input: '(16 >> 2)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 9 },
                    AST.ExprNode.asInteger({ start: 1, end: 3 }, 16),
                    '>>',
                    AST.ExprNode.asInteger({ start: 7, end: 8 }, 2)
                )
            },

            // Chained shifts
            {
                input: '((1 << 2) << 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 15 },
                    asParenBinary(
                        { start: 1, end: 9 },
                        AST.ExprNode.asInteger({ start: 2, end: 3 }, 1),
                        '<<',
                        AST.ExprNode.asInteger({ start: 7, end: 8 }, 2)
                    ),
                    '<<',
                    AST.ExprNode.asInteger({ start: 13, end: 14 }, 3)
                )
            },

            // Shift with arithmetic
            {
                input: '((2 * 4) << 1)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 14 },
                    asParenBinary(
                        { start: 1, end: 8 },
                        AST.ExprNode.asInteger({ start: 2, end: 3 }, 2),
                        '*',
                        AST.ExprNode.asInteger({ start: 6, end: 7 }, 4)
                    ),
                    '<<',
                    AST.ExprNode.asInteger({ start: 12, end: 13 }, 1)
                )
            },
        ],

        BinaryExprRelational: [
            // Less than
            {
                input: '(2 < 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 7 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 2),
                    '<',
                    AST.ExprNode.asInteger({ start: 5, end: 6 }, 3)
                )
            },

            // Greater than or equal
            {
                input: '(5 >= 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 8 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 5),
                    '>=',
                    AST.ExprNode.asInteger({ start: 6, end: 7 }, 3)
                )
            },

            // Chained comparisons
            {
                input: '((1 < 2) < 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 13 },
                    asParenBinary(
                        { start: 1, end: 8 },
                        AST.ExprNode.asInteger({ start: 2, end: 3 }, 1),
                        '<',
                        AST.ExprNode.asInteger({ start: 6, end: 7 }, 2)
                    ),
                    '<',
                    AST.ExprNode.asInteger({ start: 11, end: 12 }, 3)
                )
            },

            // Comparison with arithmetic
            {
                input: '((2 + 3) < (4 * 5))',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 19 },
                    asParenBinary(
                        { start: 1, end: 8 },
                        AST.ExprNode.asInteger({ start: 2, end: 3 }, 2),
                        '+',
                        AST.ExprNode.asInteger({ start: 6, end: 7 }, 3)
                    ),
                    '<',
                    asParenBinary(
                        { start: 11, end: 18 },
                        AST.ExprNode.asInteger({ start: 12, end: 13 }, 4),
                        '*',
                        AST.ExprNode.asInteger({ start: 16, end: 17 }, 5)
                    )
                )
            },

            // With identifiers
            {
                input: '(foo < bar)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 11 },
                    AST.ExprNode.asIdent({ start: 1, end: 4 }, 'foo', false),
                    '<',
                    AST.ExprNode.asIdent({ start: 7, end: 10 }, 'bar', false)
                )
            },
        ],

        BinaryExprEquality: [
            // Basic equality
            {
                input: '(2 == 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 8 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 2),
                    '==',
                    AST.ExprNode.asInteger({ start: 6, end: 7 }, 3)
                )
            },

            // Inequality
            {
                input: '(5 != 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 8 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 5),
                    '!=',
                    AST.ExprNode.asInteger({ start: 6, end: 7 }, 3)
                )
            },

            // Chained equality
            {
                input: '((1 == 2) == 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 15 },
                    asParenBinary(
                        { start: 1, end: 9 },
                        AST.ExprNode.asInteger({ start: 2, end: 3 }, 1),
                        '==',
                        AST.ExprNode.asInteger({ start: 7, end: 8 }, 2)
                    ),
                    '==',
                    AST.ExprNode.asInteger({ start: 13, end: 14 }, 3)
                )
            },

            // Equality with comparisons
            {
                input: '((1 < 2) == (3 > 4))',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 20 },
                    asParenBinary(
                        { start: 1, end: 8 },
                        AST.ExprNode.asInteger({ start: 2, end: 3 }, 1),
                        '<',
                        AST.ExprNode.asInteger({ start: 6, end: 7 }, 2)
                    ),
                    '==',
                    asParenBinary(
                        { start: 12, end: 19 },
                        AST.ExprNode.asInteger({ start: 13, end: 14 }, 3),
                        '>',
                        AST.ExprNode.asInteger({ start: 17, end: 18 }, 4)
                    )
                )
            },

            // With boolean literals
            {
                input: '(true == false)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 15 },
                    AST.ExprNode.asBool({ start: 1, end: 5 }, true),
                    '==',
                    AST.ExprNode.asBool({ start: 9, end: 14 }, false)
                )
            },
        ],

        BinaryExprBitwise: [
            // Bitwise AND
            {
                input: '(5 & 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 7 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 5),
                    '&',
                    AST.ExprNode.asInteger({ start: 5, end: 6 }, 3)
                )
            },

            // Bitwise OR
            {
                input: '(5 | 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 7 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 5),
                    '|',
                    AST.ExprNode.asInteger({ start: 5, end: 6 }, 3)
                )
            },

            // Bitwise XOR
            {
                input: '(5 ^ 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 7 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 5),
                    '^',
                    AST.ExprNode.asInteger({ start: 5, end: 6 }, 3)
                )
            },

            // Chained AND operations
            {
                input: '((7 & 5) & 3)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 13 },
                    asParenBinary(
                        { start: 1, end: 8 },
                        AST.ExprNode.asInteger({ start: 2, end: 3 }, 7),
                        '&',
                        AST.ExprNode.asInteger({ start: 6, end: 7 }, 5)
                    ),
                    '&',
                    AST.ExprNode.asInteger({ start: 11, end: 12 }, 3)
                )
            },

            // Mixed bitwise with precedence
            {
                input: '(1 | (2 ^ (4 & 8)))',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 19 },
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 1),
                    '|',
                    asParenBinary(
                        { start: 5, end: 18 },
                        AST.ExprNode.asInteger({ start: 6, end: 7 }, 2),
                        '^',
                        asParenBinary(
                            { start: 10, end: 17 },
                            AST.ExprNode.asInteger({ start: 11, end: 12 }, 4),
                            '&',
                            AST.ExprNode.asInteger({ start: 15, end: 16 }, 8)
                        )
                    )
                )
            },

            // Bitwise with arithmetic
            {
                input: '((2 + 3) & (4 * 5))',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 19 },
                    asParenBinary(
                        { start: 1, end: 8 },
                        AST.ExprNode.asInteger({ start: 2, end: 3 }, 2),
                        '+',
                        AST.ExprNode.asInteger({ start: 6, end: 7 }, 3)
                    ),
                    '&',
                    asParenBinary(
                        { start: 11, end: 18 },
                        AST.ExprNode.asInteger({ start: 12, end: 13 }, 4),
                        '*',
                        AST.ExprNode.asInteger({ start: 16, end: 17 }, 5)
                    )
                )
            },

            // With identifiers
            {
                input: '(foo & bar)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 11 },
                    AST.ExprNode.asIdent({ start: 1, end: 4 }, 'foo', false),
                    '&',
                    AST.ExprNode.asIdent({ start: 7, end: 10 }, 'bar', false)
                )
            },
        ],

        BinaryExprLogical: [
            // Logical AND
            {
                input: '(true and false)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 16 },
                    AST.ExprNode.asBool({ start: 1, end: 5 }, true),
                    'and',
                    AST.ExprNode.asBool({ start: 10, end: 15 }, false)
                )
            },

            // Logical OR
            {
                input: '(false or true)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 15 },
                    AST.ExprNode.asBool({ start: 1, end: 6 }, false),
                    'or',
                    AST.ExprNode.asBool({ start: 10, end: 14 }, true)
                )
            },

            // Chained logical operations
            {
                input: '((true and false) and true)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 27 },
                    asParenBinary(
                        { start: 1, end: 17 },
                        AST.ExprNode.asBool({ start: 2, end: 6 }, true),
                        'and',
                        AST.ExprNode.asBool({ start: 11, end: 16 }, false)
                    ),
                    'and',
                    AST.ExprNode.asBool({ start: 22, end: 26 }, true)
                )
            },

            // Mixed AND/OR with precedence
            {
                input: '(true or (false and false))',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 27 },
                    AST.ExprNode.asBool({ start: 1, end: 5 }, true),
                    'or',
                    asParenBinary(
                        { start: 9, end: 26 },
                        AST.ExprNode.asBool({ start: 10, end: 15 }, false),
                        'and',
                        AST.ExprNode.asBool({ start: 20, end: 25 }, false)
                    )
                )
            },

            // Logical with other operations
            {
                input: '(((1 & 2) == 3) or false)',
                success     : true,
                output: asParenBinary(
                    { start: 0, end: 25 },
                    asParenBinary(
                        { start: 1, end: 15 },
                        asParenBinary(
                            { start: 2, end: 9 },
                            AST.ExprNode.asInteger({ start: 3, end: 4 }, 1),
                            '&',
                            AST.ExprNode.asInteger({ start: 7, end: 8 }, 2)
                        ),
                        '==',
                        AST.ExprNode.asInteger({ start: 13, end: 14 }, 3)
                    ),
                    'or',
                    AST.ExprNode.asBool({ start: 19, end: 24 }, false)
                )
            },
        ],

        BinaryExprAssignment: [
            // Basic assignment
            {
                input: 'x = 5',
                success     : true,
                output: AST.ExprNode.asBinary(
                    { start: 0, end: 5 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'x', false),
                    '=',
                    AST.ExprNode.asInteger({ start: 4, end: 5 }, 5)
                )
            },

            // Addition assignment
            {
                input: 'x += 10',
                success     : true,
                output: AST.ExprNode.asBinary(
                    { start: 0, end: 7 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'x', false),
                    '+=',
                    AST.ExprNode.asInteger({ start: 5, end: 7 }, 10)
                )
            },

            // Subtraction assignment
            {
                input: 'y -= 3',
                success     : true,
                output: AST.ExprNode.asBinary(
                    { start: 0, end: 6 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'y', false),
                    '-=',
                    AST.ExprNode.asInteger({ start: 5, end: 6 }, 3)
                )
            },

            // Multiplication assignment
            {
                input: 'z *= 2',
                success     : true,
                output: AST.ExprNode.asBinary(
                    { start: 0, end: 6 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'z', false),
                    '*=',
                    AST.ExprNode.asInteger({ start: 5, end: 6 }, 2)
                )
            },

            // Division assignment
            {
                input: 'a /= 4',
                success     : true,
                output: AST.ExprNode.asBinary(
                    { start: 0, end: 6 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'a', false),
                    '/=',
                    AST.ExprNode.asInteger({ start: 5, end: 6 }, 4)
                )
            },

            // Modulo assignment
            {
                input: 'b %= 7',
                success     : true,
                output: AST.ExprNode.asBinary(
                    { start: 0, end: 6 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'b', false),
                    '%=',
                    AST.ExprNode.asInteger({ start: 5, end: 6 }, 7)
                )
            },

            // Assignment with expression
            {
                input: 'x = (y + z)',
                success     : true,
                output: AST.ExprNode.asBinary(
                    { start: 0, end: 11 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'x', false),
                    '=',
                    asParenBinary(
                        { start: 4, end: 11 },
                        AST.ExprNode.asIdent({ start: 5, end: 6 }, 'y', false),
                        '+',
                        AST.ExprNode.asIdent({ start: 9, end: 10 }, 'z', false)
                    )
                )
            },

            // Compound assignment with expression
            {
                input: 'total += (price * quantity)',
                success     : true,
                output: AST.ExprNode.asBinary(
                    { start: 0, end: 27 },
                    AST.ExprNode.asIdent({ start: 0, end: 5 }, 'total', false),
                    '+=',
                    asParenBinary(
                        { start: 9, end: 27 },
                        AST.ExprNode.asIdent({ start: 10, end: 15 }, 'price', false),
                        '*',
                        AST.ExprNode.asIdent({ start: 18, end: 26 }, 'quantity', false)
                    )
                )
            },

            // Assignment with boolean
            {
                input: 'flag = true',
                success     : true,
                output: AST.ExprNode.asBinary(
                    { start: 0, end: 11 },
                    AST.ExprNode.asIdent({ start: 0, end: 4 }, 'flag', false),
                    '=',
                    AST.ExprNode.asBool({ start: 7, end: 11 }, true)
                )
            },

            // Assignment with string
            {
                input: 'name = "John"',
                success     : true,
                output: AST.ExprNode.asBinary(
                    { start: 0, end: 13 },
                    AST.ExprNode.asIdent({ start: 0, end: 4 }, 'name', false),
                    '=',
                    AST.ExprNode.asString({ start: 7, end: 13 }, 'John')
                )
            },
        ],
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝