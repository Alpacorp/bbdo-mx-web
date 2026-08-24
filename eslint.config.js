// @ts-check
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

/**
 * ESLint. Type checking is handled by `astro check`, which genuinely
 * understands .astro; this covers what that does not see: unused variables,
 * unawaited promises, accessibility in the markup.
 */
export default defineConfig(
  {
    // '.vercel/' holds the adapter's build output: bundled server chunks that
    // are generated, not written, and linting them reports hundreds of errors
    // about code nobody edits.
    ignores: ['dist/', '.astro/', 'node_modules/', 'public/', '.vercel/'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  // Accessibility rules from the Astro plugin. The brief lists accessibility
  // among the non-negotiables, so these are errors, not warnings.
  ...astro.configs['jsx-a11y-recommended'],
  {
    rules: {
      // Leading underscores mark something as deliberately unused.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // The <script> blocks in .astro files run in the browser.
    files: ['**/*.astro'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        setTimeout: 'readonly',
        requestAnimationFrame: 'readonly',
        cancelAnimationFrame: 'readonly',
        IntersectionObserver: 'readonly',
        CSS: 'readonly',
        HTMLElement: 'readonly',
        HTMLVideoElement: 'readonly',
        SVGSVGElement: 'readonly',
        SVGGElement: 'readonly',
      },
    },
  },
  {
    // API routes run on the server, against web-standard globals.
    files: ['src/pages/api/**/*.ts'],
    languageOptions: {
      globals: {
        Response: 'readonly',
        Request: 'readonly',
        URL: 'readonly',
        fetch: 'readonly',
        FormData: 'readonly',
        console: 'readonly',
      },
    },
  },
  {
    // Build scripts run in Node, not in the browser.
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        process: 'readonly',
      },
    },
  }
);
