// test.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        TestStmtMustSucceed: [
            // Simple test with block
            {
                name: 'simple test with block',
                input: 'test {}',
                success: true,
                output: AST.StmtNode.asTest(
                    { start: 0, end: 7 },
                    undefined,
                    AST.BlockStmtNode.create(
                        { start: 5, end: 7 },
                        [],
                    )
                )
            },

            // Test with name and block
            {
                name: 'test with name and block',
                input: 'test "MyTest" {}',
                success: true,
                output: AST.StmtNode.asTest(
                    { start: 0, end: 16 },
                    { name: 'MyTest', span: { start: 5, end: 13 } },
                    AST.BlockStmtNode.create(
                        { start: 14, end: 16 },
                        [],
                    )
                )
            },
        ],

        TestStmtMustFails: [
            // Missing block after test keyword
            {
                name: 'test without name/block',
                input: 'test ',
                success: false,
                output: [
                    {
                        span: { start: 0, end: 4 },
                        msg: "Expected block statement or test name after `test` keyword",
                    },
                ],
            },

            // Missing block after test name
            {
                name: 'test with name but without block',
                input: 'test "MyTest" ',
                success: false,
                output: [
                    {
                        span: { start: 5, end: 13 },
                        msg: "Expected block statement after test name",
                    },
                ],
            },
        ]

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Stmt', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝