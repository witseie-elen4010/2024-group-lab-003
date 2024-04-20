# Title
**Adoption of Third Normal Form (3NF) in Database Schema Design**

# Status
Accepted

# Context
In designing the database schema for our new application, we aimed to address common data management issues from the start, including data redundancy, update anomalies, and scalability. Establishing a robust database architecture is crucial to support the application's growth and ensure efficient data handling and maintenance from the outset.

# Decision
We have chosen to design the initial database schema according to the Third Normal Form (3NF). This design principle eliminates transitive dependencies and ensures that each non-key attribute depends solely on the primary key. The schema distinctly separates collections for users, rooms, room players, rounds, text prompts, image prompts, drawings, and guesses. This structure is intended to minimize redundant storage of information and streamline relational data management.

# Consequences

## Benefits:
- **Improved Data Integrity**: Adherence to 3NF reduces redundancy, which decreases the risk of data inconsistencies during updates.
- **Easier Maintenance**: The clear separation of concerns simplifies the understanding and modification of the database, reducing backend complexity.
- **Increased Scalability**: The streamlined data structure allows the system to handle more data and more users efficiently without a proportional increase in resource demands.
- **Efficiency in Data Manipulation**: Operations such as insertions, deletions, and updates are more straightforward and less prone to requiring cascading changes or extensive cross-table checks.

## Challenges:
- **Increased Complexity in Queries**: Retrieving interconnected data now requires more joins, which could impact performance if not properly indexed or if the database queries are not optimized.
- **Initial Setup Effort**: Significant resources and time are invested in setting up the database structure, requiring careful planning and execution to align with our design principles.

This decision sets a foundational architecture that supports our goals to enhance performance, maintainability, and scalability as user demands and application functionalities grow.
