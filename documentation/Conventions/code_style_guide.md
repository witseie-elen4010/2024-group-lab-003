# Coding Style Guide

## Introduction
This guide provides comprehensive guidelines for writing clean, consistent, and readable code, incorporating [StandardJS](https://standardjs.com/) formatting principles.

## 1. Variables and Functions
- **Naming**: Use `lowerCamelCase` for variable and function names to enhance readability and consistency.

## 2. Classes
- **Naming**: Use `UpperCamelCase` (also known as PascalCase) for class names.

## 3. Constants
- **Definition**: Define constants in `UPPERCASE` to easily distinguish them from variables that might change.

## 4. Properties
- **Object Keys**: If object keys are quoted, maintain consistency across the project. Use unquoted keys unless quotes are needed.

## 5. Conditionals
- **Equality**: Always use the `===` operator for comparison to avoid unexpected type coercion.
- **Simple Equality**: Use the ternary operator for concise conditional statements, enhancing code brevity and clarity.

## 6. Comments
- **Usage**: Write meaningful comments that explain the "why" behind the code, not just the "what". This helps in maintaining code and onboarding new developers.

## 7. Version Control
- **Commit Practices**: Use clear and descriptive commit messages.
- **Branching**: Always pull down the main branch before creating a new branch. Create a well-named branch that reflects the task or bug you are working on. Once you have completed your work, pull the main branch again and merge it into your branch. Resolve any conflicts and then create a pull request to merge your work into the main branch.

## Best Practices

### Code Consistency
- Stick to the consistent coding style by using a linter or formatter like StandardJS.
- Use UNIX-style newlines (`\n`), and ensure a newline character as the last character of a file. Windows-style newlines (`\r\n`) are forbidden inside any repository.
- No trailing whitespace.
- **Do not use semicolons** to end lines.
- Max 80 characters per line.
- Use single quotes for strings unless writing JSON.
- Opening braces go on the same line as the statement.
- Declare one variable per statement, which makes it easier to re-order the lines. Place variable declarations at the top of their respective scopes for clarity.


## Naming Conventions
- **Variables and Functions**: Should be descriptive and use `lowerCamelCase`. Avoid single character variables and uncommon abbreviations.
- **Class Names**: Should be capitalized using `UpperCamelCase`.
- **Constants**: Should use `UPPERCASE`.

## Conditionals
- Always use the `===` operator for comparisons to avoid type coercion.

## Functions
- **Size**: Write small functions. A good rule of thumb is that a function should be no longer than 15 lines of code.
- **Early Returns**: Return early from functions to avoid deep nesting of if-statements.

## Comments
- **Style**: Use `//` for both single line and multi-line comments. Comments should explain higher-level mechanisms or clarify complex segments of your code; avoid stating the obvious.

**References**
- [StandardJS Website](https://standardjs.com/)
