# Sylo Setup Guide

## 🎉 SETUP COMPLETE!

**Current Status:** Foundation is fully configured and working!
- ✅ Environment variables configured
- ✅ Supabase connection established
- ✅ All UI components installed
- ✅ Git repository ready
- ✅ Ready for Vercel deployment

## 🚀 Quick Start

### 1. Environment Setup

1. **Copy environment file:**
   ```bash
   cd shadcn-nextjs-boilerplate
   cp .env.local.example .env.local
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

### 2. Supabase Setup

1. **Create a Supabase project:**
   - Go to [https://app.supabase.com](https://app.supabase.com)
   - Create a new project
   - Wait for the database to be ready

2. **Get your API keys:**
   - Go to Settings > API in your Supabase dashboard
   - Copy the Project URL and anon public key
   - Copy the service_role secret key

3. **Update `.env.local`:**
   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. **Apply database schema:**
   ```bash
   # In your Supabase SQL editor, run the contents of schema.sql
   ```

### 3. OpenAI Setup

1. **Get OpenAI API key:**
   - Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
   - Create a new API key
   - Add billing information if needed

2. **Update `.env.local`:**
   ```bash
   NEXT_PUBLIC_OPENAI_API_KEY=sk-your_openai_key
   ```

### 4. Stripe Setup (Optional)

1. **Create Stripe account:**
   - Go to [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Get your publishable and secret keys

2. **Update `.env.local`:**
   ```bash
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key
   STRIPE_SECRET_KEY=sk_test_your_key
   ```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 🎨 Style Guide

The project uses:
- **Tailwind CSS** for utility-first styling
- **Shadcn UI** for component library
- **Inter font** for typography
- **CSS custom properties** for theming

### Color Palette
- **Primary**: Green (`--primary: 140 30% 55%`)
- **Background**: White/Dark (`--background`)
- **Foreground**: Dark/Light text (`--foreground`)
- **Muted**: Subtle backgrounds (`--muted`)

### Typography
- **Font**: Inter (Google Fonts)
- **Weights**: 100-900 available
- **Letter spacing**: 0px for paragraphs

## 🚀 Vercel Deployment

### 1. Connect to Vercel

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Deploy:**
   ```bash
   cd shadcn-nextjs-boilerplate
   vercel
   ```

### 2. Environment Variables

In your Vercel dashboard, add these environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_OPENAI_API_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_SITE_URL` (your Vercel URL)

### 3. Update Site URL

Update your `.env.local` and Vercel environment variables:
```bash
NEXT_PUBLIC_SITE_URL=https://your-app.vercel.app
```

## ✅ Verification Checklist

- [ ] Environment variables configured
- [ ] Supabase project created and connected
- [ ] Database schema applied
- [ ] OpenAI API key working
- [ ] Development server running
- [ ] Authentication flow working
- [ ] Stripe integration (if needed)
- [ ] Vercel deployment successful

## 🔧 Troubleshooting

### Common Issues

1. **Supabase connection errors:**
   - Check your project URL and API keys
   - Ensure RLS policies are set up correctly

2. **OpenAI API errors:**
   - Verify API key is correct
   - Check billing is set up
   - Ensure you have credits

3. **Build errors:**
   - Run `npm install` to ensure dependencies
   - Check TypeScript errors with `npm run build`

4. **Environment variables not loading:**
   - Restart development server after changing `.env.local`
   - Check variable names match exactly

## 📝 Next Steps

Once setup is complete:
1. Test the authentication flow
2. Try the AI chat functionality
3. Explore the dashboard components
4. Start customizing for design studio needs

Need help? Check the [documentation](./docs/) or create an issue.
