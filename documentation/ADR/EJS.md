# Adoption of EJS as the Templating Engine over Plain HTML in a Node.js and Express Application

## Status
Accepted

## Context
In developing our web application, the choice of templating engine is critical for rendering dynamic content efficiently. Our application needs to serve pages that dynamically display data from the server, which requires a templating engine that integrates seamlessly with Node.js and Express. The main options considered were using plain HTML with client-side JavaScript and adopting a server-side templating engine like EJS (Embedded JavaScript).

## Decision
We have decided to use EJS as our templating engine over plain HTML. EJS allows for JavaScript code execution on the server, enabling dynamic generation of HTML pages based on server-side data before they are sent to the client. This approach supports our need for real-time data display without relying heavily on client-side JavaScript, improving the load times and SEO performance of our application.

## Consequences
By adopting EJS, we can streamline our development process with server-side rendering, which simplifies the architecture by minimizing the reliance on client-side JavaScript for initial page renders. This will potentially enhance the user experience through faster page loads and improved SEO as content is already rendered when pages are crawled by search engines. However, this choice introduces a dependency on EJS and its syntax, requiring our team to familiarize themselves with EJS-specific code, which can slightly steepen the learning curve.

### Pros
- Server-side Rendering: Enhances initial page load performance and SEO.
- Dynamic Content Generation: Facilitates the straightforward integration of server-side data into web pages.
- Simplicity and Speed: EJS uses plain HTML syntax with added JavaScript, which can be easier to develop and maintain compared to extensive client-side rendering solutions.
- Reduction in Client-side Code: Decreases the amount of JavaScript required on the client-side, leading to faster initial page rendering.

### Cons
- Learning Curve: Requires developers to learn EJS syntax and best practices.
- Scalability Concerns: As application complexity grows, managing large EJS templates can become cumbersome compared to using a more robust client-side framework.
- Limited Client-side Interactivity: Relies more on server-side rendering, which might limit the responsiveness and interactivity on the client-side compared to solutions employing client-side rendering frameworks.
