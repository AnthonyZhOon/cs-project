# Task Management System

- Each Monash club/team has their own _workspace_.
- Workspaces contain _tasks_ and _events_.
- When someone creates a workspace, they become the _owner_ and automatically get the _manager_ role.
- Managers can invite other users by email to a workspace. If a user does not exist yet with that email, they will be able to see the invite when they sign up.

## Permissions

- 'Normal' members (`MEMBER` role) can only
	- create tasks and assign them to themselves
	- edit tasks that have been assigned to them
- Managers (`MANAGER` role) can do everything except
	- add/remove managers
	- delete workspace
- The owner of a workspace (who always has the `MANAGER` role) can do everything.
