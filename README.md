<div align="center">

# 🌊 Omniflow

**A Comprehensive All-in-One Tool Suite for Developers and Power Users**

[![Vue 3](https://img.shields.io/badge/Vue-3.5.13-4FC08D?logo=vue.js&logoColor=white)](https://vuejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.3-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.3.5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.7-06B6D4?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[Features](#-features) • [Installation](#-installation) • [Development](#-development) • [Contributing](#-contributing) • [Tool Categories](#-tool-categories)

</div>

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [Features](#-features)
- [Tool Categories](#-tool-categories)
- [Installation](#-installation)
- [Development](#-development)
- [Project Structure](#-project-structure)
- [Adding a New Tool](#-adding-a-new-tool)
- [Tech Stack](#-tech-stack)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Contributing](#-contributing)
- [License](#-license)

## 🎯 About the Project

Omniflow is a modern, browser-based tool suite that provides developers and power users with an extensive collection of useful utilities. From calculators to text tools, cryptography to image processing – everything in one place, fast, offline-capable, and privacy-friendly.

The application runs entirely in the browser, with all calculations and processing performed client-side. No data is sent to external servers.

## ✨ Features

- 🎨 **Modern UI/UX** – Elegantly designed with Tailwind CSS and shadcn-vue components
- 🌓 **Dark/Light Mode** – Automatic theme switching with persistent storage
- ⭐ **Favorites System** – Mark your most frequently used tools for quick access
- ⌨️ **Keyboard Shortcuts** – Fully customizable key combinations for power users
- 🔍 **Intelligent Search** – Find tools quickly via the integrated search function
- 📱 **Responsive Design** – Optimized for desktop, tablet, and mobile
- 🚀 **Blazing Fast** – Thanks to Vite and optimized performance
- 🔒 **Privacy-First** – All processing happens locally in your browser
- 🎭 **Animated Transitions** – Smooth navigation with anime.js
- 📊 **Categorization** – Tools are clearly organized in categories
- 🔄 **Sorting Options** – Sort tools by name or favorites

## 🛠️ Tool Categories

#### 🧮 Calculators

#### 🔐 Cryptography

#### 📝 Text Tools

#### 🖼️ Image Tools

#### 👨‍💻 Developer Tools

#### 🎲 Other Tools

## 📥 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Bun](https://bun.sh/) (recommended) or npm/yarn/pnpm

### Setup

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd Omniflow
   ```

2. **Install dependencies**

   ```bash
   bun install
   # or
   npm install
   ```

3. **Start development server**

   ```bash
   bun run dev
   # or
   npm run dev
   ```

4. **Open browser**
   ```
   http://localhost:5173
   ```

### ⚠️ Security Notice

**Important:** When starting the project, your antivirus software may flag the `ReverseShellGenerator.vue` file as potentially dangerous. This is a false positive – the file is a legitimate educational tool for generating reverse shell commands and poses no threat to your system. The tool runs entirely in your browser and does not execute any malicious code.

If your antivirus software quarantines or blocks the file, you may need to add an exception for this project directory.

## 🚀 Development

### Available Scripts

```bash
# Start development server
bun run dev

# Create production build
bun run build

# Test production build locally
bun run preview

# Run linting
bun run lint
```

## 📁 Project Structure

```
Omniflow/
├── public/                    # Static assets
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── assets/               # Images, fonts, etc.
│   ├── components/           # Vue components
│   │   ├── layout/          # Layout components (Sidebar, TopBar, etc.)
│   │   └── ui/              # shadcn-vue UI components
│   ├── data/                # Data definitions
│   │   └── tools/          # Tool categories and card definitions
│   │       ├── _index.ts       # Export all categories
│   │       ├── calculators.ts  # Calculator tools
│   │       ├── cryptography.ts # Crypto tools
│   │       ├── textTools.ts    # Text tools
│   │       └── ...
│   ├── enums/               # TypeScript enums
│   ├── lib/                 # Utility functions
│   ├── router/              # Vue Router configuration
│   │   ├── _index.ts       # Main router
│   │   ├── calculators.ts  # Calculator routes
│   │   ├── text.ts         # Text tool routes
│   │   └── ...
│   ├── services/            # Services (Keyboard, Currency, etc.)
│   ├── types/               # TypeScript types
│   ├── views/               # Vue views/pages
│   │   ├── Dashboard.vue
│   │   ├── Calculators/
│   │   ├── Cryptography/
│   │   ├── Text/
│   │   └── ...
│   ├── App.vue              # Root component
│   ├── main.ts              # App entry point
│   └── style.css            # Global styles
├── components.json          # shadcn-vue configuration
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## 🔧 Adding a New Tool

To add a new tool to Omniflow, follow these steps:

### 1. Create Vue Component

Create a new `.vue` file in the appropriate folder under `src/views/`:

```bash
src/views/[Category]/[ToolName].vue
```

**Example:** `src/views/Text/MyNewTool.vue`

```vue
<script setup lang="ts">
import { ref } from 'vue'

// Your tool logic here
const input = ref('')
</script>

<template>
  <div class="container mx-auto p-6">
    <h1 class="mb-4 text-2xl font-bold">My New Tool</h1>
    <!-- Your tool content -->
  </div>
</template>
```

### 2. Add Route

Add the route to the corresponding router file (`src/router/[category].ts`):

```typescript
// src/router/text.ts
import MyNewTool from '@/views/Text/MyNewTool.vue'

export const textRoutes: RouteRecordRaw[] = [
  // ... existing routes
  {
    path: '/text/myNewTool',
    name: 'MyNewTool',
    component: MyNewTool,
    meta: { isFavoritable: true }, // Optional: Mark tool as favoritable
  },
]
```

### 3. Add Dashboard Card

Add the tool information to the category file (`src/data/tools/[category].ts`):

```typescript
// src/data/tools/textTools.ts
export const textToolsCategory: Category = {
  title: 'Text Tools',
  hoverColor: '#10B981',
  waveDesign: {
    waveColors: ['rgba(0,255,0,0.3)', 'rgba(0,255,0,0.15)', 'rgba(0,255,0,0.05)'],
    waveHeights: [15, 15, 15],
    waveAmplitudes: [-10, -20, -0],
  },
  cards: [
    // ... existing cards
    {
      title: 'My New Tool',
      icon: 'mdi:tool', // Icon from Iconify (https://icon-sets.iconify.design/)
      description: 'A brief description of your tool.',
      path: '/text/myNewTool',
      isActive: true,
    },
  ],
}
```

### 4. Create New Category (Optional)

If you want to create a completely new category:

1. Create `src/data/tools/myCategory.ts`
2. Create `src/router/myCategory.ts`
3. Create folder `src/views/MyCategory/`
4. Import and export in `src/data/tools/_index.ts`
5. Import and add routes in `src/router/_index.ts`

### Example for a New Category:

```typescript
// src/data/tools/myCategory.ts
import type { Category } from '@/types/Category'

export const myCategoryCategory: Category = {
  title: 'My Category',
  hoverColor: '#FF6B6B',
  waveDesign: {
    waveColors: ['rgba(255,107,107,0.3)', 'rgba(255,107,107,0.15)', 'rgba(255,107,107,0.05)'],
    waveHeights: [20, 15, 10],
    waveAmplitudes: [8, 5, 3],
  },
  cards: [
    // Your tools here
  ],
}
```

Then in `src/data/tools/_index.ts`:

```typescript
import { myCategoryCategory } from './myCategory'

export function getCategories(): Category[] {
  return [
    // ... other categories
    myCategoryCategory,
  ]
}
```

## 🧰 Tech Stack

### Core

- **[Vue 3](https://vuejs.org/)** – Progressive JavaScript Framework
- **[TypeScript](https://www.typescriptlang.org/)** – Type-Safe JavaScript
- **[Vite](https://vitejs.dev/)** – Next Generation Frontend Tooling

### UI & Styling

- **[Tailwind CSS](https://tailwindcss.com/)** – Utility-First CSS Framework
- **[shadcn-vue](https://www.shadcn-vue.com/)** – Re-usable UI Components
- **[Radix Vue](https://www.radix-vue.com/)** – Unstyled, accessible components
- **[Lucide Vue](https://lucide.dev/)** – Beautiful & consistent icons
- **[Iconify](https://iconify.design/)** – Comprehensive icon library

### Development Tools

- **[ESLint](https://eslint.org/)** – Code Linting
- **[Prettier](https://prettier.io/)** – Code Formatting
- **[TypeScript ESLint](https://typescript-eslint.io/)** – TypeScript Linting

## ⌨️ Keyboard Shortcuts

Omniflow supports fully customizable keyboard shortcuts. The default shortcuts are:

| Action          | Shortcut   | Description                     |
| --------------- | ---------- | ------------------------------- |
| **Open Search** | `Ctrl + K` | Opens the global search         |
| **Dark Mode**   | `Ctrl + D` | Toggles between Dark/Light Mode |
| **Settings**    | `Ctrl + ,` | Opens settings                  |
| **Dashboard**   | `Ctrl + H` | Navigates to dashboard          |

All shortcuts can be customized individually in the **Settings**.

## 🤝 Contributing

Contributions are warmly welcomed! Whether bug fixes, new features, or new tools – all help is appreciated.

### Contribution Guidelines

1. **Fork** the repository
2. **Clone** your fork: `git clone <fork-url>`
3. Create a **Feature Branch**: `git checkout -b feature/AmazingTool`
4. **Commit** your changes: `git commit -m 'Add: Amazing new tool'`
5. **Push** to the branch: `git push origin feature/AmazingTool`
6. Open a **Pull Request**

### Code Style

- Use **TypeScript** for type-safe code
- Follow **Vue 3 Composition API** best practices
- Use **ESLint** and **Prettier** for consistent formatting
- Write **meaningful commit messages**
- Document complex functions with **comments**

### Pull Request Checklist

- [ ] Code runs without errors (`bun run dev`)
- [ ] Build is successful (`bun run build`)
- [ ] ESLint shows no errors (`bun run lint`)
- [ ] Tool is registered in the appropriate category
- [ ] Route is correctly configured
- [ ] UI is responsive and works in Dark/Light Mode
- [ ] No sensitive data is sent to external servers

## 📄 License

This project is licensed under the **MIT License** – see [LICENSE](LICENSE) file for details.

---

<div align="center">

**Made with ❤️ and Vue.js**

[⬆ Back to Top](#-omniflow)

</div>
