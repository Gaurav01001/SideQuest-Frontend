// API URL lives in src/config/env.js — import from there.


export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  FEED: '/feed',
  PROFILE: '/profile/:username',
  EDIT_PROFILE: '/profile/edit',
  MESSAGES: '/messages',
  ROLES: '/roles',
  ROLE_DETAIL: '/roles/:id',
  CREATE_ROLE: '/roles/create',
  SEARCH: '/search',
  REVIEWS: '/reviews/:userId',
  MODERATION: '/moderation',
};

export const CONNECTION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

export const APPLICATION_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
};

export const REPORT_REASONS = [
  'Spam',
  'Harassment',
  'Fake account',
  'Inappropriate content',
  'Scam or fraud',
  'Other',
];

export const MAX_POST_LENGTH = 1000;
export const MAX_BIO_LENGTH = 200;
export const MAX_MESSAGE_LENGTH = 1000;

export const DEFAULT_AVATAR = 'https://api.dicebear.com/7.x/avataaars/svg?seed=';
