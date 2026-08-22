# Life OS - Visual Guide

This document provides a visual reference for Life OS's UI and UX design.

## 🎨 Color Palette

### Warm Gray Scale (Primary)
```
warm-gray-50:  #fafaf9  (Lightest - backgrounds)
warm-gray-100: #f5f5f4  (Light backgrounds, hover states)
warm-gray-200: #e7e5e4  (Borders, dividers)
warm-gray-300: #d6d3d1  (Secondary borders)
warm-gray-400: #a8a29e  (Disabled text)
warm-gray-500: #78716c  (Secondary text)
warm-gray-600: #57534e  (Body text)
warm-gray-700: #44403c  (Headings)
warm-gray-800: #292524  (Primary buttons, emphasis)
warm-gray-900: #1c1917  (Darkest)
```

### Accent Colors
```
Green:   #10b981  (Success, completed goals)
Orange:  #f97316  (Streak flames 🔥)
Red:     #ef4444  (Destructive actions, warnings)
Blue:    #3b82f6  (Focus rings, links)
```

## 📐 Layout Structure

### Overall Layout
```
┌─────────────────────────────────────────────────────────┐
│ Header: "Life OS" [Hi, Name] [🎯] [Logout]             │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌─────────────────────────┐  ┌───────────────────┐   │
│  │                         │  │   Side Panel      │   │
│  │   Chat Interface        │  │   (slide-in)      │   │
│  │   (Main area)           │  │                   │   │
│  │                         │  │   [Goals | Notes] │   │
│  │                         │  │                   │   │
│  │                         │  │   Content...      │   │
│  └─────────────────────────┘  └───────────────────┘   │
│  ┌─────────────────────────┐                          │
│  │ [Input] [Send]          │                          │
│  └─────────────────────────┘                          │
└─────────────────────────────────────────────────────────┘
```

### Responsive Breakpoints
- Mobile: 320px - 640px (full-width panel overlay)
- Tablet: 641px - 1024px (narrower side panel)
- Desktop: 1025px+ (optimal layout)

## 🖥️ Screen Components

### 1. Authentication Modal

**Layout:**
```
┌────────────────────────────────┐
│                                │
│        Life OS                 │
│   Your personal decision       │
│   engine & accountability      │
│        counselor               │
│                                │
│   ┌────────────────────────┐  │
│   │ Name: [____________]   │  │
│   │ Email: [___________]   │  │
│   │                        │  │
│   │   [Get Started]        │  │
│   └────────────────────────┘  │
│                                │
│   Simple auth for MVP -        │
│   your data stays local        │
└────────────────────────────────┘
```

**Styling:**
- Centered on screen
- White card with shadow
- Rounded corners (rounded-2xl)
- Gradient background (warm-gray-50 to warm-gray-100)

### 2. Main Chat Interface

**Empty State:**
```
┌──────────────────────────────────────┐
│                🎯                    │
│                                      │
│        Welcome to Life OS            │
│                                      │
│   I'm your personal decision         │
│   counselor. Tell me what's on       │
│   your mind...                       │
│                                      │
│   💡 Try: "I have 3 tasks..."       │
│   🎯 Try: "I want to start..."      │
└──────────────────────────────────────┘
```

**With Messages:**
```
┌──────────────────────────────────────┐
│ ┌──────────────────────────┐         │
│ │ User message (dark)      │         │
│ │ 10:30 AM                 │         │
│ └──────────────────────────┘         │
│                                      │
│        ┌────────────────────────┐    │
│        │ Bot message (light)    │    │
│        │ with border            │    │
│        │ 10:30 AM               │    │
│        └────────────────────────┘    │
│                                      │
│ [Loading dots if waiting...]         │
└──────────────────────────────────────┘
┌──────────────────────────────────────┐
│ [What's on your mind?] [Send]        │
└──────────────────────────────────────┘
```

**Message Styling:**
- User: Right-aligned, dark background (warm-gray-800), white text
- Bot: Left-aligned, white background, border, dark text
- Rounded corners (rounded-2xl)
- Max width: 80% of container
- Timestamp: Small, muted color

### 3. Side Panel (Goals View)

**Header:**
```
┌──────────────────────────────┐
│ 🎯 Goals              [X]    │
├──────────────────────────────┤
│ [Goals] [Notes]              │
├──────────────────────────────┤
```

**Goals List:**
```
│ ┌──────────────────────────┐ │
│ │  + Add New Goal          │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ [✓] Exercise daily       │ │
│ │     To improve health... │ │
│ │     🔥 7 day streak      │ │
│ │     Started Aug 15       │ │
│ │                      [🗑] │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ [ ] Read books           │ │
│ │     To learn more...     │ │
│ │     🔥 0 day streak      │ │
│ │     Started Aug 22       │ │
│ │                      [🗑] │ │
│ └──────────────────────────┘ │
```

**Add Goal Form:**
```
│ ┌──────────────────────────┐ │
│ │ [Goal title_______]      │ │
│ │ [Why does this matter?]  │ │
│ │ [                      ] │ │
│ │ [                      ] │ │
│ │ [Add Goal] [Cancel]      │ │
│ └──────────────────────────┘ │
```

**Goal Card Elements:**
- White background with border
- Hover effect (shadow-md)
- Checkbox: Left-aligned, green when checked
- Title: Font-medium, warm-gray-800
- Reason: Text-sm, warm-gray-600
- Streak: 🔥 icon + number, orange-600 color
- Date: Text-xs, warm-gray-500
- Delete: Icon button, top-right, hover red

### 4. Side Panel (Notes View)

**Notes List:**
```
│ ┌──────────────────────────┐ │
│ │ [Write a note...]        │ │
│ │ [                      ] │ │
│ │ [Type ▼] [Add Note]      │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 📝 Completed all tasks   │ │
│ │     today. Feeling good! │ │
│ │     Quick • Aug 22 2PM   │ │
│ │                      [🗑] │ │
│ └──────────────────────────┘ │
│                              │
│ ┌──────────────────────────┐ │
│ │ 💭 Struggling with       │ │
│ │     motivation lately    │ │
│ │     Reflection • Aug 21  │ │
│ │                      [🗑] │ │
│ └──────────────────────────┘ │
```

**Note Type Icons:**
- 📝 Quick note
- 💭 Reflection
- 🔗 Task-linked

### 5. Milestone Celebration Toast

**Appearance:**
```
┌──────────────────────────────┐
│  🎉 7-day streak!            │
│  You're building real        │
│  consistency!                │
└──────────────────────────────┘
```

**Styling:**
- Fixed position: top-right
- Green background (#10b981)
- White text
- Rounded corners
- Shadow
- Bounce animation
- Auto-dismiss after 3 seconds

## 🎭 Interaction States

### Buttons

**Primary Button (Send, Add Goal):**
```
Normal:  bg-warm-gray-800, text-white
Hover:   bg-warm-gray-700
Disabled: opacity-50, cursor-not-allowed
```

**Secondary Button (Cancel):**
```
Normal:  bg-warm-gray-200, text-warm-gray-700
Hover:   bg-warm-gray-300
```

**Icon Button (Delete):**
```
Normal:  text-warm-gray-400
Hover:   text-red-600
```

### Inputs

**Text Input / Textarea:**
```
Normal:  border-warm-gray-300
Focus:   ring-2 ring-warm-gray-500, border-transparent
```

### Checkboxes

**Goal Completion:**
```
Unchecked: border-2 border-warm-gray-300
Checked:   bg-green-500 border-green-500 with checkmark
Hover:     border-warm-gray-400
```

## 📱 Mobile Adaptations

### Layout Changes (< 640px)

1. **Header:**
   - Simplified: Just logo and 🎯 icon
   - "Hi, Name" and "Logout" moved to hamburger menu (optional)

2. **Chat Interface:**
   - Full width
   - Larger touch targets (48px minimum)
   - Input area: Stacked send button below textarea (optional)

3. **Side Panel:**
   - Full-screen overlay (not partial)
   - Swipe-to-close gesture support
   - Slightly larger fonts for readability

4. **Goals/Notes:**
   - Full-width cards
   - Larger checkboxes (32px)
   - More padding for touch

## 🌈 Visual Hierarchy

### Emphasis Levels

**Primary (Most Important):**
- Goal titles
- Chat messages (content)
- Primary CTA buttons
- Font: font-semibold or font-medium
- Color: warm-gray-800

**Secondary (Supporting Info):**
- Goal reasons
- Note types
- Timestamps
- Font: font-normal, text-sm
- Color: warm-gray-600

**Tertiary (Metadata):**
- "Started" dates
- Message timestamps
- Helper text
- Font: font-normal, text-xs
- Color: warm-gray-500

## ✨ Animation & Transitions

### Slide Panel
```css
transform: translateX(100%) → translateX(0)
duration: 300ms
easing: ease-in-out
```

### Button Hovers
```css
transition: background-color, color
duration: 200ms
```

### Loading Dots
```css
animation: bounce
dots: 3
stagger: 0.2s each
```

### Toast Notifications
```css
animation: bounce (entrance)
duration: 3s on screen
fade-out: 500ms
```

## 🎯 UX Patterns

### Confirmation Dialogs
- **Show for:** Delete goal, delete note, clear conversation
- **Don't show for:** Mark goal done/undone, adding items

### Empty States
- Always show helpful illustration (emoji)
- Include specific call-to-action
- Provide example usage

### Loading States
- Chat: Animated dots (3 dots bouncing)
- Goals/Notes: "Loading..." text centered
- Never: Blocking spinner overlay

### Error States
- Inline error messages (red text)
- Non-intrusive: Don't block entire UI
- Specific: Tell user what went wrong and how to fix

## 📏 Spacing System (Tailwind)

**Padding/Margin Scale:**
- `p-1` = 4px (tight spacing)
- `p-2` = 8px (compact)
- `p-3` = 12px (comfortable)
- `p-4` = 16px (standard)
- `p-6` = 24px (spacious)
- `p-8` = 32px (very spacious)

**Common Patterns:**
- Card padding: `p-4`
- Section spacing: `space-y-3` or `space-y-4`
- Button padding: `px-4 py-2` or `px-6 py-3`

## 🖼️ Component Sizes

**Panel Width:**
- Desktop: `w-96` (384px)
- Mobile: Full width

**Chat Container:**
- Max width: `max-w-4xl` (896px)
- Centered: `mx-auto`

**Message Bubbles:**
- Max width: 80% of container
- Min height: 48px

**Input Areas:**
- Textarea: `min-h-12`, `max-h-30`
- Text input: `h-12` (48px)

---

## 🎨 Design Tokens Summary

```javascript
// Colors
const colors = {
  background: 'warm-gray-50',
  surface: 'white',
  border: 'warm-gray-200',
  textPrimary: 'warm-gray-800',
  textSecondary: 'warm-gray-600',
  textTertiary: 'warm-gray-500',
  accent: 'warm-gray-800',
  success: 'green-500',
  warning: 'orange-600',
  danger: 'red-600'
};

// Typography
const typography = {
  fontFamily: 'System fonts (-apple-system, etc.)',
  heading: 'text-xl font-semibold',
  body: 'text-base font-normal',
  small: 'text-sm',
  tiny: 'text-xs'
};

// Spacing
const spacing = {
  tight: 'space-y-2',
  normal: 'space-y-3',
  relaxed: 'space-y-4'
};

// Border Radius
const borderRadius = {
  button: 'rounded-lg',
  card: 'rounded-lg',
  message: 'rounded-2xl',
  modal: 'rounded-2xl'
};
```

---

**This visual guide ensures consistent, warm, accessible design throughout Life OS.** 🎨
