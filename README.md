# Clover Website

Official website for Clover - Baby Changing Places app.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
cd website
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:4321](http://localhost:4321) in your browser.

### Build

```bash
npm run build
```

The static site will be generated in the `dist/` directory.

### Preview Build

```bash
npm run preview
```

## 📁 Project Structure

```
website/
├── src/
│   ├── components/      # Reusable components
│   ├── layouts/         # Page layouts
│   ├── pages/          # Route pages (file-based routing)
│   └── styles/         # Global styles
├── public/             # Static assets
├── astro.config.mjs    # Astro configuration
├── tailwind.config.mjs # Tailwind CSS configuration
└── netlify.toml        # Netlify deployment config
```

## 🎨 Tech Stack

- **Astro** - Static site generator
- **Tailwind CSS** - Utility-first CSS framework
- **TypeScript** - Type safety

## 🌈 Color Scheme

The website uses Clover's brand colors:
- Brand Pink: `#E91E63`
- Accent Violet: `#6B73FF`
- Supporting amenity colors for visual hierarchy

## 📦 Deployment

### Netlify (Recommended)

1. Push this `website/` folder to a GitHub repository
2. Connect your repository to Netlify
3. Netlify will auto-detect the build settings from `netlify.toml`
4. Deploy!

Or use Netlify CLI:

```bash
npm install -g netlify-cli
netlify deploy --prod
```

### Manual Deployment

1. Build the site: `npm run build`
2. Upload the `dist/` folder to any static hosting provider

## 📝 Pages

- `/` - Homepage with hero, features, and CTAs
- `/about` - About Clover and mission
- `/privacy` - Privacy policy (required for app stores)
- `/terms` - Terms of service (required for app stores)

## 🔧 Customization

### Update App Store Links

Edit `src/components/AppStoreButtons.astro` and replace the `#` placeholders with actual store URLs.

### Add Images/Screenshots

1. Place images in `public/images/`
2. Reference them in components: `<img src="/images/screenshot.png" alt="..." />`
3. Update Hero component to use real app screenshots

### Update Contact Email

Search for email placeholders (`hello@clover-app.com`, etc.) and replace with your actual email addresses.

## 📱 Responsive Design

The site is fully responsive and optimized for:
- Mobile (320px+)
- Tablet (768px+)
- Desktop (1024px+)

## ♿ Accessibility

- Semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Screen reader friendly

## 📊 Performance

- Zero JavaScript by default (except for mobile menu toggle)
- Optimized images and assets
- Fast page loads with Astro's static generation

## 🤝 Contributing

This website is part of the Clover app project. To make changes:

1. Update files in `website/src/`
2. Test locally with `npm run dev`
3. Build with `npm run build`
4. Deploy to Netlify

## 📄 License

Part of the Clover project.
