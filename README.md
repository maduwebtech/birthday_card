# Birthday Wishes Image Generator

A full production-ready AI-powered Birthday Wishes Image Generator web application built with Next.js (App Router) and TypeScript. This modern serverless SaaS allows users to create personalized birthday cards with AI-generated wishes, editable designs, and high-resolution exports - all without any database or authentication.

## Features

### Core Features
- **AI Birthday Wish Generator** - Generate personalized messages using OpenAI or Gemini API based on user input (name + tone)
- **Dynamic Image Card Generator** - Real-time editable design canvas using HTML Canvas API and Fabric.js
- **Pre-built Animated Templates** - 6 beautiful birthday card templates (balloons, cake, lights, confetti effects)
- **Fully Editable Text System** - Drag, resize, font change, color picker, alignment control
- **Live Preview System** - Instant updates when AI response is received or user edits content
- **Image Export System** - Download final card as high-resolution PNG/JPEG

### Advanced Features
- **Theme-based Design System** - Cute, Elegant, Luxury, and Minimal themes
- **Multi-language AI Output** - Support for English, Urdu, and Hindi
- **Real-time Drag-and-Drop Editor** - Canvas-based editing engine
- **Live Font Switching & Color Customization** - Full text customization
- **One-click Download** - Optimized image compression for exports
- **No Database Architecture** - All state handled via React state and localStorage

## Tech Stack

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for modern responsive UI
- **Fabric.js** for canvas-based editing engine
- **HTML Canvas API** for rendering images
- **Framer Motion** for smooth animations
- **Lucide React** for icons

### Backend / API
- **Next.js API Routes** (serverless functions)
- **OpenAI API** integration (GPT-3.5 Turbo)
- **Google Gemini API** integration (optional alternative)
- **Rate limiting** for API protection
- **Environment variable** handling for secure API keys

## Project Structure

```
birthday-wishes-generator/
├── app/
│   ├── api/
│   │   └── generate-wish/
│   │       └── route.ts          # AI wish generation API
│   ├── globals.css               # Global styles & Tailwind
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Main application page
├── components/
│   ├── CanvasEditor.tsx          # Fabric.js canvas editor
│   ├── InputPanel.tsx            # User input controls
│   ├── TemplatePanel.tsx         # Template selector
│   └── TextEditor.tsx            # Wish text editor
├── lib/
│   └── utils.ts                  # Utility functions
├── types/
│   └── index.ts                  # TypeScript types & constants
├── .env.local.example            # Environment variables template
├── next.config.js                # Next.js configuration
├── package.json                  # Dependencies
├── tailwind.config.ts            # Tailwind CSS configuration
└── tsconfig.json                 # TypeScript configuration
```

## Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- OpenAI API key OR Google Gemini API key

### Setup

1. **Clone the repository**
```bash
git clone https://github.com/maduwebtech/birthday_card
cd birthday_card
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment variables**
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your API keys:
```env
# OpenAI API Key (get from https://platform.openai.com/api-keys)
OPENAI_API_KEY=your_openai_api_key_here

# OR Google Gemini API Key (get from https://makersuite.google.com/app/apikey)
GEMINI_API_KEY=your_gemini_api_key_here

# Choose AI Provider: 'openai' or 'gemini'
AI_PROVIDER=openai
```

4. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Usage

### Creating a Birthday Card

1. **Enter Recipient Details**
   - Fill in the recipient's name
   - Select the desired tone (Funny, Emotional, Professional, Romantic)
   - Choose language (English, Urdu, Hindi)
   - Optionally add context for personalized wishes

2. **Generate AI Wish**
   - Click "Generate AI Wish" button
   - The AI will create a personalized birthday message
   - View the generated wish in the text editor

3. **Choose Template**
   - Select from 6 pre-designed templates
   - Themes include: Cute, Elegant, Luxury, and Minimal
   - Each template has unique decorations and styling

4. **Customize Design**
   - Click on text to edit directly on the canvas
   - Drag text to reposition
   - Use the toolbar to change fonts and colors
   - Resize using corner handles

5. **Export & Download**
   - Click PNG or JPEG buttons to download
   - High-resolution export (2x multiplier)
   - Share or print your birthday card

### AI Providers

The application supports two AI providers:

#### OpenAI (Default)
Uses GPT-3.5 Turbo for generating wishes. Recommended for best quality output.

#### Google Gemini
Alternative AI provider. Set `AI_PROVIDER=gemini` in your `.env.local` file.

#### Fallback Mode
If no API keys are configured, the app falls back to template-based generation with pre-written wishes for each tone and language.

## Architecture

```
User Input → Next.js UI → API Route (AI Request) → AI Response (Wish Text) 
    ↓
Canvas Rendering Engine → Editable Design Layer → Export Module → Downloadable Image
```

### State Management
- **React State** - Component-level state management
- **localStorage** - Persistence for template selection and wish text
- **No Database** - Completely serverless and stateless

### Security
- API keys stored securely in environment variables
- Rate limiting (20 requests/hour per IP)
- No user data stored on servers
- Stateless system design

## Deployment

### Vercel (Recommended)

1. **Push your code to GitHub**
2. **Import project in Vercel**
3. **Add environment variables** in Vercel dashboard
4. **Deploy**

The application is optimized for serverless deployment with:
- Dynamic imports for canvas engine
- Optimized API calls with debouncing
- Lightweight bundle size

### Environment Variables for Production

```env
OPENAI_API_KEY=sk-...
# OR
GEMINI_API_KEY=...
AI_PROVIDER=openai
```

## Customization

### Adding New Templates

Edit `types/index.ts` and add new templates to `CARD_TEMPLATES` array:

```typescript
{
  id: 'my-template',
  name: 'My Template',
  theme: 'cute',
  backgroundColor: '#ffffff',
  gradient: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
  decorations: [
    { type: 'star', x: 100, y: 100, size: 30, color: '#ffd700' },
  ],
  defaultFont: 'Arial',
  defaultTextColor: '#000000',
}
```

### Adding New Tones

Add new tone options to the `Tone` type and `TONE_LABELS` in `types/index.ts`:

```typescript
export type Tone = 'funny' | 'emotional' | 'professional' | 'romantic' | 'poetic';

export const TONE_LABELS: Record<Tone, string> = {
  // ... existing
  poetic: '📜 Poetic',
};
```

### Adding New Languages

Add language support by updating the `Language` type and adding templates in the API route.

## API Reference

### POST /api/generate-wish

Generate a personalized birthday wish.

**Request Body:**
```json
{
  "name": "John",
  "tone": "funny",
  "language": "english",
  "customPrompt": "optional context"
}
```

**Response:**
```json
{
  "wish": "Happy Birthday John! 🎉 ...",
  "tone": "funny",
  "language": "english",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Error Responses:**
- `400` - Invalid request parameters
- `429` - Rate limit exceeded
- `500` - Server error

## Performance Considerations

- **Canvas rendering** uses Fabric.js for efficient 2D graphics
- **Image exports** use 2x multiplier for high resolution
- **API calls** are rate-limited to prevent abuse
- **Dynamic imports** reduce initial bundle size
- **localStorage** persists user data without server storage

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

Requires modern browser support for:
- HTML5 Canvas API
- ES6+ JavaScript
- CSS Grid & Flexbox

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- OpenAI for GPT-3.5 Turbo API
- Google for Gemini API
- Fabric.js team for the amazing canvas library
- Next.js team for the fantastic React framework

## Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Happy Birthday Card Creating! 🎉🎂🎈**
