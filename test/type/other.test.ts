// other.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        OptionalTypes: [
            {
                input: '?i32',
                success: true,
                output: AST.TypeNode.asOptional({ start: 0, end: 4 }, AST.TypeNode.asSigned({ start: 1, end: 4 }, 'i32', 32)),
            },
            {
                input: '?String',
                success: true,
                output: AST.TypeNode.asOptional({ start: 0, end: 7 }, AST.TypeNode.asIdentifier({ start: 1, end: 7 }, 'String')),
            },
        ],

        PointerTypes: [
            {
                input: '*i32',
                success: true,
                output: AST.TypeNode.asPointer({ start: 0, end: 4 }, AST.TypeNode.asSigned({ start: 1, end: 4 }, 'i32', 32), false),
            },
            {
                input: '*mut String',
                success: true,
                output: AST.TypeNode.asPointer({ start: 0, end: 11 }, AST.TypeNode.asIdentifier({ start: 5, end: 11 }, 'String'), true),
            },
        ],

        ArrayTypes: [
            {
                input: '[]i32',
                success: true,
                output: AST.TypeNode.asArray({ start: 0, end: 5 }, AST.TypeNode.asSigned({ start: 2, end: 5 }, 'i32', 32), undefined, false),
            },
            {
                input: '[10]i32',
                success: true,
                output: AST.TypeNode.asArray({ start: 0, end: 7 }, AST.TypeNode.asSigned({ start: 4, end: 7 }, 'i32', 32), AST.ExprNode.asInteger({ start: 1, end: 3 }, 10), false),
            },
            {
                input: '[]mut String',
                success: true,
                output: AST.TypeNode.asArray({ start: 0, end: 12 }, AST.TypeNode.asIdentifier({ start: 6, end: 12 }, 'String'), undefined, true),
            },
        ],

        TupleTypes: [
            {
                input: '.{}',
                success: true,
                output: AST.TypeNode.asTuple({ start: 0, end: 3 }, []),
            },
            {
                input: '.{i32, String}',
                success: true,
                output: AST.TypeNode.asTuple({ start: 0, end: 14 }, [
                    AST.TypeNode.asSigned({ start: 2, end: 5 }, 'i32', 32),
                    AST.TypeNode.asIdentifier({ start: 7, end: 13 }, 'String')
                ]),
            },
        ],

        UnionTypes: [
            {
                input: 'i32 | String',
                success: true,
                output: AST.TypeNode.asUnion({ start: 0, end: 12 }, [
                    AST.TypeNode.asSigned({ start: 0, end: 3 }, 'i32', 32),
                    AST.TypeNode.asIdentifier({ start: 6, end: 12 }, 'String')
                ]),
            },
            {
                input: 'i32 | String | bool',
                success: true,
                output: AST.TypeNode.asUnion({ start: 0, end: 19 }, [
                    AST.TypeNode.asSigned({ start: 0, end: 3 }, 'i32', 32),
                    AST.TypeNode.asIdentifier({ start: 6, end: 12 }, 'String'),
                    AST.TypeNode.asBool({ start: 15, end: 19 })
                ]),
            },
        ],

        ComplexCompositeTypes: [


            // Pointer to array
            {
                input: '*[]i32',
                success: true,
                output: AST.TypeNode.asPointer({ start: 0, end: 6 },
                    AST.TypeNode.asArray({ start: 1, end: 6 },
                        AST.TypeNode.asSigned({ start: 3, end: 6 }, 'i32', 32)
                    )
                ),
            },

            // Array of pointers
            {
                input: '[]*i32',
                success: true,
                output: AST.TypeNode.asArray({ start: 0, end: 6 },
                    AST.TypeNode.asPointer({ start: 2, end: 6 },
                        AST.TypeNode.asSigned({ start: 3, end: 6 }, 'i32', 32)
                    )
                ),
            },

            // Optional array with size
            {
                input: '?[10]String',
                success: true,
                output: AST.TypeNode.asOptional({ start: 0, end: 11 },
                    AST.TypeNode.asArray({ start: 1, end: 11 },
                        AST.TypeNode.asIdentifier({ start: 5, end: 11 }, 'String'),
                        AST.ExprNode.asInteger({ start: 2, end: 4 }, 10)
                    )
                ),
            },

            // Tuple with complex types
            {
                input: '.{?i32, *String, []bool}',
                success: true,
                output: AST.TypeNode.asTuple({ start: 0, end: 24 }, [
                    AST.TypeNode.asOptional({ start: 2, end: 6 },
                        AST.TypeNode.asSigned({ start: 3, end: 6 }, 'i32', 32)
                    ),
                    AST.TypeNode.asPointer({ start: 8, end: 15 },
                        AST.TypeNode.asIdentifier({ start: 9, end: 15 }, 'String')
                    ),
                    AST.TypeNode.asArray({ start: 17, end: 23 },
                        AST.TypeNode.asBool({ start: 19, end: 23 })
                    )
                ]),
            },
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Type', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝