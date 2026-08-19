// @ts-check
import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import ts from 'typescript-eslint';
import astro from 'eslint-plugin-astro';

/**
 * ESLint. El chequeo de tipos lo hace `astro check`, que entiende .astro de
 * verdad; esto se ocupa de lo que aquel no ve: variables sin usar, promesas sin
 * await, accesibilidad en el marcado.
 */
export default defineConfig(
  {
    ignores: ['dist/', '.astro/', 'node_modules/', 'public/'],
  },
  js.configs.recommended,
  ...ts.configs.recommended,
  ...astro.configs.recommended,
  // Reglas de accesibilidad del plugin de Astro. El brief pone la
  // accesibilidad en la lista de no negociables, así que van como error.
  ...astro.configs['jsx-a11y-recommended'],
  {
    rules: {
      // Los guiones bajos marcan intención de no usar algo.
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Los <script> de los .astro corren en el navegador.
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
  }
);
