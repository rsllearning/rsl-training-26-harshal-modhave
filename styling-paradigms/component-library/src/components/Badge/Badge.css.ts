import { recipe, RecipeVariants } from '@vanilla-extract/recipes';
import { vars } from '../../styles/theme.css';

export const badgeStyle = recipe({
  base: {
    display: 'inline-block',
    padding: `${vars.space.xs} ${vars.space.sm}`,
    fontSize: '0.75rem',
    fontWeight: 600,
    borderRadius: vars.borderRadius.full,
    fontFamily: vars.font.body,
    textTransform: 'uppercase',
  },

  variants: {
    variant: {
      success: {
        backgroundColor: vars.color.successBg,
        color: vars.color.successText,
      },
      warning: {
        backgroundColor: vars.color.warningBg,
        color: vars.color.warningText,
      },
      error: {
        backgroundColor: vars.color.errorBg,
        color: vars.color.errorText,
      },
    },
  },

  defaultVariants: {
    variant: 'success',
  },
});

export type BadgeVariants = RecipeVariants<typeof badgeStyle>;