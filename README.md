# Concept Decomposition

A powerful web application that breaks down complex concepts into their fundamental principles using first-principles thinking. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

- **Concept Analysis**: Decompose any concept into its core components
- **Multi-Domain Support**: Mathematics, Physics, Computer Science, Economics, Biology, Philosophy, Chemistry, Psychology
- **Depth Options**: Choose between quick insights or exhaustive analysis
- **Interactive Results**: Beautiful, structured narrative output with examples and use cases
- **User Authentication**: Secure login system with password confirmation
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd decomp
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── decompose/     # Concept decomposition API
│   ├── login/             # Login page
│   ├── page.tsx           # Home page
│   └── results/           # Results page
├── components/            # React components
│   └── narrative/         # Narrative display components
├── lib/                   # Utility libraries
│   ├── narrative/         # Narrative processing
│   └── pipeline/          # Analysis pipeline
├── types/                 # TypeScript type definitions
│   ├── internal.ts        # Internal data models
│   ├── narrative.ts       # Narrative types
│   └── index.ts           # Main type exports
└── globals.css           # Global styles
```

## 🔐 Authentication

The application includes a simple authentication system:

- **Login**: Email and password with confirmation
- **Demo Mode**: Quick access without credentials
- **Session Storage**: Authentication state persisted in localStorage

*Note: This is a demo authentication system. In production, implement proper authentication with JWT tokens or session management.*

## 📊 API Endpoints

### POST /api/decompose

Decomposes a concept into structured analysis.

**Request Body:**
```json
{
  "input": {
    "concept": "Algorithm",
    "domain": "computer-science",
    "depth": "short"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "definition": "...",
    "first_principles": [...],
    "reconstruction": [...],
    "examples": [...],
    "use_cases": [...],
    "scenarios": [...],
    "assumption_challenges": [...]
  }
}
```

### Supported Domains

- `general` - General concepts
- `mathematics` - Mathematical concepts
- `physics` - Physical phenomena
- `computer-science` - CS concepts
- `economics` - Economic principles
- `biology` - Biological concepts
- `philosophy` - Philosophical ideas
- `chemistry` - Chemical concepts
- `psychology` - Psychological concepts

### Depth Options

- `short` - Quick clarity (concise analysis)
- `exhaustive` - Deep dive (comprehensive analysis)

## 🎨 Design System

The application uses a custom design system with:

- **Colors**: 
  - Primary: Orange (`#d4570a`)
  - Background: Warm off-white (`#fefdfb`)
  - Text: Dark charcoal (`#1a1614`)
- **Typography**: 
  - Serif: Crimson Pro (headings, body text)
  - Monospace: IBM Plex Mono (UI elements, buttons)
- **Animations**: Subtle fade-in and slide-up effects

## 🔧 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

### Code Style

- **TypeScript**: Strict mode enabled
- **ESLint**: Configured for Next.js and TypeScript
- **Prettier**: Code formatting (optional)
- **Tailwind CSS**: Utility-first CSS framework

## 🧪 Testing

The project includes test setup:

```bash
# Run tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

## 📝 How It Works

1. **Input**: User enters a concept, selects domain and depth
2. **Processing**: The concept is analyzed through a 4-step pipeline:
   - Definition extraction
   - First principles identification
   - Logical reconstruction
   - Example generation
3. **Output**: Results are formatted into an interactive narrative
4. **Storage**: Results are saved to localStorage for persistence

## 🚀 Deployment

### Vercel (Recommended)

1. Connect your repository to Vercel
2. Configure environment variables
3. Deploy automatically on git push

### Other Platforms

```bash
# Build the application
npm run build

# Start the production server
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Icons from [Heroicons](https://heroicons.com/)
- Fonts from [Google Fonts](https://fonts.google.com/)

## 📞 Support

If you have any questions or need support, please:

1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Join our community discussions

---

**Concept Decomposition** - Making complex ideas simple, one principle at a time.
