export * from './light';
export * from './dark';

export type Theme = typeof import('./light').lightTheme;
