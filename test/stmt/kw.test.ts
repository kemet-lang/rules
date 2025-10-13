// kw.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        ReturnStatement: [
            // Simple return without value
            {
                input: 'return',
                success: true,
                output: AST.StmtNode.asReturn(
                    { start: 0, end: 6 },
                    undefined
                )
            },

            // Return with integer value
            {
                input: 'return 42',
                success: true,
                output: AST.StmtNode.asReturn(
                    { start: 0, end: 9 },
                    AST.ExprNode.asInteger({ start: 7, end: 9 }, 42)
                )
            },

            // Return with identifier
            {
                input: 'return x',
                success: true,
                output: AST.StmtNode.asReturn(
                    { start: 0, end: 8 },
                    AST.ExprNode.asIdent({ start: 7, end: 8 }, 'x', false)
                )
            },

            // Return with expression
            {
                input: 'return (x + y)',
                success: true,
                output: AST.StmtNode.asReturn(
                    { start: 0, end: 14 },
                    asParenBinary(
                        { start: 7, end: 14 },
                        AST.ExprNode.asIdent({ start: 8, end: 9 }, 'x', false),
                        '+',
                        AST.ExprNode.asIdent({ start: 12, end: 13 }, 'y', false)
                    )
                )
            },

            // Return with string
            {
                input: 'return "hello"',
                success: true,
                output: AST.StmtNode.asReturn(
                    { start: 0, end: 14 },
                    AST.ExprNode.asString({ start: 7, end: 14 }, 'hello')
                )
            },
        ],

        DeferStatement: [
            // Defer with expression
            {
                input: 'defer "hello"',
                success: true,
                output: AST.StmtNode.asDefer(
                    { start: 0, end: 13 },
                    AST.ExprNode.asString({ start: 6, end: 13 }, 'hello')
                )
            },
        ],

        BreakStatement: [
            // Simple break
            {
                input: 'break',
                success: true,
                output: AST.StmtNode.asBreak({ start: 0, end: 5 })
            },
        ],

        ContinueStatement: [
            // Simple continue
            {
                input: 'continue',
                success: true,
                output: AST.StmtNode.asContinue({ start: 0, end: 8 })
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Stmt', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝