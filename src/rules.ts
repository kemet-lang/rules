// rules.ts — Parser rules and grammar definitions for the Kemet programming language.
//
// repo   : https://github.com/kemet-lang/rules
// author : https://github.com/maysara-elshewehy
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as syntax          from '@je-es/syntax';
    import { lexerRules }       from './conf/lexer_rules';
    import { lspConfig }        from './conf/lsp_rules';
    import { parserRules, parserSettings } from './conf/parser_rules';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    export const KemetSyntax = syntax.create({
            name     : 'Kemet',
            version  : '0.0.1',
            lexer    : lexerRules,
            parser   : parserRules,
            lsp      : lspConfig,
            settings : parserSettings
        } as syntax.SyntaxConfig
    );

// ╚══════════════════════════════════════════════════════════════════════════════════════╝