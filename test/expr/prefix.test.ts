// prefix.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗
    const cases = {

        Prefix: [
            {
                input       : '++foo',
                success     : true,
                output      : AST.ExprNode.asPreIncrement({ start: 0, end: 5 }, AST.ExprNode.asIdent({ start: 2, end: 5 }, 'foo', false)),
            },
            {
                input       : '--bar',
                success     : true,
                output      : AST.ExprNode.asPreDecrement({ start: 0, end: 5 }, AST.ExprNode.asIdent({ start: 2, end: 5 }, 'bar', false)),
            },
            {
                input       : '&foo',
                success     : true,
                output      : AST.ExprNode.asReference({ start: 0, end: 4 }, AST.ExprNode.asIdent({ start: 1, end: 4 }, 'foo', false)),
            },
            {
                input       : '-bar',
                success     : true,
                output      : AST.ExprNode.asUnaryMinus({ start: 0, end: 4 }, AST.ExprNode.asIdent({ start: 1, end: 4 }, 'bar', false)),
            },
            {
                input       : '+foo',
                success     : true,
                output      : AST.ExprNode.asUnaryPlus({ start: 0, end: 4 }, AST.ExprNode.asIdent({ start: 1, end: 4 }, 'foo', false)),
            },
            {
                input       : '!bar',
                success     : true,
                output      : AST.ExprNode.asLogicalNot({ start: 0, end: 4 }, AST.ExprNode.asIdent({ start: 1, end: 4 }, 'bar', false)),
            },
            {
                input       : '~foo',
                success     : true,
                output      : AST.ExprNode.asxBitwiseNot({ start: 0, end: 4 }, AST.ExprNode.asIdent({ start: 1, end: 4 }, 'foo', false)),
            },
        ],

        MultiPrefix: [
            {
                input       : '++++foo',
                success     : true,
                output      : AST.ExprNode.asPreIncrement({ start: 2, end: 7 }, AST.ExprNode.asPreIncrement({ start: 0, end: 7 }, AST.ExprNode.asIdent({ start: 4, end: 7 }, 'foo', false))),
            }
        ],
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝