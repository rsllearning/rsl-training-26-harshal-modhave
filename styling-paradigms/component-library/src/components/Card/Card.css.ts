import { style } from '@vanilla-extract/css';
import { vars } from '../../styles/theme.css';

export const cardStyle = style({
  backgroundColor: vars.color.bgSurface,
  borderRadius: vars.borderRadius.lg,
  padding: vars.space.lg,
  border: `1px solid ${vars.color.border}`,
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  fontFamily: vars.font.body,
});