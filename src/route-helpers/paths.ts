// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/$lang/auth',
  DASHBOARD: '/$lang/dashboard',
  AGENTS: '/$lang/agents',
  BLOGWRITER: '/$lang/blog-writer',
  CONNECTION: '/$lang/connection',
  ADMINPANEL: '/$lang/admin',
  SETTINGS: '/$lang/settings',
}

// ----------------------------------------------------------------------

export const paths = {
  faqs: '/$lang/faqs',
  minimalStore: 'https://mui.com/store/items/minimal-dashboard/',
  team: '/$lang/team',
  inbox: '/$lang/inbox',
  integrations: '/$lang/integrations',
  referrals: '/$lang/referrals',
  oldSettings: '/$lang/old-settings',
  login: '/$lang/login',
  // AUTH
  auth: {
    amplify: {
      signIn: `${ROOTS.AUTH}/amplify/sign-in`,
      verify: `${ROOTS.AUTH}/amplify/verify`,
      signUp: `${ROOTS.AUTH}/amplify/sign-up`,
      updatePassword: `${ROOTS.AUTH}/amplify/update-password`,
      resetPassword: `${ROOTS.AUTH}/amplify/reset-password`,
    },
    firebase: {
      signIn: `${ROOTS.AUTH}/firebase/sign-in`,
      verify: `${ROOTS.AUTH}/firebase/verify`,
      signUp: `${ROOTS.AUTH}/firebase/sign-up`,
      resetPassword: `${ROOTS.AUTH}/firebase/reset-password`,
    },
    auth0: {
      signIn: `${ROOTS.AUTH}/auth0/sign-in`,
    },
    supabase: {
      signIn: `${ROOTS.AUTH}/supabase/sign-in`,
      verify: `${ROOTS.AUTH}/supabase/verify`,
      signUp: `${ROOTS.AUTH}/supabase/sign-up`,
      updatePassword: `${ROOTS.AUTH}/supabase/update-password`,
      resetPassword: `${ROOTS.AUTH}/supabase/reset-password`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: '/$lang',
    team: `${ROOTS.DASHBOARD}/team`,
    inbox: `${ROOTS.DASHBOARD}/inbox`,
    integrations: `${ROOTS.DASHBOARD}/integrations`,
    referrals: `${ROOTS.DASHBOARD}/referrals`,
    oldSettings: `${ROOTS.DASHBOARD}/old-settings`,
  },
  // AGENTS
  agents: {
    root: ROOTS.AGENTS,
    blogWriter: `${ROOTS.AGENTS}/blog-writer`,
  },
  // BLOG WRITER
  blogWriter: {
    root: ROOTS.BLOGWRITER,
  },
  // CONNECTION
  connection: {
    root: ROOTS.CONNECTION,
    failure: `${ROOTS.CONNECTION}/failure`,
    success: `${ROOTS.CONNECTION}/success`,
  },
  // ADMIN PANEL
  adminPanel: {
    root: ROOTS.ADMINPANEL,
    users: `${ROOTS.ADMINPANEL}/admin`,
    projects: `${ROOTS.ADMINPANEL}/projects`,
    questions: `${ROOTS.ADMINPANEL}/questions`,
    workflowQuestions: () =>
      `${ROOTS.ADMINPANEL}/workflows/{$workflowId}/questions`,
    projectActions: () => `${ROOTS.ADMINPANEL}/actions/{$projectId}`,
    agents: `${ROOTS.ADMINPANEL}/agents`,
    subscriptions: `${ROOTS.ADMINPANEL}/subscriptions`,
    settings: `${ROOTS.ADMINPANEL}/settings`,
  },
  // SETTINGS
  settings: {
    root: ROOTS.SETTINGS,
    general: `${ROOTS.SETTINGS}/general`,
    appearance: `${ROOTS.SETTINGS}/appearance`,
    billing: `${ROOTS.SETTINGS}/billing`,
    notifications: `${ROOTS.SETTINGS}/notifications`,
    projects: `${ROOTS.SETTINGS}/projects`,
    changePassword: `${ROOTS.SETTINGS}/change-password`,
  },
}
