# Code Editor Refactoring Guide

## 🎯 Project Overview

This project has been refactored into a monorepo structure with framework-agnostic core and framework-specific wrappers.

## 📁 New Structure

```
code-editor/
├── packages/
│   ├── core/                    # Framework-agnostic core
│   ├── vue/                     # Vue 3 wrapper
│   ├── react/                   # React wrapper  
│   ├── angular/                 # Angular wrapper
│   ├── solid/                   # Solid.js wrapper
│   ├── svelte/                  # Svelte wrapper
│   └── qwik/                    # Qwik wrapper
├── demos/                       # Demo projects for each framework
├── docs/                        # VitePress documentation
├── scripts/                     # Build and utility scripts
└── pnpm-workspace.yaml         # Monorepo workspace config
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Build All Packages

```bash
pnpm -r build
```

### 3. Run Tests

```bash
pnpm -r test
```

### 4. Lint All Packages

```bash
pnpm -r lint
```

## 📦 Package Details

### @ldesign/code-editor-core

Framework-agnostic core library with all editor functionality:

- ✅ CodeEditor base class
- ✅ EnhancedCodeEditor with loading states
- ✅ AI completion and analysis
- ✅ Collaboration (CRDT, WebSocket)
- ✅ Virtual file system
- ✅ Debugger and breakpoints
- ✅ Theme system
- ✅ Extension loader
- ✅ Performance monitoring
- ✅ Memory management
- ✅ Keybinding system
- ✅ Command palette
- ✅ Snippet system
- ✅ Language services (Python, Go, Rust, Java)

**Build:** Uses `@ldesign/builder`  
**Lint:** Uses `@antfu/eslint-config`  
**Test:** Vitest with coverage

### @ldesign/code-editor-vue

Vue 3 components and composables:

- ✅ `CodeEditor` component
- ✅ `useCodeEditor` composable
- ✅ Full reactivity support
- ✅ TypeScript types

### @ldesign/code-editor-react

React components and hooks:

- ✅ `CodeEditor` component  
- ✅ `useCodeEditor` hook
- ✅ TypeScript types

### @ldesign/code-editor-angular

Angular directives and services (To be implemented)

### @ldesign/code-editor-solid

Solid.js primitives and components (To be implemented)

### @ldesign/code-editor-svelte

Svelte stores and components (To be implemented)

### @ldesign/code-editor-qwik

Qwik resumable components (To be implemented)

## 🛠️ Development Workflow

### Build Single Package

```bash
cd packages/core
pnpm build
```

### Watch Mode

```bash
cd packages/vue
pnpm dev
```

### Run Tests

```bash
# All packages
pnpm -r test

# Single package
cd packages/react
pnpm test
```

### Lint and Fix

```bash
# All packages
pnpm -r lint:fix

# Single package
cd packages/core
pnpm lint:fix
```

### Type Check

```bash
pnpm -r type-check
```

## 📝 Next Steps

### Immediate Tasks

1. ✅ Core package setup
2. ✅ Vue wrapper  
3. ✅ React wrapper
4. ⏳ Generate remaining framework packages (run: `tsx scripts/generate-packages.ts`)
5. ⏳ Implement Angular wrapper
6. ⏳ Implement Solid.js wrapper
7. ⏳ Implement Svelte wrapper
8. ⏳ Implement Qwik wrapper

### Demo Projects

Create demo projects using `@ldesign/launcher`:

```bash
cd demos
# Create Vue demo
pnpm create @ldesign/launcher vue-demo --template vue

# Create React demo
pnpm create @ldesign/launcher react-demo --template react

# ... and so on for each framework
```

### Documentation

Setup VitePress documentation:

```bash
pnpm add -D vitepress
pnpm docs:dev
```

Documentation structure:
- Getting Started
- Installation guides for each framework
- API Reference
- Examples and recipes
- Migration guide from v1

### Testing Strategy

1. **Unit Tests**: Test core logic and utilities
2. **Component Tests**: Test framework components
3. **Visual Tests**: Screenshot testing for UI components
4. **Performance Tests**: Benchmark editor operations
5. **Integration Tests**: Test full workflows

### Performance Optimization

- [x] Lazy loading
- [x] Editor pooling
- [x] Memory management
- [x] Performance monitoring
- [ ] Bundle size optimization
- [ ] Code splitting
- [ ] Tree shaking verification

### Quality Assurance

- [x] ESLint configured (@antfu/eslint-config)
- [x] TypeScript strict mode
- [ ] 100% type coverage
- [ ] Unit test coverage > 80%
- [ ] E2E tests
- [ ] Visual regression tests
- [ ] Performance benchmarks

## 🔧 Configuration Files

Each package includes:

- `package.json` - Package configuration
- `builder.config.ts` - Build configuration (@ldesign/builder)
- `eslint.config.js` - Lint configuration (@antfu/eslint-config)
- `tsconfig.json` - TypeScript configuration
- `vitest.config.ts` - Test configuration
- `README.md` - Package documentation

## 📊 Build System

Using `@ldesign/builder` for all packages:

```typescript
// builder.config.ts
import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  formats: ['es', 'cjs'],
  dts: true,
  external: ['monaco-editor'],
  sourcemap: true,
  clean: true,
})
```

Benefits:
- Zero config for most cases
- Auto-detection of frameworks
- Fast builds with esbuild/swc
- Type declaration generation
- Multiple output formats

## 🧪 Testing

Using Vitest for all packages:

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
})
```

## 📚 Additional Resources

- [Monaco Editor Documentation](https://microsoft.github.io/monaco-editor/)
- [LDesign Builder](../../tools/builder)
- [LDesign Launcher](../../tools/launcher)
- [@antfu/eslint-config](https://github.com/antfu/eslint-config)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `pnpm test`
5. Run linter: `pnpm lint:fix`
6. Type check: `pnpm type-check`
7. Submit a pull request

## 📄 License

MIT
