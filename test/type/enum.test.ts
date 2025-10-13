// enum.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    const cases = {

        EnumTypeMustSucceed: [
            // Empty enum
            {
                input: 'enum {}',
                success: true,
                output: AST.TypeNode.asEnum({ start: 0, end: 7 }, [])
            },

            // Simple enum with unit variants
            {
                input: 'enum { Red, Green, Blue }',
                success: true,
                output: AST.TypeNode.asEnum({ start: 0, end: 25 }, [
                    AST.EnumVariantNode.create({ start: 7, end: 11 }, AST.IdentNode.create({start: 7, end: 10}, 'Red')),
                    AST.EnumVariantNode.create({ start: 12, end: 18 }, AST.IdentNode.create({start: 12, end: 17}, 'Green')),
                    AST.EnumVariantNode.create({ start: 19, end: 25 }, AST.IdentNode.create({start: 19, end: 23}, 'Blue'))
                ])
            },

            // Enum with typed variant
            {
                input: 'enum { None, Some:i32 }',
                success: true,
                output: AST.TypeNode.asEnum({ start: 0, end: 23 }, [
                    AST.EnumVariantNode.create({ start: 7, end: 12 }, AST.IdentNode.create({start: 7, end: 11}, 'None')),
                    AST.EnumVariantNode.create({ start: 13, end: 21 }, AST.IdentNode.create({start: 13, end: 17}, 'Some'), AST.TypeNode.asSigned({ start: 18, end: 21 }, 'i32', 32))
                ])
            },

            // Enum with different types
            {
                input: 'enum { Empty, Value:String , Count:u32  }',
                success: true,
                output: AST.TypeNode.asEnum({ start: 0, end: 41 }, [
                    AST.EnumVariantNode.create({ start: 7, end: 13 }, AST.IdentNode.create({start: 7, end: 12}, 'Empty')),
                    AST.EnumVariantNode.create({ start: 14, end: 26 }, AST.IdentNode.create({start: 14, end: 19}, 'Value'), AST.TypeNode.asIdentifier({ start: 20, end: 26 }, 'String')),
                    AST.EnumVariantNode.create({ start: 29, end: 38 }, AST.IdentNode.create({start: 29, end: 34}, 'Count'), AST.TypeNode.asUnsigned({ start: 35, end: 38 }, 'u32', 32))
                ])
            },

            // Enum with structure
            {
                input: 'enum { Config: struct { width: i32 } }',
                success: true,
                output: AST.TypeNode.asEnum({ start: 0, end: 38 },
                    [
                        AST.EnumVariantNode.create(
                            { start: 7, end: 36 },
                            AST.IdentNode.create({start: 7, end: 13}, 'Config'),
                            AST.TypeNode.asStruct({ start: 15, end: 36 },
                                [
                                    AST.StructMemberNode.createField(
                                        { start: 24, end: 36 },
                                        AST.FieldNode.create({start: 24, end: 36},
                                            { kind: 'Private', span: undefined, },
                                            { kind: 'Runtime', },
                                            { kind: 'Immutable', span: undefined },
                                            AST.IdentNode.create({start: 24, end: 29}, 'width'),
                                            AST.TypeNode.asSigned({ start: 31, end: 34 }, 'i32', 32)
                                        )
                                    )
                                ]
                            )
                        )
                    ]
                )
            },
        ],

        EnumTypeMustFails: [
            // Missing opening brace
            {
                input: 'enum',
                success: false,
                output: [{
                    msg: "Expected '{' after `enum` keyword",
                    span: { start: 4, end: 5 }
                }]
            },

            // Missing closing brace
            {
                input: 'enum {',
                success: false,
                output: [{
                    msg: "Expected '}' after enum body",
                    span: { start: 6, end: 7 }
                }]
            },

            // Missing opening and closing braces
            {
                input: 'enum Red, Green, Blue',
                success: false,
                output: [{
                    msg: "Expected '{' after `enum` keyword",
                    span: { start: 4, end: 5 }
                }]
            },

            // Expected `:` before type
            {
                input: 'enum { Red i32 }',
                success: false,
                output: [{
                    msg: "Expected `:` before type",
                    span: { start: 11, end: 14 }
                }]
            },

            // Expected type after `:`
            {
                input: 'enum { Red : }',
                success: false,
                output: [{
                    msg: "Expected type after `:`",
                    span: { start: 11, end: 12 }
                }]
            },

        ]

    };

    testParser('Type', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝