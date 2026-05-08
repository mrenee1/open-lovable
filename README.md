# Biz Boost AI Builder

Build.Brand.Dominate. AI-powered website builder that creates stunning websites with your brand's style. Powered by Biz Boost Agency.

<img src="https://media1.giphy.com/media/v1.Y2lkPTc5MGI3NjExbmZtaHFleGRsMTNlaWNydGdianI4NGQ4dHhyZjB0d2VkcjRyeXBucCZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZFVLWMa6dVskQX0qu1/giphy.gif" alt="Biz Boost AI Builder Demo" width="100%"/>

## Setup

1. **Clone & Install**
```bash
git clone https://github.com/firecrawl/open-lovable.git
cd open-lovable
pnpm install  # or npm install / yarn install
```

2. **Add `.env.local`**

```env
# =================================================================
# REQUIRED
# =================================================================
FIRECRAWL_API_KEY=fc-d2d06a748f8a400bb8164675d98e1f6a  

# =================================================================
# AI PROVIDER - Choose your LLM
# =================================================================
GEMINI_API_KEY=AIzaSyDYy7tQXtzwWNJRye9vZXQeeItJw1anEGk
      
OPENAI_API_KEY=sk-proj-rx4_JjYoRMy1VW48e8_WMqk_ET7LPNHUC5sQ-dTuamiemKbHEMB1qkR2-udeYIaNgK4CXon64AT3BlbkFJO7cCCsbRv8JJWypMVBtQFgXEv9HX9rb5Ru6nMkOSzBO6sMqoICkJK     

GROQ_API_KEY=your_groq_api_key         

# =================================================================
# FAST APPLY (Optional - for faster edits)
# =================================================================
# MORPH_API_KEY=your_morphllm_api_key    

DEVIN_API_KEY=apk_user_dXNlci0zZWIwMWE0NTc4YzQ0NzcyYjg5MzE4ZjYxNTY3NWU2OF9vcmctYzI3ZDE2MmZhOWExNDM0OThmNDQ5YTQ5OWZjZDkwMzE6NTUyZDQxNWE4NTRhNGM3Y2JmMzFkYTA2MzllNDA4NDA=

# =================================================================
# SANDBOX PROVIDER - Choose ONE: Vercel (default) or E2B
# =================================================================
SANDBOX_PROVIDER=vercel  
# or 'e2b

# Option 1: Vercel Sandbox (default)
# Choose one authentication method:

# Method A: OIDC Token (recommended for development)
# Run `vercel link` then `vercel env pull` to get VERCEL_OIDC_TOKEN automatically
VERCEL_OIDC_TOKEN=auto_generated_by_vercel_env_pull

# Method B: Personal Access Token (for production or when OIDC unavailable)
# VERCEL_TEAM_ID=team_xxxxxxxxx      # Your Vercel team ID 
# VERCEL_PROJECT_ID=prj_xxxxxxxxx    # Your Vercel project ID
# VERCEL_TOKEN=vercel_xxxxxxxxxxxx   # Personal access token from Vercel dashboard

# Option 2: E2B Sandbox
# E2B_API_KEY=e2b_f5045a365a05c49f947f19e82e35d64fbabfc715
 # https://e2b.dev
```

3. **Run**
```bash
pnpm dev  # or npm run dev / yarn dev
```

Open [http://localhost:3000](http://localhost:3000)

## About Biz Boost Agency

Websites, branding, and digital marketing that actually move the needle. We don't do average. Every pixel, every word, every campaign is built to convert.

- **Build.Brand.Dominate.** - Our philosophy in three words
- **Built from hustle, scaled with systems** - How we deliver results
- **Everything your brand needs** - Complete digital solutions
- **The builders behind the boost** - Expert team ready to help

Visit us at [https://thebizboostagency.com](https://thebizboostagency.com) to learn more.

## License

MIT