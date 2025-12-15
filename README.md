# Admin CMS

This is a standalone Admin CMS extracted from a portfolio project. It is built with React, Vite, and Supabase.

## Documentation

- **API Documentation**: Available at `/api-docs` when running the app.
- **Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Running the code

1.  **Install dependencies**:
    ```bash
    npm install
    ```

## Database Setup

1. Create a new Supabase project.
2. Go to the SQL Editor in your Supabase dashboard.
3. Copy the contents of `src/supabase/schema.sql` and run it to create the necessary tables and policies.
4. Go to Project Settings -> API and copy your Project URL and anon public key.
5. Setup your environment variables as described below.

## Environment Variables

Create a `.env` file in the root of the project and add your Supabase credentials:

```env
VITE_SUPABASE_PROJECT_ID=your_project_id
VITE_SUPABASE_ANON_KEY=your_anon_key
```

Then, start the development server:

```bash
npm run dev
```