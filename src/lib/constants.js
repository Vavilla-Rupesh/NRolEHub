// Application-wide constants
export const APP_NAME = 'Campus Connect';
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    PROFILE: '/auth/profile',
    UPDATE_PROFILE: '/auth/profile/update',
    CHANGE_PASSWORD: '/auth/profile/password',
  },
  EVENTS: {
    LIST: '/events',
    DETAILS: (id) => `/events/${id}`,
    REGISTER: '/registrations/register',
    MY_REGISTRATIONS: '/registrations/my-registrations',
  },
  ADMIN: {
    CREATE_EVENT: '/admin/events',
    UPDATE_EVENT: (id) => `/admin/events/${id}`,
    DELETE_EVENT: (id) => `/admin/events/${id}`,
    MARK_ATTENDANCE: (id) => `/admin/mark-attendance/${id}`,
  },
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  ADMIN: {
    DASHBOARD: '/admin',
    EVENTS: '/admin/events',
    EVENT_DETAILS: (id) => `/admin/events/${id}`,
    CERTIFICATES: '/admin/certificates',
    LEADERBOARD: '/admin/leaderboard',
    PROFILE: '/admin/profile',
  },
  STUDENT: {
    DASHBOARD: '/student',
    EVENTS: '/student/events',
    MY_EVENTS: '/student/my-events',
    CERTIFICATES: '/student/certificates',
    SUPPORT: '/student/support',
    PROFILE: '/student/profile',
  },
};