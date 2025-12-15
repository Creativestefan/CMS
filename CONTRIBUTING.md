# Contributing to the Admin CMS

Thank you for your interest in contributing! We welcome contributions from everyone.

## Getting Started

1.  **Fork** the repository on GitHub.
2.  **Clone** your fork locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/CMS.git
    cd CMS
    ```
3.  **Install dependencies**:
    ```bash
    npm install
    ```
4.  **Environment Setup**:
    You need Supabase credentials to run the app. Create a `.env` file or update `src/utils/supabase/info.tsx` (if you are the owner) with:
    - `projectId`
    - `publicAnonKey`

## Development

Run the development server:

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

## Code Style

- We use **Prettier** for code formatting.
- We use **ESLint** for linting.
- Please ensure your code is formatted and lint-free before submitting.

## Pull Request Process

1.  Create a new branch for your feature or fix.
2.  Make your changes.
3.  Run `npm run build` to ensure no build errors.
4.  Push your branch and open a Pull Request.
5.  Fill out the Pull Request Template.

## Reporting Issues

If you find a bug or have a feature request, please open an issue in the repository.
