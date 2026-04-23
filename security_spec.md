# Security Specification for BakeNest

## Data Invariants
- Users can only read and write their own profile document.
- `uid` and `email` must match the authenticated state.
- `createdAt` is immutable.
- `updatedAt` must be set to the current server time.

## The Dirty Dozen Payloads (Target: /users/{userId})
1. **Identity Theft**: Creating a user profile for a different UID.
2. **Email Hijacking**: Setting an email in the document different from the auth email.
3. **Shadow Update**: Adding a `role: "admin"` field to the user profile.
4. **Time Travel**: Attempting to set `createdAt` to a past date.
5. **Future Shock**: Attempting to set `updatedAt` to a future date.
6. **ID Poisoning**: Injecting 2kb of junk characters as a User ID.
7. **Cross-User Data Leak**: Reading someone else's user profile.
8. **PII Scraping**: Trying to list all users.
9. **Spam Creation**: Creating multiple profiles for the same user.
10. **Type Mismatch**: Sending a number for `displayName`.
11. **Size Violation**: Sending a 2MB string for `displayName`.
12. **Insecure Delete**: Trying to delete your own profile (assuming not allowed for consistency).

## Test Runner (DRAFT_firestore.rules.test.ts)
Wait for implementation...
