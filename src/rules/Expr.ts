// Expr.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as ParserLib       from '@je-es/parser';
    import * as AST             from '@je-es/ast';
    import { ParseError }       from '@je-es/parser';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    // TODO: There are some rules that need to be updated to work with the new style.
    export const Expr: ParserLib.Rules = [

        // ════════════ ROOT ════════════

            ParserLib.createRule('Expr',
                ParserLib.seq(
                    ParserLib.optional(
                        ParserLib.choice(
                            ParserLib.token('typeof'),
                            ParserLib.token('sizeof'),
                        )
                    ),
                    ParserLib.rule('AsExpr'),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════
                            const seq_array     = data.getSequenceResult()!;

                            const isSpecial     = seq_array[0].isOptionalPassed();
                            const specialType   : 'typeof' | 'sizeof' | null = isSpecial
                                ? seq_array[0].getOptionalResult()!.getChoiceResult()!.getTokenValue()! as 'typeof' | 'sizeof'
                                : null;
                            const specialSan  = isSpecial ? seq_array[0].getOptionalResult()!.getChoiceResult()!.span : undefined;
                            const exprResult    = seq_array[1];
                            const expr = exprResult.getCustomData()! as AST.ExprNode;

                            let final_expr = expr;
                            while(final_expr.isParen()) final_expr = final_expr.getParen()!.source;

                        // ══════ Syntax validation ══════

                            // if sizeof and non-type expre
                            if(specialType === 'sizeof' && !final_expr.isType()) {
                                throw {
                                    msg: "Expected type expression after `sizeof`",
                                    span: expr.span,
                                } as ParseError;
                            }

                        // ══════ Build AST ══════

                            const result = specialType === 'typeof'
                                ? AST.ExprNode.asTypeof(data.span, expr)
                                : specialType === 'sizeof'
                                    ? AST.ExprNode.asSizeof(data.span, expr)
                                    : expr;
                            return ParserLib.Result.createAsCustom('passed', 'expr', result, data.span);
                    },
                    errors: [ParserLib.error(() => true, "Expected expression")]
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('AsExpr',
                ParserLib.seq(
                    // base <CatchPoint>
                    ParserLib.rule('OrelseExpr'),
                    // as type
                    ParserLib.optional(
                        ParserLib.seq(
                            ParserLib.token('as'),
                            ParserLib.optional(ParserLib.choice(
                                ParserLib.rule('Type'), // only ident
                                ParserLib.rule('Stmt'), // reject
                            ))
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array     = data.getSequenceResult()!;
                            const baseResult    = seq_array[0];
                            const isAs          = seq_array[1].isOptionalPassed();
                            const isType        = seq_array[1].isOptionalPassed()
                                                ? seq_array[1].getOptionalResult()!.getSequenceResult()![1].isOptionalPassed()! &&
                                                  seq_array[1].getOptionalResult()!.getSequenceResult()![1].getOptionalResult()!.getChoiceIndex()! === 0
                                                : false;

                            if(!seq_array[1].isOptionalPassed()) { return baseResult; }


                            const base          = baseResult.getCustomData()! as AST.ExprNode;
                            const type          = isType ? seq_array[1].getOptionalResult()!.getSequenceResult()![1].getOptionalResult()!.getChoiceResult()!.getCustomData()! as AST.TypeNode : undefined;

                            const asSpan        = isAs ? seq_array[1].getOptionalResult()!.getSequenceResult()![0].span : data.span;

                        // ══════ Syntax validation ══════

                            {
                                // 'as' without type
                                if(isAs && !isType) {
                                    throw {
                                        msg: "Expected type after `as` keyword",
                                        span: asSpan
                                    } as ParseError;
                                }

                            }

                        // ══════════ Build AST ══════════

                            const result    = AST.ExprNode.asAs(data.span, base, type!);
                            return ParserLib.Result.createAsCustom('passed', 'as-expr', result, result.span);
                    }
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('OrelseExpr',
                ParserLib.seq(
                    // base <CatchPoint>
                    ParserLib.rule('RangeExpr'),
                    // ?? expr ...
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            // ?? <CatchPoint>
                            ParserLib.token('??'),
                            // expr
                            ParserLib.optional(ParserLib.rule('RangeExpr'))
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array     = data.getSequenceResult()!;
                            const base          = seq_array[0];
                            const rest          = seq_array[1].getRepeatResult()!;

                            if (rest.length === 0) { return base; }

                            let current = base.getCustomData()! as AST.ExprNode;

                        // ══════ Syntax validation ══════

                            for (const item of rest) {
                                // Extract Data
                                const seq       = item.getSequenceResult()!;
                                const isRight   = seq[1].isOptionalPassed();
                                const right     = isRight ? seq[1].getOptionalResult()!.getCustomData()! as AST.ExprNode : undefined;
                                const signSpan  = seq[0].span;
                                const span      = {
                                    start: current.span.start,
                                    end: isRight ? right!.span.end : current.span.end
                                };

                                // Syntax validation
                                if (!isRight) {
                                    throw {
                                        msg: "Expected expression after `??`",
                                        span: signSpan
                                    } as ParseError;
                                }

                                // Build AST
                                current = AST.ExprNode.asOrelse(span, current, right!);
                            }

                        // ══════════ Build AST ══════════

                            return ParserLib.Result.createAsCustom('passed', 'null-coalescing-expr', current, current.span);
                    }
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('RangeExpr',
                ParserLib.seq(
                    ParserLib.rule('TryExpr'),

                    ParserLib.optional(
                        ParserLib.seq(
                            ParserLib.choice(
                                ParserLib.token('..'),
                                ParserLib.token('..=')
                            ),
                            ParserLib.optional(ParserLib.rule('Expr'))
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;

                        // without range
                        const isRangePassed = seq_array[1].isOptionalPassed();
                        if (!isRangePassed) { return seq_array[0]; }

                        // with range
                        else {
                            const left = seq_array[0].getCustomData()! as AST.ExprNode;

                            const opt_seq_array = seq_array[1].getOptionalResult()!.getSequenceResult()!;

                            const operator = opt_seq_array[0].getChoiceResult()!.getTokenValue()!;
                            const rangeType = operator === '..' ? 'exclusive' : 'inclusive';

                            const isRightPassed = opt_seq_array[1].isOptionalPassed();
                            const right = isRightPassed ? opt_seq_array[1].getOptionalResult()!.getCustomData()! as AST.ExprNode : null;

                            // x..y | x..
                            return ParserLib.Result.createAsCustom('passed', 'range-expr',
                                AST.ExprNode.asRange(data.span, left, rangeType, right),
                                data.span
                            );
                        }
                    }
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('TryExpr',
                ParserLib.seq(
                    ParserLib.optional( ParserLib.token('try') ),
                    ParserLib.rule('CatchExpr'),
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const isTry = seq_array[0].isOptionalPassed();

                        if(!isTry) return seq_array[1];

                        const expr = seq_array[1].getCustomData()! as AST.ExprNode;
                        const result = AST.ExprNode.asTry(data.span, expr);

                        // Return
                        return ParserLib.Result.createAsCustom('passed', 'try-expr', result, data.span);

                    },
                    errors: [ParserLib.error(() => true, "Expected expression")]
                }
            ),

            ParserLib.createRule('CatchExpr',
                ParserLib.seq(
                    ParserLib.rule('ControlFlowExpr'),
                    ParserLib.optional(
                        ParserLib.seq(
                            ParserLib.token('catch'),

                            ParserLib.optional(
                                ParserLib.seq(
                                    ParserLib.token('('),
                                    ParserLib.rule('Expr'),
                                    ParserLib.token(')')
                                )
                            ),

                            ParserLib.rule('Stmt')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        if(!seq_array[1].isOptionalPassed()) return seq_array[0];

                        const opt_seq_array : ParserLib.Result[] = seq_array[1].getOptionalResult()!.getSequenceResult()!;
                        const leftExpr = seq_array[0].getCustomData()! as AST.ExprNode;
                        const isTagged = opt_seq_array[1].isOptionalPassed();
                        const tag = isTagged ? opt_seq_array[1].getOptionalResult()!.getSequenceResult()![1].getCustomData()! as AST.ExprNode : null;
                        const rightStmt = opt_seq_array[2].getCustomData()! as AST.StmtNode;

                        const result = AST.ExprNode.asCatch({ start: leftExpr.span.start, end: rightStmt.span.end },
                            leftExpr,
                            tag,
                            rightStmt
                        );

                        // Return
                        return ParserLib.Result.createAsCustom('passed', 'catch-expr', result, data.span);
                    },
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('ControlFlowExpr',
                ParserLib.choice(
                    ParserLib.rule('IfExpr'),
                    ParserLib.rule('MatchExpr'),
                    ParserLib.rule('AssignmentExpr')
                ),
                {
                    build: (data: ParserLib.Result) => data.getChoiceResult()!,
                }
            ),

            ParserLib.createRule('IfExpr',
                ParserLib.seq(
                    // if <CatchPoint>
                    ParserLib.token('if'),
                    // expression
                    ParserLib.optional(ParserLib.rule('Expr')),
                    // statement
                    ParserLib.optional(ParserLib.rule('Stmt')),
                    // else
                    ParserLib.optional(
                        ParserLib.seq(
                            // else <CatchPoint>
                            ParserLib.token('else'),
                            // statement
                            ParserLib.optional(ParserLib.rule('Stmt'))
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array = data.getSequenceResult()!;

                            const isIfExpr          = seq_array[1].isOptionalPassed();
                            const isIfStmt          = seq_array[2].isOptionalPassed();
                            const iElse             = seq_array[3].isOptionalPassed();
                            const isElseStmt        = iElse ? seq_array[3].getOptionalResult()!.getSequenceResult()![1].isOptionalPassed() : false;

                            const ifSpan            = seq_array[0].span;
                            const elseSpan          = iElse ? seq_array[3].getOptionalResult()!.getSequenceResult()![0].span : undefined;

                            const ifExpr            = isIfExpr ? seq_array[1].getOptionalResult()!.getCustomData()! as AST.ExprNode : undefined;
                            const ifStmt            = isIfStmt ? seq_array[2].getOptionalResult()!.getCustomData()! as AST.StmtNode : undefined;
                            const elseStmt          = isElseStmt ? seq_array[3].getOptionalResult()!.getSequenceResult()![1].getOptionalResult()!.getCustomData()! as AST.StmtNode : null;

                        // ══════ Syntax validation ══════

                            // Missing if expression
                            if(!isIfExpr) {
                                throw {
                                    msg: "Expected expression after `if` keyword",
                                    span: ifSpan,
                                } as ParseError;
                            }

                            // Missing if statement
                            if(!isIfStmt) {
                                throw {
                                    msg: "Expected statement after expression",
                                    span: ifExpr!.span,
                                } as ParseError;
                            }

                            // Missing else statement
                            if(iElse && !isElseStmt) {
                                throw {
                                    msg: "Expected statement after `else` keyword",
                                    span: elseSpan,
                                } as ParseError;
                            }


                        // ══════════ Build AST ══════════

                            const result = AST.ExprNode.asIf(data.span, ifExpr!, ifStmt!, elseStmt);
                            return ParserLib.Result.createAsCustom('passed', 'if-expr', result, data.span);
                    },
                }
            ),

            ParserLib.createRule('MatchExpr',
                ParserLib.seq(
                    // match <catchPoint>
                    ParserLib.token('match'),
                    // expression
                    ParserLib.optional(ParserLib.rule('Expr')),
                    // {
                    ParserLib.optional(ParserLib.token(`{`)),
                    // cases
                    ParserLib.zeroOrMore( ParserLib.rule('Case') ),
                    // default
                    ParserLib.optional(ParserLib.rule('DefaultCase')),
                    // }
                    ParserLib.optional(ParserLib.token(`}`))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array = data.getSequenceResult()!;

                            const isMatchExpr       = seq_array[1].isOptionalPassed();
                            const isOpeningParen    = seq_array[2].isOptionalPassed();
                            const isCases           = seq_array[3].getRepeatCount()! > 0;
                            const isDefaultCase     = seq_array[4].isOptionalPassed();
                            const isClosingParen    = seq_array[5].isOptionalPassed();

                            const matchSpan         = seq_array[0].span;
                            const openingParenSpan  = isOpeningParen ? seq_array[2].span : undefined;
                            const closingParenSpan  = isClosingParen ? seq_array[5].span : undefined;

                            const matchExpr         = isMatchExpr ? seq_array[1].getOptionalResult()!.getCustomData()! as AST.ExprNode : undefined;
                            const casesArray        = isCases ? seq_array[3].getRepeatResult()!.map(member => member.getCustomData()! as AST.CaseNode) : [];
                            const defaultCase       = isDefaultCase ? seq_array[4].getOptionalResult()!.getCustomData()! as AST.DefaultNode : null;

                        // ══════ Syntax validation ══════

                            // Missing match expression
                            if(!isMatchExpr) {
                                throw {
                                    msg: "Expected expression after `match` keyword",
                                    span: matchSpan,
                                } as ParseError;
                            }

                            // Missing opening parenthesis
                            if(!isOpeningParen) {
                                throw {
                                    msg: "Expected `{` after match expression",
                                    span: matchExpr!.span,
                                } as ParseError;
                            }

                            // Missing match cases
                            if(!isCases && !isDefaultCase) {
                                throw {
                                    msg: "Expected match cases",
                                    span: openingParenSpan,
                                } as ParseError;
                            }

                            // Missing closing parenthesis
                            if(!isClosingParen) {
                                let last_span = openingParenSpan;
                                if(casesArray.length > 0) {
                                    last_span = casesArray[casesArray.length - 1].span;
                                } else if(defaultCase) {
                                    last_span = defaultCase.span;
                                }

                                throw {
                                    msg: "Expected `}` after match cases",
                                    span: last_span,
                                } as ParseError;
                            }

                        // ══════ Build AST ══════

                            const result = AST.ExprNode.asMatch(data.span, matchExpr!, casesArray, defaultCase);
                            return ParserLib.Result.createAsCustom('passed', 'switch-expr', result, data.span);
                    },
                }
            ),

            ParserLib.createRule('Case',
                ParserLib.seq(
                    // expression <catchPoint>
                    ParserLib.rule('Expr'),
                    // =>
                    ParserLib.optional(ParserLib.token('=>')),
                    // statement
                    ParserLib.optional(ParserLib.rule('Stmt'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array = data.getSequenceResult()!;

                            const isArrow       = seq_array[1].isOptionalPassed();
                            const isStmt        = seq_array[2].isOptionalPassed();

                            const caseExpr      = seq_array[0].getCustomData()! as AST.ExprNode;
                            const arrowSpan     = isArrow ? seq_array[1].span : undefined;
                            const stmt          = isStmt ? seq_array[2].getOptionalResult()!.getCustomData()! as AST.StmtNode : null;

                        // ══════ Syntax validation ══════

                            // Missing arrow
                            if(!isArrow) {
                                throw {
                                    msg: "Expected arrow after expression",
                                    span: caseExpr!.span,
                                } as ParseError;
                            }

                            // Missing statement
                            if(!isStmt) {
                                throw {
                                    msg: "Expected statement after arrow",
                                    span: arrowSpan,
                                } as ParseError;
                            }

                        // ══════ Build AST ══════

                            const result = AST.CaseNode.create(data.span, caseExpr!, stmt);
                            return ParserLib.Result.createAsCustom('passed', 'case', result, data.span);
                    },
                }
            ),

            ParserLib.createRule('DefaultCase',
                ParserLib.seq(
                    // default <catchPoint>
                    ParserLib.token('default'),
                    // =>
                    ParserLib.optional(ParserLib.token('=>')),
                    // statement
                    ParserLib.optional(ParserLib.rule('Stmt'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array = data.getSequenceResult()!;

                            const isArrow       = seq_array[1].isOptionalPassed();
                            const isStmt        = seq_array[2].isOptionalPassed();

                            const defaultSpan   = seq_array[0].span;
                            const arrowSpan     = isArrow ? seq_array[1].span : undefined;
                            const stmt          = isStmt ? seq_array[2].getOptionalResult()!.getCustomData()! as AST.StmtNode : null;

                        // ══════ Syntax validation ══════

                            // Missing arrow
                            if(!isArrow) {
                                throw {
                                    msg: "Expected arrow after `default` keyword",
                                    span: defaultSpan,
                                } as ParseError;
                            }

                            // Missing statement
                            if(!isStmt) {
                                throw {
                                    msg: "Expected statement after arrow",
                                    span: arrowSpan,
                                } as ParseError;
                            }

                        // ══════ Build AST ══════

                            const result = AST.DefaultNode.create(data.span, stmt!);
                            return ParserLib.Result.createAsCustom('passed', 'default-case', result, data.span);
                    },
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('AssignmentExpr',
                ParserLib.seq(
                    ParserLib.rule('ConditionalExpr'),
                    ParserLib.optional(
                        ParserLib.seq(
                            ParserLib.choice(
                                ParserLib.token('='),
                                ParserLib.token('+='),
                                ParserLib.token('-='),
                                ParserLib.token('*='),
                                ParserLib.token('/='),
                                ParserLib.token('%='),
                            ),
                            ParserLib.rule('Expr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;

                        if(!seq_array[1].isOptionalPassed()) return seq_array[0];

                        const opt_seq_array : ParserLib.Result[] = seq_array[1].getOptionalResult()!.getSequenceResult()!;
                        const left = seq_array[0].getCustomData()! as AST.ExprNode;
                        const operator = opt_seq_array[0].getChoiceResult()!.getTokenValue()!;
                        const right = opt_seq_array[1].getCustomData()! as AST.ExprNode;

                        const result = AST.ExprNode.asBinary({ start: left.span.start, end: right.span.end },
                            left,
                            operator,
                            right
                        );

                        // Return
                        return ParserLib.Result.createAsCustom('passed', 'assignment-expr', result, data.span);
                    },
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('ConditionalExpr',
                ParserLib.seq(
                    ParserLib.rule('LogicalOrExpr'),
                    ParserLib.optional(
                        ParserLib.seq(
                            ParserLib.token('?'),
                            ParserLib.rule('Expr'),
                            ParserLib.token(':'),
                            ParserLib.rule('Expr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const data_seq_array = data.getSequenceResult()!;
                        if(!data_seq_array[1].isOptionalPassed()) return data_seq_array[0];

                        const seq_array : ParserLib.Result[] = data_seq_array[1].getOptionalResult()!.getSequenceResult()!;
                        const condition = data_seq_array[0].getCustomData()! as AST.ExprNode;
                        const trueExpr = seq_array[1].getCustomData()! as AST.ExprNode;
                        const falseExpr = seq_array[3].getCustomData()! as AST.ExprNode;

                        const result = AST.ExprNode.asConditional({ start: condition.span.start, end: falseExpr.span.end },
                            condition,
                            trueExpr,
                            falseExpr
                        );

                        // Return
                        return ParserLib.Result.createAsCustom('passed', 'conditional-expr', result, data.span);
                    }
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('PrefixExpr',
                ParserLib.seq(
                    ParserLib.zeroOrMore(
                        ParserLib.choice(
                            ParserLib.token('++'),
                            ParserLib.token('--'),
                            ParserLib.token('&'),
                            ParserLib.token('+'),
                            ParserLib.token('-'),
                            ParserLib.token('!'),
                            ParserLib.token('~')
                        )
                    ),
                    ParserLib.rule('PostfixExpr')
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const or_this : ParserLib.Result = seq_array[1];

                        const repeat_array : ParserLib.Result[] = seq_array[0].getRepeatResult()!;

                        if(!repeat_array.length){
                            return or_this;
                        }

                        let result = or_this.getCustomData()! as AST.ExprNode;
                        const operations = repeat_array;

                        // Same logic as before
                        for (const _op of operations) {
                            const op = _op.getChoiceResult()!;

                            // Prefix Increment
                            if (op.getTokenValue() === '++') {
                                result = AST.ExprNode.asPreIncrement({ start: op.span.start, end: result.span.end },
                                    result
                                );
                            }

                            // Prefix Decrement
                            else if (op.getTokenValue() === '--') {
                                result = AST.ExprNode.asPreDecrement({ start: op.span.start, end: result.span.end },
                                    result
                                );
                            }

                            // Reference
                            else if (op.getTokenValue() === '&') {
                                result = AST.ExprNode.asReference({ start: op.span.start, end: result.span.end },
                                    result
                                );
                            }

                            // Unary Plus
                            else if (op.getTokenValue() === '+') {
                                result = AST.ExprNode.asUnaryPlus({ start: op.span.start, end: result.span.end },
                                    result
                                );
                            }

                            // Unary Minus
                            else if (op.getTokenValue() === '-') {
                                result = AST.ExprNode.asUnaryMinus({ start: op.span.start, end: result.span.end },
                                    result
                                );
                            }

                            // Logical Not
                            else if (op.getTokenValue() === '!') {
                                result = AST.ExprNode.asLogicalNot({ start: op.span.start, end: result.span.end },
                                    result
                                );
                            }

                            // Bitwise Not
                            else if (op.getTokenValue() === '~') {
                                result = AST.ExprNode.asxBitwiseNot({ start: op.span.start, end: result.span.end },
                                    result
                                );
                            }
                        }

                        // Return
                        return ParserLib.Result.createAsCustom('passed', 'prefix-expr', result, data.span);
                    },
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('PostfixExpr',
                ParserLib.seq(
                    ParserLib.rule('PrimaryExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.choice(
                            ParserLib.rule('ArrayAccess'),
                            ParserLib.rule('CallSuffix'),
                            ParserLib.rule('MemberAccessSuffix'),
                            ParserLib.token('.*'),
                            ParserLib.token('++'),
                            ParserLib.token('--'),
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const or_this : ParserLib.Result = seq_array[0];

                        const repeat_array : ParserLib.Result[] = seq_array[1].getRepeatResult()!;

                        if(!repeat_array.length){
                            return or_this;
                        }

                        let result = or_this.getCustomData()! as AST.ExprNode;
                        const operations = repeat_array;

                        // Same logic as before, just more efficient parsing
                        for (const choice_res of operations) {
                            const op = choice_res.getChoiceResult()!;
                            // Post Increment
                            if (op.getTokenValue() === '++') {
                                result = AST.ExprNode.asPreIncrement({ start: result.span.start, end: op.span.end },
                                    result
                                );
                            }

                            // Post Decrement
                            else if (op.getTokenValue() === '--') {
                                result = AST.ExprNode.asPostDecrement({ start: result.span.start, end: op.span.end },
                                    result
                                );
                            }

                            // Dereference
                            else if (op.getTokenValue() === '.*') {
                                result = AST.ExprNode.asDereference({ start: result.span.start, end: op.span.end },
                                    result
                                );
                            }

                            // Member Access
                            else if (op.isCustom('member-access-suffix')) {
                                const memberResult = op.getCustomData()! as {
                                    expr: AST.ExprNode,
                                    optional: boolean
                                };
                                result = AST.ExprNode.asMemberAccess({ start: result.span.start, end: op.span.end },
                                    result,
                                    memberResult.expr,
                                    memberResult.optional
                                );
                            }

                            // CallSuffix
                            else if (op.isCustom('call-suffix')) {

                                // call expr must not be type
                                if(result.isType()) {

                                    // if like `i32(..)` so return expr -> type -> cast type
                                    if((op.getCustomData()! as AST.ExprNode[]).length === 1) {
                                        result = AST.ExprNode.asAs({ start: result.span.start, end: op.span.end },
                                            (op.getCustomData()! as AST.ExprNode[])[0],
                                            result.getType()!,
                                        );

                                        return ParserLib.Result.createAsCustom('passed', 'as-expr', result, result.span);
                                    }

                                    // otherwise
                                    throw {
                                        msg: "Type cannot be called as function",
                                        span: result.span
                                    } as ParseError;
                                }

                                result = AST.ExprNode.asCall({ start: result.span.start, end: op.span.end },
                                    result,
                                    op.getCustomData()! as AST.ExprNode[]
                                );
                            }

                            // Array Access
                            else if (op.isCustom('array-access')) {
                                result = AST.ExprNode.asArrayAccess({ start: result.span.start, end: op.span.end },
                                    result,
                                    op.getCustomData()! as AST.ExprNode
                                );
                            }
                        }

                        return ParserLib.Result.createAsCustom('passed', 'postfix-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('MemberAccessSuffix',
                ParserLib.seq(
                    ParserLib.optional(ParserLib.token('?')),
                    ParserLib.token('.'),
                    ParserLib.rule('PrimaryExpr'),
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const isOptional = data.getSequenceResult()![0].isOptionalPassed();
                        const expr = data.getSequenceResult()![2].getCustomData()! as AST.ExprNode;
                        return ParserLib.Result.createAsCustom('passed', 'member-access-suffix', {
                            expr,
                            optional: isOptional
                        }, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected '.' for member access"),
                        ParserLib.error(1, "Expected identifier after '.'"),
                    ]
                }
            ),

            ParserLib.createRule('CallSuffix',
                ParserLib.seq(
                    ParserLib.token('('),
                    ParserLib.zeroOrOne(ParserLib.rule('ArgumentList')),
                    // Edit :
                    ParserLib.optional(ParserLib.token(')'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array = data.getSequenceResult()!;
                            const isClosed = seq_array[2].isOptionalPassed();
                            const repeat_array = seq_array[1].getRepeatResult()!;
                            const args = repeat_array.length > 0 ? repeat_array[0].getCustomData()! as AST.ExprNode : [];

                        // ══════ Syntax validation ══════

                            // Missing ')'
                            if (!isClosed) {
                                throw {
                                    msg: "Expected ')' after argument list",
                                    span: data.span
                                } as ParseError;
                            }

                        // ══════ Build AST ══════

                            return ParserLib.Result.createAsCustom('passed', 'call-suffix', args, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected '(' for function call"),
                        ParserLib.error(1, "Expected ')' for function call"),
                        ParserLib.error(2, "Expected ')' for function call"),
                    ]
                }
            ),

            ParserLib.createRule('ArgumentList',
                ParserLib.zeroOrMore(
                    ParserLib.rule('Expr'),
                    ParserLib.token(',')
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const repeat_array = data.getRepeatResult()!;
                        const args : AST.ExprNode[] = [];
                        for(const x of repeat_array) { args.push(x.getCustomData()! as AST.ExprNode); }
                        return ParserLib.Result.createAsCustom('passed', 'argument-list', args, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected argument list"),
                    ]
                }
            ),

            ParserLib.createRule('ArrayAccess',
                ParserLib.seq(
                    ParserLib.token('['),
                    ParserLib.rule('Expr'),
                    ParserLib.token(']')
                ),
                {

                    build: (data: ParserLib.Result) => {
                        return ParserLib.Result.createAsCustom('passed', 'array-access', data.getSequenceResult()![1].getCustomData()!, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected '[' for array access"),
                        ParserLib.error(1, "Expected Expr for array access"),
                        ParserLib.error(2, "Expected ']' for array access"),
                    ]
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('PrimaryExpr',
                ParserLib.choice(
                    ParserLib.rule('UnreachableExpr'),
                    ParserLib.rule('ParenExpr'),
                    ParserLib.rule('TupleExpr'),
                    ParserLib.rule('ObjectExpr'),
                    ParserLib.rule('IdentExpr'),
                    ParserLib.rule('TypeExpr'),
                    ParserLib.rule('LiteralExpr'),
                ),
                {
                    build: (data: ParserLib.Result) => ParserLib.Result.createAsCustom('passed', 'primary-expr', data.getChoiceResult()!.getCustomData()!, data.span)
                }
            ),

            ParserLib.createRule('IdentExpr',
                ParserLib.seq(
                    ParserLib.optional(ParserLib.token('@')),
                    ParserLib.token('ident'),
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const is_builtin = seq_array[0].isOptionalPassed();
                        const identResult = seq_array[1];

                        return ParserLib.Result.createAsCustom('passed', 'ident-expr',
                            AST.ExprNode.asIdent( data.span, identResult.getTokenValue()!, is_builtin),
                            data.span
                        );
                    },

                    errors: [ ParserLib.error(0, "Expected identifier") ]
                }
            ),

            ParserLib.createRule('LiteralExpr',
                ParserLib.choice(
                    // Integer
                    ParserLib.token('dec'),
                    ParserLib.token('bin'),
                    ParserLib.token('oct'),
                    ParserLib.token('hex'),

                    // Float
                    ParserLib.token('flt'),

                    // Boolean
                    ParserLib.token('true'),
                    ParserLib.token('false'),

                    // String
                    ParserLib.token('slice'),

                    // Character
                    ParserLib.token('char'),

                    // Null/Undefined
                    ParserLib.token('null'),
                    ParserLib.token('und'),

                    // Array
                    ParserLib.seq(
                        ParserLib.token('['),
                        ParserLib.zeroOrMore(
                            ParserLib.rule('Expr'),
                            ParserLib.token(',')
                        ),
                        ParserLib.token(']'),
                    ),
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const selected = data.getChoiceResult()!;
                        let expr : AST.ExprNode | null = null;

                        if(selected.isToken()) {
                            const token = selected.getTokenData()!;
                            switch (token.kind) {

                                // Integer
                                case 'dec':
                                case 'bin':
                                case 'oct':
                                case 'hex':
                                    expr = AST.ExprNode.asInteger(token.span, Number(token.value));
                                    break;

                                // Float
                                case 'flt':
                                    expr = AST.ExprNode.asFloat(token.span, Number(token.value));
                                    break;

                                // Boolean
                                case 'true':
                                case 'false':
                                    expr = AST.ExprNode.asBool(token.span, token.value === 'true');
                                    break;

                                // Slice
                                case 'slice':
                                    expr = AST.ExprNode.asString(token.span, token.value ?? '');
                                    break;

                                // Character
                                case 'char':
                                    expr = AST.ExprNode.asChar(token.span, token.value ?? '');
                                    break;

                                // Null
                                case 'null':
                                    expr = AST.ExprNode.asNull(token.span);
                                    break;

                                // Undefined
                                case 'und':
                                    expr = AST.ExprNode.asUndefined(token.span);
                                    break;

                                // --
                                default:
                                    throw new Error(`Unknown literal kind: ${token.kind}`);
                            }
                        }

                        else if(selected.isSequence()) {
                            const repeat_items : ParserLib.Result[] = selected.getSequenceResult()![1].getRepeatResult()!;
                            const exprs : AST.ExprNode[] = [];

                            if(repeat_items.length > 0) {
                                for(const r_item of repeat_items) {
                                    const res = r_item.getCustomData();
                                    if(!res) continue;
                                    exprs.push(res as AST.ExprNode);
                                }
                            }

                            expr = AST.ExprNode.asArray(
                                data.span,
                                exprs
                            );
                        }

                        return ParserLib.Result.createAsCustom('passed', 'literal-expr', expr, data.span);
                    },
                    errors: [
                        ParserLib.error(0, "Expected literal expression")
                    ]
                }
            ),

            ParserLib.createRule('UnreachableExpr',
                ParserLib.token('unreachable'),
                {
                    build: (data: ParserLib.Result) => ParserLib.Result.createAsCustom('passed', 'unreachable-expr', AST.ExprNode.asUnreachable(data.span), data.span)
                }
            ),

            ParserLib.createRule('ParenExpr',
                ParserLib.seq(
                    ParserLib.token('('),
                    ParserLib.rule('Expr'),
                    ParserLib.token(')')
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;

                        const paren_expr = AST.ExprNode.asParen(
                            data.span,
                            seq_array[1].getCustomData()! as AST.ExprNode
                        );

                        return ParserLib.Result.createAsCustom('passed', 'paren-expr', paren_expr, data.span);
                    },
                }
            ),

            ParserLib.createRule('TupleExpr',
                ParserLib.seq(
                    ParserLib.token('.'),
                    ParserLib.token('{'),
                    ParserLib.rule('Expr'),

                    ParserLib.oneOrMore(
                        ParserLib.seq(
                            ParserLib.token(','),
                            ParserLib.rule('Expr'),
                        ),
                    ),


                    ParserLib.token('}')
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;

                        const repeat_items : ParserLib.Result[] = seq_array[3].getRepeatResult()!;
                        const exprs : AST.ExprNode[] = [
                            seq_array[2].getCustomData()! as AST.ExprNode
                        ];

                        if(repeat_items.length > 0) {
                            for(const r_item of repeat_items) {
                                const res = r_item.getSequenceResult()![1].getCustomData();
                                if(!res) continue;
                                exprs.push(res as AST.ExprNode);
                            }
                        }

                        const tuple_expr = AST.ExprNode.asTuple(
                            data.span,
                            exprs
                        );

                        return ParserLib.Result.createAsCustom('passed', 'tuple-expr', tuple_expr, data.span);
                    },
                }
            ),

            ParserLib.createRule('ObjectExpr',
                ParserLib.seq(
                    ParserLib.optional(ParserLib.seq(
                        ParserLib.token('new'),
                        ParserLib.rule('Ident')
                    )),
                    ParserLib.token('{'),
                    ParserLib.zeroOrMore(
                        ParserLib.rule('ObjectProperty'),
                        ParserLib.token(',')
                    ),
                    ParserLib.token('}'),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;
                            const isIdent           = seq_array[0].isOptionalPassed();
                            const ident             = isIdent ? seq_array[0].getOptionalResult()!.getSequenceResult()![1].getCustomData()! as AST.IdentNode  : undefined;

                            const repeat_items      = seq_array[2].getRepeatResult()!;
                            const props             = [] as AST.PropNode[];

                            if (repeat_items.length > 0) {
                                for (const r_item of repeat_items) {
                                    const res = r_item.getCustomData();
                                    if (!res) continue;
                                    props.push(res as AST.PropNode);
                                }
                            }

                        // ══════════ Build AST ══════════

                            const expr = AST.ExprNode.asObject( data.span, props, ident );
                            return ParserLib.Result.createAsCustom('passed', 'object-expr', expr, data.span);
                    }
                }
            ),

            ParserLib.createRule('ObjectProperty',
                ParserLib.seq(
                    ParserLib.rule('Ident'),
                    ParserLib.token(':'), // TODO: why not '=' ?
                    ParserLib.rule('Expr')
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const key = seq_array[0].getCustomData()! as AST.IdentNode;
                        const value = seq_array[2].getCustomData()! as AST.ExprNode;

                        return ParserLib.Result.createAsCustom('passed', 'object-property',
                            AST.PropNode.create(data.span, key, value),
                            data.span
                        );
                    },
                    errors: [
                        ParserLib.error(0, "Expected property name"),
                        ParserLib.error(1, "Expected ':'"),
                        ParserLib.error(2, "Expected property value")
                    ]
                }
            ),

            // e.g. `let x = i32;`
            ParserLib.createRule('TypeExpr',
                ParserLib.rule('Type'),
                {
                    build: (data: ParserLib.Result) => {
                        const typeNode = data.getCustomData()! as AST.TypeNode;

                        if(typeNode.isUndefined()) {
                            return ParserLib.Result.createAsCustom('passed', 'literal-expr',
                                AST.ExprNode.asUndefined(typeNode.span),
                                data.span
                            );
                        }
                        else if(typeNode.isNull()) {
                            return ParserLib.Result.createAsCustom('passed', 'literal-expr',
                                AST.ExprNode.asNull(typeNode.span),
                                data.span
                            );
                        }

                        // Otherwise, return a type expression node
                        else return ParserLib.Result.createAsCustom('passed', 'type-expr',
                            AST.ExprNode.asType(data.span, data.getCustomData()! as AST.TypeNode),
                            data.span
                        );
                    },
                    errors: [
                        ParserLib.error(0, "Expected 'type'")
                    ]
                }
            ),

            // e.g. `let x = i32(55);`
            ParserLib.createRule('TypeCastExpr',
                ParserLib.seq(
                    ParserLib.rule('Type'),
                    ParserLib.token('('),
                    ParserLib.rule('Expr'),
                    ParserLib.token(')'),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array = data.getSequenceResult()!;
                            const typeNode = seq_array[0].getCustomData()! as AST.TypeNode;
                            const exprNode = seq_array[2].getCustomData()! as AST.ExprNode;

                        // ══════════ Build AST ══════════

                            return ParserLib.Result.createAsCustom('passed', 'type-cast-expr',
                                AST.ExprNode.asAs(data.span, exprNode, typeNode),
                                data.span
                            );

                    }
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('PowerExpr',
                ParserLib.seq(
                    ParserLib.rule('PrefixExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.token('**'),
                            ParserLib.rule('PrefixExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        // Power is right-associative: x**y**z = x**(y**z)
                        // Collect all operands
                        const allOperands: AST.ExprNode[] = [base.getCustomData()! as AST.ExprNode];

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            allOperands.push(opSeq[1].getCustomData()! as AST.ExprNode);
                        }

                        // Build right-associative chain from the end
                        let result = allOperands[allOperands.length - 1];
                        for (let i = allOperands.length - 2; i >= 0; i--) {
                            const left = allOperands[i];
                            const span = { start: left.span.start, end: result.span.end };
                            result = AST.ExprNode.asBinary(span, left, '**', result);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'power-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('MultiplicativeExpr',
                ParserLib.seq(
                    ParserLib.rule('PowerExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.choice(
                                ParserLib.token('*'),
                                ParserLib.token('/'),
                                ParserLib.token('%')
                            ),
                            ParserLib.rule('PowerExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        let result = base.getCustomData()! as AST.ExprNode;

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            const operator = opSeq[0].getChoiceResult()!.getTokenValue()!;
                            const right = opSeq[1].getCustomData()! as AST.ExprNode;
                            const span = { start: result.span.start, end: right.span.end };

                            result = AST.ExprNode.asBinary(span, result, operator, right);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'multiplicative-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('AdditiveExpr',
                ParserLib.seq(
                    ParserLib.rule('MultiplicativeExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.choice(
                                ParserLib.token('+'),
                                ParserLib.token('-')
                            ),
                            ParserLib.rule('MultiplicativeExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        let result = base.getCustomData()! as AST.ExprNode;

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            const operator = opSeq[0].getChoiceResult()!.getTokenValue()!;
                            const right = opSeq[1].getCustomData()! as AST.ExprNode;
                            const span = { start: result.span.start, end: right.span.end };

                            result = AST.ExprNode.asBinary(span, result, operator, right);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'additive-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('ShiftExpr',
                ParserLib.seq(
                    ParserLib.rule('AdditiveExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.choice(
                                ParserLib.token('<<'),
                                ParserLib.token('>>')
                            ),
                            ParserLib.rule('AdditiveExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        // Left-associative: a<<b<<c = (a<<b)<<c
                        let result = base.getCustomData()! as AST.ExprNode;

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            const operator = opSeq[0].getChoiceResult()!.getTokenValue()!;
                            const right = opSeq[1].getCustomData()! as AST.ExprNode;
                            const span = { start: result.span.start, end: right.span.end };

                            result = AST.ExprNode.asBinary(span, result, operator, right);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'shift-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('RelationalExpr',
                ParserLib.seq(
                    ParserLib.rule('ShiftExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.choice(
                                ParserLib.token('<='),
                                ParserLib.token('>='),
                                ParserLib.token('<'),
                                ParserLib.token('>')
                            ),
                            ParserLib.rule('ShiftExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        let result = base.getCustomData()! as AST.ExprNode;

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            const operator = opSeq[0].getChoiceResult()!.getTokenValue()!;
                            const right = opSeq[1].getCustomData()! as AST.ExprNode;
                            const span = { start: result.span.start, end: right.span.end };

                            result = AST.ExprNode.asBinary(span, result, operator, right);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'relational-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('EqualityExpr',
                ParserLib.seq(
                    ParserLib.rule('RelationalExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.choice(
                                ParserLib.token('=='),
                                ParserLib.token('!=')
                            ),
                            ParserLib.rule('RelationalExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        let result = base.getCustomData()! as AST.ExprNode;

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            const operator = opSeq[0].getChoiceResult()!.getTokenValue()!;
                            const right = opSeq[1].getCustomData()! as AST.ExprNode;
                            const span = { start: result.span.start, end: right.span.end };

                            result = AST.ExprNode.asBinary(span, result, operator, right);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'equality-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('BitwiseAndExpr',
                ParserLib.seq(
                    ParserLib.rule('EqualityExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.token('&'),
                            ParserLib.rule('EqualityExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        let result = base.getCustomData()! as AST.ExprNode;

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            const right = opSeq[1].getCustomData()! as AST.ExprNode;
                            const span = { start: result.span.start, end: right.span.end };

                            result = AST.ExprNode.asBinary(span, result, '&', right);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'bitwise-and-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('BitwiseXorExpr',
                ParserLib.seq(
                    ParserLib.rule('BitwiseAndExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.token('^'),
                            ParserLib.rule('BitwiseAndExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        let result = base.getCustomData()! as AST.ExprNode;

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            const right = opSeq[1].getCustomData()! as AST.ExprNode;
                            const span = { start: result.span.start, end: right.span.end };

                            result = AST.ExprNode.asBinary(span, result, '^', right);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'bitwise-xor-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('BitwiseOrExpr',
                ParserLib.seq(
                    ParserLib.rule('BitwiseXorExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.token('|'),
                            ParserLib.rule('BitwiseXorExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        let result = base.getCustomData()! as AST.ExprNode;

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            const right = opSeq[1].getCustomData()! as AST.ExprNode;
                            const span = { start: result.span.start, end: right.span.end };

                            result = AST.ExprNode.asBinary(span, result, '|', right);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'bitwise-or-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('LogicalAndExpr',
                ParserLib.seq(
                    ParserLib.rule('BitwiseOrExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.token('and'),
                            ParserLib.rule('BitwiseOrExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        // Left-associative: a and b and c = (a and b) and c
                        let result = base.getCustomData()! as AST.ExprNode;

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            const right = opSeq[1].getCustomData()! as AST.ExprNode;
                            const span = { start: result.span.start, end: right.span.end };

                            result = AST.ExprNode.asBinary(span, result, 'and', right);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'logical-and-expr', result, data.span);
                    }
                }
            ),

            ParserLib.createRule('LogicalOrExpr',
                ParserLib.seq(
                    ParserLib.rule('LogicalAndExpr'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.token('or'),
                            ParserLib.rule('LogicalAndExpr')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        // ══════════ Extract Data ════════
                        const seq_array = data.getSequenceResult()!;
                        const base = seq_array[0];
                        const operations = seq_array[1].getRepeatResult()!;

                        if (operations.length === 0) { return base; }

                        // ══════════ Build AST ══════════
                        // Left-associative: a or b or c = (a or b) or c
                        let result = base.getCustomData()! as AST.ExprNode;

                        for (const op of operations) {
                            const opSeq = op.getSequenceResult()!;
                            const right = opSeq[1].getCustomData()! as AST.ExprNode;
                            const span = { start: result.span.start, end: right.span.end };

                            result = AST.ExprNode.asBinary(span, result, 'or', right);
                        }

                        return ParserLib.Result.createAsCustom('passed', 'logical-or-expr', result, data.span);
                    }
                }
            ),
    ];

// ╚══════════════════════════════════════════════════════════════════════════════════════╝