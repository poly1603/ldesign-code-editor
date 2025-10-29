/**
 * Script to generate all framework package configurations
 * Run with: tsx scripts/generate-packages.ts
 */

import * as fs from 'node:fs/promises'
import * as path from 'node:path'

const PACKAGES_DIR = path.join(process.cwd(), 'packages')

const frameworks = [
  { name: 'angular', deps: ['@angular/core', '@angular/common'], version: '^18.0.0' },
  { name: 'solid', deps: ['solid-js'], version: '^1.8.0' },
  { name: 'svelte', deps: ['svelte'], version: '^4.0.0' },
  { name: 'qwik', deps: ['@builder.io/qwik'], version: '^1.11.0' },
]

async function generatePackageJson(framework: typeof frameworks[0]) {
  const packageJson = {
    name: `@ldesign/code-editor-${framework.name}`,
    version: '2.0.0',
    description: `${framework.name.charAt(0).toUpperCase() + framework.name.slice(1)} components for @ldesign/code-editor-core`,
    type: 'module',
    main: './dist/index.cjs',
    module: './dist/index.js',
    types: './dist/index.d.ts',
    exports: {
      '.': {
        types: './dist/index.d.ts',
        import: './dist/index.js',
        require: './dist/index.cjs',
      },
    },
    files: ['dist', 'README.md'],
    scripts: {
      build: 'ldesign-builder build',
      dev: 'ldesign-builder dev',
      lint: 'eslint .',
      'lint:fix': 'eslint . --fix',
      'type-check': 'tsc --noEmit',
      test: 'vitest',
      'test:ui': 'vitest --ui',
      'test:coverage': 'vitest --coverage',
      clean: 'rimraf dist',
    },
    keywords: [framework.name, 'code-editor', 'monaco-editor'],
    author: 'LDesign Team',
    license: 'MIT',
    peerDependencies: {
      '@ldesign/code-editor-core': 'workspace:*',
      'monaco-editor': '^0.52.0',
      ...Object.fromEntries(framework.deps.map(dep => [dep, framework.version])),
    },
    devDependencies: {
      '@antfu/eslint-config': '^6.0.0',
      '@ldesign/builder': 'workspace:*',
      '@ldesign/code-editor-core': 'workspace:*',
      '@types/node': '^22.10.2',
      '@vitest/coverage-v8': '^1.6.0',
      '@vitest/ui': '^1.0.0',
      eslint: '^9.18.0',
      'monaco-editor': '^0.52.0',
      rimraf: '^5.0.5',
      typescript: '^5.7.3',
      vitest: '^1.0.0',
      ...Object.fromEntries(framework.deps.map(dep => [dep, framework.version])),
    },
  }

  const packageDir = path.join(PACKAGES_DIR, framework.name)
  await fs.mkdir(packageDir, { recursive: true })
  await fs.writeFile(
    path.join(packageDir, 'package.json'),
    JSON.stringify(packageJson, null, 2),
  )
}

async function generateBuilderConfig(framework: string) {
  const config = `import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  formats: ['es', 'cjs'],
  dts: true,
  external: ['${framework === 'angular' ? '@angular/core' : framework === 'solid' ? 'solid-js' : framework === 'svelte' ? 'svelte' : '@builder.io/qwik'}', '@ldesign/code-editor-core', 'monaco-editor'],
  sourcemap: true,
  clean: true,
  framework: '${framework}',
})
`

  const packageDir = path.join(PACKAGES_DIR, framework)
  await fs.writeFile(path.join(packageDir, 'builder.config.ts'), config)
}

async function generateEslintConfig(framework: string) {
  const hasSpecialRules = framework === 'angular' || framework === 'svelte'
  const config = `import antfu from '@antfu/eslint-config'

export default antfu({
  typescript: true,
  ${hasSpecialRules ? `${framework}: true,` : ''}
  formatters: true,
  rules: {
    'no-console': ['warn', { allow: ['warn', 'error', 'debug'] }],
    'ts/no-explicit-any': 'warn',
    'ts/explicit-module-boundary-types': 'off',
    'ts/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    'ts/no-non-null-assertion': 'warn',
    'ts/consistent-type-imports': ['error', { prefer: 'type-imports' }],
    'prefer-const': 'error',
    'no-var': 'error',
  },
})
`

  const packageDir = path.join(PACKAGES_DIR, framework)
  await fs.writeFile(path.join(packageDir, 'eslint.config.js'), config)
}

async function generateTsConfig(framework: string) {
  const config = {
    compilerOptions: {
      target: 'ES2020',
      useDefineForClassFields: true,
      module: 'ESNext',
      lib: ['ES2020', 'DOM', 'DOM.Iterable'],
      skipLibCheck: true,
      moduleResolution: 'bundler',
      allowImportingTsExtensions: true,
      resolveJsonModule: true,
      isolatedModules: true,
      noEmit: true,
      jsx: framework === 'solid' || framework === 'qwik' ? 'preserve' : undefined,
      strict: true,
      noUnusedLocals: true,
      noUnusedParameters: true,
      noFallthroughCasesInSwitch: true,
      noUncheckedIndexedAccess: true,
      declaration: true,
      declarationDir: './dist',
      baseUrl: '.',
      paths: {
        '@/*': ['src/*'],
      },
    },
    include: ['src/**/*.ts', 'src/**/*.d.ts'],
    exclude: ['node_modules', 'dist', '**/*.test.ts', '**/*.spec.ts'],
  }

  const packageDir = path.join(PACKAGES_DIR, framework)
  await fs.writeFile(
    path.join(packageDir, 'tsconfig.json'),
    JSON.stringify(config, null, 2),
  )
}

async function generateReadme(framework: string) {
  const frameworkName = framework.charAt(0).toUpperCase() + framework.slice(1)
  const readme = `# @ldesign/code-editor-${framework}

${frameworkName} components for the LDesign Code Editor.

## Installation

\`\`\`bash
npm install @ldesign/code-editor-${framework} @ldesign/code-editor-core monaco-editor
\`\`\`

## Usage

Coming soon...

## Documentation

For full documentation, visit: [https://ldesign.github.io/code-editor](https://ldesign.github.io/code-editor)

## License

MIT
`

  const packageDir = path.join(PACKAGES_DIR, framework)
  await fs.writeFile(path.join(packageDir, 'README.md'), readme)
}

async function main() {
  console.log('Generating framework packages...')

  for (const framework of frameworks) {
    console.log(`\nGenerating ${framework.name}...`)

    await generatePackageJson(framework)
    await generateBuilderConfig(framework.name)
    await generateEslintConfig(framework.name)
    await generateTsConfig(framework.name)
    await generateReadme(framework.name)

    // Create src directory
    const srcDir = path.join(PACKAGES_DIR, framework.name, 'src')
    await fs.mkdir(srcDir, { recursive: true })

    // Create placeholder index.ts
    await fs.writeFile(
      path.join(srcDir, 'index.ts'),
      `// ${framework.name.charAt(0).toUpperCase() + framework.name.slice(1)} wrapper for @ldesign/code-editor-core\n\nexport {}\n`,
    )

    console.log(`✓ ${framework.name} package generated`)
  }

  console.log('\n✅ All packages generated successfully!')
}

main().catch(console.error)
