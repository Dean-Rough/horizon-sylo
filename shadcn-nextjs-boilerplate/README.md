# Sylo Design Studio Platform

<p align="center">
  <img src="./public/sylo-logo-tangerine.svg" alt="Sylo Logo" width="200px">
</p>

<p align="center">
  <strong>AI-Powered Design Studio Management Platform</strong>
</p>

<p align="center">
  Interior design project management with Pinterest inspiration and SketchUp 3D modeling integration
</p>

&nbsp;

<p align="center" style="width: 100%;">
<a style="display:flex; justify-content: center; width: 100%;" href="https://horizon-ui.com/boilerplate-shadcn" target="_blank"><img style="border-radius: 10px; width: 100%;" src="https://i.ibb.co/72bXVwG/horizon-free-boilerplate-shadcn-image-readme-2.png" alt="Horizon AI Boilerplate NextJS Shadcn UI" /></a>
</p>


&nbsp;

## 🎯 Overview

Sylo is a specialized project management platform for interior designers and architects, built on a foundation of AI-powered assistance. Starting from a Horizon UI boilerplate, we've evolved it into a comprehensive design studio management tool with MCP (Model Context Protocol) integrations.

### ✨ Key Features

- **🎨 Design-Focused AI Assistant** - Specialized prompts and workflows for interior design
- **📌 Pinterest Integration** - Search inspiration and create mood boards directly in the platform
- **🏗️ SketchUp Integration** - 3D modeling and space planning capabilities
- **🎨 Sylo Brand System** - Custom typography, colors, and design language
- **🔐 Authentication & Subscriptions** - Supabase auth with Stripe billing
- **📱 Responsive Design** - Works on desktop, tablet, and mobile

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ LTS
- npm or yarn
- Supabase account
- OpenAI API key
- Pinterest Developer account (optional)
- SketchUp installed (optional)

### Installation

1. **Clone the repository:**
```bash
git clone https://github.com/Dean-Rough/horizon-sylo.git
cd horizon-sylo/shadcn-nextjs-boilerplate
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**
```bash
cp .env.local.example .env.local
# Edit .env.local with your API keys
```

4. **Start the development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🔧 Configuration

### Required Environment Variables

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key

# MCP Servers (Optional)
PINTEREST_API_KEY=your_pinterest_api_key
PINTEREST_API_SECRET=your_pinterest_api_secret
SKETCHUP_PATH=/path/to/sketchup
```
&nbsp;

## 🔌 MCP Integration Setup

Sylo includes Model Context Protocol (MCP) integrations for enhanced design workflows:

### Pinterest MCP Server
1. Get Pinterest API credentials from [Pinterest Developers](https://developers.pinterest.com/)
2. Add credentials to `.env.local`
3. Configure Claude Desktop with Pinterest MCP server

### SketchUp MCP Server
1. Install SketchUp 2020 or later
2. Configure SketchUp path in `.env.local`
3. Configure Claude Desktop with SketchUp MCP server

See `docs/mcp-setup.md` for detailed setup instructions.

## 🎨 Design System

Sylo features a custom brand system with:

- **Typography**: Druk XCond Super for display, Circular Std for body text
- **Colors**: Tangerine (#FF6700), Pavement (#DCDCDC), Blackish (#272727)
- **Components**: Custom cards, buttons, and layouts
- **Dark Theme**: Professional dark interface with light content cards

## 📚 Documentation

- [Setup Guide](./docs/setup-and-development.md)
- [MCP Integration](./docs/mcp-setup.md)
- [Product Requirements](./docs/product-requirements.md)
- [Roadmap](./docs/roadmap.md)
- [Technical Architecture](./docs/technical-architecture.md)


### Example Sections

If you want to get inspiration for your startup project or just show something directly to your clients, you can jump-start your development with our pre-built example sections. You will be able to quickly set up the basic structure for your web project.

 View <a href="https://horizon-ui.com/boilerplate-shadcn#pages" target="_blank">example sections here</a>

 ---


# PRO Version

Unlock a huge amount of components and pages with our PRO version - <a href="https://horizon-ui.com/boilerplate-shadcn#pricing" target="_blank">Learn more</a>

<p align="center" style="width: 100%;">
<a style="display:flex; justify-content: center; width: 100%;" href="https://horizon-ui.com/boilerplate-shadcn#pricing" target="_blank"><img style="border-radius: 10px; width: 100%;" src="https://i.ibb.co/Q8jNqWJ/horizon-boilerplate-shadcn-image-readme-2.png" alt="Horizon AI Boilerplate NextJS Shadcn UI" /></a>
</p>


---

# Reporting Issues

We use GitHub Issues as the official bug tracker for the Horizon UI. Here are
some advice for our users who want to report an issue:

1. Make sure that you are using the latest version of the Horizon UI Boilerplate. Check the CHANGELOG for your dashboard on our [CHANGE LOG File](https://github.com/horizon-ui/shadcn-nextjs-boilerplate/blob/main/CHANGELOG.md).
<br />

1. Providing us with reproducible steps for the issue will shorten the time it takes for it to be fixed.
<br />


3. Some issues may be browser-specific, so specifying in what browser you encountered the issue might help.

---

# Community

Connect with the community! Feel free to ask questions, report issues, and meet new people who already use Horizon UI!

💬 [Join the #HorizonUI Discord Community!](https://discord.gg/f6tEKFBd4m)


### Copyright and license

⭐️ [Copyright 2024 Horizon UI](https://www.horizon-ui.com/?ref=readme-horizon)

📄 [Horizon UI License](https://horizon-ui.notion.site/End-User-License-Agreement-8fb09441ea8c4c08b60c37996195a6d5)


---

# Credits

Special thanks to the open-source resources that helped us create this awesome boilerplate package, including:

- [Shadcn UI Library](https://ui.shadcn.com/)
- [NextJS Subscription Payments](https://github.com/vercel/nextjs-subscription-payments)
- [ChatBot UI by mckaywrigley](https://github.com/mckaywrigley/chatbot-ui)
