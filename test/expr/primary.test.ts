// Primary.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        LiteralExprMustSucceed : [
            // integer
            {
                input       : '55',
                success     : true,
                output      : AST.ExprNode.asInteger({ start: 0, end: 2 }, 55),
            },

            // float (n.n)
            {
                input       : '3.14',
                success     : true,
                output      : AST.ExprNode.asFloat({ start: 0, end: 4 }, 3.14),
            },

            // float (using scientific notation)
            {
                input       : '3.14e2',
                success     : true,
                output      : AST.ExprNode.asFloat({ start: 0, end: 6 }, 3.14e2),
            },

            // bool
            {
                input       : 'true',
                success     : true,
                output      : AST.ExprNode.asBool({ start: 0, end: 4 }, true),
            },
            {
                input       : 'false',
                success     : true,
                output      : AST.ExprNode.asBool({ start: 0, end: 5 }, false),
            },

            // null
            {
                input       : 'null',
                success     : true,
                output      : AST.ExprNode.asNull({ start: 0, end: 4 }),
            },

            // undefined
            {
                input       : 'und',
                success     : true,
                output      : AST.ExprNode.asUndefined({ start: 0, end: 3 }),
            },

            // string
            {
                input       : `"hello"`,
                success     : true,
                output      : AST.ExprNode.asString({ start: 0, end: 7 }, 'hello'),
            },

            // empty string
            {
                input       : `""`,
                success     : true,
                output      : AST.ExprNode.asString({ start: 0, end: 2 }, ''),
            },

            // character
            {
                input       : `'c'`,
                success     : true,
                output      : AST.ExprNode.asChar({ start: 0, end: 3 }, 'c'),
            },

             // empty character
            {
                input       : `''`,
                success     : true,
                output      : AST.ExprNode.asChar({ start: 0, end: 2 }, ''),
            },

            // array
            {
                input       : `[]`,
                success     : true,
                output      : AST.ExprNode.asArray({ start: 0, end: 2 }, []),
            },
            {
                input       : `[1, 2, 3]`,
                success     : true,
                output      : AST.ExprNode.asArray({ start: 0, end: 9 }, [
                    AST.ExprNode.asInteger({ start: 1, end: 2 }, 1),
                    AST.ExprNode.asInteger({ start: 4, end: 5 }, 2),
                    AST.ExprNode.asInteger({ start: 7, end: 8 }, 3),
                ]),
            },
        ],

        IdentifierExprMustSucceed : [
            {
                input       : 'foo',
                success     : true,
                output      : AST.ExprNode.asIdent({ start: 0, end: 3 }, 'foo'),
            },
            {
                input       : '@bar',
                success     : true,
                output      : AST.ExprNode.asIdent({ start: 0, end: 4 }, 'bar', true),
            },
            {
                input       : 'null_',
                success     : true,
                output      : AST.ExprNode.asIdent({ start: 0, end: 5 }, 'null_'),
            },
        ],

        ParenExprMustSucceed : [
            {
                input       : '(55)',
                success     : true,
                output      : AST.ExprNode.asParen({ start: 0, end: 4 }, AST.ExprNode.asInteger({ start: 1, end: 3 }, 55)),
            },
        ],

        TypeExprMustSucceed : [
            {
                input       : 'i32',
                success     : true,
                output      : AST.ExprNode.asType({ start: 0, end: 3 }, AST.TypeNode.asSigned({ start: 0, end: 3 }, 'i32', 32)),
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝