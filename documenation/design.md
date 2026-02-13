# Design Document: PesaPlus Web App UI/UX

## Overview

PesaPlus is a responsive web application designed to make micro-savings engaging through gamification, social features, and immediate reward feedback. This design document outlines the UI/UX architecture, component specifications, interaction patterns, and visual design system for the web MVP, aligned with the mobile app design specifications.

The web app is designed to be **mobile-first and responsive**, adapting seamlessly from mobile viewports (320px) to desktop screens (1920px+), while maintaining the same visual design system, component patterns, and user flows as the mobile app.

The design prioritizes:
- **Trust**: Financial credibility through professional visual design
- **Simplicity**: Minimal friction from onboarding to daily use
- **Engagement**: Gamification and social features that make saving rewarding
- **Transparency**: Clear visibility of balances, interest, and transactions
- **Responsiveness**: Seamless experience across mobile, tablet, and desktop devices

## Architecture

### Design System Architecture

The PesaPlus design system follows atomic design principles with responsive breakpoints:

```
Atoms (Basic Elements)
├── Colors
├── Typography
├── Icons
├── Spacing
└── Shadows

Molecules (Simple Components)
├── Buttons
├── Input Fields
├── Cards
├── Progress Bars
└── Badges

Organisms (Complex Components)
├── Navigation Bar (Responsive: Mobile hamburger → Desktop horizontal)
├── Goal Cards (Responsive: Stacked → Grid layout)
├── Leaderboard Lists
├── Transaction History
└── Notification Center

Templates (Screen Layouts)
├── Dashboard Layout (Responsive: Single column → Multi-column)
├── Detail Screen Layout
├── List Screen Layout
└── Modal Layout

Pages (Complete Screens)
├── Onboarding Flow
├── Dashboard
├── Goal Detail
├── Rewards
├── Social/Challenges
├── Notifications
└── Settings
```

### Responsive Breakpoints

The web app uses a mobile-first approach with the following breakpoints:

```
Mobile: 320px - 767px (Single column, bottom navigation)
Tablet: 768px - 1023px (Two columns, side navigation option)
Desktop: 1024px+ (Multi-column, side navigation, expanded content)

Specific breakpoints:
- xs: 320px (iPhone SE)
- sm: 375px (iPhone standard)
- md: 768px (iPad portrait)
- lg: 1024px (iPad landscape, small desktop)
- xl: 1280px (Desktop)
- 2xl: 1920px (Large desktop)
```

### Responsive Layout Principles

**Mobile (320px-767px):**
- Single column layout
- Bottom navigation bar (fixed)
- Full-width cards with 16px horizontal padding
- Stacked content
- Hamburger menu for secondary navigation
- Touch-optimized interactions (44px minimum touch targets)

**Tablet (768px-1023px):**
- Two-column layout where appropriate
- Optional side navigation or bottom navigation
- Cards in 2-column grid
- Increased padding (24px horizontal)
- Hybrid touch/mouse interactions

**Desktop (1024px+):**
- Multi-column layout (2-3 columns)
- Persistent side navigation
- Cards in 3-column grid
- Maximum content width: 1440px (centered)
- Hover states for mouse interactions
- Keyboard navigation support

### Information Architecture

```
PesaPlus Web App
├── Onboarding (First-time users)
│   ├── Welcome/Splash
│   ├── Sign Up/Login
│   ├── Forgot Password
│   ├── Reset Password
│   └── First Goal Setup
├── Main App (Authenticated)
│   ├── Dashboard (Home)
│   │   ├── Balance Card
│   │   ├── Quick Actions
│   │   ├── Active Goals (Responsive grid)
│   │   └── Streaks & Achievements
│   ├── Goals
│   │   ├── Goal List (Responsive grid)
│   │   ├── Goal Detail
│   │   └── Create Goal
│   ├── Rewards
│   │   ├── Badges (Responsive grid)
│   │   ├── Leaderboards
│   │   └── Lottery
│   ├── Social
│   │   ├── Challenges
│   │   ├── Friends
│   │   └── Invite
│   ├── Notifications
│   ├── Settings
│   │   ├── Account
│   │   ├── Payment Methods
│   │   ├── Preferences
│   │   └── Security
│   └── KYC Verification
│       ├── Introduction
│       ├── Personal Information (Step 1/4)
│       ├── Document Upload (Step 2/4)
│       ├── Selfie Capture (Step 3/4)
│       ├── Review & Submit (Step 4/4)
│       ├── Verification Pending
│       ├── Verification Approved
│       └── Verification Rejected
```


## Components and Interfaces

### Design Tokens

#### Color System

**Primary Colors:**
```
Deep Blue: #0F2A44
- Usage: Brand identity, headers, navigation bars, primary buttons
- Variants: 
  - Light: #1B3A5B (hover states)
  - Dark: #081A2C (pressed states)
```

**Secondary Colors:**
```
Emerald Green: #1FA774
- Usage: Balances, interest earned, success states, positive actions
- Variants:
  - Light: #2BC98A (backgrounds)
  - Dark: #178A5E (emphasis)
```

**Accent Colors:**
```
Warm Gold: #F4B400
- Usage: CTAs, rewards, referral bonuses, achievements
- Variants:
  - Light: #FFC933 (highlights)
  - Dark: #D99E00 (pressed states)
```

**Neutral Colors:**
```
Charcoal: #2E2E2E (Primary text)
Cool Gray: #8A8F98 (Secondary text, disabled states)
Light Gray: #F4F6F8 (Backgrounds, dividers)
White: #FFFFFF (Cards, surfaces)
```

**Semantic Colors:**
```
Success: Emerald Green #1FA774
Warning: Warm Gold #F4B400
Error: #E53935
Info: Deep Blue #0F2A44
```

#### Typography

**Font Family:**
- Primary: Inter (clean, modern, excellent readability on screens)
- Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

**Type Scale (Responsive):**
```
Mobile (320px-767px):
Display Large: 28px / 36px line-height / Bold
Display Medium: 24px / 32px / Bold
Heading 1: 20px / 28px / Semibold
Heading 2: 18px / 24px / Semibold
Heading 3: 16px / 22px / Semibold
Body Large: 16px / 24px / Regular
Body: 14px / 20px / Regular
Body Small: 12px / 16px / Regular
Caption: 11px / 14px / Regular

Tablet (768px-1023px):
Display Large: 32px / 40px / Bold
Display Medium: 28px / 36px / Bold
Heading 1: 24px / 32px / Semibold
Heading 2: 20px / 28px / Semibold
Heading 3: 18px / 24px / Semibold
Body Large: 16px / 24px / Regular
Body: 14px / 20px / Regular
Body Small: 12px / 16px / Regular
Caption: 11px / 14px / Regular

Desktop (1024px+):
Display Large: 36px / 44px / Bold
Display Medium: 32px / 40px / Bold
Heading 1: 28px / 36px / Semibold
Heading 2: 24px / 32px / Semibold
Heading 3: 20px / 28px / Semibold
Body Large: 18px / 26px / Regular
Body: 16px / 24px / Regular
Body Small: 14px / 20px / Regular
Caption: 12px / 16px / Regular
```

**Font Weights:**
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

#### Spacing System (8-point grid, responsive)

```
Mobile (320px-767px):
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 32px
2xl: 48px
3xl: 64px

Tablet (768px-1023px):
xs: 4px
sm: 8px
md: 16px
lg: 24px
xl: 40px
2xl: 56px
3xl: 72px

Desktop (1024px+):
xs: 4px
sm: 8px
md: 16px
lg: 32px
xl: 48px
2xl: 64px
3xl: 96px

Container Padding:
Mobile: 16px horizontal
Tablet: 24px horizontal
Desktop: 32px horizontal (max-width: 1440px, centered)
```

#### Border Radius

```
Small: 4px (input fields, small badges)
Medium: 8px (cards, containers)
Large: 16px (modals, large cards)
XLarge: 24px (buttons, pills)
Round: 50% (avatars, circular badges)
```

#### Shadows

```
Small: 0 1px 3px rgba(0,0,0,0.12)
Medium: 0 4px 6px rgba(0,0,0,0.1)
Large: 0 10px 20px rgba(0,0,0,0.15)
```

### Core UI Components

#### Buttons

**Primary Button:**
- Background: Warm Gold #F4B400
- Text: Charcoal #2E2E2E
- Height: 48px (mobile), 56px (desktop)
- Border Radius: 24px (mobile), 28px (desktop)
- Font: Body Large, Semibold
- Min Width: 120px
- Padding: 12px 24px (mobile), 16px 32px (desktop)
- States:
  - Hover: Background #FFC933, cursor pointer (desktop only)
  - Pressed/Active: Background #D99E00, scale 0.98
  - Focus: 2px outline Deep Blue, 2px offset
  - Disabled: Background Cool Gray, Text Light Gray, cursor not-allowed

**Secondary Button:**
- Background: Transparent
- Border: 2px solid Deep Blue #0F2A44
- Text: Deep Blue #0F2A44
- Height: 48px (mobile), 56px (desktop)
- Border Radius: 24px (mobile), 28px (desktop)
- States:
  - Hover: Background #F4F6F8 (desktop only)
  - Pressed: Background #E8EAED
  - Focus: 2px outline Deep Blue, 2px offset

**Text Button:**
- Background: Transparent
- Text: Deep Blue #0F2A44
- Font: Body, Semibold
- Padding: 8px 16px
- States:
  - Hover: Text opacity 0.8, underline (desktop only)
  - Pressed: Text opacity 0.6
  - Focus: 2px outline Deep Blue, 2px offset

**Responsive Button Behavior:**
- Mobile: Full width by default, stacked vertically
- Tablet: Inline or full width based on context
- Desktop: Inline with min-width, horizontal layout

#### Input Fields

**Text Input:**
- Height: 48px (mobile), 56px (desktop)
- Border: 1px solid Cool Gray #8A8F98
- Border Radius: 8px
- Padding: 12px 16px (mobile), 16px 20px (desktop)
- Font: Body
- Background: White
- States:
  - Focus: Border Deep Blue #0F2A44, 2px width, box-shadow 0 0 0 3px rgba(15, 42, 68, 0.1)
  - Error: Border Error color #E53935, box-shadow 0 0 0 3px rgba(229, 57, 53, 0.1)
  - Disabled: Background Light Gray, cursor not-allowed
  - Hover: Border Deep Blue (desktop only)

**Label:**
- Font: Body Small, Medium
- Color: Charcoal
- Margin Bottom: 8px

**Helper Text:**
- Font: Caption
- Color: Cool Gray
- Margin Top: 4px

**Error Text:**
- Font: Caption
- Color: Error #E53935
- Margin Top: 4px
- Icon: Warning icon (optional)

**Responsive Input Behavior:**
- Mobile: Full width, stacked labels
- Tablet: Full width or inline based on context
- Desktop: Flexible width with max-width constraints

#### Cards

**Standard Card:**
- Background: White
- Border Radius: 12px (mobile), 16px (desktop)
- Padding: 16px (mobile), 20px (tablet), 24px (desktop)
- Shadow: 0 2px 8px rgba(0,0,0,0.08) (mobile), 0 4px 12px rgba(0,0,0,0.1) (desktop)
- Border: None
- Transition: box-shadow 0.2s ease (desktop hover)
- States:
  - Hover: Shadow 0 6px 16px rgba(0,0,0,0.12), transform translateY(-2px) (desktop only)
  - Focus: 2px outline Deep Blue

**Goal Card:**
- Background: White
- Border Radius: 12px (mobile), 16px (desktop)
- Padding: 16px (mobile), 20px (desktop)
- Shadow: Medium
- Contains: Goal name, progress bar, current/target amounts
- Responsive Layout:
  - Mobile: Single column, stacked content
  - Tablet: 2-column grid
  - Desktop: 3-column grid

**Achievement Card:**
- Background: Gradient (Warm Gold to Light variant)
- Border Radius: 12px (mobile), 16px (desktop)
- Padding: 16px (mobile), 20px (desktop)
- Shadow: Large
- Contains: Badge icon, achievement name, unlock date
- Responsive Layout:
  - Mobile: 2-column grid
  - Tablet: 3-column grid
  - Desktop: 4-column grid

#### Progress Indicators

**Linear Progress Bar:**
- Height: 8px
- Border Radius: 4px
- Background: Light Gray
- Fill: Emerald Green
- Animation: Smooth fill from left to right (300ms ease-out)

**Circular Progress:**
- Stroke Width: 6px
- Background: Light Gray
- Fill: Emerald Green
- Size: 48px (small), 80px (medium), 120px (large)

**Thermometer Progress:**
- Width: 40px
- Height: Variable (based on container)
- Background: Light Gray
- Fill: Emerald Green (bottom to top)
- Border Radius: 20px

#### Badges and Icons

**Badge Component:**
- Size: 64x64px (display), 40x40px (list)
- Border Radius: Round
- Background: Warm Gold or Emerald Green
- Icon: White, centered
- Shadow: Medium

**Notification Badge:**
- Size: 20px
- Border Radius: Round
- Background: Error color
- Text: White, Caption, Bold
- Position: Top-right of parent element

**Icon Sizes:**
- Small: 16x16px
- Medium: 24x24px
- Large: 32x32px
- XLarge: 48x48px


### Screen Specifications

#### 1. Onboarding Flow

**Screen 1: Welcome/Splash**
- Full-screen branded background (Deep Blue gradient)
- PesaPlus logo (centered)
- Tagline: "Save, Grow, Earn" (Display Medium, White)
- Primary Button: "Get Started"
- Text Button: "Already have an account? Log in"
- Duration: Auto-advance after 2s or click to continue

**Responsive Layout:**
- Mobile: Full screen, vertically centered content
- Tablet: Full screen, slightly larger logo and text
- Desktop: Centered card (max-width: 480px) on branded background

**Screen 2: Sign Up/Login**
- Header: "Welcome to PesaPlus" (Heading 1)
- Social login buttons (Google, Facebook) with icons
- Divider: "or" (Body Small, Cool Gray)
- Email input field
- Password input field
- Primary Button: "Sign Up" or "Log In"
- Checkbox: "I agree to Terms & Privacy Policy"
- Link: "Forgot password?"

**Responsive Layout:**
- Mobile: Full screen, stacked form (16px padding)
- Tablet: Centered card (max-width: 480px), increased padding
- Desktop: Centered card (max-width: 480px), side-by-side social buttons

**Screen 3: Forgot Password**
- Back arrow (top-left)
- Lock icon 🔒 (centered, 80px)
- "Forgot Password?" heading
- Description text
- Email input field
- "Send Reset Link" button
- "Back to Login" link
- Info text about email delivery

**Responsive Layout:**
- Mobile: Full screen, vertically centered
- Tablet: Centered card (max-width: 480px)
- Desktop: Centered card (max-width: 480px)

**Screen 4: Reset Password**
- Back arrow (top-left)
- "Reset Password" heading
- Description text
- New Password field with eye icon
- Confirm Password field with eye icon
- Password requirements checklist
- "Reset Password" button

**Responsive Layout:**
- Mobile: Full screen, stacked form
- Tablet: Centered card (max-width: 480px)
- Desktop: Centered card (max-width: 480px)

**Screen 5: Password Reset Success**
- Large checkmark in circle (Emerald Green, 100px)
- Success particles: ✨🎉
- "Password Reset Successful!" heading
- Description text
- "Log In Now" button

**Responsive Layout:**
- Mobile: Full screen, vertically centered
- Tablet: Centered card (max-width: 480px)
- Desktop: Centered card (max-width: 480px)

**Screen 6: First Goal Setup**
- Header: "Set Your First Goal" (Heading 1)
- Subheader: "What are you saving for?" (Body, Cool Gray)
- Goal name input (e.g., "Emergency Fund", "Vacation")
- Target amount input (with currency symbol)
- Optional: Goal icon selector (grid of icons)
- Automation toggle: "Enable automatic savings"
- Primary Button: "Create Goal"
- Text Button: "Skip for now"

**Responsive Layout:**
- Mobile: Full screen, stacked form, 3x2 icon grid
- Tablet: Centered card (max-width: 600px), 4x2 icon grid
- Desktop: Centered card (max-width: 600px), 6x1 icon grid

#### 2. Dashboard (Home Screen)

**Layout Structure:**
```
Mobile (320px-767px):
┌─────────────────────────────┐
│ Header (Navigation Bar)     │
├─────────────────────────────┤
│ Balance Card                │
├─────────────────────────────┤
│ Quick Actions (Stacked)     │
├─────────────────────────────┤
│ Active Goals (Single column)│
├─────────────────────────────┤
│ Streaks & Achievements      │
└─────────────────────────────┘
│ Bottom Navigation (Fixed)   │
└─────────────────────────────┘

Tablet (768px-1023px):
┌─────────────────────────────┐
│ Header (Navigation Bar)     │
├─────────────────────────────┤
│ Balance Card (Centered)     │
├─────────────────────────────┤
│ Quick Actions (Side by side)│
├─────────────────────────────┤
│ Active Goals (2 columns)    │
├─────────────────────────────┤
│ Streaks & Achievements      │
└─────────────────────────────┘
│ Bottom Navigation (Fixed)   │
└─────────────────────────────┘

Desktop (1024px+):
┌──────────┬──────────────────┐
│          │ Header (Top bar) │
│ Side Nav ├──────────────────┤
│ (Fixed)  │ Balance Card     │
│          │ Quick Actions    │
│          ├──────────────────┤
│          │ Active Goals     │
│          │ (3 columns)      │
│          ├──────────────────┤
│          │ Streaks & Badges │
└──────────┴──────────────────┘
```

**Header/Navigation Bar:**

*Mobile:*
- Height: 64px
- Background: Deep Blue
- Left: Hamburger menu icon (white)
- Center-left: PesaPlus logo (white)
- Right: Notification icon (with badge), Profile avatar (40px)
- Shadow: Small

*Tablet:*
- Height: 64px
- Same as mobile or optional side navigation

*Desktop:*
- Side Navigation (Fixed left, 240px width):
  - PesaPlus logo (top)
  - Navigation items: Home, Goals, Rewards, Social, Settings
  - Active state: Background tint, left border accent
  - Hover state: Background tint
- Top Bar (Fixed top, 64px height):
  - Search bar (optional)
  - Notification icon
  - Profile avatar with dropdown

**Balance Card:**

*Mobile:*
- Full width with 16px padding
- Prominent display of total balance (Display Large, Emerald Green)
- Subtext: Interest earned this week (Body Small, Cool Gray)
- Background: White card with gradient accent
- Icon: Trending up arrow (Emerald Green)

*Tablet:*
- Centered, max-width: 600px
- Slightly larger text
- Increased padding (24px)

*Desktop:*
- Centered, max-width: 800px
- Display balance and interest side-by-side
- Additional stats (total saved, streak days)
- Increased padding (32px)

**Quick Actions:**

*Mobile:*
- Two buttons stacked vertically or side-by-side
- "Quick Save" (Primary Button, Warm Gold)
- "Add Goal" (Secondary Button)
- Full width with 16px spacing

*Tablet:*
- Two buttons side-by-side
- Centered, max-width: 600px
- 16px spacing between buttons

*Desktop:*
- Two buttons side-by-side
- Centered, max-width: 800px
- Additional quick actions (View Transactions, Invite Friends)
- 16px spacing between buttons

**Goal Cards (List):**

*Mobile:*
- Single column, stacked vertically
- Each card shows:
  - Goal name (Heading 3)
  - Progress bar (Linear, Emerald Green)
  - Current amount / Target amount (Body, Charcoal / Cool Gray)
  - Percentage complete (Body Small, Cool Gray)
- Full width with 16px horizontal padding
- 12px spacing between cards
- Click to open goal detail
- Swipe actions: Edit, Delete (mobile only)

*Tablet:*
- 2-column grid
- 16px gap between cards
- 24px horizontal padding
- Hover state: Lift effect (desktop)

*Desktop:*
- 3-column grid
- 24px gap between cards
- 32px horizontal padding
- Hover state: Lift effect, show quick actions
- Click to open goal detail

**Streaks & Achievements Section:**

*Mobile:*
- Horizontal scrollable list
- Streak counter with fire icon
- Recent badges (circular icons, 48px)
- "View All" link

*Tablet:*
- Horizontal scrollable or wrapped grid
- Larger badges (64px)
- More badges visible

*Desktop:*
- Grid layout (no scrolling needed)
- Larger badges (80px)
- All badges visible or "View All" link

#### 3. Goal Detail Screen

**Layout Structure:**
```
Mobile (320px-767px):
┌─────────────────────────────┐
│ Header (Back, Goal Name)    │
├─────────────────────────────┤
│ Progress Visualization      │
│     (Circular/Thermometer)  │
├─────────────────────────────┤
│ Interest & Rewards Card     │
├─────────────────────────────┤
│ Quick Deposit (Stacked)     │
├─────────────────────────────┤
│ Automation Settings         │
├─────────────────────────────┤
│ Transaction History         │
└─────────────────────────────┘

Tablet (768px-1023px):
┌─────────────────────────────┐
│ Header (Back, Goal Name)    │
├──────────────┬──────────────┤
│ Progress     │ Interest &   │
│ Visual       │ Rewards      │
├──────────────┴──────────────┤
│ Quick Deposit (Side by side)│
├─────────────────────────────┤
│ Automation Settings         │
├─────────────────────────────┤
│ Transaction History         │
└─────────────────────────────┘

Desktop (1024px+):
┌──────────┬──────────────────┐
│          │ Header           │
│ Side Nav ├──────┬───────────┤
│          │Prog. │ Interest  │
│          │Visual│ & Rewards │
│          ├──────┴───────────┤
│          │ Quick Deposit    │
│          ├──────────────────┤
│          │ Automation       │
│          ├──────────────────┤
│          │ Transactions     │
└──────────┴──────────────────┘
```

**Progress Visualization:**

*Mobile:*
- Large circular or thermometer progress indicator (120px)
- Animated fill on screen load
- Current amount (Display Medium, Emerald Green)
- Target amount (Body, Cool Gray)
- Percentage (Heading 2, Charcoal)
- Centered layout

*Tablet:*
- Larger progress indicator (160px)
- Left column in 2-column layout
- Increased text sizes

*Desktop:*
- Largest progress indicator (200px)
- Left column in 2-column layout
- Additional stats (days to goal, average daily savings)

**Interest & Rewards Card:**

*Mobile:*
- Full width card
- Background: Light gradient (Emerald Green tint)
- "Next Reward" label (Body Small, Cool Gray)
- Reward amount (Heading 2, Emerald Green)
- Countdown timer (Body, Charcoal)
- Icon: Gift or star (Warm Gold)

*Tablet:*
- Right column in 2-column layout
- Increased padding

*Desktop:*
- Right column in 2-column layout
- Additional reward details
- Reward history preview

**Quick Deposit Buttons:**

*Mobile:*
- Three preset amount buttons stacked or in row
- "KES 100", "KES 500", "Custom"
- Secondary button style
- Full width or equal width
- Custom amount opens input modal

*Tablet:*
- Three buttons side-by-side
- Equal width
- Centered

*Desktop:*
- Three buttons side-by-side
- Additional preset amounts (5 buttons)
- Inline custom amount input option

**Automation Settings:**

*Mobile:*
- List of toggle switches
- Icons for visual clarity
- "Round-ups: ON", "Weekly: KES 200"
- Click to configure details

*Tablet:*
- Same as mobile with increased padding
- Inline configuration options

*Desktop:*
- Expanded view with inline configuration
- No need for separate modal
- Real-time preview of automation impact

**Transaction History:**

*Mobile:*
- List of recent transactions (5 items)
- Each item: Date, amount, type (deposit/withdrawal)
- Color coding: Emerald Green (deposits), Charcoal (withdrawals)
- "View All" link at bottom

*Tablet:*
- List of recent transactions (8 items)
- Slightly larger text
- "View All" link

*Desktop:*
- Table view with columns: Date, Description, Amount, Type, Balance
- Sortable columns
- Pagination or infinite scroll
- Export option

#### 4. Rewards Screen

**Layout Structure:**
```
┌─────────────────────────────┐
│ Header (Rewards)            │
├─────────────────────────────┤
│ Tabs: [Badges] [Leaderboard]│
│       [Lottery]             │
├─────────────────────────────┤
│ Content Area                │
│ (Based on selected tab)     │
└─────────────────────────────┘
```

**Badges Tab:**
- Grid layout (2 columns)
- Each badge card:
  - Badge icon (64x64px)
  - Badge name (Body, Semibold)
  - Unlock date or "Locked" (Caption, Cool Gray)
  - Unlocked: Full color, Shadow
  - Locked: Grayscale, No shadow
- Animation on unlock: Scale up + confetti

**Leaderboard Tab:**
- List of ranked users
- Each item:
  - Rank number (Heading 3, Warm Gold for top 3)
  - Avatar (40x40px, circular)
  - Username (Body, Semibold)
  - Savings amount (Body, Emerald Green)
- Current user highlighted (Light Gray background)
- Pull to refresh

**Lottery Tab:**
- Large ticket icon or animation
- "Your Entries: X" (Display Medium, Warm Gold)
- Next draw date (Heading 3, Charcoal)
- Countdown timer (Body, Cool Gray)
- Prize information card
- "How it works" expandable section


#### 5. Social/Challenges Screen

**Layout Structure:**
```
┌─────────────────────────────┐
│ Header (Social)             │
├─────────────────────────────┤
│ Invite Friends Card         │
│ Share your referral link    │
│ [Share Button]              │
├─────────────────────────────┤
│ Active Challenges           │
│ ┌─────────────────────────┐ │
│ │ Challenge Card 1        │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ Challenge Card 2        │ │
│ └─────────────────────────┘ │
├─────────────────────────────┤
│ [Join New Challenge]        │
└─────────────────────────────┘
```

**Invite Friends Card:**
- Background: Gradient (Warm Gold tint)
- Icon: Gift or people (Warm Gold)
- Heading: "Invite Friends, Earn Rewards" (Heading 3)
- Subtext: "Get KES 100 for each friend" (Body Small)
- Primary Button: "Share Link"
- Shows referral count and total earned

**Challenge Card:**
- Challenge name (Heading 3)
- Participant avatars (overlapping circles)
- Progress bars comparing participants
- Time remaining (Body Small, Cool Gray)
- Reward amount (Body, Warm Gold)
- Tap to view details

**Challenge Detail Modal:**
- Full-screen or bottom sheet
- Challenge description
- Participant list with progress
- Your rank and progress
- "Leave Challenge" button (destructive style)

#### 6. Notifications Screen

**Layout Structure:**
```
┌─────────────────────────────┐
│ Header (Notifications)      │
│ [Mark all read]             │
├─────────────────────────────┤
│ Notification List           │
│ ┌─────────────────────────┐ │
│ │ 🎉 Badge Unlocked!      │ │
│ │ 2 hours ago             │ │
│ └─────────────────────────┘ │
│ ┌─────────────────────────┐ │
│ │ 💰 Interest Earned      │ │
│ │ 1 day ago               │ │
│ └─────────────────────────┘ │
└─────────────────────────────┘
```

**Notification Item:**
- Icon based on type (emoji or icon)
- Title (Body, Semibold)
- Message (Body Small, Cool Gray)
- Timestamp (Caption, Cool Gray)
- Unread: Light Gray background, Bold title
- Read: White background, Regular title
- Swipe to delete

**Notification Types:**
- Streak reminder: Fire icon
- Reward earned: Gift icon
- Challenge update: Trophy icon
- Low balance: Warning icon
- Goal milestone: Star icon

#### 7. Settings Screen

**Layout Structure:**
```
┌─────────────────────────────┐
│ Header (Settings)           │
├─────────────────────────────┤
│ Profile Section             │
│ [Avatar] Name               │
│ Email                       │
├─────────────────────────────┤
│ Account                     │
│ › Personal Information      │
│ › Payment Methods           │
│ › Withdrawal Options        │
├─────────────────────────────┤
│ Preferences                 │
│ › Notifications             │
│ › Language                  │
│ › Currency                  │
├─────────────────────────────┤
│ Security                    │
│ › Change Password           │
│ › Two-Factor Auth           │
│ › Biometric Login           │
├─────────────────────────────┤
│ Support                     │
│ › Help Center               │
│ › Contact Support           │
│ › Terms & Privacy           │
├─────────────────────────────┤
│ [Log Out]                   │
└─────────────────────────────┘
```

**Profile Section:**
- Avatar (80x80px, circular, editable)
- Name (Heading 2)
- Email (Body, Cool Gray)
- "Edit Profile" button

**Settings List Items:**
- Icon (24x24px, Deep Blue)
- Label (Body, Charcoal)
- Chevron right (Cool Gray)
- Tap to navigate to detail screen

**Toggle Settings:**
- Label on left
- Toggle switch on right (Emerald Green when on)

**Log Out Button:**
- Destructive style (Error color)
- Confirmation modal before logout

#### 8. KYC Verification Flow

**Layout Structure:**
```
┌─────────────────────────────┐
│ Header (Verify Identity)    │
│ [Back] [Step X of 4]        │
├─────────────────────────────┤
│ Progress Indicator          │
│ ●━━━○━━━○━━━○               │
├─────────────────────────────┤
│ Step Content Area           │
│ (Based on current step)     │
├─────────────────────────────┤
│ [Continue Button]           │
└─────────────────────────────┘
```

**KYC Introduction Screen:**
- Icon: Shield with checkmark (Deep Blue)
- Heading: "Verify Your Identity" (Heading 1)
- Subtext: "To comply with financial regulations and keep your account secure, we need to verify your identity." (Body, Cool Gray)
- Required documents list:
  - Full name and date of birth
  - National ID, Passport, or Driver's License
  - Selfie photo
- Estimated time: "Takes about 3 minutes" (Body Small, Cool Gray)
- Primary Button: "Start Verification"
- Text Button: "I'll do this later"

**Step 1: Personal Information**
- Heading: "Personal Information" (Heading 2)
- Form fields:
  - Full Name (First and Last)
  - Date of Birth (Date picker)
  - National ID Number
  - Residential Address (Street, City, Postal Code)
- Validation:
  - Age verification (18+ required)
  - ID number format validation
- Helper text: "This information must match your ID document" (Caption, Cool Gray)
- Primary Button: "Continue"

**Step 2: Document Upload**
- Heading: "Upload ID Document" (Heading 2)
- Document type selector:
  - Radio buttons: National ID, Passport, Driver's License
- Upload options:
  - "Take Photo" button (with camera icon)
  - "Choose from Gallery" button (with image icon)
- Camera capture screen:
  - Frame overlay (rounded rectangle)
  - Guidelines: "Position ID within frame"
  - Lighting tips: "Ensure good lighting, avoid glare"
  - Capture button (circular, Warm Gold)
- Preview screen:
  - Uploaded image preview
  - "Retake" button (Secondary)
  - "Use This Photo" button (Primary)
- Document requirements card:
  - Background: Light Gray
  - Icon: Info icon (Deep Blue)
  - Text: "Ensure all text is clearly visible and not blurred"

**Step 3: Selfie Verification**
- Heading: "Take a Selfie" (Heading 2)
- Subtext: "We'll use this to verify your identity" (Body, Cool Gray)
- Camera screen:
  - Face oval overlay (centered)
  - Guidelines: "Position your face within the oval"
  - Tips: "Remove glasses, look directly at camera"
  - Capture button (circular, Warm Gold)
- Preview screen:
  - Selfie preview
  - "Retake" button (Secondary)
  - "Use This Photo" button (Primary)

**Step 4: Review and Submit**
- Heading: "Review Your Information" (Heading 2)
- Review cards (each editable):
  - Personal Information card
    - Name, DOB, ID Number, Address
    - "Edit" link (Deep Blue)
  - ID Document card
    - Document type
    - Thumbnail image
    - "Change" link
  - Selfie card
    - Thumbnail image
    - "Retake" link
- Consent checkbox:
  - "I confirm that all information provided is accurate and belongs to me"
- Privacy notice:
  - "Your data is encrypted and securely stored. We'll never share your information without your consent."
  - Link: "Privacy Policy"
- Primary Button: "Submit for Verification"

**Verification Pending Screen:**
- Icon: Clock or hourglass (Warm Gold, animated)
- Heading: "Verification in Progress" (Heading 1)
- Message: "We're reviewing your documents. This usually takes 1-2 business days." (Body, Cool Gray)
- Status card:
  - Background: Light Gray
  - "Status: Pending Review" (Body, Semibold)
  - "Submitted: [Date and Time]" (Caption, Cool Gray)
- Information card:
  - "What happens next?"
  - Bullet points:
    - "We'll verify your documents"
    - "You'll receive a notification when complete"
    - "You can use limited features while we review"
- Primary Button: "Return to Dashboard"

**Verification Approved Screen:**
- Icon: Checkmark in circle (Emerald Green, animated scale-in)
- Confetti animation
- Heading: "Verification Complete!" (Heading 1, Emerald Green)
- Message: "Your identity has been verified. You now have full access to all PesaPlus features." (Body, Cool Gray)
- Features unlocked list:
  - Checkmark icons (Emerald Green)
  - "Make deposits and withdrawals"
  - "Participate in challenges"
  - "Earn maximum rewards"
- Primary Button: "Start Saving"

**Verification Rejected Screen:**
- Icon: Warning triangle (Error color)
- Heading: "Verification Unsuccessful" (Heading 1)
- Message: "We couldn't verify your identity with the information provided." (Body, Cool Gray)
- Reasons card:
  - Background: Light red tint
  - Heading: "Reasons:" (Body, Semibold)
  - Bullet list of specific issues:
    - "Document image is blurry or unclear"
    - "Information doesn't match ID document"
    - "Selfie doesn't match ID photo"
- Primary Button: "Try Again"
- Text Button: "Contact Support"

**KYC Status Banner (Dashboard):**
- Displayed when KYC is incomplete or pending
- Background: Warm Gold (light tint)
- Icon: Shield or warning icon
- Text: "Complete identity verification to unlock all features" (Body Small, Semibold)
- Action: "Verify Now" link (Deep Blue)
- Dismissible: X button (only if verification is optional)

**KYC Status in Settings:**
- Section: "Account Verification"
- Status indicator:
  - Pending: Clock icon (Warm Gold), "Verification Pending"
  - Approved: Checkmark icon (Emerald Green), "Verified"
  - Rejected: Warning icon (Error color), "Verification Failed"
  - Incomplete: Info icon (Cool Gray), "Not Verified"
- Tap to view details or resubmit

### Interaction Patterns

#### Navigation

**Bottom Navigation Bar (Primary):**
- Height: 64px
- Background: White
- Shadow: Small (top)
- 5 items: Home, Goals, Rewards, Social, Settings
- Active state: Icon and label in Deep Blue, indicator line
- Inactive state: Icon and label in Cool Gray

**Tab Navigation (Secondary):**
- Used within screens (e.g., Rewards tabs)
- Horizontal scrollable if needed
- Active tab: Underline (Deep Blue, 3px), Bold text
- Inactive tab: No underline, Regular text

**Back Navigation:**
- Back arrow in top-left of header
- Tap to return to previous screen
- Swipe from left edge (iOS gesture)

#### Gestures

**Pull to Refresh:**
- Available on list screens (Dashboard, Leaderboard, Notifications)
- Pull down from top
- Animated refresh indicator (circular spinner, Deep Blue)
- Haptic feedback on trigger

**Swipe Actions:**
- Goal cards: Swipe left for Edit/Delete
- Notifications: Swipe left for Delete
- Visual feedback: Background color reveals action icons

**Long Press:**
- Goal cards: Quick actions menu (Edit, Delete, Share)
- Badges: Show badge details tooltip

#### Modals and Overlays

**Bottom Sheet:**
- Slides up from bottom
- Rounded top corners (16px)
- Drag handle at top (centered, Cool Gray)
- Backdrop: Semi-transparent black (0.5 opacity)
- Dismissible: Tap backdrop or swipe down

**Full-Screen Modal:**
- Slides up from bottom
- Close button (X) in top-right
- Used for: Goal creation, deposit flows

**Alert Dialog:**
- Centered on screen
- White background, rounded corners (16px)
- Shadow: Large
- Title (Heading 3)
- Message (Body)
- Actions: Primary and Secondary buttons

**Toast Notification:**
- Appears at bottom of screen
- Auto-dismiss after 3 seconds
- Background: Charcoal (0.9 opacity)
- Text: White
- Icon based on type (success, error, info)


#### Animations and Transitions

**Screen Transitions:**
- Duration: 300ms
- Easing: ease-out
- Type: Slide (horizontal for navigation, vertical for modals)

**Micro-Animations:**

**Button Press:**
- Scale down to 0.95
- Duration: 100ms
- Easing: ease-in-out

**Progress Bar Fill:**
- Animate from 0 to target value
- Duration: 800ms
- Easing: ease-out
- Delay: 200ms after screen load

**Badge Unlock:**
- Scale from 0 to 1.2 to 1 (bounce effect)
- Duration: 600ms
- Confetti particles (20-30 particles)
- Haptic feedback (medium impact)

**Streak Counter:**
- Number count-up animation
- Duration: 500ms
- Fire icon pulse (scale 1 to 1.1 to 1)

**Deposit Success:**
- Checkmark icon scale in
- Progress bar animate to new value
- Confetti if milestone reached
- Toast notification slide up

**Loading States:**

**Skeleton Screens:**
- Used for: Goal cards, transaction lists, leaderboards
- Shimmer effect (left to right)
- Gray placeholder shapes matching content layout
- Duration: Until content loads

**Spinner:**
- Used for: Button loading states, full-screen loading
- Circular spinner (Deep Blue)
- Size: 24px (button), 48px (full-screen)

**Pull to Refresh:**
- Circular spinner appears on pull
- Rotates while loading
- Disappears with fade-out on complete

## Data Models

### UI State Models

**User Profile (UI):**
```typescript
interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  totalBalance: number;
  currency: string;
  streakDays: number;
  longestStreak: number;
  referralCount: number;
  joinDate: Date;
}
```

**Savings Goal (UI):**
```typescript
interface SavingsGoal {
  id: string;
  name: string;
  icon: string;
  targetAmount: number;
  currentAmount: number;
  percentComplete: number;
  nextReward: {
    amount: number;
    daysUntil: number;
  };
  automation: {
    roundUps: boolean;
    weeklyDeposit: number | null;
    monthlyDeposit: number | null;
  };
  createdAt: Date;
  targetDate: Date | null;
}
```

**Transaction (UI):**
```typescript
interface Transaction {
  id: string;
  goalId: string;
  amount: number;
  type: 'deposit' | 'withdrawal' | 'interest';
  status: 'pending' | 'completed' | 'failed';
  timestamp: Date;
  description: string;
}
```

**Badge (UI):**
```typescript
interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'savings' | 'social' | 'special';
  unlocked: boolean;
  unlockedAt: Date | null;
  progress: number; // 0-100 for locked badges
}
```

**Challenge (UI):**
```typescript
interface Challenge {
  id: string;
  name: string;
  description: string;
  type: 'individual' | 'team';
  participants: Participant[];
  goalAmount: number;
  startDate: Date;
  endDate: Date;
  reward: {
    type: 'cash' | 'bonus_interest' | 'badge';
    value: number;
  };
  userProgress: number;
  userRank: number;
}

interface Participant {
  userId: string;
  name: string;
  avatar: string | null;
  progress: number;
  rank: number;
}
```

**Notification (UI):**
```typescript
interface Notification {
  id: string;
  type: 'streak' | 'reward' | 'challenge' | 'goal' | 'system';
  title: string;
  message: string;
  icon: string;
  read: boolean;
  timestamp: Date;
  actionUrl: string | null; // Deep link to relevant screen
}
```

**Leaderboard Entry (UI):**
```typescript
interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  avatar: string | null;
  savingsAmount: number;
  isCurrentUser: boolean;
}
```

**KYC Verification (UI):**
```typescript
interface KYCVerification {
  id: string;
  userId: string;
  status: 'incomplete' | 'pending' | 'approved' | 'rejected';
  personalInfo: {
    fullName: string;
    dateOfBirth: Date;
    nationalIdNumber: string;
    address: {
      street: string;
      city: string;
      postalCode: string;
      country: string;
    };
  };
  documents: {
    idDocument: {
      type: 'national_id' | 'passport' | 'drivers_license';
      imageUrl: string;
      uploadedAt: Date;
    };
    selfie: {
      imageUrl: string;
      uploadedAt: Date;
    };
  };
  submittedAt: Date | null;
  reviewedAt: Date | null;
  rejectionReasons: string[] | null;
  currentStep: number; // 1-4 for incomplete verifications
}
```

**KYC Status Display (UI):**
```typescript
interface KYCStatusDisplay {
  status: 'incomplete' | 'pending' | 'approved' | 'rejected';
  statusText: string;
  statusColor: string; // Hex color based on status
  icon: string; // Icon name based on status
  canResubmit: boolean;
  showBanner: boolean;
  restrictedFeatures: string[];
}
```

### Form Validation Models

**Goal Creation Form:**
```typescript
interface GoalFormData {
  name: string; // Required, 3-50 characters
  targetAmount: number; // Required, > 0
  icon: string; // Optional
  targetDate: Date | null; // Optional
  enableRoundUps: boolean;
  weeklyDeposit: number | null; // Optional, > 0 if set
}

interface GoalFormErrors {
  name?: string;
  targetAmount?: string;
  weeklyDeposit?: string;
}
```

**Deposit Form:**
```typescript
interface DepositFormData {
  amount: number; // Required, > 0, <= available balance
  goalId: string; // Required
  paymentMethod: string; // Required
}
```

**KYC Personal Information Form:**
```typescript
interface KYCPersonalInfoForm {
  firstName: string; // Required, 2-50 characters
  lastName: string; // Required, 2-50 characters
  dateOfBirth: Date; // Required, user must be 18+
  nationalIdNumber: string; // Required, format validation based on country
  street: string; // Required
  city: string; // Required
  postalCode: string; // Required
  country: string; // Required
}

interface KYCPersonalInfoErrors {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  nationalIdNumber?: string;
  street?: string;
  city?: string;
  postalCode?: string;
}
```

**KYC Document Upload Form:**
```typescript
interface KYCDocumentForm {
  documentType: 'national_id' | 'passport' | 'drivers_license'; // Required
  documentImage: File | Blob; // Required, max 5MB, jpg/png
  selfieImage: File | Blob; // Required, max 5MB, jpg/png
}

interface KYCDocumentErrors {
  documentType?: string;
  documentImage?: string;
  selfieImage?: string;
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

For the PesaPlus UI/UX, correctness properties focus on ensuring consistent visual design, proper component rendering, accessibility compliance, and reliable user interactions across all screens and states.

### Visual Design Consistency Properties

**Property 1: Color palette consistency**
*For any* UI element designated as a primary brand element (header, navigation, key brand component), the computed color value should be Deep Blue (#0F2A44) or its specified variants.
**Validates: Requirements 2.1**

**Property 2: Success state color consistency**
*For any* UI element displaying balance, interest earned, or success state, the computed color value should be Emerald Green (#1FA774) or its specified variants.
**Validates: Requirements 2.2**

**Property 3: CTA color consistency**
*For any* call-to-action button, reward display, or referral element, the computed color value should be Warm Gold (#F4B400) or its specified variants.
**Validates: Requirements 2.3**

**Property 4: Text contrast accessibility**
*For any* text element using Charcoal (#2E2E2E) as primary text color, the contrast ratio against its background should be at least 4.5:1.
**Validates: Requirements 2.4**

**Property 5: Spacing grid consistency**
*For any* spacing value (margin, padding, gap) in the UI, the value should be a multiple of 8 pixels.
**Validates: Requirements 2.7**

**Property 6: Border radius consistency**
*For any* card component, the border-radius should be 8px, and for any button component, the border-radius should be 24px.
**Validates: Requirements 2.8**

### Component Rendering Properties

**Property 7: Goal display completeness**
*For any* active savings goal displayed on the dashboard, the rendered component should include a progress indicator showing percentage completion.
**Validates: Requirements 3.3, 3.4**

**Property 8: Conditional streak display**
*For any* user with active streaks (streak days > 0), the dashboard should render a streak counter with a fire or calendar icon.
**Validates: Requirements 3.5**

**Property 9: Conditional badge display**
*For any* user with earned badges, the dashboard should display the most recent badges.
**Validates: Requirements 3.6**

**Property 10: Card shadow consistency**
*For any* card-based layout element on the dashboard, the computed box-shadow property should be non-zero (indicating depth).
**Validates: Requirements 3.8**

**Property 11: Goal detail data completeness**
*For any* goal detail screen, the rendered content should include goal name, target amount, and current balance.
**Validates: Requirements 4.1**

**Property 12: Reward information display**
*For any* goal with available reward data, the goal detail screen should display estimated interest or reward countdown information.
**Validates: Requirements 4.3**

**Property 13: Interest color highlighting**
*For any* interest or earnings display element, the computed color should be Emerald Green (#1FA774).
**Validates: Requirements 4.4, 5.6**

**Property 14: Milestone animation triggering**
*For any* milestone achievement event, the application should trigger celebratory animations (confetti or badge unlock animation).
**Validates: Requirements 4.7**

### Gamification and Social Properties

**Property 15: Badge display completeness**
*For any* earned badge in the rewards screen, the rendered component should include the badge icon, name, and unlock date.
**Validates: Requirements 5.1**

**Property 16: Unlocked badge styling**
*For any* unlocked badge, the rendered component should include Warm Gold (#F4B400) accent colors.
**Validates: Requirements 5.2**

**Property 17: Leaderboard entry completeness**
*For any* leaderboard entry, the rendered component should include rank, user avatar, and savings amount.
**Validates: Requirements 5.3**

**Property 18: Current user highlighting**
*For any* leaderboard display where the current user appears, that user's entry should have distinct highlighting (different background color or border).
**Validates: Requirements 5.4**

**Property 19: Lottery information display**
*For any* user with lottery entries (entry count > 0), the lottery tab should display the number of entries and next draw date.
**Validates: Requirements 5.5**

**Property 20: Achievement unlock modal**
*For any* new achievement unlock event, the application should display a modal with animation and congratulatory message.
**Validates: Requirements 5.7**

**Property 21: Challenge participant display**
*For any* active challenge on the social screen, the rendered component should include participant count information.
**Validates: Requirements 6.1**

**Property 22: Challenge progress visualization**
*For any* challenge display, the rendered component should include progress bars for comparing performance.
**Validates: Requirements 6.2**

**Property 23: Referral reward highlighting**
*For any* referral reward display element, the computed color should be Warm Gold (#F4B400).
**Validates: Requirements 6.4**

**Property 24: Challenge detail completeness**
*For any* challenge detail view, the rendered content should include start date, end date, and reward information.
**Validates: Requirements 6.5**

**Property 25: Progress comparison visualization**
*For any* challenge with multiple participants, the display should include visual charts showing relative performance.
**Validates: Requirements 6.6**

### Notification Properties

**Property 26: Streak risk notification**
*For any* user whose streak is at risk (no deposit in current period), a push notification reminder should be triggered.
**Validates: Requirements 7.1**

**Property 27: Reward notification**
*For any* reward or bonus earned event, an immediate notification should be sent including the reward amount.
**Validates: Requirements 7.2**

**Property 28: Challenge deadline notification**
*For any* challenge with approaching deadline (within notification threshold), reminder notifications should be sent to all participants.
**Validates: Requirements 7.3**

**Property 29: Low balance notification**
*For any* scheduled deposit where user balance is insufficient, an alert notification should be triggered.
**Validates: Requirements 7.4**

**Property 30: Unread notification badge**
*For any* unread notifications (read status = false), a badge count should be displayed on the notification icon.
**Validates: Requirements 7.6**

**Property 31: Notification navigation**
*For any* notification tap event, the application should navigate to the relevant screen based on notification type.
**Validates: Requirements 7.7**

### Settings and Account Properties

**Property 32: Payment method masking**
*For any* linked payment method (bank account or card), the displayed number should be masked (showing only last 4 digits).
**Validates: Requirements 8.2**

**Property 33: Preference update confirmation**
*For any* user preference update operation, a confirmation feedback message should be displayed upon successful save.
**Validates: Requirements 8.5**

**Property 34: Security section color**
*For any* security-related UI element in settings, the computed color should be Deep Blue (#0F2A44).
**Validates: Requirements 8.6**

### Animation and Interaction Properties

**Property 35: Deposit animation**
*For any* completed deposit action, an animated progress bar fill should be triggered.
**Validates: Requirements 9.1**

**Property 36: Streak milestone animation**
*For any* streak milestone achievement, confetti or celebration animations should be triggered.
**Validates: Requirements 9.2**

**Property 37: Badge unlock animation**
*For any* badge unlock event, a modal with bouncing badge animation should be displayed.
**Validates: Requirements 9.3**

**Property 38: Button haptic feedback**
*For any* button tap event on supported devices, haptic feedback should be triggered.
**Validates: Requirements 9.4**

**Property 39: Loading state display**
*For any* data loading operation, skeleton screens or shimmer effects should be displayed instead of blank screens.
**Validates: Requirements 9.5**

**Property 40: Screen transition animations**
*For any* navigation between screens, smooth slide or fade animations should be applied.
**Validates: Requirements 9.6**

**Property 41: Pull-to-refresh indicator**
*For any* pull-to-refresh gesture on supported screens, an animated refresh indicator should be displayed.
**Validates: Requirements 9.7**

### Transparency and Trust Properties

**Property 42: Balance currency display**
*For any* balance display, the rendered text should include both the amount and currency symbol.
**Validates: Requirements 10.1**

**Property 43: Interest calculation breakdown**
*For any* interest earned display, the breakdown should include base rate, streak bonus, and referral bonus components.
**Validates: Requirements 10.2**

**Property 44: Transaction timestamp display**
*For any* transaction in the transaction history, the rendered component should include a timestamp.
**Validates: Requirements 10.3**

**Property 45: Transaction color coding**
*For any* transaction display, deposits should use Emerald Green (#1FA774) and withdrawals should use Charcoal (#2E2E2E).
**Validates: Requirements 10.4**

### Accessibility Properties

**Property 46: Screen reader labels**
*For any* interactive element (button, link, input), proper semantic labels or ARIA attributes should be present for screen reader support.
**Validates: Requirements 11.1**

**Property 47: Touch target sizing**
*For any* interactive element (button, link, tap target), the minimum dimensions should be 44x44 points.
**Validates: Requirements 11.2**

**Property 48: WCAG contrast compliance**
*For any* text element and its background, the color contrast ratio should meet WCAG AA standards (4.5:1 for normal text, 3:1 for large text).
**Validates: Requirements 11.3**

**Property 49: Large text scaling**
*For any* text element when large text mode is enabled, the font size should scale appropriately without breaking the layout.
**Validates: Requirements 11.4**

**Property 50: Reduced motion support**
*For any* animation when reduced motion preference is enabled, the animation should be minimized or disabled.
**Validates: Requirements 11.5**

**Property 51: Orientation support**
*For any* screen, the layout should render correctly in both portrait and landscape orientations.
**Validates: Requirements 11.6**

**Property 52: Image alternative text**
*For any* image or icon element, alternative text (alt attribute or aria-label) should be provided.
**Validates: Requirements 11.7**

### Performance Properties

**Property 53: Loading indicator timing**
*For any* screen loading operation, skeleton screens or loading indicators should appear within 100ms of loading start.
**Validates: Requirements 12.1**

**Property 54: Progress indicator for long operations**
*For any* data fetch operation exceeding 1 second, a progress indicator should be displayed.
**Validates: Requirements 12.2**

**Property 55: Image loading transitions**
*For any* image loading operation, a placeholder should be displayed with a smooth fade-in transition when the image loads.
**Validates: Requirements 12.3**

**Property 56: Immediate interaction feedback**
*For any* user action (button press, tap), immediate visual feedback (state change) should be provided.
**Validates: Requirements 12.4**

**Property 57: Error handling with retry**
*For any* failed network request, an error message with a retry option should be displayed.
**Validates: Requirements 12.5**

**Property 58: Offline mode indication**
*For any* offline state, cached data should be displayed with a clear offline status indicator.
**Validates: Requirements 12.6**

**Property 59: Online sync notification**
*For any* transition from offline to online state, data should sync automatically and the user should be notified.
**Validates: Requirements 12.7**

### KYC Verification Properties

**Property 60: KYC prompt after registration**
*For any* user who completes initial registration without KYC verification, the application should prompt the user to begin KYC verification.
**Validates: Requirements 13.1**

**Property 61: KYC process explanation display**
*For any* user starting KYC verification, the application should display a clear explanation of required documents and the verification process.
**Validates: Requirements 13.2**

**Property 62: Personal information completeness**
*For any* KYC personal information form submission, all required fields (full name, date of birth, national ID number, residential address) must be present.
**Validates: Requirements 13.3**

**Property 63: Age validation**
*For any* date of birth entered in KYC verification, the calculated age should be at least 18 years.
**Validates: Requirements 13.4**

**Property 64: Document type acceptance**
*For any* identity document upload, the document type should be one of: national ID, passport, or driver's license.
**Validates: Requirements 13.5**

**Property 65: Camera guidelines display**
*For any* document photo capture screen, camera guidelines (frame overlay, lighting tips) should be displayed.
**Validates: Requirements 13.6**

**Property 66: Selfie guidance display**
*For any* selfie capture screen, the application should display guidance for taking a clear face photo.
**Validates: Requirements 13.7**

**Property 67: Verification status display**
*For any* submitted KYC verification, the status (pending, approved, rejected) should be displayed to the user.
**Validates: Requirements 13.8**

**Property 68: Feature restriction during pending verification**
*For any* user with pending KYC verification, deposit and withdrawal features should be restricted while view-only features remain accessible.
**Validates: Requirements 13.9**

**Property 69: Feature unlock on approval**
*For any* KYC verification approval event, all features should be unlocked and a congratulatory notification should be sent.
**Validates: Requirements 13.10**

**Property 70: Rejection reason display**
*For any* rejected KYC verification, specific rejection reasons should be displayed with an option to resubmit.
**Validates: Requirements 13.11**

**Property 71: Verification progress indicators**
*For any* KYC status display, visual indicators (pending icon, checkmark, warning icon) should clearly show the verification progress.
**Validates: Requirements 13.12**

**Property 72: Incomplete KYC banner display**
*For any* user with incomplete KYC status, a prominent banner should be displayed on the dashboard prompting completion.
**Validates: Requirements 13.13**

**Property 73: KYC data encryption**
*For any* KYC data storage operation, all sensitive personal information and document images should be encrypted.
**Validates: Requirements 13.14**

**Property 74: Sensitive data masking**
*For any* KYC information display, sensitive data (e.g., ID number) should be masked showing only partial information.
**Validates: Requirements 13.15**


## Error Handling

### UI Error States

**Network Errors:**
- Display: Toast notification or inline error message
- Message: "Unable to connect. Please check your internet connection."
- Action: Retry button
- Fallback: Show cached data if available with offline indicator

**Validation Errors:**
- Display: Inline error message below input field
- Color: Error red (#E53935)
- Icon: Warning icon
- Examples:
  - "Goal name must be between 3-50 characters"
  - "Target amount must be greater than 0"
  - "Please enter a valid email address"

**Authentication Errors:**
- Display: Alert dialog or inline message
- Messages:
  - "Invalid email or password"
  - "Session expired. Please log in again."
  - "Account locked. Contact support."
- Action: Retry login or contact support link

**Payment Errors:**
- Display: Alert dialog with detailed message
- Messages:
  - "Payment method declined. Please try another method."
  - "Insufficient funds for this deposit."
  - "Payment processing failed. Please try again."
- Action: Retry or change payment method

**Data Loading Errors:**
- Display: Empty state with illustration and message
- Message: "Unable to load data. Please try again."
- Action: Retry button
- Fallback: Show last cached data if available

**KYC Verification Errors:**
- Display: Inline error message or alert dialog
- Messages:
  - "Age verification failed. You must be 18 or older to use PesaPlus."
  - "Invalid ID number format. Please check and try again."
  - "Document image is too large. Maximum size is 5MB."
  - "Image quality is too low. Please retake with better lighting."
  - "Unable to process document. Please ensure all text is clearly visible."
- Action: Retry or correct information
- Validation: Real-time validation for form fields

**Document Upload Errors:**
- Display: Toast notification or inline message
- Messages:
  - "Upload failed. Please check your internet connection."
  - "File format not supported. Please use JPG or PNG."
  - "Image is blurry. Please retake for better quality."
- Action: Retry upload or retake photo
- Progress indicator during upload

### Error Recovery Patterns

**Automatic Retry:**
- For transient network errors
- Exponential backoff: 1s, 2s, 4s
- Maximum 3 retry attempts
- Show retry count to user

**Manual Retry:**
- For persistent errors
- Prominent retry button
- Clear error explanation
- Option to contact support

**Graceful Degradation:**
- Show cached data when fresh data unavailable
- Disable features requiring network when offline
- Clear indication of degraded functionality

**Error Logging:**
- Log all errors to analytics service
- Include: Error type, timestamp, user context, stack trace
- Privacy: Exclude sensitive user data

### Empty States

**No Goals:**
- Illustration: Empty piggy bank or safe
- Message: "Start your savings journey"
- Subtext: "Create your first goal to begin earning rewards"
- Action: "Create Goal" button (Primary)

**No Badges:**
- Illustration: Trophy or medal outline
- Message: "No badges yet"
- Subtext: "Keep saving to unlock achievements"
- Action: "View Available Badges" link

**No Transactions:**
- Illustration: Empty list or document
- Message: "No transactions yet"
- Subtext: "Your deposits and withdrawals will appear here"

**No Challenges:**
- Illustration: People or team icon
- Message: "No active challenges"
- Subtext: "Join a challenge to compete with friends"
- Action: "Browse Challenges" button

**No Notifications:**
- Illustration: Bell with checkmark
- Message: "You're all caught up"
- Subtext: "No new notifications"

**KYC Not Started:**
- Illustration: Shield with document icon
- Message: "Identity verification required"
- Subtext: "Complete verification to unlock all features and start saving"
- Action: "Start Verification" button (Primary)

**KYC Pending:**
- Illustration: Clock or hourglass
- Message: "Verification in progress"
- Subtext: "We're reviewing your documents. This usually takes 1-2 business days."
- No action button (status screen accessible from settings)

## Testing Strategy

### Testing Approach

The PesaPlus UI/UX will be tested using a dual approach combining unit tests for specific examples and property-based tests for universal properties. This ensures comprehensive coverage while maintaining test efficiency.

**Unit Tests:**
- Focus on specific examples and edge cases
- Test individual component rendering
- Verify specific user flows (onboarding, goal creation)
- Test error conditions and boundary cases
- Integration points between components

**Property-Based Tests:**
- Verify universal properties across all inputs
- Test design system consistency (colors, spacing, typography)
- Validate accessibility requirements across all components
- Ensure animation and interaction patterns work for all states
- Comprehensive input coverage through randomization

### Testing Framework

**Framework Selection:**
- **React Native**: Jest + React Native Testing Library + fast-check
- **Flutter**: Flutter Test + Dart test + faker
- **Web**: Jest + React Testing Library + fast-check

**Property-Based Testing Library:**
- JavaScript/TypeScript: fast-check
- Dart: test package with custom generators
- Minimum 100 iterations per property test

### Test Organization

**Component Tests:**
```
src/
├── components/
│   ├── Button/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx (unit tests)
│   │   └── Button.properties.test.tsx (property tests)
│   ├── Card/
│   │   ├── Card.tsx
│   │   ├── Card.test.tsx
│   │   └── Card.properties.test.tsx
│   └── ProgressBar/
│       ├── ProgressBar.tsx
│       ├── ProgressBar.test.tsx
│       └── ProgressBar.properties.test.tsx
```

**Screen Tests:**
```
src/
├── screens/
│   ├── Dashboard/
│   │   ├── Dashboard.tsx
│   │   ├── Dashboard.test.tsx (unit tests)
│   │   └── Dashboard.properties.test.tsx (property tests)
│   ├── GoalDetail/
│   │   ├── GoalDetail.tsx
│   │   ├── GoalDetail.test.tsx
│   │   └── GoalDetail.properties.test.tsx
```

### Property Test Examples

**Property Test 1: Color Palette Consistency**
```typescript
// Feature: pesaplus-ui-ux, Property 1: Color palette consistency
describe('Property 1: Color palette consistency', () => {
  it('should use Deep Blue for all primary brand elements', () => {
    fc.assert(
      fc.property(
        fc.constantFrom('header', 'navigation', 'primaryButton'),
        (elementType) => {
          const element = renderBrandElement(elementType);
          const color = getComputedColor(element);
          expect(color).toBe('#0F2A44');
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property Test 2: Touch Target Sizing**
```typescript
// Feature: pesaplus-ui-ux, Property 47: Touch target sizing
describe('Property 47: Touch target sizing', () => {
  it('should maintain minimum 44x44 points for all interactive elements', () => {
    fc.assert(
      fc.property(
        fc.record({
          type: fc.constantFrom('button', 'link', 'input', 'checkbox'),
          label: fc.string(),
          disabled: fc.boolean()
        }),
        (props) => {
          const element = renderInteractiveElement(props);
          const dimensions = getElementDimensions(element);
          expect(dimensions.width).toBeGreaterThanOrEqual(44);
          expect(dimensions.height).toBeGreaterThanOrEqual(44);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

**Property Test 3: Spacing Grid Consistency**
```typescript
// Feature: pesaplus-ui-ux, Property 5: Spacing grid consistency
describe('Property 5: Spacing grid consistency', () => {
  it('should use multiples of 8 for all spacing values', () => {
    fc.assert(
      fc.property(
        fc.record({
          component: fc.constantFrom('card', 'button', 'input', 'container'),
          spacingType: fc.constantFrom('margin', 'padding', 'gap')
        }),
        (props) => {
          const element = renderComponent(props.component);
          const spacingValue = getSpacingValue(element, props.spacingType);
          expect(spacingValue % 8).toBe(0);
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Examples

**Unit Test: Onboarding Flow**
```typescript
describe('Onboarding Flow', () => {
  it('should display maximum 3 screens for first-time users', () => {
    const { getAllByTestId } = render(<OnboardingFlow />);
    const screens = getAllByTestId('onboarding-screen');
    expect(screens.length).toBeLessThanOrEqual(3);
  });

  it('should show dashboard after onboarding completion', async () => {
    const { getByText, getByTestId } = render(<OnboardingFlow />);
    
    // Complete onboarding steps
    fireEvent.press(getByText('Get Started'));
    fireEvent.changeText(getByTestId('email-input'), 'test@example.com');
    fireEvent.press(getByText('Sign Up'));
    fireEvent.changeText(getByTestId('goal-name'), 'Emergency Fund');
    fireEvent.press(getByText('Create Goal'));
    
    // Verify dashboard is shown
    await waitFor(() => {
      expect(getByTestId('dashboard')).toBeTruthy();
    });
  });
});
```

**Unit Test: Goal Card Rendering**
```typescript
describe('Goal Card', () => {
  it('should display goal name, progress, and amounts', () => {
    const goal = {
      name: 'Vacation Fund',
      targetAmount: 10000,
      currentAmount: 5000,
      percentComplete: 50
    };
    
    const { getByText } = render(<GoalCard goal={goal} />);
    
    expect(getByText('Vacation Fund')).toBeTruthy();
    expect(getByText('KES 5,000 / KES 10,000')).toBeTruthy();
    expect(getByText('50%')).toBeTruthy();
  });
});
```

### Accessibility Testing

**Automated Accessibility Tests:**
- Use @testing-library/jest-native for React Native
- Use axe-core for web applications
- Test all screens for WCAG AA compliance
- Verify screen reader compatibility

**Manual Accessibility Testing:**
- Test with actual screen readers (TalkBack, VoiceOver)
- Verify keyboard navigation
- Test with large text enabled
- Test with reduced motion enabled
- Verify color contrast in different lighting conditions

### Visual Regression Testing

**Tools:**
- Storybook for component documentation
- Chromatic or Percy for visual regression
- Snapshot tests for component structure

**Coverage:**
- All component variants and states
- All screen layouts
- Dark mode (if implemented)
- Different screen sizes and orientations

### Performance Testing

**Metrics to Monitor:**
- Time to interactive (TTI)
- First contentful paint (FCP)
- Animation frame rate (target: 60fps)
- Memory usage
- Bundle size

**Tools:**
- React Native Performance Monitor
- Flipper for debugging
- Lighthouse for web performance

### Test Coverage Goals

**Minimum Coverage:**
- Unit test coverage: 80% of components and screens
- Property test coverage: All design system properties
- Accessibility test coverage: 100% of interactive elements
- Visual regression: All component variants

**Priority Testing:**
1. Critical user flows (onboarding, deposits, withdrawals)
2. Design system consistency (colors, spacing, typography)
3. Accessibility compliance
4. Error handling and edge cases
5. Animation and interaction patterns

### Continuous Integration

**CI Pipeline:**
1. Run unit tests on every commit
2. Run property tests on every pull request
3. Run visual regression tests on UI changes
4. Run accessibility tests before merge
5. Generate coverage reports
6. Block merge if tests fail or coverage drops

**Test Execution Time:**
- Unit tests: < 2 minutes
- Property tests: < 5 minutes
- Full test suite: < 10 minutes

