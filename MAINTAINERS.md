# Maintainer Guide

This guide is for repository administrators to configure the project for secure and organized collaboration.

## GitHub Repository Setup

### 1. Protect the Main Branch
To prevent direct pushes to `main` and ensure all changes go through a Pull Request (PR) with review:

1.  Go to your repository on GitHub.
2.  Click **Settings** > **Branches**.
3.  Click **Add branch protection rule**.
4.  **Branch name pattern**: `main`
5.  Check the following options:
    *   [x] **Require a pull request before merging**
    *   [x] **Require approvals** (Recommend: 1 maintainer)
    *   [x] **Require status checks to pass before merging** (If you set up CI/CD later)
    *   [x] **Do not allow bypassing the above settings**
6.  Click **Create**.

### 2. Enable Discussions (Optional)
If you want a place for general questions outside of Issues/PRs:
1.  Go to **Settings** > **General**.
2.  Scroll down to **Features**.
3.  Check **Discussions**.

## Workflow for Maintainers

### Merging Pull Requests
1.  Review the code changes in the "Files changed" tab.
2.  Ensure Vercel/Netlify builds (if connected) are green.
3.  Use "Squash and merge" to keep the main history clean, or "Merge commit" to preserve individual commit history.

### Managing Releases
1.  Draft a new release in the **Releases** tab on GitHub.
2.  Tag the version (e.g., `v1.0.0`).
3.  Auto-generate release notes based on merged PRs.
