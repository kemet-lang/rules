// lexer_rules.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as LexerLib from '@je-es/lexer';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    export const lexerRules : LexerLib.Rules = {
        // ═══ Whitespace ═══
        ws              : /\s+/,

        // ═══ Comments ═══
        document        : { match: /\/\/\/[!/]?.*/, value: (text: string) => text.slice(3).trim() },
        comment         : { match: /\/\/[!/]?.*/,   value: (text: string) => text.slice(2).trim() },

        // ═══ Literals ═══
        flt             : /[0-9]+\.[0-9]+(?:[eE][+-]?[0-9]+)?/,
        bin             : /0b[01]+/,
        oct             : /0o[0-7]+/,
        hex             : /0x[0-9a-fA-F]+/,
        dec             : /[0-9]+/,
        str             : { match: /"(?:[^"\\]|\\.)*"/, value: (text: string) => text.slice(1, -1) },
        char            : { match: /'(?:[^'\\]|\\.)*'/, value: (text: string) => text.slice(1, -1) },
        true            : 'true',
        false           : 'false',
        null            : 'null',
        null_t          : 'null_t',
        und             : 'und',
        und_t           : 'und_t',

        // ═══ Keywords ═══
        test            : 'test',
        new             : 'new',
        try             : 'try',
        catch           : 'catch',
        use             : 'use',
        as              : 'as',
        from            : 'from',
        pub             : 'pub',
        def             : 'def',
        let             : 'let',
        fn              : 'fn',

        mut             : 'mut',
        inline          : 'inline',
        static          : 'static',
        struct          : 'struct',
        enum            : 'enum',
        errset          : 'errset',

        typeof          : 'typeof',
        sizeof          : 'sizeof',

        if              : 'if',
        else            : 'else',

        while           : 'while',
        for             : 'for',
        do              : 'do',


        return          : 'return',
        defer           : 'defer',
        throw           : 'throw',

        break           : 'break',
        continue        : 'continue',

        switch          : 'switch',
        case            : 'case',
        default         : 'default',

        comptime        : 'comptime',


        // ═══ Types ═══
        i_type          : { match: /i[0-9]+/ },
        u_type          : { match: /u[0-9]+/ },
        f_type          : ['f16', 'f32', 'f64', 'f80', 'f128'],
        cint            : 'cint',
        cflt            : 'cflt',
        isize           : 'isize',
        usize           : 'usize',
        bool            : 'bool',
        void            : 'void',
        type            : 'type',
        any             : 'any',
        err             : 'err',

        // ═══ Operators ═══
        '->'            : '->',     // Function Return operator
        '.*'            : '.*',     // Dereference operator
        '??'            : '??',     // Null coalescing operator
        '..='           : '..=',    // Range operator (Inclusive)
        '..'            : '..',     // Range operator (Exclusive)
        '@'             : '@',      // Builtin operator
        '=='            : '==',
        '!='            : '!=',
        '<='            : '<=',
        '>='            : '>=',
        '+='            : '+=',
        '-='            : '-=',
        '*='            : '*=',
        '/='            : '/=',
        '%='            : '%=',
        '**'            : '**',
        '++'            : '++',
        '--'            : '--',
        '<<'            : '<<',
        '>>'            : '>>',
        'and'           : 'and',
        'or'            : 'or',
        '<'             : '<',
        '>'             : '>',
        '|'             : '|',
        '^'             : '^',
        '&'             : '&',
        '='             : '=',
        '+'             : '+',
        '-'             : '-',
        '*'             : '*',
        '/'             : '/',
        '%'             : '%',
        '?'             : '?',
        '!'             : '!',
        '~'             : '~',
        ':'             : ':',
        ';'             : ';',
        ','             : ',',
        '.'             : '.',
        '('             : '(',
        ')'             : ')',
        '{'             : '{',
        '}'             : '}',
        '['             : '[',
        ']'             : ']',

        // ═══ Identifier ═══
        ident           : /[a-zA-Z_][a-zA-Z0-9_]*/,
    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝