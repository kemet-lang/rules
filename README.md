<!----------------------------------- BEG ----------------------------------->
<br>
<div align="center">
    <p>
        <img src="./assets/img/logo.png" alt="Kemet-Logo" style="" width="300" />
    </p>
</div>


<div align="center">
    <p>
        <img src="./assets/img/rules-desc.png" alt="Kemet-Desc" style="" width="200" />
    </p>
    <a href="https://github.com/kemet-lang"><img src="https://img.shields.io/badge/from-kemet_lang-black"/></a>
</div>


<div align="center">
    <img src="./assets/img/line.png" alt="line" style="display: block; margin-top:20px;margin-bottom:20px;width:500px;"/>
    <br>
</div>

<!--------------------------------------------------------------------------->



<!----------------------------------- --- ----------------------------------->

- ### Syntax Rules

    1. ### Type

        ```bash
        Primitive
            | type                      # e.g. `bool, i32, u32, ..`

            | bool                      # e.g. `let x : bool   = true`
            | cint                      # e.g. `let x : cint   = 9999`
            | cflt                      # e.g. `let x : cflt   = 3.14`
            | und_t                     # e.g. `let x : und_t  = und`
            | null_t                    # e.g. `let x : null_t = null`
            | any                       # e.g. `let x : any    = true`

            | void                      # e.g. `fn x() -> void { /* no return stmt requierd */ }`
            | err                       # e.g. `def e = errse t{ e1, ... }; let x : err = e.e1`

            | i[0-65535]                # Signed
            | u[0-65535]                # Unsigned

            | f[16,32,64,80,128]        # Float
        ```

        ```bash
        Identifier
            | x                         # .g. `def MyStruct = struct { ... }; let x : MyStruct = new MyStruct { ... };`
        ```

        ```bash
        Optional
            | ?type                     # e.g. `let x : ?i32 = null`
        ```

        ```bash
        Pointer
            | *mut type                 # e.g. `let y: i32 = 0; let x: *i32 = &y`
        ```

        ```bash
        Array
            | [expr] mut type           # e.g. `let x : [3]u8 = [0, 1, 2]`
        ```

        ```bash
        Tuple
            | (type, ..)                # e.g. `let x : ,{ i32, bool } = .{ 0, true }`
        ```

        ```bash
        Function
            | pub inline fn(args) -> err!type stmt
                                        # pub, inline, args, err, !, type is optional
                                        # arg can be, ident: type = expr, .., .., ..
                                        # stmt can be, block stmt, expr stmt, or any other stmt
                                        # err can be, errset { ident, .. }
                                        # or just ident as shortcut for annonymous error
                                        # or member of error set, e.g. myErrorSet.myError
                                        # ! required after err type
        ```

        ```bash
        Errorset
            | errset { err, ... }       # e.g. `def e = errset { e1, ... }`
        ```

        ```bash
        Structure
            | struct { ... }            # e.g. `def MyStruct = struct {
                                        #   static x = 512;
                                        #   pub mut y : bool = false;
                                        #   static fn getX() return MyStruct.x;
                                        #   pub fn getY() return self.y;
                                        # }`
        ```

        ```bash
        Enum
            | enum { x }                # e.g. `def e = enum { x, y, ... }`
            | enum { x: type }          # e.g. `x: i32, y: struct { ... }`
        ```

        ```bash
        Union
            | type | type               # e.g. `let x : i32 | null = null`
        ```

        ```bash
        Paren
            | (type)                    # e.g. `let x : (i32) = 0`
        ```

        ```bash
        Alias
            | slice                     # []u8
            | char                      # u8
            | cpoint                    # u21
            | usize                     # u64
            | isize                     # i64
        ```

    2. ### Expr

        > To have a value, we need an expression.

        - #### [1] Primary

            ```bash
            | Literal
                | 1                     # Integer (Decimal)
                | 0x1                   # Integer (Hexadecimal)
                | 0o1                   # Integer (Octal)
                | 0b1                   # Integer (Binary)

                | 1.0                   # Float
                | 1.0e-2                # Float (Scientific)

                | "text"                # String
                | 'c'                   # Character

                | true                  # Boolean (true)
                | false                 # Boolean (false)

                | null                  # Null
                | undefined             # Undefined

                | []                    # Empty Array
                | [expr, expr, ..]      # Filled Array
            ```

            ```bash
            | Ident
                | x                     # Identifier
                | @x                    # Builtin Identifier
            ```

            ```bash
            | Type                      # Type in Expression rule
            ```

            ```bash
            | Paren
                | (expr)                # Paren Expression
            ```

            ```bash
            | Tuple
                | (expr, expr, ..)      # Tuple Expression (',' required)
            ```

            ```bash
            | Object
                | {}                    # Empty Object
                | { key: expr, .. }     # Filled Object (props can be (key: value) pairs separated by commas)
                | new ident { .. }      # Tagged object
            ```

        - #### [2] Postfix

            ```bash
            | [^]                       # Previous
            | [^] ++                    # Increment
            | [^] --                    # Decrement
            | [^].*                     # Dereference
            | [^].expr                  # Member Access
            | [^]?.expr                 # Member Access (optional)
            | [^](expr, ..)             # Call
            | type([^])                 # Call as Cast e.g. `i32(12345)`
            | [^][expr]                 # Array Access
            ```

            > The postfix operator can be repeated multiple times.

        - #### [3] Prefix

            ```bash
            | ++ [^]                    # Increment
            | -- [^]                    # Decrement
            | &  [^]                    # Reference
            | -  [^]                    # UnaryMinus
            | +  [^]                    # UnaryPlus
            | !  [^]                    # LogicalNot
            | ~  [^]                    # BitwiseNot
            |    [^]                    # Previous
            ```

            > The Prefix operator can be repeated multiple times.

        - #### [4] Binary

            ```bash
            | [^] ... [^]               # Power (**)
            | [^] ... [^]               # Multiplicative (*,/,%)
            | [^] ... [^]               # Additive (+,-)
            | [^] ... [^]               # Shift (<<,>>)
            | [^] ... [^]               # Relational (<=, >=, <, >)
            | [^] ... [^]               # Equality (==, !=)
            | [^] ... [^]               # BitwiseAnd (&)
            | [^] ... [^]               # BitwiseXor (^)
            | [^] ... [^]               # BitwiseOr  (|)
            | [^] ... [^]               # LogicalAnd (and)
            | [^] ... [^]               # LogicalOr  (or)
            ```

        - #### [5] Conditional

            ```bash
            | [^]                       # Previous
            | [^] ? expr : expr         # Conditional
            ```

        - #### [6] Assignment

            ```bash
            | [^]                       # Previous
            | [^] = expr                # Assignment (=, +=, -=, *=, /=, %=, ..)
            ```

        - #### [7] If/Else

            ```bash
            | if expr stmt              # If
            | [^]                       # Previous
            ```

            > after **if** :

            ```bash
            | else stmt                 # Else
            ```

        - #### [8] Switch

            ```bash
            | switch expr { ... }       # Switch
            | [^]                       # Previous
            ```

            > inside **switch** :

            ```bash
            | case expr: stmt           # SwitchCase
            | default: stmt             # DefaultSwitchCase
            ```


        - #### [9] Catch

            ```bash
            | [^]                       # Previous
            | [^] catch stmt            # Catch
            ```

        - #### [10] Try

            ```bash
            | try [^]                   # Try
            | [^]                       # Previous
            ```

        - #### [11] Range

            ```bash
            | [^]..                     # exclusive | Auto End (only for arrays, end = array length)
                                        # the last element index in this case (will be array.length)

            | [^]..=                    # inclusive | Auto End (only for arrays, end = array length)
                                        # the last element index in this case (will be array.length - 1)
                                        # this includes the last element

            | [^]..expr                 # Manual End
            | [^]                       # Previous
            ```

        - #### [12] Orelse

            ```bash
            | [^]                       # Previous
            | [^] ?? expr               # Orelse (returns right if left is null/undefined)
            ```

            > The `??` operator returns the right operand when the left operand is null or undefined.
            > This is especially useful with optional types: `x: ?i32`
            >
            > Examples:
            > - `value ?? defaultValue` - use defaultValue if value is null/undefined
            > - `user?.name ?? "Unknown"` - chain with optional access
            > - `a ?? b ?? c` - multiple coalescing (left-associative)

        - #### [13] As

            > you can also use `type(expr)` syntax for casting.

            ```bash
            | [^]                       # Previous
            | [^] as type               # Cast to type
            ```

        - #### [14] Special

            ```bash
            | typeof [^]                # get type of expr
            | sizeof [^]                # get size of expr(as type)
            ```

    3. ### Stmt

        > To do something, we need a statement.

        - #### [1] Expression & Block

            ```bash
            | expr                      # Expression Statement
            | { stmts }                 # Block Statement
            ```

            > `;` is optional after statements

            > `,` is optional after sequence items

        - #### [2] Use

            ```bash
            | use x as myX              # Use (from current module) as alias
            | use x from 'path'         # Use (from outside module) as import
            | use x as myX from 'path'  # Use (from outside module) with alias
            | use x.y as z from "path"  # with member access
            ```

        - #### [3] Type Definition

            ```bash
            | def x = type              # Define (Private)
            | pub def x = type          # Define (Public)
            ```

        - #### [4] Variable Declaration

            ```bash
            | let x: type                   # Variable with type
            | let x = expr                  # Variable with initializer
            | let x: type = expr            # Variable with type and initializer
            | let mut x = expr              # Mutable variable
            | pub let x = expr              # Public variable
            | pub let mut x: type = expr    # Public mutable variable with type
            | pub comptime let x = expr     # Comptime constant..
            ```

        - #### [5] Function Declaration

            ```bash
            | fn ident() { stmt }                           # Simple function
            | fn ident(param: type) { stmt }                # Function with parameters
            | fn ident(param: type = expr) { stmt }         # Function with default parameters
            | fn ident() -> type { stmt }                   # Function with return type
            | fn ident() -> err!type { stmt }               # Function with error and return type
            | pub fn ident() { stmt }                       # Public function
            | pub inline fn ident() { stmt }                # Public inline function
            | pub comptime inline fn ident() { stmt }       # Public comptime inline function
            ```

            > Parameters can be: `ident`, `ident: type`, `ident: type = expr`
            > Error type can be: `errset { err, .. }`, `err`, or `errorSet.err`

        - #### [6] Loop

            ```bash
            | for expr stmt             # For loop      (expr should be range)
                                        # to access to the current index use `@i` [TODO]

            | while expr stmt           # While loop

            | do stmt while expr        # Do loop
            ```

        - #### [7] Control Flow

            ```bash
            | return                    # Return (no value)
            | return expr               # Return with value
            | break                     # Break from loop
            | continue                  # Continue loop
            | defer expr                # Defer stmt
            | throw err                 # Throw stmt
            ```

        - #### [8] Test

            ```bash
            | test str block-stmt       # Test stmt (str is optional)
            ```
<br>
<div align="center">
    <img src="./assets/img/line.png" alt="line" style="display: block;width:500px;"/>
    <br>
</div>

<!--------------------------------------------------------------------------->


<!----------------------------------- END ----------------------------------->

<br>
<div align="center" dir='rtl'>
    <a href="https://github.com/maysara-elshewehy">
        <img src="https://img.shields.io/badge/by-Maysara-blue"/>
    </a>
</div>


<!--------------------------------------------------------------------------->