# 🚀 Life OS - Smart Productivity Assistant

> An AI-powered productivity system with custom focus timers, goal tracking, study analytics, voice interaction, and intelligent suggestions.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Made with React](https://img.shields.io/badge/Made%20with-React-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Google Gemini](https://img.shields.io/badge/Google%20Gemini-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)

![Life OS Screenshot](https://via.placeholder.com/800x400/667eea/ffffff?text=Life+OS+-+Beautiful+Productivity+System)

---

## ✨ Features

### 🤖 AI-Powered Assistant
- **Chat with Gemini AI** - Free Google Gemini 3.6 Flash model
- **Voice Input** 🎤 - Speak your messages (speech-to-text)
- **Voice Output** 🔊 - Listen to AI responses (text-to-speech)
- **Context-Aware** - AI remembers your goals, mood, and patterns
- **Smart Suggestions** - Pattern analysis and recommendations

### ⏱️ Custom Focus Timer
- **Flexible Durations** - Choose 15, 25, 30, 45, 60, or 90 minutes
- **Custom Input** - Set any duration from 1 to 180 minutes
- **Pomodoro Mode** - Auto-switch between focus and break
- **Visual Progress** - Beautiful animated circular timer
- **Session Tracking** - Link sessions to specific goals

### 🎯 Goal Management
- **Goal Tracking** - Add goals with reasons and motivation
- **Streak System** - 🔥 Track consecutive days with grace period
- **Daily Completion** - Check off goals each day
- **Milestone Celebrations** - 7, 30, 50, 100+ day achievements

### 📊 Study Analytics
- **10-Day Dashboard** - Visual bar chart of study time
- **Daily Breakdown** - Click any day for detailed stats
- **Goal-wise Time** - See time spent per goal
- **Progress Metrics** - Total hours, averages, active days

### 💡 Smart Features
- **Daily Check-ins** ☀️🌙 - Morning priorities & evening reflections
- **Mood Tracking** - Automatic emotion detection from messages
- **Pattern Analysis** - Identifies struggling goals
- **Proactive Suggestions** - AI-generated improvement tips
- **Decision Memory** - Learns from your past choices

### 📝 Notes & Journaling
- **Quick Notes** - Capture thoughts instantly
- **Daily Reflections** - Journal your progress
- **Searchable** - Find notes easily

---

## 🎨 Beautiful UI

- **Animated Gradients** - Smooth color transitions
- **Glass-morphism** - Modern frosted glass effects
- **Smooth Animations** - Fade, slide, and float effects
- **Custom Scrollbar** - Gradient-styled scrolling
- **Responsive Design** - Works on all devices
- **Dark Accents** - Professional color scheme

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v14 or higher)
- **MongoDB Atlas** account (free)
- **Google Gemini API** key (free)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Priya342-gif/smart-productivity-assistant.git
cd smart-productivity-assistant
```

2. **Install dependencies**
```bash
npm install
cd client && npm install
cd ..
```

3. **Set up environment variables**

Create `.env` in root directory:
```env
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
NODE_ENV=development
```

Create `client/.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

4. **Initialize database**
```bash
npm run init-db
```

5. **Start the application**

Backend:
```bash
npm start
```

Frontend (in new terminal):
```bash
cd client
npm start
```

6. **Open your browser**
```
http://localhost:3000
```

---

## 📚 Documentation

- **[Quick Start Guide](QUICK_START.md)** - Get up and running in 5 minutes
- **[Feature Guide](NEW_FEATURES_COMPLETE.md)** - Complete feature documentation
- **[UI Enhancements](UI_ENHANCEMENTS_COMPLETE.md)** - Design system details
- **[Architecture](ARCHITECTURE.md)** - Technical architecture overview
- **[API Documentation](QUICKSTART.md)** - Backend API reference

---

## 🛠️ Tech Stack

### Frontend
- **React** - UI library
- **Tailwind CSS** - Utility-first styling
- **Axios** - HTTP client
- **Web Speech API** - Voice input/output

### Backend
- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM

### AI & Services
- **Groq AI API** for fast and efficient chatbot responses
- **Speech Recognition API** - Voice input
- **Speech Synthesis API** - Voice output

---

## 📁 Project Structure

```
smart-productivity-assistant/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.js         # Main app
│   │   └── index.js       # Entry point
│   └── public/            # Static files
├── server/                # Node.js backend
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   └── server.js          # Server entry
├── .env.example           # Environment template
└── package.json           # Dependencies
```

---

## 🎯 Usage Examples

### Set Custom Timer
1. Click 🎯 icon → Timer tab
2. Choose preset (15-90 min) or enter custom duration
3. Select goal (optional)
4. Click "Start Focus"

### Voice Interaction
- **Input**: Click 🎤 microphone, speak your message
- **Output**: Click 🔈 speaker icon on AI responses

### Track Goals
1. Click 🎯 icon → Goals tab
2. Add goal with title and reason
3. Check off daily when complete
4. Watch your 🔥 streak grow

### View Analytics
- Click 🎯 icon → Stats tab
- See 10-day bar chart
- Click any day for details

---

## 🔧 Configuration

### MongoDB Setup
1. Create free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create cluster
3. Get connection string
4. Replace `<password>` with your password

### Gemini API Key
1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create API key
3. Copy and add to `.env`

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Features Roadmap

- [ ] Mobile app (PWA)
- [ ] Calendar integration
- [ ] Data export (CSV/PDF)
- [ ] Dark mode toggle
- [ ] Goal categories
- [ ] Weekly/monthly reports
- [ ] Social accountability
- [ ] Browser extension

---

### 🚀 Deployment

- **Frontend:** [Live Demo](https://smart-productivity-assistant-1.onrender.com)
- **Backend:** [Backend API](https://smart-productivity-assistant.onrender.com)

  

## 🙏 Acknowledgments

- **Groq AI API** for fast and efficient chatbot responses
- **MongoDB Atlas** for free database hosting
- **Tailwind CSS** for beautiful styling
- **React** community for awesome tools

---

## 📞 Support

If you have any questions or issues, please:
- Open an [Issue](https://github.com/Priya342-gif/smart-productivity-assistant/issues)
- Check the [Documentation](QUICK_START.md)
- Contact: [Your Email]

---

## ⭐ Star this repo if you find it helpful!

Made with ❤️ and ☕ by [Priya342-gif](https://github.com/Priya342-gif)

---

**Happy Productivity!** 🚀✨
