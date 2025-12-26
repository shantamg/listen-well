---
slug: /backend/api/auth
sidebar_position: 13
---

# Authentication API

User registration, login, and token management.

## Overview

BeHeard uses **Clerk** for authentication and token issuance. Expo app integrates Clerk for signup/login/social; backend uses Clerk middleware to validate tokens. No custom password or refresh-token handling in the backend.

### Clerk-based flow (MVP)
1) **Mobile (Expo)**: Wrap the app root with `<ClerkProvider publishableKey={...}>`. Use Clerk hooks (`useAuth`, `useUser`) to sign in/up and obtain session tokens:
```tsx
const { getToken } = useAuth();
const token = await getToken({ template: 'backend' }); // send as Bearer token
```
2) **Backend (Express)**: Add `clerkMiddleware()` at the top-level router to validate incoming `Authorization: Bearer <Clerk JWT>`:
```ts
import { clerkMiddleware, requireAuth } from '@clerk/express';
app.use(clerkMiddleware());
app.use('/api/v1', requireAuth(), apiRouter);
```
3) **User provisioning**: On first authenticated request, upsert a local `User` row keyed by the Clerk user ID (store Clerk user ID in the User table; recommend using it as the primary key or a unique `clerkUserId` field). Copy profile fields (email, name) + pushToken when available.
4) **Token characteristics**: Tokens are Clerk session JWTs; no backend refresh endpoint is needed. Expiration/rotation is managed by Clerk.

The only backend-issued tokens are for Ably (`/auth/ably-token`) which require a valid Clerk session token on the request.

## Register / Login

Handled entirely by Clerk in the mobile app. The backend does **not** implement `/auth/register` or `/auth/login`. Use Clerk’s SDK UI/components or custom flows in Expo; send Clerk session tokens to the backend.

For invitation acceptance, the app should pass `invitationId` to Clerk’s sign-up flow, then call `/sessions/:id/compact/sign` after auth.

## Logout

Handled by Clerk SDK on the client (ends session + clears tokens). No backend endpoint required.

## Get Current User

Get the authenticated user's profile.

```
GET /api/v1/auth/me
```

### Response

```typescript
interface GetMeResponse {
  user: UserDTO;
  activeSessions: number;
  pushNotificationsEnabled: boolean;
}
```

`GET /auth/me` should:
- Trust Clerk middleware for auth context.
- Upsert local user if missing (Clerk ID, email, name, pushToken).
- Return current user profile + counts derived from local DB (sessions, etc.).

---

## Update Profile

Update user profile information.

```
PATCH /api/v1/auth/me
```

### Request Body

```typescript
interface UpdateProfileRequest {
  name?: string;
}
```

### Response

```typescript
interface UpdateProfileResponse {
  user: UserDTO;
}
```

---

## Update Push Token

Register device for push notifications.

```
POST /api/v1/auth/push-token
```

### Request Body

```typescript
interface UpdatePushTokenRequest {
  pushToken: string;  // Expo push token
  platform: 'ios' | 'android';
}
```

### Response

```typescript
interface UpdatePushTokenResponse {
  registered: boolean;
}
```

---

## Request Password Reset

Request a password reset email.

```
POST /api/v1/auth/forgot-password
```

### Request Body

```typescript
interface ForgotPasswordRequest {
  email: string;
}
```

### Response

```typescript
interface ForgotPasswordResponse {
  sent: boolean;
  // Always returns true to prevent email enumeration
}
```

---

## Reset Password

Reset password with token from email.

```
POST /api/v1/auth/reset-password
```

### Request Body

```typescript
interface ResetPasswordRequest {
  token: string;
  newPassword: string;
}
```

### Response

```typescript
interface ResetPasswordResponse {
  reset: boolean;
}
```

### Side Effects

- All existing tokens are invalidated
- User must log in again

---

## Ably Token

Get an Ably token for real-time connections.

```
GET /api/v1/auth/ably-token
```

### Response

```typescript
interface AblyTokenResponse {
  tokenRequest: {
    keyName: string;
    ttl: number;
    timestamp: number;
    capability: string;
    clientId: string;
    nonce: string;
    mac: string;
  };
}
```

### Capability Scoping

Token is scoped to user's active sessions only:

```json
{
  "beheard:session:sess_abc123": ["subscribe", "publish"],
  "beheard:session:sess_abc123:presence": ["presence"]
}
```

---

## Token Format

### Access Token Claims

```typescript
interface AccessTokenPayload {
  sub: string;      // User ID
  email: string;
  iat: number;      // Issued at
  exp: number;      // Expires (15 min)
  type: 'access';
}
```

### Refresh Token Claims

```typescript
interface RefreshTokenPayload {
  sub: string;      // User ID
  jti: string;      // Token ID (for revocation)
  iat: number;
  exp: number;      // Expires (30 days)
  type: 'refresh';
}
```

---

## Security Considerations

### Rate Limiting

| Endpoint | Limit |
|----------|-------|
| `/auth/login` | 5 attempts per minute per IP |
| `/auth/register` | 3 per minute per IP |
| `/auth/forgot-password` | 3 per hour per email |

### Password Requirements

- Minimum 8 characters
- Future: strength scoring, breach detection

### Token Storage (Mobile)

- Store refresh token in secure storage (iOS Keychain, Android Keystore)
- Access token can be in memory only
- Never store tokens in AsyncStorage

---

## Related Documentation

- [Realtime Integration](./realtime.md) - Ably token usage
- [Sessions API](./sessions.md) - Authenticated session access

---

[Back to API Index](./index.md) | [Back to Backend](../index.md)
