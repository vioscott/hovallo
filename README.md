# Hovallo - Property Rental Platform

A modern property rental platform for Nigeria, connecting landlords, agents, and tenants.

## Features

- 🏠 Property listings with advanced search and filtering
- 👤 User authentication with role-based access (Tenant, Landlord, Agent, Admin)
- 📊 **Advanced Analytics Dashboard** for landlords
  - Property view tracking
  - Inquiry conversion rates
  - Price comparison with similar properties
  - Best time to list analysis
  - Geographic demand heatmaps
- 📝 Property inquiry system
- 🔐 Admin moderation panel
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Backend**: Supabase (PostgreSQL + Auth)
- **Charts**: Recharts
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd property
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run database migrations:
- Open your Supabase dashboard
- Go to SQL Editor
- Run the SQL from `supabase_schema.sql`
- Run the SQL from `analytics_schema.sql` for analytics features

5. Start the development server:
```bash
npm run dev
```

## Analytics Setup

The platform includes advanced analytics for landlords. To set up:

1. Install analytics dependencies (already in package.json):
```bash
npm install recharts date-fns
```

2. Run the analytics migration in Supabase SQL Editor:
- Copy contents of `analytics_schema.sql`
- Paste and execute in SQL Editor

3. See `ANALYTICS_SETUP.md` for detailed setup instructions

## Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository in Vercel
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Deploy!

## Project Structure

```
property/
├── src/
│   ├── components/      # Reusable UI components
│   ├── contexts/        # React contexts (Auth)
│   ├── pages/          # Page components
│   ├── utils/          # Utility functions (storage, analytics)
│   ├── App.tsx         # Main app component with routing
│   └── main.tsx        # Entry point
├── public/             # Static assets
├── analytics_schema.sql # Analytics database migration
├── supabase_schema.sql # Main database migration
└── ANALYTICS_SETUP.md  # Analytics setup guide
```

## Key Features

### For Landlords & Agents
- Create and manage property listings
- Track property performance with analytics
- View inquiries and conversion rates
- Compare pricing with market
- Identify best listing times

### For Tenants
- Search and filter properties
- View detailed property information
- Contact property owners
- Save favorite listings

### For Admins
- Moderate all listings
- Manage user accounts
- View platform statistics

## Environment Variables

Required environment variables:

- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

MIT License - feel free to use this project for your own purposes.

## Support

For issues or questions, please open an issue on GitHub.
