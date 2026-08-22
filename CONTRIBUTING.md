# Contributing to Life OS

Thank you for considering contributing to Life OS! This document provides guidelines for contributing to the project.

## 🎯 Project Vision

Life OS is a **personal decision engine + accountability counselor**, not a generic task manager. Every contribution should align with this vision:

- **Context retention** over feature bloat
- **Reasoning transparency** over silent automation  
- **Gentle accountability** over guilt-tripping notifications
- **Conversational intelligence** over rigid workflows

## 🛠️ Development Setup

1. Fork and clone the repository
2. Follow the QUICKSTART.md to set up locally
3. Create a branch: `git checkout -b feature/your-feature-name`
4. Make your changes
5. Test thoroughly
6. Submit a pull request

## 📋 Contribution Areas

### High-Priority Improvements

1. **Authentication System**
   - Replace simple name/email with JWT or OAuth
   - Add password hashing
   - Implement proper session management

2. **AI Quality**
   - Improve decision detection heuristics
   - Add prompt tuning for better responses
   - Implement feedback loop for AI calibration

3. **Streak Logic Enhancements**
   - User-configurable grace period (0, 1, or 2 days)
   - Visualize streak history (calendar view)
   - "Partial completion" mode (e.g., did 50% of goal)

4. **Search & Discovery**
   - Upgrade to vector embeddings for semantic search
   - Add filters for notes (by type, date range)
   - Full-text search across all conversations

5. **Daily Check-in Automation**
   - Scheduled prompts (morning/evening)
   - "How did yesterday go?" automation
   - Weekly reflection prompts

### Nice-to-Have Features

- Calendar integration (Google Calendar sync)
- Export data (CSV, JSON)
- Dark mode
- Goal templates (common habits)
- Progress charts (streak visualizations)
- Mobile app (React Native)
- Voice input for chat
- Goal dependencies (can't do B until A is done)

## 🚫 What We Don't Want

Please avoid contributions that:

- Add enterprise features (teams, permissions, billing)
- Make the UI more complex (keep it minimal)
- Add gamification beyond streaks (no points, levels, badges)
- Implement rigid scheduling (no calendar grid view)
- Add social features (sharing, following, competition)

Life OS is intentionally simple and personal.

## 💻 Code Style Guidelines

### Backend (Node.js)

- Use `async/await` over callbacks
- Write descriptive function names (`calculateStreak` not `calc`)
- Add JSDoc comments for exported functions
- Handle errors gracefully (try/catch + meaningful messages)
- Use `const` by default, `let` when necessary, never `var`

### Frontend (React)

- Use functional components with hooks
- Keep components focused (single responsibility)
- Use descriptive variable names (`isLoadingGoals` not `loading`)
- Prefer composition over prop drilling (but no Context API unless needed)
- Use Tailwind utility classes (avoid custom CSS unless necessary)

### Database

- Always add indexes for new query patterns
- Use lean() for read-only queries
- Validate IDs before querying
- Use transactions for multi-document operations

## 🧪 Testing

Currently, Life OS has no automated tests (MVP decision). If adding tests:

- Use Jest for unit tests
- Use Supertest for API integration tests
- Use React Testing Library for component tests
- Focus on critical paths (streak calculation, AI integration)

## 📝 Commit Message Format

Use conventional commits:

```
feat: add calendar view for streak history
fix: resolve streak calculation grace period bug
docs: update README with new deployment steps
refactor: extract streak logic into separate service
test: add unit tests for streak calculation
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

## 🔄 Pull Request Process

1. **Create descriptive PR title:**
   - Good: "Add vector search for similar decisions"
   - Bad: "Update stuff"

2. **Fill out PR template:**
   - What: Brief description of changes
   - Why: Reason for the change
   - Testing: How you tested it
   - Screenshots: If UI changes

3. **Ensure code quality:**
   - No console.log statements
   - No commented-out code
   - No merge conflicts
   - All files properly formatted

4. **Update documentation:**
   - Update README.md if features added
   - Update ARCHITECTURE.md if structure changed
   - Update FEATURES_CHECKLIST.md if new features

5. **Wait for review:**
   - Address feedback constructively
   - Make requested changes
   - Be patient :)

## 🐛 Bug Reports

When filing a bug report, include:

- **Environment:** OS, Node version, browser
- **Steps to reproduce:** Detailed step-by-step
- **Expected behavior:** What should happen
- **Actual behavior:** What actually happens
- **Screenshots:** If UI issue
- **Logs:** Server console or browser console errors

## 💡 Feature Requests

When requesting a feature:

- **Use case:** Why do you need this?
- **Current workaround:** How do you handle this now?
- **Proposed solution:** How should it work?
- **Alternatives considered:** Other approaches?
- **Alignment with vision:** How does this fit Life OS philosophy?

## 🔒 Security Vulnerabilities

**DO NOT** open a public issue for security vulnerabilities.

Instead, email the maintainer directly with:
- Description of vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## 📜 Code of Conduct

### Our Standards

- Be respectful and inclusive
- Welcome newcomers and help them learn
- Accept constructive criticism gracefully
- Focus on what's best for the project
- Show empathy toward other community members

### Unacceptable Behavior

- Harassment, discrimination, or trolling
- Personal attacks or insults
- Publishing others' private information
- Spamming or self-promotion
- Any conduct inappropriate for a professional setting

## 📞 Questions?

- Open a GitHub Discussion for general questions
- Check existing issues before opening new ones
- Join our community chat (if available)

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for helping make Life OS better! Every contribution, big or small, is appreciated.** 🙏
