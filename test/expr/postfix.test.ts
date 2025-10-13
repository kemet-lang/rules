// postfix.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        Postfix: [
            {
                input       : 'foo++',
                success     : true,
                output      : AST.ExprNode.asPreIncrement({ start: 0, end: 5 }, AST.ExprNode.asIdent({ start: 0, end: 3 }, 'foo', false)),
            },
            {
                input       : 'bar--',
                success     : true,
                output      : AST.ExprNode.asPostDecrement({ start: 0, end: 5 }, AST.ExprNode.asIdent({ start: 0, end: 3 }, 'bar', false)),
            },
            {
                input       : 'foo.*',
                success     : true,
                output      : AST.ExprNode.asDereference({ start: 0, end: 5 }, AST.ExprNode.asIdent({ start: 0, end: 3 }, 'foo', false)),
            },
            {
                input       : 'foo.bar',
                success     : true,
                output      : AST.ExprNode.asMemberAccess({ start: 0, end: 7 }, AST.ExprNode.asIdent({ start: 0, end: 3 }, 'foo', false), AST.ExprNode.asIdent({ start: 4, end: 7 }, 'bar', false)),
            },
            {
                input       : 'foo()',
                success     : true,
                output      : AST.ExprNode.asCall({ start: 0, end: 5 }, AST.ExprNode.asIdent({ start: 0, end: 3 }, 'foo', false), []),
            },
            {
                input       : 'foo[42]',
                success     : true,
                output      : AST.ExprNode.asArrayAccess({ start: 0, end: 7 }, AST.ExprNode.asIdent({ start: 0, end: 3 }, 'foo', false), AST.ExprNode.asInteger({ start: 4, end: 6 }, 42)),
            },
        ],

        MultiPostfix: [
            {
                input       : 'foo.bar.baz',
                success     : true,
                output      : AST.ExprNode.asMemberAccess({ start: 0, end: 11 },
                                AST.ExprNode.asMemberAccess({ start: 0, end: 7 },
                                    AST.ExprNode.asIdent({ start: 0, end: 3 },
                                        'foo', false
                                    ),
                                    AST.ExprNode.asIdent({ start: 4, end: 7 },
                                        'bar', false
                                    )
                                ),
                                AST.ExprNode.asIdent({ start: 8, end: 11 },
                                    'baz', false
                                ),
                            ),
            },
            {
                input       : 'foo()()',
                success     : true,
                output      : AST.ExprNode.asCall({ start: 0, end: 7 }, AST.ExprNode.asCall({ start: 0, end: 5 }, AST.ExprNode.asIdent({ start: 0, end: 3 }, 'foo', false), []), []),
            },
            {
                input       : 'foo[42][43]',
                success     : true,
                output      : AST.ExprNode.asArrayAccess({ start: 0, end: 11 }, AST.ExprNode.asArrayAccess({ start: 0, end: 7 }, AST.ExprNode.asIdent({ start: 0, end: 3 }, 'foo', false), AST.ExprNode.asInteger({ start: 4, end: 6 }, 42)), AST.ExprNode.asInteger({ start: 8, end: 10 }, 43)),
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝