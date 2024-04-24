# Retrospective Meeting Minutes

**Date:** [24 April 2024]  
**Participants:** Joseph, Akiva, Yishai, Jacob  
**Sprint Duration:** 1 Week  
**Objective:** Review of Sprint 1 for Doodle All The Way Down

## 1. Sprint Overview
During this sprint, the team started creating the web-based game called **Doodles All The Way Down**. The initial scrum was created and user stories defined and allocated. Moreover, documentation regarding structure, form, style, and architectural decisions were created in markdown. The team completed six user stories involving the creation of essential game functionalities such as landing page, room creation, joining a room, a waiting room, drawing features, and admin controls to start the game. The sprint also included significant database design and enhancements to support game initiation.

## 2. Sprint Velocity
| Expected Story Points | Actual Story Points |
|-----------------------|---------------------|
| 22                    | 22                  |

The landing page was expected to require 2 Story Points, under the assumption that it was a simple page to implement. However, significant overhead was incurred due to initial setup and resulted in actual story points being 3. The drawing feature was expected to be difficult to implement, however, with the use of specific Javascript libraries, creating this feature turned out to be easier than expected and only took 3 Story Points to complete. The user stories that involved database creation, design, and implementation such as creating a room, joining a room, waiting room dynamics, and starting the game for all players was accurately estimated to be 4 Story Points due to initial conceern about ease of database connection and use.

## 3. What the Team Did Well
- **Collaboration:** The team displayed strong collaboration, particularly in the peer review process which ensured high-quality code.
- **Meeting Deadlines:** All planned user stories were completed on time.
- **Technical Implementation:** Successful implementation of the 3NF database design which was critical for cohesive reading and mutatiuon of data.
- **Scope controll:** The team ensured that no use story incurred scope screep, leading to delays and overhead.
- **Automatic Testing:** Automatic Playwright tests were implemented early on in the process, esnuring coherence and operation of the codebase.

## 4. What Went Wrong
- **Estimation Issues:** Some tasks were underestimated, particularly the Landing Page, which took more effort than expected due to initial setup.
- **Sequential User Stories:** User stories were allocated in such a way that required some team members to wait for the completion of others in order to start their user story implementations.
- **Concurrency of Standard Definitions and Implementations:** Some documentation was added later in the development process, leading to retroactive updates of said documentation.

## 5. What Could Have Been Done Better
- **Better Estimation:** Improve story point estimation to better reflect the complexity involved, especially with initial setup.
- **Better Organised Documentation:** Improve the database of documentation templates and standards for ease of use.

## 6. Tickets Completed
| Task                   | Assigned to | Reviewed by |
|------------------------|-------------|-------------|
| Landing Page           | Joseph      | Akiva       |
| Creating A Room        | Yishai      | Jacob       |
| Join A Room            | Jacob       | Yishai      |
| Waiting Room           | Yishai      | Joseph      |
| Drawing Feature        | Akiva       | Yishai      |
| Admin Can Start Game   | Jacob       | Akiva       |

## 7. Key Decisions and Discussions
- **Architecture Decision:** The team decided to implement and then improve upon a 3NF database design which Yishai and Jacob worked on. This architecture is crucial for scalability and performance.

## 9. Closing
The meeting concluded with acknowledgments of the team's hard work and a discussion about maintaining the momentum into the next sprint. The team agreed on the action items and is committed to implementing the improvements discussed.

**Next Meeting:** [1 May 2024, 18:00]
