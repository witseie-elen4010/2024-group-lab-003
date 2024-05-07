# Retrospective Meeting Minutes

*Date:* [1 May 2024]  
*Participants:* Joseph, Akiva, Yishai, Jacob  
*Sprint Duration:* 1 Week  
*Objective:* Review of Sprint 2 for Doodle All The Way Down

## 1. Sprint Overview
This sprint focused on enhancing inter-user collaboration in *Doodles All The Way Down*, allowing players to start the game either by drawing or writing. We improved the drawing functionality by enabling drawing in different colors, undoing actions, and saving drawings to the PC. Additional features included giving players the ability to leave the game and return to the landing page, and allowing the admin to remove a player from the waiting room, with all other players seeing the changes in real-time regarding player status.

## 2. Sprint Velocity
| Expected Story Points | Actual Story Points |
|-----------------------|---------------------|
| 18                    | 20                  |

Two tasks required more effort than expected:
- *Admin Can Remove a Player from the Room:* Originally estimated at 3 story points but required 4. The additional work involved ensuring the admin could not remove themselves and implementing checks to send removed players back to the landing page, necessitating further database handling.
- *Undo, Redo, and Clear Drawings:* Estimated at 2 story points but took 3. The complexity arose from needing to create temporary registers to store moves and defining what constitutes a stroke for proper undo/redo functionality.

## 3. What the Team Did Well
- *Implementation of Testing:* Successfully integrated Jest testing into our framework, enhancing our code verification processes.
- *Collaborative Game Play Enhancements:* Improved admin control over the game, allowing better management of player interactions.
- *Feature Implementation:* Added significant functionalities to the game, enhancing user experience and control.
- *Adherence to Standards:* Maintained high standards in coding and documentation.

## 4. What Went Wrong
- *Estimation Issues:* Certain tasks, particularly those involving complex backend operations, were underestimated in terms of the effort required.

## 5. What Could Have Been Done Better
- *Improved Estimation Practices:* There's a continuing need to enhance our estimation accuracy, especially for tasks involving detailed database and state management.
- *Task Dependency Management:* Managing sequential dependencies remains a challenge that could be addressed by better task scheduling.

## 6. Tickets Completed
| Task                          | Assigned to | Reviewed by |
|-------------------------------|-------------|-------------|
| Color Palette for Drawing     | Yishai      | Joseph      |
| Undo, Redo, and Clear Drawings| Akiva       | Jacob       |
| Begin by Drawing in Book      | Joseph      | Yishai      |
| User Can Describe the Drawing | Jacob       | Akiva       |
| Admin Can Remove a Player     | Yishai      | Joseph      |
| Leave Room                    | Akiva       | Yishai      |
| Save Image                    | Joseph      | Akiva       |

## 7. Key Decisions and Discussions
- *Technical Enhancements:* Decided to upgrade the database schema to better support dynamic player management and state tracking.
- *Feature Integration:* Focused on seamless integration of front-end and back-end components, especially for game flow-related features.

## 9. Closing
The meeting concluded with the team acknowledging the progress made and the lessons learned regarding estimation and task allocation. These insights are expected to drive improvements in the upcoming sprint.

*Next Meeting:* [8 May 2024, 18:00]

This revised overview now includes the focus on user collaboration and updates across functionalities that were key to this sprint's objectives. Additional details have been added to each section for a more comprehensive review of the team's efforts and challenges. If further adjustments are needed, please let me know.