// object.test.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as AST                         from '@je-es/ast';
    import { testParser, asParenBinary }    from '../utils';
    import { PropNode }     from '@je-es/ast';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗


    const cases = {

        Objects: [
            // Empty object
            {
                input: '{}',
                success     : true,
                output: AST.ExprNode.asObject({ start: 0, end: 2 }, [])
            },

            // new object
            {
                input: 'new MyObject {}',
                success     : true,
                output: AST.ExprNode.asObject({ start: 0, end: 15 }, [],
                    AST.IdentNode.create({start: 4, end: 12}, 'MyObject')
                )
            },

            // Simple object with one property
            {
                input: '{ name: "Ahmed" }',
                success     : true,
                output: AST.ExprNode.asObject({ start: 0, end: 17 }, [
                    PropNode.create({ start: 2, end: 15 },
                        AST.IdentNode.create({ start: 2, end: 6 }, 'name'),
                        AST.ExprNode.asString({ start: 8, end: 15 }, 'Ahmed')
                    )
                ])
            },

            // Object with multiple properties
            {
                input: '{ name: "Ahmed", age: 25, active: true }',
                success     : true,
                output: AST.ExprNode.asObject({ start: 0, end: 40 }, [
                    PropNode.create({ start: 2, end: 15 },
                        AST.IdentNode.create({ start: 2, end: 6 }, 'name'),
                        AST.ExprNode.asString({ start: 8, end: 15 }, 'Ahmed')
                    ),
                    PropNode.create({ start: 17, end: 24 },
                        AST.IdentNode.create({ start: 17, end: 20 }, 'age'),
                        AST.ExprNode.asInteger({ start: 22, end: 24 }, 25)
                    ),
                    PropNode.create({ start: 26, end: 38 },
                        AST.IdentNode.create({ start: 26, end: 32 }, 'active'),
                        AST.ExprNode.asBool({ start: 34, end: 38 }, true)
                    )
                ])
            },

            // Object with nested object
            {
                input: '{ user: { name: "Ali", id: 1 } }',
                success     : true,
                output: AST.ExprNode.asObject({ start: 0, end: 32 }, [
                    PropNode.create({ start: 2, end: 30 },
                        AST.IdentNode.create({ start: 2, end: 6 }, 'user'),
                        AST.ExprNode.asObject({ start: 8, end: 30 }, [
                            PropNode.create({ start: 10, end: 21 },
                                AST.IdentNode.create({ start: 10, end: 14 }, 'name'),
                                AST.ExprNode.asString({ start: 16, end: 21 }, 'Ali')
                            ),
                            PropNode.create({ start: 23, end: 28 },
                                AST.IdentNode.create({ start: 23, end: 25 }, 'id'),
                                AST.ExprNode.asInteger({ start: 27, end: 28 }, 1)
                            )
                        ])
                    )
                ])
            },

            // Object with computed expressions
            {
                input: '{ sum: (a + b), result: (x * 2) }',
                success     : true,
                output: AST.ExprNode.asObject({ start: 0, end: 33 }, [
                    PropNode.create({ start: 2, end: 14 },
                        AST.IdentNode.create({ start: 2, end: 5 }, 'sum'),
                        asParenBinary({ start: 7, end: 14 },
                            AST.ExprNode.asIdent({ start: 8, end: 9 }, 'a', false),
                            '+',
                            AST.ExprNode.asIdent({ start: 12, end: 13 }, 'b', false)
                        )
                    ),
                    PropNode.create({ start: 16, end: 31 },
                        AST.IdentNode.create({ start: 16, end: 22 }, 'result'),
                        asParenBinary({ start: 24, end: 31 },
                            AST.ExprNode.asIdent({ start: 25, end: 26 }, 'x', false),
                            '*',
                            AST.ExprNode.asInteger({ start: 29, end: 30 }, 2)
                        )
                    )
                ])
            },

            // Object with array property
            {
                input: '{ items: [1, 2, 3], count: 3 }',
                success     : true,
                output: AST.ExprNode.asObject({ start: 0, end: 30 }, [
                    PropNode.create({ start: 2, end: 18 },
                        AST.IdentNode.create({ start: 2, end: 7 }, 'items'),
                        AST.ExprNode.asArray({ start: 9, end: 18 }, [
                            AST.ExprNode.asInteger({ start: 10, end: 11 }, 1),
                            AST.ExprNode.asInteger({ start: 13, end: 14 }, 2),
                            AST.ExprNode.asInteger({ start: 16, end: 17 }, 3)
                        ])
                    ),
                    PropNode.create({ start: 20, end: 28 },
                        AST.IdentNode.create({ start: 20, end: 25 }, 'count'),
                        AST.ExprNode.asInteger({ start: 27, end: 28 }, 3)
                    )
                ])
            }
        ],

    };

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TEST ════════════════════════════════════════╗

    testParser('Expr', cases);

// ╚══════════════════════════════════════════════════════════════════════════════════════╝