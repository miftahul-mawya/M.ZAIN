# OWNER CHANGE-TRACKING SYSTEM

This project is prepared for Git-based change tracking.

## What the owner can see

When changes are committed, the owner can see:

- New files added
- Files deleted
- Files modified
- Lines added (+)
- Lines removed (-)
- Commit date/time
- Your commit message
- The complete sequence of previous versions

## IMPORTANT: ZIP vs GitHub

A ZIP is only a snapshot. If you send a ZIP today and then change your
local project tomorrow, the owner will NOT automatically see tomorrow's changes.

For continuous owner access, use GitHub.

Recommended workflow:

1. Create a GitHub repository for this project.
2. Connect this local project to that GitHub repository.
3. Whenever you make a meaningful change, run `SAVE-CHANGES.bat`.
4. Push the commit to GitHub.
5. The owner can open the GitHub repository and check the Commits/History.

## Every change

Double-click:

    SAVE-CHANGES.bat

It will:
- show what changed
- ask what you changed
- save the change as a Git commit

Example messages:

    Added new gallery section
    Added 5 new images
    Updated homepage layout
    Fixed mobile design
    Added contact section
    Changed navigation menu

## See your history

Double-click:

    VIEW-CHANGES.bat

## See exact code differences

Double-click:

    SHOW-CHANGES.bat

## GitHub commands

After creating a GitHub repository, connect it:

    git remote add origin YOUR_GITHUB_REPOSITORY_URL
    git push -u origin main

After each new commit:

    git push

## Best practice

Commit after each meaningful piece of work. Do not wait until the entire
project is finished.

Example:

    Added homepage section
    Added project images
    Added new project card
    Fixed responsive layout

This gives the owner a clear record of your work.

## Important limitation

Git only records changes after they are committed. Uncommitted changes are
visible on your computer through `git status` and `git diff`, but another
person cannot see them until you commit and push them to the shared GitHub
repository.
