// Type.ts
//
// Developed with ❤️ by Maysara.



// ╔════════════════════════════════════════ PACK ════════════════════════════════════════╗

    import * as ParserLib   from '@je-es/parser';
    import * as AST         from '@je-es/ast';
    import { ParseError }   from '@je-es/parser';

// ╚══════════════════════════════════════════════════════════════════════════════════════╝



// ╔════════════════════════════════════════ INIT ════════════════════════════════════════╗

    export const Type: ParserLib.Rules = [

        // TODO: There are some rules that need to be updated to work with the new style.

        // ════════════ ROOT ════════════

            ParserLib.createRule('Type',
                ParserLib.rule('UnionType'),
                {
                    build: (data: ParserLib.Result) => data,
                    errors: [ParserLib.error(() => true, "Expected type")]
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('UnionType',
                ParserLib.seq(
                    ParserLib.rule('BaseType'),
                    ParserLib.zeroOrMore(
                        ParserLib.seq(
                            ParserLib.token('|'),
                            ParserLib.rule('BaseType')
                        )
                    )
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const first = seq_array[0];
                        const rest = seq_array[1].getRepeatResult()!;

                        if (rest.length === 0) {
                            return first;
                        }

                        const types: AST.TypeNode[] = [first.getCustomData()! as AST.TypeNode];

                        for (const item of rest) {
                            const seq = item.getSequenceResult()!;
                            types.push(seq[1].getCustomData()! as AST.TypeNode);
                        }

                        const result = AST.TypeNode.asUnion(data.span, types);
                        return ParserLib.Result.createAsCustom('passed', 'union-type', result, data.span);
                    }
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('BaseType',
                ParserLib.choice(
                    ParserLib.rule('FunctionType'),
                    ParserLib.rule('ErrsetType'),
                    ParserLib.rule('StructType'),
                    ParserLib.rule('EnumType'),
                    ParserLib.rule('TupleType'),
                    ParserLib.rule('ArrayType'),
                    ParserLib.rule('PointerType'),
                    ParserLib.rule('OptionalType'),
                    ParserLib.rule('PrimitiveType'),
                    ParserLib.rule('IdentifierType'),
                    ParserLib.rule('ParenType'),
                ),
                {
                    build: (data: ParserLib.Result) => ParserLib.Result.createAsCustom('passed', 'base-type', data.getChoiceResult()!.getCustomData()!, data.span)
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('StructType',
                ParserLib.seq(
                    // struct <CatchPoint>
                    ParserLib.token('struct'),
                    // {
                    ParserLib.optional(ParserLib.token('{')),
                    // members
                    ParserLib.zeroOrMore( ParserLib.rule('StructMember') ),
                    // }
                    ParserLib.optional(ParserLib.token('}'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;

                            const isOpeningParen    = seq_array[1].isOptionalPassed();
                            const isClosingParen    = seq_array[3].isOptionalPassed();

                            const structSpan        = seq_array[0].getTokenSpan()!;
                            const openingParenSpan  = isOpeningParen ? seq_array[1].getOptionalResult()!.getTokenSpan()! : null;
                            const closingParenSpan  = isClosingParen ? seq_array[3].getOptionalResult()!.getTokenSpan()! : null;


                            const membersCount  = seq_array[2].getRepeatCount()!;
                            const members       = membersCount > 0
                                                ? seq_array[2].getRepeatResult()!.map(member => member.getCustomData()! as AST.StructMemberNode)
                                                : [];

                        // ══════ Syntax validation ══════

                            // Missing `{`
                            if(!isOpeningParen) {
                                throw {
                                    msg: "Expected '{' to begin struct body",
                                    span: {
                                        start: structSpan.end,
                                        end: structSpan.end + 1,
                                    },
                                } as ParseError;
                            }

                            // Missing `}`
                            if(!isClosingParen) {
                                throw {
                                    msg: "Expected '}' after struct body",
                                    span: {
                                        start: closingParenSpan?.end ?? (membersCount > 0 && members![membersCount-1])
                                                                        ? members![membersCount-1].span.end
                                                                        : openingParenSpan?.end,
                                        end: closingParenSpan?.end ?? (membersCount > 0 && members![membersCount-1])
                                                                        ? members![membersCount-1].span.end+1
                                                                        : openingParenSpan!.end+1
                                    },
                                } as ParseError;
                            }

                        // ══════════ Build AST ══════════

                            const result = AST.TypeNode.asStruct(data.span, members);
                            return ParserLib.Result.createAsCustom('passed', 'struct-type', result, data.span);
                    },
                }
            ),

            ParserLib.createRule('StructMember',
                ParserLib.seq(
                    ParserLib.choice(
                        ParserLib.rule('StructField'),
                        ParserLib.rule('FnStmt'),
                    ),
                    ParserLib.optional(ParserLib.token(';'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array = data.getSequenceResult()!;
                            const member = seq_array[0].getChoiceResult()!.getCustomData()! as AST.StmtNode | AST.FieldNode;

                        // ══════ Syntax validation ══════

                            // Missing member
                            if(!member) {
                                throw {
                                    msg: "Expected valid member",
                                    span: data.span,
                                } as ParseError;
                            }

                        // ══════════ Build AST ══════════

                            const result = member.kind === 'Func' // function stmt
                                        ? AST.StructMemberNode.createMethod(member.span, (member as AST.StmtNode).getFunc()!)
                                        : AST.StructMemberNode.createField(member.span, member as AST.FieldNode)

                            return ParserLib.Result.createAsCustom('passed', 'struct-member', result, data.span);
                    }
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('EnumType',
                ParserLib.seq(
                    // enum <CatchPoint>
                    ParserLib.token('enum'),
                    // {
                    ParserLib.optional(ParserLib.token('{')),
                    // members
                    ParserLib.zeroOrMore( ParserLib.rule('EnumVariant'), ParserLib.token(',') ),
                    // }
                    ParserLib.optional(ParserLib.token('}'))
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;

                            const isOpeningParen    = seq_array[1].isOptionalPassed();
                            const isClosingParen    = seq_array[3].isOptionalPassed();

                            const enumSpan          = seq_array[0].getTokenSpan()!;
                            const openingParenSpan  = isOpeningParen ? seq_array[1].getOptionalResult()!.getTokenSpan()! : null;
                            const closingParenSpan  = isClosingParen ? seq_array[3].getOptionalResult()!.getTokenSpan()! : null;


                            const variantsCount     = seq_array[2].getRepeatCount()!;
                            const variants          = variantsCount > 0
                                                    ? seq_array[2].getRepeatResult()!.map(member => member.getCustomData()! as AST.EnumVariantNode)
                                                    : [];

                        // ══════ Syntax validation ══════

                            // Missing `{`
                            if(!isOpeningParen) {
                                throw {
                                    msg: "Expected '{' after `enum` keyword",
                                    span: {
                                        start: enumSpan.end,
                                        end: enumSpan.end + 1,
                                    },
                                } as ParseError;
                            }

                            // Missing `}`
                            if(!isClosingParen) {
                                throw {
                                    msg: "Expected '}' after enum body",
                                    span: {
                                        start: closingParenSpan?.end ?? variantsCount > 0
                                                                        ? variants![variantsCount-1].span.end
                                                                        : openingParenSpan?.end,
                                        end: closingParenSpan?.end ?? variantsCount > 0
                                                                        ? variants![variantsCount-1].span.end+1
                                                                        : openingParenSpan!.end+1
                                    },
                                } as ParseError;
                            }

                        // ══════════ Build AST ══════════

                            const result = AST.TypeNode.asEnum(data.span, variants);
                            return ParserLib.Result.createAsCustom('passed', 'enum-type', result, data.span);
                    },
                }
            ),

            ParserLib.createRule('EnumVariant',
                ParserLib.seq(
                    // ident <CatchPoint>
                    ParserLib.rule('Ident'),
                    // :
                    ParserLib.optional(ParserLib.token(`:`)),
                    // type
                    ParserLib.optional(ParserLib.rule('BaseType')),
                ),
                {
                    build: (data: ParserLib.Result, parser: ParserLib.Parser) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;
                            const ident             = seq_array[0].getCustomData()! as AST.IdentNode;

                            // () | {}
                            const isColonSign       = seq_array[1].isOptionalPassed();
                            const isColonSignSpan   = isColonSign ? seq_array[1].getOptionalResult()!.getTokenSpan()! : undefined;

                            // Type
                            const isType            = seq_array[2].isOptionalPassed()
                            const type              = isType
                                                        ? seq_array[2].getOptionalResult()!.getCustomData()! as AST.TypeNode
                                                        : undefined;

                        // ══════ Syntax validation ══════

                            // type without `:`
                                if(type && !isColonSign) {
                                    // throw new Error("Expected `:` before type");
                                    throw {
                                        msg: "Expected `:` before type",
                                        span: type.span,
                                    } as ParseError
                                }

                                // `:` without type
                                if(!type && isColonSign) {
                                    throw {
                                        msg: "Expected type after `:`",
                                        span: isColonSignSpan,
                                    } as ParseError
                                }

                                // TODO: not allowed types...

                        // ══════════ Build AST ══════════

                            const variantNode = AST.EnumVariantNode.create(data.span, ident, type);
                            return ParserLib.Result.createAsCustom('passed', 'enum-variant', variantNode, data.span);
                    }
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('FunctionType',
                ParserLib.seq(
                    // fn <CatchPoint>
                    ParserLib.token('fn'),
                    // (
                    ParserLib.optional(ParserLib.token('(')),
                    // parameters
                    ParserLib.optional(
                        ParserLib.oneOrMore(
                            ParserLib.rule('Type'),
                            ParserLib.token(','),
                        ),
                    ),
                    // )
                    ParserLib.optional(ParserLib.token(')')),
                    // ->
                    ParserLib.optional(ParserLib.token('->')),
                    // error type
                    ParserLib.optional(ParserLib.rule('Type')),
                    // !
                    ParserLib.optional(ParserLib.token('!')),
                    // return type
                    ParserLib.optional(ParserLib.rule('Type')),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;

                            const isOpeningParen    = seq_array[1].isOptionalPassed();
                            const isParams          = seq_array[2].isOptionalPassed();
                            const isClosingParen    = seq_array[3].isOptionalPassed();
                            const isArrowSign       = seq_array[4].isOptionalPassed();
                            const isErrsetType       = seq_array[5].isOptionalPassed();
                            const isNotSign         = seq_array[6].isOptionalPassed();
                            const isReturnType      = seq_array[7].isOptionalPassed();

                            const fnSpan            = seq_array[0].getTokenSpan()!;
                            const openingParenSpan  = isOpeningParen ? seq_array[1].span : undefined;
                            const closingParenSpan  = isClosingParen ? seq_array[3].span : undefined;
                            const arrowSignSpan     = isArrowSign    ? seq_array[4].span : undefined;
                            const notSignSpan       = isNotSign      ? seq_array[6].span : undefined;

                            let parameters  = [] as AST.TypeNode[];
                            let errorType   = isErrsetType   ? seq_array[5].getOptionalResult()!.getCustomData()! as AST.TypeNode   : undefined;
                            let returnType  = isReturnType  ? seq_array[7].getOptionalResult()!.getCustomData()! as AST.TypeNode   : undefined;

                            if (isParams) {
                                const paramList = seq_array[2].getOptionalResult()!.getRepeatResult()!;
                                parameters = paramList.map(r => r.getCustomData()! as AST.TypeNode);
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
                                if(returnType) {
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
                                } else {
                                    lastElemSpan = fnSpan;
                                }
                            }

                        // ══════ Syntax validation ══════

                            // Missing opening parenthesis
                            if (!isOpeningParen) {
                                throw {
                                    msg: "Expected `(` after `fn` keyword for function type",
                                    span: fnSpan,
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

                        // ══════════ Build AST ══════════

                            const result = AST.TypeNode.asFunction(
                                data.span,
                                parameters,
                                returnType,
                                errorType,
                            );

                            return ParserLib.Result.createAsCustom('passed', 'function-type', result, data.span);
                    },
                    errors: [
                        ParserLib.error(1, 'Expected `fn` keyword'),
                    ]
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('ErrsetType',
                ParserLib.seq(
                    // errset <CatchPoint>
                    ParserLib.token('errset'),
                    // {
                    ParserLib.optional(ParserLib.token('{')),
                    // names
                    ParserLib.zeroOrMore(
                        ParserLib.rule('Ident'),
                        ParserLib.token(','),
                    ),
                    // }
                    ParserLib.optional(ParserLib.token('}')),
                ),
                {
                    build: (data: ParserLib.Result) => {

                        // ══════════ Extract Data ════════

                            const seq_array         = data.getSequenceResult()!;

                            const isOpeningParen    = seq_array[1].isOptionalPassed();
                            const isClosingParen    = seq_array[3].isOptionalPassed();

                            const errorSpan         = seq_array[0].getTokenSpan()!;
                            const openingParenSpan  = isOpeningParen ? seq_array[1].getOptionalResult()!.getTokenSpan()! : null;
                            const closingParenSpan  = isClosingParen ? seq_array[3].getOptionalResult()!.getTokenSpan()! : null;

                            const membersCount  = seq_array[2].getRepeatCount()!;
                            const members       = membersCount > 0
                                                ? seq_array[2].getRepeatResult()!.map(member => member.getCustomData()! as AST.IdentNode)
                                                : undefined;

                        // ══════ Syntax validation ══════

                            // Missing `{`
                            if(!isOpeningParen) {
                                throw {
                                    msg: "Expected '{' after `errset` keyword",
                                    span: {
                                        start: errorSpan.end,
                                        end: errorSpan.end + 1,
                                    },
                                } as ParseError;
                            }

                            // no members
                            if(!membersCount) {
                                throw {
                                    msg: "Expected members after `{`",
                                    span: {
                                        start: openingParenSpan?.start ?? errorSpan.start,
                                        end: closingParenSpan?.end ?? openingParenSpan?.end ?? errorSpan.end,
                                    },
                                } as ParseError;
                            }

                            // Missing `}`
                            if(!isClosingParen) {
                                throw {
                                    msg: "Expected '}' after error set",
                                    span: {
                                        start: closingParenSpan?.end ?? membersCount > 0
                                                                        ? members![membersCount-1].span.end
                                                                        : openingParenSpan?.end,
                                        end: closingParenSpan?.end ?? membersCount > 0
                                                                        ? members![membersCount-1].span.end+1
                                                                        : openingParenSpan!.end+1
                                    },
                                } as ParseError;
                            }

                        // ══════════ Build AST ══════════

                            const result = AST.TypeNode.asErrset(data.span, members!);
                            return ParserLib.Result.createAsCustom('passed', 'error-type', result, data.span);
                    },
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('TupleType',
                ParserLib.seq(
                    ParserLib.token('.'),
                    ParserLib.token('{'),
                    ParserLib.zeroOrMore(
                        ParserLib.rule('Type'),
                        ParserLib.token(',')
                    ),
                    ParserLib.token('}')
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const repeat_items = seq_array[2].getRepeatResult()!;
                        const types: AST.TypeNode[] = [];

                        for (const item of repeat_items) {
                            types.push(item.getCustomData()! as AST.TypeNode);
                        }

                        // If only one type and no trailing comma, it's a parenthesized type, not a tuple
                        if (types.length === 1) {
                            return ParserLib.Result.createAsCustom('passed', 'paren-type', types[0], data.span);
                        }

                        const result = AST.TypeNode.asTuple(data.span, types);
                        return ParserLib.Result.createAsCustom('passed', 'tuple-type', result, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected '.{' for tuple"),
                        ParserLib.error(2, "Expected '}' for tuple")
                    ]
                }
            ),

            ParserLib.createRule('OptionalType',
                ParserLib.seq(
                    ParserLib.token('?'),
                    ParserLib.rule('BaseType')
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const targetType = seq_array[1].getCustomData()! as AST.TypeNode;

                        const result = AST.TypeNode.asOptional(data.span, targetType);
                        return ParserLib.Result.createAsCustom('passed', 'optional-type', result, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected '?' for optional type"),
                        ParserLib.error(1, "Expected target type for optional")
                    ]
                }
            ),

            ParserLib.createRule('PointerType',
                ParserLib.seq(
                    ParserLib.token('*'),
                    ParserLib.optional(ParserLib.token('mut')),
                    ParserLib.rule('BaseType')
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const mutable = seq_array[1].isOptionalPassed();
                        const targetType = seq_array[2].getCustomData()! as AST.TypeNode;

                        const result = AST.TypeNode.asPointer(data.span, targetType, mutable);
                        return ParserLib.Result.createAsCustom('passed', 'pointer-type', result, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected '*' for pointer type"),
                        ParserLib.error(2, "Expected target type for pointer")
                    ]
                }
            ),

        // ════════════ ---- ════════════

            ParserLib.createRule('PrimitiveType',
                ParserLib.choice(
                    // Basic types
                    ParserLib.token('type'),
                    ParserLib.token('void'),
                    ParserLib.token('bool'),
                    ParserLib.token('null_t'),
                    ParserLib.token('und_t'),

                    // Signed
                    ParserLib.token('i_type'),
                    ParserLib.token('isize'),

                    // Unsigned
                    ParserLib.token('u_type'),
                    ParserLib.token('usize'),

                    // Float
                    ParserLib.token('f_type'),

                    // ComptimeTypes
                    ParserLib.token('cint'),
                    ParserLib.token('cflt'),

                    // Any
                    ParserLib.token('any'),
                    ParserLib.token('err'),
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const selected = data.getChoiceResult()!;
                        let type: AST.TypeNode;

                        if (selected.isToken()) {
                            const token = selected.getTokenData()!;
                            switch (token.kind) {
                                case 'type':
                                    type = AST.TypeNode.asType(token.span);
                                    break;
                                case 'void':
                                    type = AST.TypeNode.asVoid(token.span);
                                    break;
                                case 'bool':
                                    type = AST.TypeNode.asBool(token.span);
                                    break;
                                case 'cint':
                                    type = AST.TypeNode.asComptimeInt(token.span, token.value!);
                                    break;
                                case 'cflt':
                                    type = AST.TypeNode.asComptimeFloat(token.span, token.value!);
                                    break;
                                case 'isize':
                                    type = AST.TypeNode.asSigned(token.span, token.value!, 64);
                                    break;
                                case 'i_type':
                                    type = AST.TypeNode.asSigned(token.span, token.value!, AST.PrimitiveTypeNode.calcWidth('i', token.value!));
                                    break;
                                case 'u_type':
                                    type = AST.TypeNode.asUnsigned(token.span, token.value!, AST.PrimitiveTypeNode.calcWidth('u', token.value!));
                                    break;
                                case 'usize':
                                    type = AST.TypeNode.asUnsigned(token.span, token.value!, 64);
                                    break;
                                case 'f_type':
                                    type = AST.TypeNode.asFloat(token.span, token.value!, AST.PrimitiveTypeNode.calcWidth('f', token.value!));
                                    break;
                                case 'null_t':
                                    type = AST.TypeNode.asNull(token.span);
                                    break;
                                case 'und_t':
                                    type = AST.TypeNode.asUndefined(token.span);
                                    break;
                                case 'any':
                                    type = AST.TypeNode.asAny(token.span);
                                    break;
                                case 'err':
                                    type = AST.TypeNode.asErr(token.span);
                                    break;
                                default:
                                    throw new Error(`Unknown primitive type: ${token.kind}`);
                            }
                        } else {
                            // Custom rule result (SizedIntegerType or SizedFloatType)
                            type = selected.getCustomData()! as AST.TypeNode;
                        }

                        return ParserLib.Result.createAsCustom('passed', 'primitive-type', type, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected primitive type")
                    ]
                }
            ),

            ParserLib.createRule('IdentifierType',
                ParserLib.token('ident'),
                {
                    build: (data: ParserLib.Result) => {
                        const token = data.getTokenData()!;
                        const type = AST.TypeNode.asIdentifier(token.span, token.value!);
                        return ParserLib.Result.createAsCustom('passed', 'identifier-type', type, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected type identifier")
                    ]
                }
            ),

            ParserLib.createRule('ArrayType',
                ParserLib.seq(
                    ParserLib.token('['),
                    ParserLib.optional(ParserLib.rule('Expr')),
                    ParserLib.token(']'),
                    ParserLib.optional(ParserLib.token('mut')),
                    ParserLib.rule('BaseType')
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const size = seq_array[1].isOptionalPassed() ?
                            seq_array[1].getOptionalResult()!.getCustomData()! as AST.ExprNode : undefined;
                        const mutable = seq_array[3].isOptionalPassed();
                        const elementType = seq_array[4].getCustomData()! as AST.TypeNode;

                        const result = AST.TypeNode.asArray(data.span, elementType, size, mutable);
                        return ParserLib.Result.createAsCustom('passed', 'array-type', result, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected '[' for array type"),
                        ParserLib.error(2, "Expected ']' for array type"),
                        ParserLib.error(4, "Expected element type for array")
                    ]
                }
            ),

            ParserLib.createRule('ParenType',
                ParserLib.seq(
                    ParserLib.token('('),
                    ParserLib.rule('Type'),
                    ParserLib.token(')')
                ),
                {
                    build: (data: ParserLib.Result) => {
                        const seq_array = data.getSequenceResult()!;
                        const parenType = AST.TypeNode.asParen(data.span, seq_array[1].getCustomData()! as AST.TypeNode);
                        return ParserLib.Result.createAsCustom('passed', 'paren-type', parenType, data.span);
                    },

                    errors: [
                        ParserLib.error(0, "Expected '(' for parenthesized type"),
                        ParserLib.error(2, "Expected ')' for parenthesized type")
                    ]
                }
            ),

        // ════════════ ---- ════════════

    ];

// ╚══════════════════════════════════════════════════════════════════════════════════════╝