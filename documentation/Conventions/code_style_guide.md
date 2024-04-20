# Coding Style Guide

## Introduction
This guide provides comprehensive guidelines for writing clean, consistent, and readable code, incorporating [Prettier's](https://prettier.io/) formatting principles.


## 1. Variables and Functions
- **Naming**: Use `lowerCamelCase` for variable and function names to enhance readability and consistency.

## 2. Classes
- **Naming**: Use `UpperCamelCase` (also known as PascalCase) for class names.

## 3. Constants
- **Definition**: Define constants in `UPPERCASE` to easily distinguish them from variables that might change.

## 4. Properties
- **Object Keys**: If object keys are quoted, maintain consistency across the project. Prefer the Prettier setting `quoteProps: 'consistent'` to ensure all keys are treated equally.

## 5. Conditionals
- **Equality**: Always use the `===` operator for comparison to avoid unexpected type coercion.
- **Simple Equality**: Use the ternary operator for concise conditional statements, enhancing code brevity and clarity.

## 6. Comments
- **Usage**: Write meaningful comments that explain the "why" behind the code, not just the "what". This helps in maintaining code and onboarding new developers.

## 7. Version Control
- **Commit Practices**: Use clear and descriptive commit messages.
- **Branching**: Always pull down main before branching. Create a well named branch that reflects the developer story or bug you are working on. Once you have completed your work, pull main again and merge it into your branch. Resolve any conflicts and then create a pull request to merge your work into the trunk.

## Best Practices

### Code Consistency
- Stick to the consistent coding style by using a linter or formatter like Prettier.
- Use UNIX-style newlines (\n), and a newline character as the last character of a file. Windows-style
- Newlines (\r\n) are forbidden inside any repository.
- No trailing whitespace
- Do not use Semicolons
- Max 80 characters per line
- Use single quotes, unless you are writing JSON.
- Opening braces go on the same line
- Your opening braces go on the same line as the statement.
- Declare one variable per var statement
- Declare one variable per var statement, it makes it easier to re-order the lines. However, ignore Crockford when it comes to declaring variables deeper inside a function, just put the declarations wherever they make sense.

## 2 Naming Conventions
- Use lowerCamelCase for variables, properties and function names
- Variables, properties and function names should use lowerCamelCase. They should also be descriptive. Single character variables and uncommon abbreviations should generally be avoided.
- Use UpperCamelCase for class names
- Class names should be capitalized using UpperCamelCase.
- Use UPPERCASE for Constants

## 3 Conditionals
- Use the === operator

## 4 Functions
- Write small functions
- Keep your functions short. A good function fits on a slide that the people in the last row of a big room can comfortably read. So don't count on them having perfect vision and limit yourself to ~15 lines of code per function.
- Return early from functions
- To avoid deep nesting of if-statements, always return a function's value as early as possible.

## 5 Comments
- Use slashes for comments
- Use slashes for both single line and multi line comments. Try to write comments that explain higher level mechanisms or clarify difficult segments of your code. Don't use comments to restate trivial things.

**References**
- https://standardjs.com/