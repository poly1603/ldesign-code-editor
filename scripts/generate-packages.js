/**
 * 生成所有框架包配置的脚本
 */

import * as fs from 'node:fs/promises'
import * as path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const PACKAGES_DIR = path.join(__dirname, '..', 'packages')

const frameworks = [
  { name: 'angular', deps: ['@angular/core', '@angular/common'], version: '^18.0.0' },
  { name: 'solid', deps: ['solid-js'], version: '^1.8.0' },
  { name: 'svelte', deps: ['svelte'], version: '^4.0.0' },
  { name: 'qwik', deps: ['@builder.io/qwik'], version: '^1.11.0' },
]

async function generatePackageJson(framework) {
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

async function generateBuilderConfig(framework) {
  const depMap = {
    angular: '@angular/core',
    solid: 'solid-js',
    svelte: 'svelte',
    qwik: '@builder.io/qwik',
  }

  const config = `import { defineConfig } from '@ldesign/builder'

export default defineConfig({
  entry: 'src/index.ts',
  formats: ['es', 'cjs'],
  dts: true,
  external: ['${depMap[framework]}', '@ldesign/code-editor-core', 'monaco-editor'],
  sourcemap: true,
  clean: true,
  framework: '${framework}',
})
`

  const packageDir = path.join(PACKAGES_DIR, framework)
  await fs.writeFile(path.join(packageDir, 'builder.config.ts'), config)
}

async function generateEslintConfig(framework) {
  const hasSpecialRules = framework === 'svelte'
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

async function generateTsConfig(framework) {
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

async function generateReadme(framework) {
  const frameworkName = framework.charAt(0).toUpperCase() + framework.slice(1)
  const readme = `# @ldesign/code-editor-${framework}

${frameworkName} 组件，用于 LDesign 代码编辑器。

## 安装

\`\`\`bash
npm install @ldesign/code-editor-${framework} @ldesign/code-editor-core monaco-editor
\`\`\`

## 使用方法

敬请期待...

## 文档

完整文档请访问: [https://ldesign.github.io/code-editor](https://ldesign.github.io/code-editor)

## 许可证

MIT
`

  const packageDir = path.join(PACKAGES_DIR, framework)
  await fs.writeFile(path.join(packageDir, 'README.md'), readme)
}

async function generateVitest(framework) {
  const config = `import { defineConfig } from 'vitest/config'
import { resolve } from 'node:path'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        '**/*.test.ts',
        '**/*.spec.ts',
        '**/*.d.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
`

  const packageDir = path.join(PACKAGES_DIR, framework)
  await fs.writeFile(path.join(packageDir, 'vitest.config.ts'), config)
}

async function main() {
  console.log('正在生成框架包...')

  for (const framework of frameworks) {
    console.log(`\n正在生成 ${framework.name}...`)

    try {
      await generatePackageJson(framework)
      await generateBuilderConfig(framework.name)
      await generateEslintConfig(framework.name)
      await generateTsConfig(framework.name)
      await generateReadme(framework.name)
      await generateVitest(framework.name)

      // 创建 src 目录
      const srcDir = path.join(PACKAGES_DIR, framework.name, 'src')
      await fs.mkdir(srcDir, { recursive: true })

      // 创建占位符 index.ts
      await fs.writeFile(
        path.join(srcDir, 'index.ts'),
        `// ${framework.name.charAt(0).toUpperCase() + framework.name.slice(1)} wrapper for @ldesign/code-editor-core\n\nexport {}\n`,
      )

      console.log(`✓ ${framework.name} 包已生成`)
    }
    catch (error) {
      console.error(`✗ 生成 ${framework.name} 失败:`, error.message)
    }
  }

  console.log('\n✅ 所有包已成功生成!')
}

main().catch(console.error)
