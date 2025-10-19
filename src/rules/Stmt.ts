// Stmt.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as ParserLib       from '@je-es/parser';
    import * as AST             from '@je-es/ast';
    import { ParseError }       from '@je-es/parser';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    export const Stmt: ParserLib.Rules = [

        // ════════════ ROOT ════════════

            ParserLib.createRule('Stmt',
                ParserLib.seq(
                    ParserLib.choice(
                        ParserLib.rule('BlockStmt'),
                        ParserLib.rule('BreakStmt'),
                        ParserLib.rule('ContinueStmt'),
                        ParserLib.rule('FnStmt'),
                        ParserLib.rule('LetStmt'),
                        ParserLib.rule('UseStmt'),
                        ParserLib.rule('DefStmt'),
                        ParserLib.rule('WhileStmt'),
                        ParserLib.rule('DoStmt'),
                        ParserLib.rule('ForStmt'),
                        ParserLib.rule('ReturnStmt'),
                        ParserLib.rule('DeferStmt'),
                        ParserLib.rule('ThrowStmt'),
                        ParserLib.rule('TestStmt'),
                        ParserLib.rule('Expr'),
                    ),
                    ParserLib.optional(
                        ParserLib.token(';'),
                    ),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const FUCKING_LENGTH_BEFORE_FUCKING_EXPR = 13;

                            const seq_array     = data.getSequenceResult()!;
                            const choise_ind    = seq_array[0].getChoiceIndex()!;
                            const choise_res    = seq_array[0].getChoiceResult()!;
                            const start_span    = data.span.start;
                            const end_span      = seq_array[1].isOptionalPassed() ? seq_array[1].getOptionalResult()!.getTokenSpan()!.end : choise_res.span.end;
                            const span          = {
                                start: start_span,
                                end: end_span,
                            };

                        // ══════ Syntax validation ══════

                            // Syntax is internally validated,
                            // but we may need to add more checks here to cover cases
                            // not covered in the internal validations of each rule
                            // because each rule assumes its own specific behavior.

                        // ══════════ Build AST ══════════

                            // Non-Expr
                            if(choise_ind <= FUCKING_LENGTH_BEFORE_FUCKING_EXPR) {
                                // fix span and return
                                const stmt = choise_res.getCustomData()! as AST.StmtNode;

                                if(stmt) {
                                    stmt.span = span;
                                    return ParserLib.Result.createAsCustom(choise_res.status, 'stmt', stmt, span);
                                } else {
                                    return choise_res;
                                }

                            }

                            // Expr
                            else {
                                const expr = choise_res.getCustomData()! as AST.ExprNode;
                                const stmt = AST.StmtNode.asExpr(span, expr);
                                return ParserLib.Result.createAsCustom('passed', 'expr-stmt', stmt, span);
                            }
                    },
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('FnStmt',
                ParserLib.seq(
                    // pub | static
                    ParserLib.optional(ParserLib.choice(
                        ParserLib.token('pub'),
                        ParserLib.token('static')
                    )),
                    // comptime
                    ParserLib.optional(ParserLib.token('comptime')),
                    // inline
                    ParserLib.optional(ParserLib.token('inline')),
                    // fn <CatchPoint>
                    ParserLib.token('fn'),
                    // identifier
                    ParserLib.optional(ParserLib.rule('Ident')),
                    // (
                    ParserLib.optional(ParserLib.token('(')),
                    // parameters
                    ParserLib.optional(
                        ParserLib.oneOrMore(
                            ParserLib.rule('Parameter'),
                            ParserLib.token(','),
                        ),
                    ),
                    // )
                    ParserLib.optional(ParserLib.token(')')),

                    ParserLib.optional(ParserLib.token('->')),

                    // error type can be : ident(MyError) or access(MySet.MyError) and later `errset { A, B }`
                    ParserLib.optional(ParserLib.rule('Type')),
                    ParserLib.optional(ParserLib.token('!')),
                    ParserLib.optional(ParserLib.rule('Type')),

                    // body (can be stmt or block of stmts)
                    ParserLib.optional(ParserLib.rule('Stmt')),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;

                            const isAttr            = seq_array[0].isOptionalPassed();
                            const isPublic          = isAttr && seq_array[0].getOptionalResult()!.getChoiceIndex() === 0;
                            const isStatic          = isAttr && seq_array[0].getOptionalResult()!.getChoiceIndex() === 1;
                            const isComptime        = seq_array[1].isOptionalPassed();
                            const isInline          = seq_array[2].isOptionalPassed();
                            const isIdent           = seq_array[4].isOptionalPassed();
                            const isOpeningParen    = seq_array[5].isOptionalPassed();
                            const isParams          = seq_array[6].isOptionalPassed();
                            const isClosingParen    = seq_array[7].isOptionalPassed();
                            const isArrowSign       = seq_array[8].isOptionalPassed();
                            const isErrorType       = seq_array[9].isOptionalPassed();
                            const isNotSign         = seq_array[10].isOptionalPassed();
                            const isReturnType      = seq_array[11].isOptionalPassed();
                            const isBody            = seq_array[12].isOptionalPassed();

                            const visibilitySpan    = isAttr         ? seq_array[0].span : undefined;
                            const comptimeSpan      = isComptime     ? seq_array[1].span : undefined;
                            const fnSpan            = seq_array[3].getTokenSpan()!;
                            const openingParenSpan  = isOpeningParen ? seq_array[5].span : undefined;
                            const closingParenSpan  = isClosingParen ? seq_array[7].span : undefined;
                            const arrowSignSpan     = isArrowSign    ? seq_array[8].span : undefined;
                            const notSignSpan       = isNotSign      ? seq_array[10].span : undefined;

                            let ident       = isIdent       ? seq_array[ 4].getOptionalResult()!.getCustomData()! as AST.IdentNode  : undefined;
                            let parameters  = [] as AST.FieldNode[];
                            let errorType   = isErrorType   ? seq_array[ 9].getOptionalResult()!.getCustomData()! as AST.TypeNode   : undefined;
                            let returnType  = isReturnType  ? seq_array[11].getOptionalResult()!.getCustomData()! as AST.TypeNode   : undefined;
                            let body        = isBody        ? seq_array[12].getOptionalResult()!.getCustomData()! as AST.StmtNode   : undefined;

                            if (isParams) {
                                const paramList = seq_array[6].getOptionalResult()!.getRepeatResult()!;
                                parameters = paramList.map(r => r.getCustomData()! as AST.FieldNode);
                            }

                            // if we have an error type, but no return type and no not sign, then the error type is the return type
                            if(errorType && !returnType && !isNotSign) {
                                // if the error type is not an error type or an ident, then it is the return type
                                if(!errorType!.isErrset() && !isNotSign) {
                                    returnType = errorType;
                                    errorType = undefined;
                                }
                            }

                            // default error type
                            if(isNotSign && !errorType) {
                                errorType = AST.TypeNode.asErr();
                            }

                            let lastElemSpan = data.span;
                            {
                                if(isBody) {
                                    lastElemSpan = body!.span;
                                } else if(returnType) {
                                    lastElemSpan = returnType.span;
                                } else if(isNotSign) {
                                    lastElemSpan = notSignSpan!;
                                } else if(errorType) {
                                    lastElemSpan = errorType.span;
                                } else if(isArrowSign) {
                                    lastElemSpan = arrowSignSpan!;
                                } else if(isClosingParen) {
                                    lastElemSpan = closingParenSpan!;
                                } else if(isParams && parameters.length) {
                                    lastElemSpan = parameters[parameters.length-1].span;
                                } else if(isOpeningParen) {
                                    lastElemSpan = openingParenSpan!;
                                } else if(isIdent) {
                                    lastElemSpan = ident!.span;
                                } else {
                                    lastElemSpan = fnSpan;
                                }
                            }

                        // ══════ Syntax validation ══════

                            // Missing identifier
                            if (!ident) {
                                throw {
                                    msg: "Expected identifier after `fn` keyword",
                                    span: fnSpan,
                                } as ParseError;
                            }

                            // Missing opening parenthesis
                            if (!isOpeningParen) {
                                throw {
                                    msg: "Expected `(` after function name",
                                    span: ident.span,
                                } as ParseError;
                            }

                            // Missing closing parenthesis
                            if (!isClosingParen) {
                                throw {
                                    msg: isParams && parameters.length
                                            ? "Expected `)` after parameters"
                                            : "Expected parameters or `)` after `(`",
                                    span: isParams && parameters.length
                                            ? { start: openingParenSpan!.start, end: parameters[parameters.length-1].span.end }
                                            : openingParenSpan
                                } as ParseError;
                            }

                            // Return type arrow without type
                            if (isArrowSign && !returnType) {
                                throw {
                                    msg: "Expected return type after `->`",
                                    span: arrowSignSpan,
                                } as ParseError;
                            }

                            // Return type without arrow
                            if (!isArrowSign && returnType) {
                                throw {
                                    msg: "Expected `->` before return type",
                                    span: returnType.span,
                                } as ParseError;
                            }

                            // Error type without `!`
                            if (errorType && !isNotSign) {
                                throw {
                                    msg: "Expected `!` after error type",
                                    span: errorType.span,
                                } as ParseError;
                            }

                            // will never happend after this update.
                            // // `!` without error type
                            // if (!errorType && isNotSign) {
                            //     throw {
                            //         msg: "Expected error type before `!`",
                            //         span: notSignSpan,
                            //     } as ParseError;
                            // }

                            // Invalid Error type
                            if(errorType && !errorType!.isErrset() && !errorType!.isErr() && !errorType!.isIdent()) {
                                throw {
                                    msg: "Error type must be error name or error set",
                                    span: errorType!.span,
                                } as ParseError;
                            }

                            // Missing body
                            if (!body) {
                                // throw new Error("Expected function body");
                                throw {
                                    msg: "Expected function body",
                                    span: {
                                        start: lastElemSpan.end,
                                        end: lastElemSpan.end + 1,
                                    },
                                } as ParseError;
                            }

                        // ══════════ Build AST ══════════

                            const result = AST.StmtNode.asFunc(
                                data.span,
                                {
                                    kind: isPublic ? 'Public' : isStatic ? 'Static' : 'Private',
                                    span: visibilitySpan,
                                },
                                {
                                    kind: isComptime ? 'Comptime' : 'Runtime',
                                    span: comptimeSpan,
                                },
                                isInline,
                                ident,
                                parameters,
                                errorType,
                                returnType,
                                body
                            );

                            return ParserLib.Result.createAsCustom('passed', 'function-stmt', result, data.span);
                    },
                    errors: [
                        ParserLib.error(1, 'Expected `fn` keyword'),
                    ]
                }
            ),

            ParserLib.createRule('UseStmt',
                ParserLib.seq(
                    // pub | static
                    ParserLib.optional(ParserLib.choice(
                        ParserLib.token('pub'),
                        ParserLib.token('static')
                    )),
                    // use  <CatchPoint>
                    ParserLib.token('use'),
                    // target
                    ParserLib.optional(
                        ParserLib.choice(
                            ParserLib.token('*'),
                            ParserLib.oneOrMore(
                                ParserLib.rule('Ident'),
                                ParserLib.token('.'),
                            ),
                        )
                    ),
                    // as
                    ParserLib.optional(ParserLib.token('as')),
                    // alias
                    ParserLib.optional(
                        ParserLib.choice(
                            ParserLib.rule('Ident'),    // allow
                            ParserLib.rule('Stmt'),     // reject
                        )
                    ),
                    // from
                    ParserLib.optional(ParserLib.token('from')),
                    // path
                    ParserLib.optional(ParserLib.token('slice')),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array = data.getSequenceResult()!;

                            // visibility
                            const isVisibility      = seq_array[0].isOptionalPassed();
                            const isPublic          = isVisibility && seq_array[0].getOptionalResult()!.getChoiceIndex() === 0;
                            const isStatic          = isVisibility && seq_array[0].getOptionalResult()!.getChoiceIndex() === 1;

                            const isAs              = seq_array[3].isOptionalPassed();
                            const isAlias           = seq_array[4].isOptionalPassed();
                            const isAliasIdent      = isAlias && seq_array[4].getOptionalResult()!.getChoiceIndex() === 0;
                            const isFrom            = seq_array[5].isOptionalPassed();
                            const isPath            = seq_array[6].isOptionalPassed();

                            const useSpan           = seq_array[1].span;
                            const asSpan            = isAs     ? seq_array[3].span : undefined;
                            const aliasSpan         = isAlias  ? seq_array[4].span : undefined;
                            const fromSpan          = isFrom   ? seq_array[5].span : undefined;
                            const pathSpan          = isPath   ? seq_array[6].span : undefined;
                            const visibilitySpan    = isVisibility ? seq_array[0].span : undefined;

                            // Target
                            const isTargetPassed        = seq_array[2].isOptionalPassed()!;
                            const isTargetNotButNotAll  = isTargetPassed && seq_array[2].getOptionalResult()!.getChoiceIndex()! !== 0;

                            const targetKind        : 'ident' | 'access' | 'all' | undefined
                                                    =
                                                    isTargetPassed
                                                    ? !isTargetNotButNotAll
                                                        ? 'all'
                                                        : seq_array[2].getOptionalResult()!.getChoiceResult()!.getRepeatCount()! === 1
                                                            ? 'ident'
                                                            : 'access'
                                                    : undefined;

                            const isTarget          = targetKind === 'ident' || targetKind === 'access' &&
                                                      seq_array[2].getOptionalResult()!.getChoiceResult()!.getRepeatCount()! > 0;

                            let targetArr           = targetKind === 'ident' || targetKind === 'access'
                                                    ? seq_array[2].getOptionalResult()!.getChoiceResult()!.getRepeatResult()!.map(x => x.getCustomData()! as AST.IdentNode)
                                                    : undefined;

                            // Is end with dot ?
                            const isEndWithDot      = isTargetNotButNotAll && seq_array[2].getOptionalResult()!.getChoiceResult()!.isRepeatEndsWithSep();

                            // full span
                            const targetArrSpan     = targetKind === 'ident' || targetKind === 'access' && targetArr!.length ?
                            {
                                start: targetArr![0].span.start,
                                end: isEndWithDot ? targetArr![targetArr!.length-1].span.end+1 : targetArr![targetArr!.length-1].span.end,
                            } : undefined;

                            // handle alias
                            let alias       = isAliasIdent ? (seq_array[4].getOptionalResult()!.getChoiceResult()!.getCustomData()! as AST.IdentNode) : undefined;

                            // handle path
                            let path        = isPath ? seq_array[6].getOptionalResult()!.getTokenData()!.value ?? ""      : undefined;

                        // ══════ Syntax validation ══════

                            // Missing target
                            if(targetKind === undefined) {
                                throw {
                                    msg: "Expected identifier after `use` keyword",
                                    span: useSpan,
                                } as ParseError;
                            }

                            // ends with .
                            if(isEndWithDot) {
                                throw {
                                    msg: "Expected identifier after `.` in target",
                                    span: targetArrSpan,
                                } as ParseError;
                            }

                            // If 'from' is present, path must be present
                            if(isFrom && !isPath) {
                                throw {
                                    msg: "Expected module path after `from` keyword",
                                    span: fromSpan
                                } as ParseError;
                            }

                            // If 'from' is not present, path must not be present
                            if(!isFrom && isPath) {
                                throw {
                                    msg: "Expected `from` keyword before module path",
                                    span: pathSpan
                                } as ParseError;
                            }

                            // Check for empty path string
                            if (path === "") {
                                throw {
                                    msg: "Module path cannot be empty",
                                    span: pathSpan!
                                } as ParseError;
                            }

                            // Missing alias
                            if(isAs && !isAlias) {
                                throw {
                                    msg: "Expected identifier after `as` keyword",
                                    span: asSpan
                                } as ParseError;
                            }

                            // Invalid alias
                            if(!isAliasIdent && isAlias && isAs) {
                                throw {
                                    msg: "Alias must be an identifier",
                                    span: aliasSpan,
                                } as ParseError;
                            }

                            // Missing As
                            if(isTarget && isAlias && !isAs) {
                                throw {
                                    msg: "Expected `as` keyword after alias",
                                    span: aliasSpan
                                } as ParseError;
                            }

                            // Error: 'use x;' (no from clause, no alias) is not allowed
                            if (!alias && !path) {
                                throw {
                                    msg: "Must specify either an alias or a module path",
                                    span: targetArrSpan!
                                } as ParseError;
                            }

                        // ══════════ Build AST ══════════

                            const result = AST.StmtNode.asUse(
                                data.span,
                                {
                                    kind: isPublic ? 'Public' : isStatic ? 'Static' : 'Private',
                                    span: visibilitySpan,
                                },
                                targetKind === 'all' ? undefined : targetArr!,
                                alias,
                                path,
                                pathSpan
                            );
                            return ParserLib.Result.createAsCustom('passed', 'use-stmt', result, data.span);
                    },
                }
            ),

            ParserLib.createRule('DefStmt',
                ParserLib.seq(
                    // pub | static
                    ParserLib.optional(ParserLib.choice(
                        ParserLib.token('pub'),
                        ParserLib.token('static')
                    )),
                    // def <CatchPoint>
                    ParserLib.token(`def`),
                    // ident
                    ParserLib.optional(ParserLib.rule('Ident')),
                    // =
                    ParserLib.optional(ParserLib.token(`=`)),
                    // type
                    ParserLib.optional(ParserLib.rule('Type')),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;

                            const isAttr            = seq_array[0].isOptionalPassed();
                            const isPublic          = isAttr && seq_array[0].getOptionalResult()!.getChoiceIndex() === 0;
                            const isStatic          = isAttr && seq_array[0].getOptionalResult()!.getChoiceIndex() === 1;
                            const isIdent           = seq_array[2].isOptionalPassed();
                            const isEqualSign       = seq_array[3].isOptionalPassed();
                            const isType            = seq_array[4].isOptionalPassed();

                            let ident               = isIdent ? seq_array[2].getOptionalResult()!.getCustomData()! as AST.IdentNode : undefined;
                            let type                = isType ? seq_array[4].getOptionalResult()!.getCustomData()! as AST.TypeNode : undefined;

                            const defSpan           = seq_array[1].span;
                            const equalSignSpan     = seq_array[3].span;
                            const visibilitySpan    = isAttr ? seq_array[0].span : undefined;

                        // ══════ Syntax validation ══════

                            if(!isIdent) {
                                throw {
                                    msg: "Expected identifier after `def` keyword",
                                    span: defSpan,
                                }
                            }

                            // type without `=`
                            if(type && !isEqualSign) {
                                // throw new Error("Expected `=` before type");
                                throw {
                                    msg: "Expected `=` before type",
                                    span: { start: type.span.start - 1, end: type.span.start, },
                                } as ParseError
                            }

                            // `=` without type
                            if(!type && isEqualSign) {
                                throw {
                                    msg: "Expected type after `=`",
                                    span: equalSignSpan,
                                } as ParseError
                            }

                            // if no :type and not =expr so reject
                            if(!type) {
                                throw {
                                    msg: `Missing type`,
                                    span: defSpan,
                                } as ParseError
                            }

                        // ══════════ Build AST ══════════

                            if(type.isStruct()) type.getStruct()!.name = ident!.name;

                            return ParserLib.Result.createAsCustom( 'passed', 'def-stmt',
                                AST.StmtNode.asDefine(
                                    data.span,
                                    {
                                        kind: isPublic ? 'Public' : isStatic ? 'Static' : 'Private',
                                        span: visibilitySpan,
                                    },
                                    ident!,
                                    type!,
                                ),
                                data.span
                            );
                    }
                }
            ),

            ParserLib.createRule('BlockStmt',
                ParserLib.seq(
                    ParserLib.token('{'),
                    ParserLib.zeroOrMore(ParserLib.rule('Stmt')),
                    ParserLib.token('}'),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array     = data.getSequenceResult()!;
                            const span          = { start: seq_array[0].getTokenSpan()!.start, end: seq_array[2].getTokenSpan()!.end };
                            const stmtsCount    = seq_array[1].getRepeatCount()!;
                            const stmts         = stmtsCount > 0
                                                ? seq_array[1].getRepeatResult()!.map((x) => x.getCustomData()! as AST.StmtNode)
                                                : [];

                        // ══════════ Build AST ══════════

                            const result = AST.StmtNode.asBlock(span, stmts);
                            return ParserLib.Result.createAsCustom('passed', 'block-stmt', result, span);
                    },
                }
            ),

            ParserLib.createRule('TestStmt',
                ParserLib.seq(
                    ParserLib.token('test'),
                    ParserLib.optional(ParserLib.token('slice')),
                    ParserLib.optional(ParserLib.rule('BlockStmt')),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array     = data.getSequenceResult()!;

                            const isNamePassed  = seq_array[1].isOptionalPassed();
                            const isBlockPassed = seq_array[2].isOptionalPassed();

                            const nameToken     = isNamePassed ? seq_array[1].getOptionalResult()!.getTokenData()! : undefined;
                            const blockStmt     = isBlockPassed ? seq_array[2].getOptionalResult()!.getCustomData()! as AST.StmtNode : undefined;

                            const testSpan      = seq_array[0].span;

                        // ══════════ Syntax validation ══════════

                            // Missing block
                            if(!isBlockPassed) {
                                if(isNamePassed) {
                                    throw {
                                        msg: "Expected block statement after test name",
                                        span: nameToken!.span,
                                    } as ParseError;
                                } else {
                                    throw {
                                        msg: "Expected block statement or test name after `test` keyword",
                                        span: testSpan,
                                    } as ParseError;
                                }
                            }

                        // ══════════ Build AST ══════════

                            const nameInfo = isNamePassed ? {
                                name: nameToken!.value!,
                                span: nameToken!.span,
                            } : undefined;
                            const result = AST.StmtNode.asTest(data.span, nameInfo, blockStmt!.getBlock()!);
                            return ParserLib.Result.createAsCustom('passed', 'test-stmt', result, data.span);
                    },
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('WhileStmt',
                ParserLib.seq(
                    // while <Catchpoint>
                    ParserLib.token('while'),
                    // expr
                    ParserLib.optional(ParserLib.rule('Expr')),
                    // stmt
                    ParserLib.optional(ParserLib.rule('Stmt'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;

                            const isExpr            = seq_array[1].isOptionalPassed();
                            const isStmt            = seq_array[2].isOptionalPassed();

                            const expr              = isExpr ? seq_array[1].getOptionalResult()!.getCustomData()! as AST.ExprNode : undefined;
                            const stmt              = isStmt ? seq_array[2].getOptionalResult()!.getCustomData()! as AST.StmtNode : undefined;

                            const whileSpan         = seq_array[0].span;

                        // ══════════ Syntax validation ══════════

                            // Missing expression
                            if(!isExpr) {
                                throw {
                                    msg: "Expected expression after `while` keyword",
                                    span: whileSpan,
                                } as ParseError;
                            }

                            // Missing statement
                            if(!isStmt) {
                                throw {
                                    msg: "Expected statement after expression",
                                    span: expr!.span,
                                } as ParseError;
                            }

                        // ═══════════ Build AST ══════════

                            const result = AST.StmtNode.asWhile(data.span, expr!, stmt!);
                            return ParserLib.Result.createAsCustom('passed', 'while-stmt', result, data.span);
                    },
                }
            ),

            ParserLib.createRule('DoStmt',
                ParserLib.seq(
                    // do <Catchpoint>
                    ParserLib.token('do'),
                    // stmt
                    ParserLib.optional(ParserLib.rule('Stmt')),
                    // while <Catchpoint>
                    ParserLib.optional(ParserLib.token('while')),
                    // expression
                    ParserLib.optional(ParserLib.rule('Expr'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;

                            const isStmt            = seq_array[1].isOptionalPassed();
                            const isWhile           = seq_array[2].isOptionalPassed();
                            const isExpr            = seq_array[3].isOptionalPassed();

                            const stmt              = isStmt ? seq_array[1].getOptionalResult()!.getCustomData()! as AST.StmtNode : undefined;
                            const expr              = isExpr ? seq_array[3].getOptionalResult()!.getCustomData()! as AST.ExprNode : undefined;

                            const doSpan           = seq_array[0].span;
                            const whileSpan        = isWhile ? seq_array[2].span : undefined;

                        // ══════════ Syntax validation ══════════

                            // Missing statement
                            if(!isStmt) {
                                throw {
                                    msg: "Expected statement after `do` keyword",
                                    span: doSpan,
                                } as ParseError;
                            }

                            // Missing while keyword
                            if(!isWhile) {
                                throw {
                                    msg: "Expected `while` keyword after statement",
                                    span: stmt!.span,
                                } as ParseError;
                            }

                            // Missing expression
                            if(!isExpr) {
                                throw {
                                    msg: "Expected expression after `while` keyword",
                                    span: whileSpan,
                                } as ParseError;
                            }

                        // ═══════════ Build AST ══════════

                            const result = AST.StmtNode.asDo(data.span, expr!, stmt!);
                            return ParserLib.Result.createAsCustom('passed', 'do-stmt', result, data.span);
                    },
                }
            ),

            ParserLib.createRule('ForStmt',
                ParserLib.seq(
                    // for <Catchpoint>
                    ParserLib.token('for'),
                    // expr
                    ParserLib.optional(ParserLib.rule('Expr')),
                    // stmt
                    ParserLib.optional(ParserLib.rule('Stmt'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;

                            const isExpr            = seq_array[1].isOptionalPassed();
                            const isStmt            = seq_array[2].isOptionalPassed();

                            const expr              = isExpr ? seq_array[1].getOptionalResult()!.getCustomData()! as AST.ExprNode : undefined;
                            const stmt              = isStmt ? seq_array[2].getOptionalResult()!.getCustomData()! as AST.StmtNode : undefined;

                            const forSpan         = seq_array[0].span;

                        // ══════════ Syntax validation ══════════

                            // Missing expression
                            if(!isExpr) {
                                throw {
                                    msg: "Expected range expression after `for` keyword",
                                    span: forSpan,
                                } as ParseError;
                            }

                            // Invalid expression type (must be range type)
                            if(!expr!.isOrEndWith('Range')) {
                                throw {
                                    msg: "Expected range expression after `for` keyword",
                                    span: expr!.span,
                                } as ParseError;
                            }

                            // Missing statement
                            if(!isStmt) {
                                throw {
                                    msg: "Expected statement after range expression",
                                    span: expr!.span,
                                } as ParseError;
                            }

                        // ═══════════ Build AST ══════════

                            const result = AST.StmtNode.asFor(data.span, expr!, stmt!);
                            return ParserLib.Result.createAsCustom('passed', 'for-stmt', result, data.span);
                    },
                }
            ),

            ParserLib.createRule('ReturnStmt',
                ParserLib.seq(
                    // return <Catchpoint>
                    ParserLib.token('return'),
                    // expr
                    ParserLib.optional(ParserLib.rule('Expr'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;
                            const isExpr            = seq_array[1].isOptionalPassed();
                            const expr              = isExpr ? seq_array[1].getOptionalResult()!.getCustomData()! as AST.ExprNode : undefined;

                        // ═══════════ Build AST ══════════

                            const result = AST.StmtNode.asReturn(data.span, expr);
                            return ParserLib.Result.createAsCustom('passed', 'return-stmt', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('DeferStmt',
                ParserLib.seq(
                    // defer <Catchpoint>
                    ParserLib.token('defer'),
                    // expr
                    ParserLib.optional(ParserLib.rule('Expr'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;
                            const isExpr            = seq_array[1].isOptionalPassed();
                            const expr              = isExpr ? seq_array[1].getOptionalResult()!.getCustomData()! as AST.ExprNode : undefined;

                            const deferSpan         = seq_array[0].span;

                        // ══════════ Syntax validation ══════════

                            // Missing expression
                            if(!isExpr) {
                                throw {
                                    msg: "Expected expression after `defer` keyword",
                                    span: deferSpan,
                                } as ParseError;
                            }

                        // ═══════════ Build AST ══════════

                            const result = AST.StmtNode.asDefer(data.span, expr);
                            return ParserLib.Result.createAsCustom('passed', 'defer-stmt', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('ThrowStmt',
                ParserLib.seq(
                    // throw <Catchpoint>
                    ParserLib.token('throw'),
                    // expr
                    ParserLib.optional(ParserLib.rule('Expr'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;
                            const isExpr            = seq_array[1].isOptionalPassed();
                            const expr              = isExpr ? seq_array[1].getOptionalResult()!.getCustomData()! as AST.ExprNode : undefined;

                            const throwSpan         = seq_array[0].span;

                        // ══════════ Syntax validation ══════════

                            // Missing expression
                            if(!isExpr) {
                                throw {
                                    msg: "Expected expression after `throw` keyword",
                                    span: throwSpan,
                                } as ParseError;
                            }

                        // ═══════════ Build AST ══════════

                            const result = AST.StmtNode.asThrow(data.span, expr);
                            return ParserLib.Result.createAsCustom('passed', 'throw-stmt', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('BreakStmt',
                // break <Catchpoint>
                ParserLib.token('break'),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const breakSpan = data.span;

                        // ═══════════ Build AST ══════════

                            const result = AST.StmtNode.asBreak(breakSpan);
                            return ParserLib.Result.createAsCustom('passed', 'break-stmt', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('ContinueStmt',
                // continue <Catchpoint>
                ParserLib.token('continue'),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const continueSpan = data.span;

                        // ═══════════ Build AST ══════════

                            const result = AST.StmtNode.asContinue(continueSpan);
                            return ParserLib.Result.createAsCustom('passed', 'continue-stmt', result, data.span);
                    }
                }
            ),

        // ════════════ ---- ════════════

            // one builder for ( variables / function parameters / structure fields)
            createCommonVariableRule('LetStmt'),
            createCommonVariableRule('Parameter'),
            createCommonVariableRule('StructField'),

        // ════════════ ---- ════════════

    ];

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ HELP ════════════════════════════════════════╗

    // one builder for ( variables / function parameters / structure fields)
    type commonVariableKind = 'LetStmt' | 'Parameter' | 'StructField';
    function createCommonVariableRule(kind: commonVariableKind) {
        return ParserLib.createRule(kind,
            ParserLib.seq(
                // pub | static
                ParserLib.optional(ParserLib.choice(
                    ParserLib.token('pub'),
                    ParserLib.token('static')
                )),
                // comptime
                ParserLib.optional(ParserLib.token('comptime')),
                // let <CatchPoint> if Variable
                kind === 'LetStmt' ? ParserLib.token(`let`) : ParserLib.optional(ParserLib.token('let')),
                // mut
                ParserLib.optional(ParserLib.token('mut')),
                // ident  <CatchPoint> if not Variable
                kind === 'LetStmt' ? ParserLib.optional(ParserLib.rule('Ident')) : ParserLib.rule('Ident'),
                // :
                ParserLib.optional(ParserLib.token(`:`)),
                // type
                ParserLib.optional(ParserLib.rule('Type')),
                // =
                ParserLib.optional(ParserLib.token(`=`)),
                // expr
                ParserLib.optional(ParserLib.rule('Expr')),
            ),
            {
                build: (data: ParserLib.Result) => {

                    // ══════════ Extract Data ════════

                        const catchPoint : 'let' | 'ident' = kind === 'LetStmt' ? 'let' : 'ident';

                        const seq_array         = data.getSequenceResult()!;

                        const isAttr            = seq_array[0].isOptionalPassed();
                        const isPublic          = isAttr && seq_array[0].getOptionalResult()!.getChoiceIndex() === 0;
                        const isStatic          = isAttr && seq_array[0].getOptionalResult()!.getChoiceIndex() === 1;
                        const isComptime        = seq_array[1].isOptionalPassed();
                        const isLet             = catchPoint === 'let' ? true : seq_array[2].isOptionalPassed();
                        const isMutable         = seq_array[3].isOptionalPassed();
                        const isIdent           = catchPoint === 'ident' ? true : seq_array[4].isOptionalPassed();
                        const isColonSign       = seq_array[5].isOptionalPassed();
                        const isType            = seq_array[6].isOptionalPassed();
                        const isEqualSign       = seq_array[7].isOptionalPassed();
                        const isInitializer     = seq_array[8].isOptionalPassed();

                        let ident               = catchPoint === 'let' && isIdent
                                                 ? seq_array[4].getOptionalResult()!.getCustomData()! as AST.IdentNode
                                                 : catchPoint === 'ident' && isIdent
                                                 ? seq_array[4].getCustomData()! as AST.IdentNode
                                                 : undefined;

                        let type                = isType        ? seq_array[ 6].getOptionalResult()!.getCustomData()! as AST.TypeNode   : undefined;
                        let initializer         = isInitializer ? seq_array[ 8].getOptionalResult()!.getCustomData()! as AST.ExprNode   : undefined;

                        const visibilitySpan    = isAttr      ? seq_array[0].span : undefined;
                        const comptimeSpan      = isComptime  ? seq_array[1].span : undefined;
                        const letSpan           = catchPoint === 'let' ? seq_array[2].span : isLet ? seq_array[2].span : undefined;
                        const mutSpan           = isMutable   ? seq_array[3].span : undefined;
                        const colonSignSpan     = isColonSign ? seq_array[5].span : undefined;
                        const equalSignSpan     = isEqualSign ? seq_array[7].span : undefined;

                    // ══════ Syntax validation ══════

                        // static/Pub keywords now allowed with params
                        if(isAttr && kind === 'Parameter') {
                            if(isPublic) {
                                throw {
                                    msg     : "`pub` keyword is not allowed in this context",
                                    span    : visibilitySpan!,
                                } as ParseError
                            } else if(isStatic) {
                                throw {
                                    msg     : "`static` keyword is not allowed in this context",
                                    span    : visibilitySpan!,
                                } as ParseError
                            }
                        }

                        // Missing identifier (if not let stmt)
                        if(!ident && catchPoint === 'let') {
                            throw {
                                msg     : mutSpan
                                        ? "Expected identifier after `mut` keyword"
                                        : "Expected identifier after `let` keyword",
                                span    : mutSpan ?? letSpan,
                            } as ParseError
                        }

                        if(!ident) {
                            throw new Error("unreachable code detected")
                        }

                        // let keyword not-allowed in this context (if not let stmt)
                        if(isLet && catchPoint !== 'let') {
                            throw {
                                msg     : "`let` keyword is not allowed in this context",
                                span    : letSpan!,
                            } as ParseError
                        }

                        // Type without `:`
                        if(type && !isColonSign) {
                            throw {
                                msg: "Expected `:` before type",
                                span: type.span,
                            } as ParseError
                        }

                        // `:` without type
                        if(!type && isColonSign) {
                            throw {
                                msg: "Expected type after `:`",
                                span: colonSignSpan,
                            } as ParseError
                        }

                        // Initializer without `=`
                        if(initializer && !isEqualSign) {
                            // throw new Error("Expected `=` before initializer");
                            throw {
                                msg: "Expected `=` before initializer",
                                span: initializer.span,
                            } as ParseError
                        }

                        // `=` without initializer
                        if(!initializer && isEqualSign) {
                            throw {
                                msg: "Expected initializer after `=`",
                                span: equalSignSpan,
                            } as ParseError
                        }

                        // if no :type and not =expr so reject
                        if(!type && !initializer) {
                            throw {
                                msg: `Expected type or initializer after ${kind === 'Parameter' ? 'parameter' : kind === 'StructField' ? 'field' : 'variable'} name`,
                                span: ident.span,
                            } as ParseError
                        }

                    // ══════════ Build AST ══════════

                        const field = AST.FieldNode.create(data.span,
                            {
                                kind: isPublic ? 'Public' : isStatic ? 'Static' : 'Private',
                                span: visibilitySpan,
                            },
                            {
                                kind: isComptime ? 'Comptime' : 'Runtime',
                                span: comptimeSpan,
                            },
                            {
                                kind: isMutable ? 'Mutable' : 'Immutable',
                                span: mutSpan,
                            },
                            ident!,
                            type,
                            initializer
                        );

                        if(kind === 'StructField') {
                            return ParserLib.Result.createAsCustom('passed', 'field-node', field, data.span);
                        } else if(kind === 'Parameter') {
                            return ParserLib.Result.createAsCustom('passed', 'param-node', field, data.span);
                        } else {
                            return ParserLib.Result.createAsCustom('passed', 'let-stmt-node',
                                AST.StmtNode.create('Let', data.span,
                                    new AST.LetStmtNode(data.span, field)
                                ),
                                data.span
                            )
                        }
                }
            }
        );
    }

// ╚══════════════════════════════════════════════════════════════════════════════════════╝