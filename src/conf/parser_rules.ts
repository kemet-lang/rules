// parser_rules.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as ParserLib       from '@je-es/parser';
    import * as AST             from '@je-es/ast';
    import { Expr }             from '../rules/Expr';
    import { Stmt }             from '../rules/Stmt';
    import { Type }             from '../rules/Type';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    export const parserRules : ParserLib.Rules = [

        ParserLib.createRule('Root',
            ParserLib.oneOrMore(ParserLib.rule('Stmt')),
            {
                build: (data: ParserLib.Result) => {
                    const seq_array = data.getRepeatResult()!;
                    const stmts : AST.StmtNode[] = seq_array.map((x) => x.getCustomData()! as AST.StmtNode);
                    return ParserLib.Result.createAsCustom('passed', 'root', stmts, data.span);
                }
            }
        ),

        ParserLib.createRule('Ident',
            ParserLib.token('ident'),
            {
                build: (data: ParserLib.Result) => {
                    const identResult = data.getTokenData()!;

                    return ParserLib.Result.createAsCustom('passed', 'ident',
                        AST.IdentNode.create( identResult.span, identResult.value!, false),
                        data.span
                    );
                },

                errors: [ ParserLib.error(0, "Expected identifier") ]
            }
        ),

        // Include required rules
        ...Type,
        ...Expr,
        ...Stmt,
    ];

    export const parserSettings : ParserLib.ParserSettings = {
        startRule       : 'Root',
        errorRecovery   : { mode: 'resilient', maxErrors: 99 },
        ignored         : ['ws', 'comment'],
        debug           : 'off',
        maxDepth        : 9999,
        maxCacheSize    : 1024, // 1GB
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝