// use.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        UseStmtMustSucceed: [
            // as import
            {
                name        : 'as import',
                input       : 'use math from "std/math"',
                success     : true,
                output      : AST.StmtNode.asUse(
                    { start: 0, end: 24 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    [AST.IdentNode.create({ start: 4, end: 8 }, 'math')],
                    undefined,
                    'std/math',
                    { start: 14, end: 24 }
                )
            },

            // as public import
            {
                name        : 'as public import',
                input       : 'pub use math from "std/math"',
                success     : true,
                output      : AST.StmtNode.asUse(
                    { start: 0, end: 28 },
                    {
                        kind: 'Public',
                        span: { start: 0, end: 3 },
                    },
                    [AST.IdentNode.create({ start: 8, end: 12 }, 'math')],
                    undefined,
                    'std/math',
                    { start: 18, end: 28 }
                )
            },

            // as import with alias
            {
                name        : 'as import with alias',
                input       : 'use math as m from "std/math"',
                success     : true,
                output      : AST.StmtNode.asUse(
                    { start: 0, end: 29 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    [AST.IdentNode.create({ start: 4, end: 8 }, 'math')],
                    AST.IdentNode.create({ start: 12, end: 13 }, 'm'),
                    'std/math',
                    { start: 19, end: 29 }
                )
            },

            // as alias only
            {
                name        : 'as alias only',
                input       : 'use x as y',
                success     : true,
                output      : AST.StmtNode.asUse(
                    { start: 0, end: 10 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    [AST.IdentNode.create({ start: 4, end: 5 }, 'x')],
                    AST.IdentNode.create({ start: 9, end: 10 }, 'y'),
                    undefined
                )
            },

            // import with static member access
            {
                name        : 'import with static member access',
                input       : 'use std.math from "std/math"',
                success     : true,
                output      : AST.StmtNode.asUse(
                    { start: 0, end: 28 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    [AST.IdentNode.create({ start: 4, end: 7 }, 'std'),
                    AST.IdentNode.create({ start: 8, end: 12 }, 'math')],
                    undefined,
                    'std/math',
                    { start: 18 , end: 28 }
                )
            },

            // public import with static member access and alias
            {
                name        : 'public import with static member access and alias',
                input       : 'pub use std.math as m from "std/math"',
                success     : true,
                output      : AST.StmtNode.asUse(
                    { start: 0, end: 37 },
                    {
                        kind: 'Public',
                        span: { start: 0, end: 3 },
                    },
                    [AST.IdentNode.create({ start: 8, end: 11 }, 'std'),
                    AST.IdentNode.create({ start: 12, end: 16 }, 'math')],
                    AST.IdentNode.create({ start: 20, end: 21 }, 'm'),
                    'std/math',
                    { start: 27 , end: 37 }
                )
            },

            // multiple level member access
            {
                name        : 'multiple level member access',
                input       : 'use std.io.fs from "std/io/fs"',
                success     : true,
                output      : AST.StmtNode.asUse(
                    { start: 0, end: 30 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    [AST.IdentNode.create({ start: 4, end: 7 }, 'std'),
                    AST.IdentNode.create({ start: 8, end: 10 }, 'io'),
                    AST.IdentNode.create({ start: 11, end: 13 }, 'fs')],
                    undefined,
                    'std/io/fs',
                    { start: 19, end: 30 }
                )
            },

            // multiple level member access with alias
            {
                name        : 'multiple level member access with alias',
                input       : 'use std.io.fs as filesystem from "std/io/fs"',
                success     : true,
                output      : AST.StmtNode.asUse(
                    { start: 0, end: 44 },
                    {
                        kind: 'Private',
                        span: undefined,
                    },
                    [AST.IdentNode.create({ start: 4, end: 7 }, 'std'),
                    AST.IdentNode.create({ start: 8, end: 10 }, 'io'),
                    AST.IdentNode.create({ start: 11, end: 13 }, 'fs')],
                    AST.IdentNode.create({ start: 17, end: 27 }, 'filesystem'),
                    'std/io/fs',
                    { start: 33, end: 44 }
                )
            },

            // public multiple level member access with alias
            {
                name        : 'public multiple level member access with alias',
                input       : 'pub use std.io.fs as filesystem from "std/io/fs"',
                success     : true,
                output      : AST.StmtNode.asUse(
                    { start: 0, end: 48 },
                    {
                        kind: 'Public',
                        span: { start: 0, end: 3 },
                    },
                    [AST.IdentNode.create({ start: 8, end: 11 }, 'std'),
                    AST.IdentNode.create({ start: 12, end: 14 }, 'io'),
                    AST.IdentNode.create({ start: 15, end: 17 }, 'fs')],
                    AST.IdentNode.create({ start: 21, end: 31 }, 'filesystem'),
                    'std/io/fs',
                    { start: 37, end: 48 }
                )
            },
        ],

        UseStmtMustFails: [
            // Missing alias
            {
                name        : 'missing alias',
                input       : 'use ',
                success     : false,
                output      : [
                    {
                        span    : { start: 0, end: 3 },
                        msg     : "Expected identifier after `use` keyword",
                    },
                ],
            },

            // `use "path"`
            {
                name        : 'use with string path only',
                input       : 'use "std/math"',
                success     : false,
                output      : [
                    {
                        span    : { start: 0, end: 3 },
                        msg     : "Expected identifier after `use` keyword",
                    },
                ],
            },

            // 'from' without path
            {
                name        : 'from without path',
                input       : 'use math from ',
                success     : false,
                output      : [
                    {
                        span    : { start: 9, end: 13 },
                        msg     : "Expected module path after `from` keyword",
                    },
                ],
            },

            // without 'from'
            {
                name        : 'without from',
                input       : 'use math as x "std/math"',
                success     : false,
                output      : [
                    {
                        span    : { start: 14, end: 24 },
                        msg     : "Expected `from` keyword before module path",
                    },
                ],
            },

            // without 'as'
            {
                name        : 'without as',
                input       : 'use math x from "std/math"',
                success     : false,
                output      : [
                    {
                        span    : { start: 9, end: 10 },
                        msg     : "Expected `as` keyword after alias",
                    },
                ],
            },

            // non-identifier alias
            {
                name        : 'non-identifier alias',
                input       : 'use math as 123 from "std/math"',
                success     : false,
                output      : [
                    {
                        span    : { start: 12, end: 15 },
                        msg     : "Alias must be an identifier",
                    },
                ],
            },

            // empty path string
            {
                name        : 'empty path string',
                input       : 'use math from ""',
                success     : false,
                output      : [
                    {
                        span    : { start: 14, end: 16 },
                        msg     : "Module path cannot be empty",
                    },
                ],
            },

            // member access with empty alias
            {
                name        : 'member access with empty alias',
                input       : 'use std.math as from "std/math"',
                success     : false,
                output      : [
                    {
                        span    : { start: 13, end: 15 },
                        msg     : "Expected identifier after `as` keyword",
                    },
                ],
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Stmt', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝