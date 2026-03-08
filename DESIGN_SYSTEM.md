# Kaizen Academy Standard Design System

## Core Design Philosophy
Professional, modern wood-themed aesthetic with sophisticated color palette and clean typography that reflects precision and tradition of lean manufacturing.

## Color Palette
- **Primary Yellow**: `#ffd559` - Bright, energetic accent for CTAs and highlights
- **Dark**: `#1a1a1a` - Deep charcoal for text and serious content
- **Grey**: `#2a2a2a` - Medium grey for secondary elements
- **Light Grey**: `#f5f5f5` - Subtle backgrounds
- **White**: `#ffffff` - Clean, pure backgrounds
- **Accent**: `#ff6b35` - Warm orange for secondary emphasis
- **Flash Red**: `#dc2626` - Alert/error states
- **Border Color**: `#e5e5e5` - Subtle dividers
- **Text Muted**: `#666666` - Secondary text

## Typography System
**Font Stack**: 
- **Headings**: 'Bebas Neue' - Bold, industrial display font
- **Body**: 'Work Sans' - Clean, professional sans-serif

**Typography Classes**:
```css
.heading-display {
  font-family: 'Bebas Neue', sans-serif;
  font-weight: 400;
  letter-spacing: 2px;
  line-height: 1.1;
}

.heading-large {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(36px, 6vw, 56px);
  letter-spacing: 2px;
  line-height: 1.1;
}

.heading-medium {
  font-family: 'Bebas Neue', sans-serif;
  font-size: clamp(28px, 4vw, 36px);
  letter-spacing: 1px;
  line-height: 1.2;
}

.text-body {
  font-family: 'Work Sans', sans-serif;
  font-size: clamp(16px, 2vw, 18px);
  line-height: 1.6;
}
```

## Component Design Patterns

### Buttons
```css
.btn-primary {
  background: var(--primary-yellow);
  color: var(--dark);
  padding: 20px 60px;
  font-size: 20px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2px;
  box-shadow: 0 8px 30px rgba(255, 213, 89, 0.4);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255, 213, 89, 0.5);
}

.btn-secondary {
  background: transparent;
  color: var(--dark);
  border: 2px solid var(--primary-yellow);
  padding: 16px 40px;
}

.btn-ghost {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-color);
  padding: 12px 24px;
}
```

### Cards
```css
.card {
  background: var(--white);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 40px 30px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-elevated {
  background: var(--white);
  border-radius: 16px;
  padding: 60px 40px;
  box-shadow: 0 8px 40px rgba(0, 0, 0, 0.12);
}

.card-featured {
  background: var(--white);
  border-left: 6px solid var(--primary-yellow);
  border-radius: 12px;
  padding: 40px 30px;
}
```

### Inputs
```css
.input {
  background: var(--white);
  border: 2px solid var(--border-color);
  border-radius: 8px;
  padding: 16px 20px;
  font-size: 16px;
  transition: all 0.3s ease;
  width: 100%;
  color: var(--dark);
}

.input:focus {
  border-color: var(--primary-yellow);
  outline: none;
  box-shadow: 0 0 0 3px rgba(255, 213, 89, 0.1);
}
```

## Layout & Spacing
- **Grid System**: 4-column responsive grid for calculators
- **Sections**: Alternating white and grey backgrounds
- **Containers**: Max-width constraints (1200px) for readability
- **Spacing**: Generous padding (40px+ for cards, 60px for sections)

## Interactive Elements
- **Transitions**: Smooth 0.3s ease for most interactions
- **Hover States**: Transform effects (translateY, translateX)
- **Animations**: Fade-in effects with staggered delays
- **Loading States**: Professional shimmer and pulse effects

## Visual Effects
- **Shadows**: Layered shadow system (4px → 40px depth)
- **Gradients**: Subtle linear gradients for depth
- **Textures**: Repeating linear patterns for visual interest
- **Overlays**: Semi-transparent overlays for depth

## Wood Theme Implementation
- **Color Temperature**: Warm amber/orange tones
- **Texture Patterns**: Repeating linear gradients mimicking wood grain
- **Natural Elements**: Earth tones with industrial precision
- **Professional Polish**: Clean edges with organic warmth

## Hero Section Pattern
```css
.hero {
  background: linear-gradient(135deg, var(--dark) 0%, var(--grey) 100%);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  background: repeating-linear-gradient(
    90deg,
    transparent,
    transparent 50px,
    rgba(255, 213, 89, 0.03) 50px,
    rgba(255, 213, 89, 0.03) 51px
  );
}
```

## Animation Classes
```css
@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.fade-in-up {
  animation: fadeInUp 0.8s ease-out;
}
```

## Accessibility & UX Standards
- **High Contrast**: Dark text on light backgrounds
- **Clear Hierarchy**: Visual weight guides user flow
- **Responsive**: Fluid typography and flexible layouts
- **Micro-interactions**: Feedback for all user actions
- **Font Smoothing**: Antialiased text rendering

## Implementation Guidelines
1. Always use CSS custom properties for colors
2. Maintain consistent spacing units (8px, 16px, 24px, 40px, 60px)
3. Apply hover states to all interactive elements
4. Use semantic HTML5 elements
5. Implement proper focus states for accessibility
6. Add loading states for async operations
7. Use consistent border radius (8px, 12px, 16px)
8. Apply subtle animations for enhanced UX

## Usage Examples

### React Component Example
```jsx
<div className="card">
  <h2 className="heading-medium">Calculator Title</h2>
  <p className="text-body">Description text here...</p>
  <input className="input" placeholder="Enter value..." />
  <button className="btn-primary">Calculate</button>
</div>
```

### CSS Variables Setup
```css
:root {
  --primary-yellow: #ffd559;
  --dark: #1a1a1a;
  --grey: #2a2a2a;
  --light-grey: #f5f5f5;
  --white: #ffffff;
  --accent: #ff6b35;
  --flash-red: #dc2626;
  --border-color: #e5e5e5;
  --text-muted: #666666;
}
```

This design system creates a premium, trustworthy interface that balances traditional wisdom of lean manufacturing with modern web design principles.
