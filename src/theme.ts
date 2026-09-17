export const colors = {
  background: '#0A0A0A',
  surface: '#151515',
  surfaceRaised: '#1D1D1D',
  border: '#292929',
  text: '#F7F4EE',
  muted: '#999995',
  orange: '#FF5A1F',
  orangeSoft: '#3A1B10',
  yellow: '#FFC857',
  green: '#52D273',
  red: '#FF6464',
  white: '#FFFFFF',
  black: '#000000',
} as const;

export const radius = {
  small: 10,
  medium: 16,
  large: 22,
  pill: 999,
} as const;

export const shadow = {
  shadowColor: '#000000',
  shadowOpacity: 0.28,
  shadowRadius: 18,
  shadowOffset: { width: 0, height: 9 },
  elevation: 8,
} as const;
