// utils.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as ParseLib                from '@je-es/parser';
    import * as rules                   from '../src/rules';
    import * as AST                     from '@je-es/ast';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ TYPE ════════════════════════════════════════╗

    export type ParserTestCase = Record<string, {
        name            ?: string,
        input           : string,
        success         : boolean,
        output          : unknown,
    }[]>;

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    export const DEF_SPAN = { start: 0, end: 0 }

    export function testParser(startRule: string | undefined, cases: ParserTestCase) {
        // [1] Create syntax
        const syntax = startRule ? rules.KemetSyntax.from(startRule, 'off') : rules.KemetSyntax;

        // [2] Run tests
        for (const [group, tests] of Object.entries(cases)) {
            describe(group, () => {
                for (const { name, input, success, output } of tests) {
                    it(name ?? input, () => {

                        // Parse input using our syntax.
                        // This test case will fail if the parsing fails.
                        // The parserResult will contain the AST if the parsing is successful,
                        // and an array of errors if the parsing fails.
                        const result : ParseLib.ParseResult = syntax.parse(input);
                        const expectedErrors = (output as ParseLib.ParseError[]);

                        function check () {
                            const result_status = result.errors.length === 0;
                            // Success and error count must match
                            expect(result_status).toEqual(success);

                            if(result.errors.length) {
                                // Diagnostic count must match
                                expect(result.errors.length).toEqual(expectedErrors.length);

                                // Diagnostic messages must match
                                for (let i = 0; i < result.errors.length; i++) {
                                    expect(result.errors[i].msg).toEqual(expectedErrors[i].msg);
                                    if(expectedErrors[i].span)
                                    expect(result.errors[i].span).toEqual(expectedErrors[i].span);
                                }
                            } else {
                                // AST must match
                                expect(result.ast[0].getCustomData()!).toEqual(output);
                            }
                        }

                        // a trick for debugging (delete it later)
                        try     { check(); }
                        catch   { console.warn(JSON.stringify(result, null, 2)); }

                        check();
                    });
                }
            });
        }
    }

    // a temp helper to wrap the binary with paren (with modified span)
    // for easy move from '(1+1)' to '1+1'
    export function asParenBinary(span: AST.Span, left: AST.ExprNode, operator: string, right: AST.ExprNode) : AST.ExprNode {
        const inSpan = { start: span.start+1, end: span.end-1 };
        return AST.ExprNode.asParen(span, AST.ExprNode.asBinary(inSpan, left, operator, right));
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝