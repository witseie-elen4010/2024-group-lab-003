## Database Schema Design: Adoption of Third Normal Form (3NF)

### Overview
The new application’s database schema has been strategically designed to mitigate common data management issues such as data redundancy, update anomalies, and scalability challenges. By adopting the Third Normal Form (3NF), we ensure a robust architecture that supports efficient data handling and prepares the system for future growth.

### Design Principles
The schema has been developed in accordance with 3NF guidelines, which eliminate transitive dependencies and ensure that each non-key attribute is solely dependent on the primary key. This approach has led to a well-structured schema with distinct collections for users, rooms, room players, rounds, text prompts, image prompts, drawings, and guesses. Our design minimizes redundant data storage and optimizes relational data management.

### Implementation Strategy
The following components outline the implementation approach for the database schema:

- **Separation of Concerns**: Each aspect of the application’s data—users, rooms, gameplay—is stored in separate tables, ensuring that related data is grouped together while maintaining independence where needed.
- **Dependency Reduction**: By enforcing that all attributes depend only on the primary key, the schema reduces the risk of anomalies and enhances the integrity of data modifications.
- **Structured Relationships**: Relationships between tables are carefully managed to uphold the integrity and efficiency of data retrieval and manipulation.

### Anticipated Benefits
The adoption of 3NF is expected to deliver significant benefits:

- **Data Integrity**: Reduction in data redundancy enhances consistency across the database, especially during updates.
- **Maintenance Efficiency**: The clear division of data simplifies ongoing database maintenance efforts, making it easier to modify and manage the schema as the application evolves.
- **Scalability**: With a streamlined data structure, the system is well-equipped to handle increases in data volume and user load efficiently.
- **Operational Effectiveness**: Routine database operations such as insertions, deletions, and updates are more straightforward and less likely to introduce cascading changes.

### Potential Challenges
While the benefits are significant, the following challenges may arise:

- **Query Complexity**: The normalized structure may lead to complex queries involving multiple joins, which could affect performance without proper indexing and query optimization.
- **Setup Demands**: Initial efforts to establish the database structure are substantial, demanding meticulous planning and execution to ensure alignment with the design principles.

- **Structure (Schema)**
# Database Schema Structure

## User Schema
| Field       | Type   | Attributes              |
|-------------|--------|-------------------------|
| email       | String | required, unique        |
| createTime  | Date   | default: Date.now       |

## Room Schema
| Field       | Type   | Attributes              |
|-------------|--------|-------------------------|
| code        | String | required, unique        |
| createTime  | Date   | default: Date.now       |
| hasStarted  | Boolean| default: false          |
| numRounds   | Number |                         |
| timePerRound| Number |                         |

## RoomPlayer Schema
| Field       | Type                         | Attributes              |
|-------------|------------------------------|-------------------------|
| room        | ObjectId (ref: 'Room')       | required                |
| user        | ObjectId (ref: 'User')       | required                |
| nickname    | String                       | required                |
| isAdmin     | Boolean                      | required, default: false|
| createTime  | Date                         | default: Date.now       |

## Round Schema
| Field               | Type                 | Attributes              |
|---------------------|----------------------|-------------------------|
| room                | ObjectId (ref: 'Room') | required                |
| roundNumber         | Number               | required                |
| numberPlayersReady  | Number               | required                |
| totalPlayers        | Number               | required                |

## Drawing Schema
| Field       | Type                         | Attributes              |
|-------------|------------------------------|-------------------------|
| round       | ObjectId (ref: 'Round')      | required                |
| bookUser    | ObjectId                     | required                |
| drawerUser  | ObjectId (ref: 'User')       | required                |
| imageData   | Buffer                       |                         |
| createTime  | Date                         |                         |

## Texting Schema
| Field       | Type                         | Attributes              |
|-------------|------------------------------|-------------------------|
| round       | ObjectId (ref: 'Round')      |                         |
| bookUser    | ObjectId                     | required                |
| textUser    | ObjectId (ref: 'User')       | required                |
| textData    | String                       |                         |
| createTime  | Date                         |                         |


### Conclusion
The choice to implement the database schema according to Third Normal Form is foundational to our objectives of enhancing performance, maintainability, and scalability. This design framework is pivotal in preparing the system to meet increasing demands and expanding functionalities effectively.
