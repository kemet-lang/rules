// error.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    const cases = {

        ErrorTypeMustSucceed: [
            // error set with single element
            {
                name: 'error set with single element',
                input: 'errset { error1, }',
                output: AST.TypeNode.asErrset({ start: 0, end: 18 }, [
                    AST.IdentNode.create({ start: 9, end: 15 }, 'error1'),
                ]),
                success: true,
            },

            // error set with elements
            {
                name: 'error set with elements',
                input: 'errset { error1, error2 }',
                output: AST.TypeNode.asErrset({ start: 0, end: 25 }, [
                    AST.IdentNode.create({ start: 9, end: 15 }, 'error1'),
                    AST.IdentNode.create({ start: 17, end: 23 }, 'error2'),
                ]),
                success: true,
            },
        ],

        ErrorTypeMustFails: [
            // Missing `{`
            {
                name        : 'Missing `{`',
                input       : 'errset ',
                success     : false,
                output      : [
                    {
                        span    : { start: 6, end: 7 },
                        msg     : "Expected '{' after `errset` keyword",
                    },
                ],
            },

            // no members
            {
                name        : 'no members - with close',
                input       : 'errset {}',
                success     : false,
                output      : [
                    {
                        span    : { start: 7, end: 9 },
                        msg     : "Expected members after `{`",
                    },
                ],
            },

            // no members - no close
            {
                name        : 'no members - no close',
                input       : 'errset {',
                success     : false,
                output      : [
                    {
                        span    : { start: 7, end: 8 },
                        msg     : "Expected members after `{`",
                    },
                ],
            },

            // Missing `}`
            {
                name        : 'Missing `}`',
                input       : 'errset { error1 ',
                success     : false,
                output      : [
                    {
                        span    : { start: 15, end: 16 },
                        msg     : "Expected '}' after error set",
                    },
                ],
            },
        ]

    };

    testParser('Type', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝