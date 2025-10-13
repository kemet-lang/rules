// as.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        AsExprMustSucceed: [
            // Simple as casting
            {
                input: 'x as i32',
                success: true,
                output: AST.ExprNode.asAs(
                    { start: 0, end: 8 },
                    AST.ExprNode.asIdent({ start: 0, end: 1 }, 'x'),
                    AST.TypeNode.asSigned({ start: 5, end: 8 }, 'i32', 32)
                )
            },
        ],

        AsExprMustFails: [
            // Simple as casting
            {
                input       : 'x as ',
                success     : false,
                output      : [
                    {
                        span    : { start: 2, end: 4 },
                        msg     : "Expected type after `as` keyword",
                    },
                ],
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝