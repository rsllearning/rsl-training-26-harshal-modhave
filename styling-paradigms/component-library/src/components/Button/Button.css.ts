import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../styles/theme.css';

export const buttonStyle = recipe({
  // Base Styles
  base: {
    fontFamily: vars.font.body,
    fontWeight: 600,
    border: 'none',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease, opacity 0.2s ease',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',

    ':focus-visible': {
      outline: `2px solid ${vars.color.primary}`,
      outlineOffset: '2px',
    },

    ':disabled': {
      opacity: 0.5,
      cursor: 'not-allowed',
    },
  },

  // Style Variants & Sizes
  variants: {
    variant: {
      primary: {
        backgroundColor: vars.color.primary,
        color: '#ffffff',
        ':hover': {
          selectors: {
            '&:not(:disabled)': { backgroundColor: vars.color.primaryHover },
          },
        },
      },
      secondary: {
        backgroundColor: vars.color.secondary,
        color: '#ffffff',
        ':hover': {
          selectors: {
            '&:not(:disabled)': { backgroundColor: vars.color.secondaryHover },
          },
        },
      },
      danger: {
        backgroundColor: vars.color.danger,
        color: '#ffffff',
        ':hover': {
          selectors: {
            '&:not(:disabled)': { backgroundColor: vars.color.dangerHover },
          },
        },
      },
    },
    size: {
      small: {
        padding: `${vars.space.xs} ${vars.space.sm}`,
        fontSize: '0.875rem',
        borderRadius: vars.borderRadius.sm,
      },
      large: {
        padding: `${vars.space.sm} ${vars.space.lg}`,
        fontSize: '1rem',
        borderRadius: vars.borderRadius.md,
      },
    },
  },

  defaultVariants: {
    variant: 'primary',
    size: 'small',
  },
});

export type ButtonVariants = RecipeVariants<typeof buttonStyle>;