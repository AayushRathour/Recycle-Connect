# 🌱 RecycleConnect - Waste Management Marketplace

A full-stack web application connecting buyers and sellers of recyclable waste materials, powered by AI for waste identification and mapping for logistics.

## ✨ Features

- 🔐 **User Authentication** - Register as Buyer or Seller with secure login
- 📍 **Interactive Maps** - Real-time location tracking and routing (OpenStreetMap + OSRM)
- 🤖 **AI Waste Identification** - Gemini AI integration for waste classification
- 🖼️ **Image Upload** - Upload multiple images per listing
- 🔍 **Advanced Search & Filters** - Search by category, price, quantity
- 💬 **Purchase Workflow** - Request, accept, reject purchase flow
- 📊 **Performance Metrics** - Real-time analytics dashboard
- 💰 **INR Currency** - All prices in Indian Rupees (₹)
- 📱 **WhatsApp Integration** - Direct contact with sellers
- 🗺️ **Route Calculation** - Distance and travel time between buyer-seller

## 🚀 Quick Deploy

### Deploy to Railway (Recommended)

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
   git push -u origin main
   ```

2. **Deploy on Railway**:
   - Go to [railway.app](https://railway.app)
   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository
   - Add environment variables:
     ```
     NODE_ENV=production
     SESSION_SECRET=your-32-char-secret
     AI_INTEGRATIONS_GEMINI_API_KEY=your-gemini-key
     ```
   - Add volumes for persistent storage:
     - `/app/uploads` (for images)
     - `/app/data` (for database)
   - Generate domain → Get your live URL!

3. **Done!** 🎉 Share your URL: `https://your-app.up.railway.app`

📖 **Detailed deployment guide**: See [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)

## 🛠️ Local Development

```bash
# Install dependencies
npm install

# Set environment variables (create .env file)
SESSION_SECRET=your-secret-here
AI_INTEGRATIONS_GEMINI_API_KEY=your-gemini-key

# Run development server
npm run dev

# Visit http://localhost:5000
```

## 📋 Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn UI
- **Backend**: Express.js, Node.js
- **Database**: SQLite with Drizzle ORM
- **Maps**: Leaflet, OpenStreetMap, OSRM
- **AI**: Google Gemini API
- **Authentication**: Passport.js
- **Forms**: React Hook Form + Zod validation

## 🌐 Live Demo

After deployment, test these features:
- ✅ Register as Buyer and Seller
- ✅ Create listings with images
- ✅ Browse with filters
- ✅ Send purchase requests
- ✅ View maps and routes
- ✅ Check performance metrics

## 📸 Screenshots

(Add screenshots after deployment)

## 🔑 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NODE_ENV` | Set to `production` for deployment | Yes |
| `SESSION_SECRET` | Secret key for session encryption (min 32 chars) | Yes |
| `AI_INTEGRATIONS_GEMINI_API_KEY` | Google Gemini API key for AI features | Yes |
| `PORT` | Server port (auto-set by hosting platforms) | No |

## 📝 License

MIT License - feel free to use for your projects!

## 🤝 Contributing

Contributions welcome! Please open an issue or submit a pull request.

---

**Built with ❤️ for a cleaner, greener future**
