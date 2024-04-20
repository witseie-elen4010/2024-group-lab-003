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

## Conclusion
Adhering to a detailed style guide helps reduce discrepancies in code style and eases collaboration and maintenance of projects. Automation tools like Prettier ensure consistent formatting across different parts of the project.