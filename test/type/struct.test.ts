// struct.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    const cases = {

        StructTypeMustSucceed: [
            // Empty struct
            {
                input: 'struct {}',
                success: true,
                output: AST.TypeNode.asStruct({ start: 0, end: 9 }, [])
            },

            // Struct with single field
            {
                input: 'struct { x: i32 }',
                success: true,
                output: AST.TypeNode.asStruct({ start: 0, end: 17 }, [
                    AST.StructMemberNode.createField(
                        { start: 9, end: 17 },
                        AST.FieldNode.create(
                            { start: 9, end: 17 },
                            { kind: 'Private', span: undefined, },
                            { kind: 'Runtime', },
                            { kind: 'Immutable', span: undefined },
                            AST.IdentNode.create({ start: 9, end: 10 }, 'x'),
                            AST.TypeNode.asSigned({ start: 12, end: 15 }, 'i32', 32))
                        )
                ])
            },

            // Struct with public field
            {
                input: 'struct { pub x: i32 }',
                success: true,
                output: AST.TypeNode.asStruct({ start: 0, end: 21 }, [
                    AST.StructMemberNode.createField(
                        { start: 9, end: 21 },
                        AST.FieldNode.create(
                            { start: 9, end: 21 },
                            { kind: 'Public', span: { start: 9, end: 12 }, },
                            { kind: 'Runtime', },
                            { kind: 'Immutable', span: undefined },
                            AST.IdentNode.create({ start: 13, end: 14 }, 'x'),
                            AST.TypeNode.asSigned({ start: 16, end: 19 }, 'i32', 32))
                        )
                ])
            },

            // Struct with static field
            {
                input: 'struct { static count: u32 }',
                success: true,
                output: AST.TypeNode.asStruct({ start: 0, end: 28 }, [
                    AST.StructMemberNode.createField(
                        { start: 9, end: 28 },
                        AST.FieldNode.create(
                            { start: 9, end: 28 },
                            { kind: 'Static', span: { start: 9, end: 15 }, },
                            { kind: 'Runtime', },
                            { kind: 'Immutable', span: undefined },
                            AST.IdentNode.create({ start: 16, end: 21 }, 'count'),
                            AST.TypeNode.asUnsigned({ start: 23, end: 26 }, 'u32', 32))
                        )
                ])
            },

            // Struct with field and initializer
            {
                input: 'struct { count = 0 }',
                success: true,
                output: AST.TypeNode.asStruct({ start: 0, end: 20 }, [
                    AST.StructMemberNode.createField(
                        { start: 9, end: 18 },
                        AST.FieldNode.create(
                            { start: 9, end: 18 },
                            { kind: 'Private', span: undefined, },
                            { kind: 'Runtime', },
                            { kind: 'Immutable', span: undefined },
                            AST.IdentNode.create({ start: 9, end: 14 }, 'count'),
                            undefined,
                            AST.ExprNode.asInteger({ start: 17, end: 18 }, 0))
                        )
                ])
            },

            // Struct with mixed fields
            {
                input: 'struct { x: i32; pub y = 10 }',
                success: true,
                output: AST.TypeNode.asStruct({ start: 0, end: 29 }, [
                    AST.StructMemberNode.createField(
                        { start: 9, end: 16 },
                        AST.FieldNode.create(
                            { start: 9, end: 16 },
                            { kind: 'Private', span: undefined, },
                            { kind: 'Runtime', },
                            { kind: 'Immutable', span: undefined },
                            AST.IdentNode.create({ start: 9, end: 10 }, 'x'),
                            AST.TypeNode.asSigned({ start: 12, end: 15 }, 'i32', 32))
                    ),
                    AST.StructMemberNode.createField(
                        { start: 17, end: 27 },
                        AST.FieldNode.create(
                            { start: 17, end: 27 },
                            { kind: 'Public', span: { start: 17, end: 20 }, },
                            { kind: 'Runtime', },
                            { kind: 'Immutable', span: undefined, },
                            AST.IdentNode.create({ start: 21, end: 22 }, 'y'),
                            undefined,
                            AST.ExprNode.asInteger({ start: 25, end: 27 }, 10))
                        )
                ])
            },

            // Struct with method
            {
                input: 'struct { static fn someFunc() {} }',
                success: true,
                output: AST.TypeNode.asStruct({ start: 0, end: 34 }, [
                    AST.StructMemberNode.createMethod(
                        { start: 9, end: 32 },
                        AST.FuncStmtNode.create(
                            { start: 9, end: 32 },
                            { kind: 'Static', span: { start: 9, end: 15 }, },
                            { kind: 'Runtime', },
                            false,
                            AST.IdentNode.create({ start: 19, end: 27 }, 'someFunc'),
                            [],
                            AST.StmtNode.asBlock({start: 30, end: 32}, []),
                            undefined,
                            undefined,
                        )
                    ),
                ])
            },
        ],

        StructTypeMustFails: [
            // Missing opening brace
            {
                input: 'struct',
                success: false,
                output: [{
                    msg: "Expected '{' after `struct` keyword",
                    span: { start: 6, end: 7 }
                }]
            },

            // Missing closing brace
            {
                input: 'struct {',
                success: false,
                output: [{
                    msg: "Expected '}' after struct body",
                    span: { start: 8, end: 9 }
                }]
            },

            // Missing opening and closing braces
            {
                input: 'struct x: i32',
                success: false,
                output: [{
                    msg: "Expected '{' after `struct` keyword",
                    span: { start: 6, end: 7 }
                }]
            },

            // Invalid field definition (missing type and initializer)
            {
                input: 'struct { x }',
                success: false,
                output: [{
                    msg: "Expected type or initializer after field name",
                    span: { start: 9, end: 10 }
                }]
            }
        ]

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Type', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝