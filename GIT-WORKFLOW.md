# Git Version History — How to record every change

This project is a Git repository.

## What Git will show

After you commit changes, Git can show:
- which files were changed
- lines added
- lines removed
- files created
- files deleted
- the commit date/time
- the commit message
- the full history of commits

## Every time you make changes

Open Command Prompt/PowerShell inside this project folder and run:

    git status
    git add .
    git commit -m "Describe what you changed"

Examples:

    git add .
    git commit -m "Added new gallery section"

    git add .
    git commit -m "Updated homepage design"

    git add .
    git commit -m "Added new images and video"

    git add .
    git commit -m "Fixed mobile responsive layout"

## To see all history

    git log --oneline --decorate --graph --all

## To see exactly what changed in a commit

    git show <commit-id>

## To see changes that are not committed yet

    git status
    git diff

## Important

Git cannot create history for changes that happened before the repository was created.
The current project is the starting baseline. From this point onward, commit after
each meaningful change so the history records it.

## If you use GitHub

Create a GitHub repository and connect this local repository. Then push your commits:

    git remote add origin YOUR_GITHUB_REPOSITORY_URL
    git push -u origin main

After that, GitHub will also show the complete commit history and file changes.
