# Code Review Guidelines

## Introduction
Effective code reviews are crucial for maintaining high-quality code. This guide outlines the key areas to focus on during a review to ensure code is robust, understandable, and aligns with our coding standards.

## Review Criteria

### 1. Design
- Evaluate whether the code is architecturally sound and fits well within your system.

### 2. Functionality
- Check if the code functions as the author intended and meets the users' needs.

### 3. Complexity
- Assess if the code could be simplified. Ensure that it can be easily understood and maintained by other developers.

### 4. Tests
- Verify that the code includes appropriate tests that are well-designed and cover expected behavior.

### 5. Naming
- Review the clarity of names used for variables, classes, methods, etc., to ensure they convey intent effectively.

### 6. Comments
- Ensure comments are meaningful and add value to understanding the code.

### 7. Style
- Confirm that the code adheres to our established style guidelines.

### 8. Documentation
- Check whether all necessary documentation has been updated or added.

## Selecting Reviewers

- Choose reviewers who can provide a detailed and accurate review promptly.
- Often, the best reviewers are those familiar with the codebase, such as the code owners, though it may be beneficial to include others who can provide fresh perspectives or specialized knowledge.

## Writing Code Review Comments

- Always be respectful and supportive in your feedback.
- Provide reasons for your suggestions to help the developer understand your perspective.
- Encourage clarity and simplicity; offer guidance on how problems can be resolved instead of just pointing them out.
- Suggest improvements or request clarifications where necessary.

## Example Review Feedback

- Design: Approved
- Functionality: Denied. Implementation of XX functionality is required.
- Complexity: Approved
- Tests: Approved (No tests needed as changes were only to HTML.)
- Naming: Approved
- Comments: Approved
- Style: Approved
- Documentation: Approved (All relevant documentation has been updated.)

*Guide adapted from [Google Engineering Practices](https://google.github.io/eng-practices/review/).*
