// Primitive.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    const cases = {

        PrimitiveTypes: [
            // Basic types
            {
                input: 'noreturn',
                success: true,
                output: AST.TypeNode.asNoreturn({ start: 0, end: 8 }),
            },
            {
                input: 'type',
                success: true,
                output: AST.TypeNode.asType({ start: 0, end: 4 }),
            },
            {
                input: 'void',
                success: true,
                output: AST.TypeNode.asVoid({ start: 0, end: 4 }),
            },
            {
                input: 'bool',
                success: true,
                output: AST.TypeNode.asBool({ start: 0, end: 4 }),
            },
            {
                input: 'null_t',
                success: true,
                output: AST.TypeNode.asNull({ start: 0, end: 6 }),
            },
            {
                input: 'und_t',
                success: true,
                output: AST.TypeNode.asUndefined({ start: 0, end: 5 }),
            },
            {
                input: 'any',
                success: true,
                output: AST.TypeNode.asAny({ start: 0, end: 3 }),
            },

            // Comptime types
            {
                input: 'cint',
                success: true,
                output: AST.TypeNode.asComptimeInt({ start: 0, end: 4 }, 'cint'),
            },
            {
                input: 'cflt',
                success: true,
                output: AST.TypeNode.asComptimeFloat({ start: 0, end: 4 }, 'cflt'),
            },

            // Size types
            {
                input: 'isize',
                success: true,
                output: AST.TypeNode.asSigned({ start: 0, end: 5 }, 'isize', 64),
            },
            {
                input: 'usize',
                success: true,
                output: AST.TypeNode.asUnsigned({ start: 0, end: 5 }, 'usize', 64),
            },
        ],

        SizedTypes: [
            // Signed integers
            {
                input: 'i8',
                success: true,
                output: AST.TypeNode.asSigned({ start: 0, end: 2 }, 'i8', 8),
            },
            {
                input: 'i32',
                success: true,
                output: AST.TypeNode.asSigned({ start: 0, end: 3 }, 'i32', 32),
            },
            {
                input: 'i64',
                success: true,
                output: AST.TypeNode.asSigned({ start: 0, end: 3 }, 'i64', 64),
            },

            // Unsigned integers
            {
                input: 'u8',
                success: true,
                output: AST.TypeNode.asUnsigned({ start: 0, end: 2 }, 'u8', 8),
            },
            {
                input: 'u32',
                success: true,
                output: AST.TypeNode.asUnsigned({ start: 0, end: 3 }, 'u32', 32),
            },
            {
                input: 'u64',
                success: true,
                output: AST.TypeNode.asUnsigned({ start: 0, end: 3 }, 'u64', 64),
            },

            // Floats
            {
                input: 'f32',
                success: true,
                output: AST.TypeNode.asFloat({ start: 0, end: 3 }, 'f32', 32),
            },
            {
                input: 'f64',
                success: true,
                output: AST.TypeNode.asFloat({ start: 0, end: 3 }, 'f64', 64),
            },
        ],

        IdentifierTypes: [
            {
                input: 'MyType',
                success: true,
                output: AST.TypeNode.asIdentifier({ start: 0, end: 6 }, 'MyType'),
            },
            {
                input: 'String',
                success: true,
                output: AST.TypeNode.asIdentifier({ start: 0, end: 6 }, 'String'),
            },
        ],

        ExtendedSizedTypes: [
            // More signed integers
            {
                input: 'i16',
                success: true,
                output: AST.TypeNode.asSigned({ start: 0, end: 3 }, 'i16', 16),
            },
            {
                input: 'i128',
                success: true,
                output: AST.TypeNode.asSigned({ start: 0, end: 4 }, 'i128', 128),
            },

            // More unsigned integers
            {
                input: 'u16',
                success: true,
                output: AST.TypeNode.asUnsigned({ start: 0, end: 3 }, 'u16', 16),
            },
            {
                input: 'u128',
                success: true,
                output: AST.TypeNode.asUnsigned({ start: 0, end: 4 }, 'u128', 128),
            },

            // More floats
            {
                input: 'f16',
                success: true,
                output: AST.TypeNode.asFloat({ start: 0, end: 3 }, 'f16', 16),
            },
            {
                input: 'f80',
                success: true,
                output: AST.TypeNode.asFloat({ start: 0, end: 3 }, 'f80', 80),
            },
            {
                input: 'f128',
                success: true,
                output: AST.TypeNode.asFloat({ start: 0, end: 4 }, 'f128', 128),
            },
        ],

    };

    testParser('Type', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝