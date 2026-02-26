# Project Assist - Web App Structure

## Overview
This document outlines the refactored file structure for the Project Assist SaaS application, now using React JavaScript (.jsx) instead of TypeScript (.tsx).

## Architecture Rules

### Language & Type System
- **Language**: React JavaScript (.jsx) - No TypeScript
- **No Type Interfaces**: All TypeScript interfaces and types removed
- **No React.FC**: Standard function components without TypeScript typing

### Component Prefix Convention
- **All UI components** are prefixed with `PA` (Project Assist)
- Examples: `PAButton`, `PAInput`, `PAFormGroup`, `PAPasswordField`

### Folder Structure

```
PROJECT-Assist-Web-App/
├── src/
│   ├── app/
│   │   ├── App.tsx (entry point - kept as .tsx for Vite compatibility)
│   │   ├── routes.ts (routing config - kept as .ts for type safety)
│   │   ├── components/
│   │   │   ├── ui/              ← Base UI components (PA-prefixed)
│   │   │   │   ├── PAButton.jsx
│   │   │   │   ├── PAInput.jsx
│   │   │   │   ├── PAFormGroup.jsx
│   │   │   │   └── PAPasswordField.jsx
│   │   │   └── figma/           ← Figma-specific components
│   │   │       └── ImageWithFallback.tsx
│   │   ├── pages/               ← Page-level components
│   │   │   ├── Login.jsx
│   │   │   ├── DesignSystem.jsx
│   │   │   └── Root.jsx
│   │   └── styles/              ← Global styles
│   │       ├── index.css        (main styles import)
│   │       ├── fonts.css        (font imports)
│   │       ├── tailwind.css     (Tailwind config)
│   │       └── theme.css        (design system tokens)
│   └── styles/                  ← Legacy styles (redirects to app/styles)
│       └── index.css
├── package.json
└── vite.config.ts
```

## File Naming Conventions

### Components
- **UI Components**: PascalCase with PA prefix
  - File: `PAButton.jsx`
  - Export: `export default function PAButton() { ... }`

- **Page Components**: PascalCase
  - File: `Login.jsx`
  - Export: `export default function Login() { ... }`

### Folders
- **camelCase** for folder names
  - ✅ `components/ui/`
  - ✅ `pages/`
  - ❌ `Components/UI/`

## Export Pattern

All components use **default exports** that match the filename:

```javascript
// PAButton.jsx
export default function PAButton({ variant = 'primary', children, ...props }) {
  // component code
}
```

## Import Pattern

```javascript
// Import UI components
import PAButton from '../components/ui/PAButton';
import PAInput from '../components/ui/PAInput';
import PAFormGroup from '../components/ui/PAFormGroup';
import PAPasswordField from '../components/ui/PAPasswordField';
```

## Design System

### Color Palette
- **Primary Blue**: `#1976D2`
- **Neutral Grey**: `#9E9E9E`
- **Background**: `#F9FAFB`
- **Error**: `#D32F2F`

### Typography
- **Font Family**: Inter
- **Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Component Variants

#### PAButton
- `primary` - Blue background (#1976D2)
- `secondary` - Blue outline
- `text` - Text link style

#### PAInput
- `default` - Standard input state
- `active` - Focused state
- `error` - Error state with red border

## Routes

- `/` - Login page (default)
- `/design-system` - UI Kit documentation

## Styling

Global styles are located in `/src/app/styles/`:
- CSS custom properties for design tokens
- Tailwind CSS v4 configuration
- Inter font imports
- Base component styles

## Key Files

- **Entry Point**: `/src/app/App.tsx`
- **Routing**: `/src/app/routes.ts`
- **UI Components**: `/src/app/components/ui/`
- **Pages**: `/src/app/pages/`
- **Styles**: `/src/app/styles/`

## Development

The application uses:
- React 18.3.1
- Vite 6.3.5
- Tailwind CSS 4.1.12
- React Router 7.13.0
- Lucide React (for icons)

---

**Last Updated**: Refactored from TypeScript to JavaScript with PA component prefix convention
