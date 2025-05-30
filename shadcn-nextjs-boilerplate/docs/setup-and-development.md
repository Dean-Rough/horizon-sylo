# Setup & Development Guide

## 🎉 Current Status: SETUP COMPLETE!

The foundation is fully configured and working:
- ✅ Environment variables configured
- ✅ Supabase connection established
- ✅ All UI components installed
- ✅ Development server running
- ✅ Git repository ready
- ✅ Ready for Vercel deployment

## Prerequisites

- Node.js LTS (18.x or later)
- npm or yarn
- Git

## Local Development Setup

1. Navigate to the boilerplate directory:
   ```bash
   cd shadcn-nextjs-boilerplate
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Initialize the Shadcn UI components:
   ```bash
   npm run init
   ```

4. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` with your actual API keys and configuration:
   - `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key
   - `NEXT_PUBLIC_OPENAI_API_KEY` - Your OpenAI API key
   - `STRIPE_SECRET_KEY` - Your Stripe secret key (for subscriptions)

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## ✅ Current Working Configuration

The project is already configured with:
- **Supabase URL**: `https://jnkfafylcsfnxcueecyx.supabase.co`
- **Database Schema**: Applied and working
- **OpenAI Integration**: Configured and functional
- **UI Components**: All 46 Shadcn components installed
- **Authentication**: Working with Supabase Auth
- **Development Server**: Running on http://localhost:3000

## Supabase Setup

1. Create a new Supabase project at [https://app.supabase.io](https://app.supabase.io)
2. Get your API keys from the Supabase dashboard (Settings > API)
3. Update your `.env.local` file with the Supabase URL and anon key
4. For local development with Supabase:
   ```bash
   npm run supabase:start
   ```

## OpenAI API Setup

1. Create an account at [https://platform.openai.com](https://platform.openai.com)
2. Generate an API key in the OpenAI dashboard
3. Add your billing information to enable API usage
4. Update your `.env.local` file with the OpenAI API key

## Coding Standards

### General Principles
- **Readability**: Write code that is easy to understand
- **Maintainability**: Structure code for long-term maintenance
- **Testability**: Design code to be easily testable
- **Performance**: Optimize for performance where appropriate

### TypeScript Standards
- Use TypeScript for all new code
- Define explicit types for all variables, parameters, and return values
- Avoid using `any` type except when absolutely necessary
- Use interfaces for object shapes and types for unions/primitives

```typescript
// Good
interface Project {
  id: string;
  name: string;
  clientId: string;
  status: ProjectStatus;
}

enum ProjectStatus {
  Planning = 'planning',
  InProgress = 'in_progress',
  Review = 'review',
  Completed = 'completed'
}

// Bad
const project: any = { name: 'Kitchen Remodel' };
```

### React/Next.js Standards
- Use functional components with hooks
- Separate business logic from UI components
- Use server components where appropriate
- Implement proper error boundaries
- Follow the container/presentational pattern

### CSS/Styling Standards
- Use Tailwind CSS for styling
- Follow the Shadcn UI component patterns
- Use CSS variables for theming
- Maintain responsive design principles

### API Standards
- Use RESTful principles for API endpoints
- Implement proper error handling and status codes
- Document all API endpoints
- Validate input data

### Testing Standards
- Write unit tests for all business logic
- Implement integration tests for critical flows
- Use mock data for testing
- Maintain test coverage above 70%

### Git Standards
- Use feature branches for all new work
- Write descriptive commit messages
- Keep pull requests focused and manageable
- Require code reviews before merging

## Deployment

### Vercel Deployment

1. Create a Vercel account at [https://vercel.com](https://vercel.com)
2. Connect your GitHub repository to Vercel
3. Configure environment variables in the Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_OPENAI_API_KEY`
   - `NEXT_PUBLIC_SITE_URL`

4. Deploy the application

### Continuous Deployment
Vercel automatically deploys when changes are pushed to the main branch.

### Database Migrations
When making database schema changes:

1. Test locally first:
   ```bash
   npm run supabase:generate-migration
   npm run supabase:push
   ```

2. Apply to production:
   ```bash
   npm run supabase:link
   npm run supabase:push
   ```

## Monitoring
- Set up Vercel Analytics for frontend monitoring
- Configure Supabase monitoring for database performance
- Use Sentry or similar for error tracking

## Documentation Standards
- Document all components with JSDoc comments
- Maintain up-to-date README files
- Document API endpoints with examples
- Update documentation when making significant changes
