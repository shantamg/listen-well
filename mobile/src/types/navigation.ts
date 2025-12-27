/**
 * Navigation route parameters for the mobile app
 * Uses Expo Router's file-based routing
 */

// Session stage types
export type SessionStage =
  | 'compact'     // Stage 0: Initial compact format
  | 'chat'        // Stage 1: AI-guided chat
  | 'empathy'     // Stage 2: Empathy mapping
  | 'needs'       // Stage 3: Needs identification
  | 'strategies'; // Stage 4: Strategy development

// Route parameter types for dynamic routes
export interface SessionRouteParams {
  id: string;
}

export interface PersonRouteParams {
  id: string;
}

export interface InvitationRouteParams {
  id: string;
}

// Tab names for type-safe navigation
export type TabName = 'index' | 'sessions' | 'profile';

// Helper type for building typed navigation paths
export type AppRoutes = {
  // Public routes
  '/login': undefined;
  '/signup': undefined;
  '/invitation/[id]': InvitationRouteParams;

  // Auth-required routes
  '/': undefined; // Home tab
  '/sessions': undefined;
  '/profile': undefined;

  // Session routes
  '/session/new': undefined;
  '/session/[id]': SessionRouteParams;
  '/session/[id]/chat': SessionRouteParams;
  '/session/[id]/compact': SessionRouteParams;
  '/session/[id]/empathy': SessionRouteParams;
  '/session/[id]/needs': SessionRouteParams;
  '/session/[id]/strategies': SessionRouteParams;

  // Person routes
  '/person/[id]': PersonRouteParams;
};

// Type for router.push with params
export type TypedRoute = keyof AppRoutes;
