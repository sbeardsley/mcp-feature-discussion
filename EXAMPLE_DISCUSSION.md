# Example Discussion
The following is an example of a feature discussion between a developer and an AI. After the feature the conversation then moves on to using the [MCP Architect Server](https://github.com/squirrelogic/mcp-architect) to generate a detailed design for the feature.

## Feature Discussion

- User:
I would like to discuss a new feature about authentication.

- AI:
I'll help you start a feature discussion about authentication.

Ran tool: begin_feature_discussion

Great! I'll help guide you through this feature discussion about authentication. The system has created a feature ID (f1) and is asking for an initial description.

Could you please provide a brief description of what you're looking to achieve with this authentication feature? For example:
- What type of authentication are you considering (e.g., username/password, OAuth, SSO)?
- What are the main requirements or goals for this authentication system?
- Are there any specific security requirements or constraints to consider?

Once you provide these details, we can proceed with a more detailed discussion of the feature.

- User:
I would like it to be able to authenticate with username and password or magic links or pass keys. I would like to also give people the option to authenticate with social providers and SSO

- AI:
I'll provide this information about your authentication requirements.

Ran tool: provide_feature_input

The system is now asking about the business value and benefits of implementing these authentication options. Would you like to share:
- How these authentication methods would benefit your users?
- What business goals they would help achieve?
- Any specific problems or pain points they would solve?

This will help us better understand the motivation behind implementing these various authentication methods and ensure we design the feature to maximize value for both users and stakeholders.

- User:
The business value for authentication is security

- AI:
I'll provide this information about the business value focused on security.

Ran tool: provide_feature_input

The system is now asking about the target users for this authentication feature. Could you please specify:
- Who will be using these authentication methods?
- Are there different types of users with different authentication needs?
- Are there specific user segments that would benefit from particular authentication methods (e.g., enterprise users for SSO, tech-savvy users for passkeys)?

This information will help us ensure the authentication system is designed appropriately for its intended audience.

- User:
Yes the target audience for username password would be just general audience everybody. The audience for pass keys would be people who are knowledgeable enough about security to use pass keys. Magic link users would be anybody who prefers that method of authentication. For its simplicity, and SSO would be for enterprise users.

- AI:
I'll provide this detailed breakdown of the target users for each authentication method.

Ran tool: provide_feature_input

The system is now asking about key requirements and constraints for the authentication feature. Could you please share:
- Any specific security requirements that must be met?
- Technical constraints we should be aware of?
- Performance requirements (e.g., authentication speed)?
- Compliance requirements (e.g., GDPR, CCPA)?
- Integration requirements with existing systems?
- Any other constraints or requirements that would impact the implementation?

This will help ensure we design a solution that meets all necessary requirements while working within any existing constraints.

- User:
I would say industry best practices are acceptable.

- AI:
I'll provide information about the requirements based on industry best practices.

Ran tool: provide_feature_input

The system is now asking about success criteria for the authentication feature. Could you share what metrics or indicators would demonstrate that the authentication system is working successfully? For example:
- What would indicate successful implementation?
- Are there specific metrics we should track?
- How would we measure user satisfaction?
- What security metrics would be important?
- Any specific KPIs that would demonstrate success?

This will help us establish clear goals and ways to measure the effectiveness of the authentication system once implemented.

- User:
A successful implementation would be protected resources would not be accessible to anyone who is not authenticated and they would be available to users who are authenticated.

- AI:
I'll provide these success criteria focused on secure resource access.

Ran tool: provide_feature_input

The system is now asking about the technical approach for implementing the authentication feature. Would you like to share:
- Any specific technologies or frameworks you'd prefer to use?
- Preferences for how to implement each authentication method?
- Any existing authentication services or providers you'd like to integrate with?
- Architectural preferences for the authentication system?

This will help us understand your technical preferences and constraints for implementing the authentication system.

- User:
The system will be built with Next.js. So I would say, any technologies and frameworks that are standard best practices to use, any libraries, things like that that will provide benefit to the functionality.

- AI:
I'll provide information about the technical approach using Next.js and recommended authentication solutions.

Ran tool: provide_feature_input

The system is now asking about potential risks and challenges we should consider for this authentication implementation. Could you share your thoughts on:
- Any technical challenges you foresee?
- Security risks that concern you?
- Implementation challenges specific to your needs?
- User adoption concerns?
- Integration challenges with existing systems?

This will help us identify and plan for potential obstacles in advance of implementation.

- User:
Integration concerns would be using OpenID Connect for social authentication using OpenID Connect and SAML for SSO authentication for pass keys making sure that the user has the ability to recover their pass keys in the event that they have wiped their machine. Maybe use BIP39 as a way to create a new monic that they can restore their pass keys with or at least allow them access to the system to generate new pass keys. username and password we should make sure that we check all of the pwn ed databases and other simple password databases as well as using password strength tools that are industry standard to make sure that they are not using a already compromised password or a weak password.

- AI:
I'll provide these detailed concerns about integration and security considerations.

Ran tool: provide_feature_input

The system is now asking about the timeline and priority for implementing this authentication feature. Could you please share:
- How urgent is this feature?
- Are there any specific deadlines to meet?
- Would you prefer a phased rollout of different authentication methods?
- Are there any dependencies on other features or systems?
- What's your preferred prioritization for the different authentication methods?

This will help us plan the implementation schedule and ensure we meet your timing requirements.

- User:
The overall feature is high priority, do immediately. I could see a phased rollout where we start with the simplest options of using username and password with a MFA provider with OTP codes. We could also roll out the OIDC provider capabilities at the same time as well as pass keys. I would say social authentication would come next. And then as a last final functionality, we implement the SSO.

- AI:
I'll provide this phased implementation plan and priority information.

Ran tool: provide_feature_input

Great! We've completed the feature discussion for the authentication system. The discussion has covered:
1. Multiple authentication methods and their target users
2. Security as the primary business value
3. Industry best practices and requirements
4. Technical approach using Next.js and modern authentication libraries
5. Specific security and integration concerns
6. A three-phase implementation plan

Would you like to:
1. Analyze the feature further to identify any gaps or potential improvements?
2. Get specific architectural suggestions for implementing this authentication system?
3. Begin working on the Phase 1 implementation?

Please let me know how you'd like to proceed, and I'll be happy to help with the next steps.

- User:
Can you give me a complete technical breakdown of that feature that we just discuss?

- AI:
I'll help analyze the architecture of this authentication feature based on our discussion.

Ran tool: analyze_architecture

Now, let me generate a detailed technical architecture for implementing this feature.

Ran tool: generate_architecture

Based on our discussion and the architecture analysis, here's a complete technical breakdown of the authentication feature:

1. Core Components:

a) Authentication Service (Central Hub):
- Built with Next.js and NextAuth.js/Auth.js
- Handles all authentication flows
- Manages user sessions
- Implements middleware for route protection
- Uses Prisma for database operations

b) Password Management Module:
- Implements bcrypt for password hashing
- Integrates with HaveIBeenPwned API
- Password strength validation
- Secure password reset flows
- Rate limiting for attempts

c) MFA Module:
- Time-based OTP (TOTP) implementation
- QR code generation for app setup
- Backup codes generation and management
- Rate limiting for verification attempts

d) Passkey Management:
- WebAuthn/FIDO2 implementation using @simplewebauthn/server
- BIP39 mnemonic implementation for recovery
- Device synchronization handling
- Backup and restoration flows

e) Identity Provider Integration:
- OpenID Connect implementation for social auth
- SAML integration for enterprise SSO
- OAuth 2.0 flows
- Provider-specific adapters

2. Security Features:

a) Session Management:
- JWT or encrypted cookies using iron-session
- Secure session rotation
- Idle session timeout
- Concurrent session handling

b) Protection Mechanisms:
- CSRF protection
- Rate limiting
- Input validation using zod
- XSS prevention
- SQL injection protection

3. Database Schema:

```sql
User {
  id: uuid
  email: string (unique)
  hashedPassword: string (nullable)
  mfaEnabled: boolean
  mfaSecret: string (nullable)
  passkeysEnabled: boolean
  recoveryPhrase: string (encrypted, nullable)
  lastLogin: datetime
  createdAt: datetime
  updatedAt: datetime
}

AuthMethod {
  id: uuid
  userId: uuid
  type: enum (password, passkey, social, sso)
  identifier: string
  metadata: jsonb
  lastUsed: datetime
}

Session {
  id: uuid
  userId: uuid
  token: string
  expiresAt: datetime
  createdAt: datetime
}

AuditLog {
  id: uuid
  userId: uuid
  event: string
  metadata: jsonb
  timestamp: datetime
  ip: string
  userAgent: string
}
```

4. API Endpoints:

a) Authentication:
```typescript
POST /api/auth/login
POST /api/auth/register
POST /api/auth/logout
POST /api/auth/refresh
GET  /api/auth/session
```

b) Password Management:
```typescript
POST /api/auth/password/reset
POST /api/auth/password/change
GET  /api/auth/password/check
```

c) MFA:
```typescript
POST /api/auth/mfa/enable
POST /api/auth/mfa/verify
POST /api/auth/mfa/disable
GET  /api/auth/mfa/backup-codes
```

d) Passkeys:
```typescript
POST /api/auth/passkey/register
POST /api/auth/passkey/authenticate
POST /api/auth/passkey/remove
POST /api/auth/passkey/recover
```

5. Implementation Phases:

Phase 1:
- Username/password authentication
- MFA with TOTP
- Basic session management
- Password security features
- Initial audit logging

Phase 2:
- Social authentication
- Passkey support
- Enhanced recovery flows
- Advanced session management
- Expanded audit logging

Phase 3:
- Enterprise SSO
- SAML integration
- Advanced administrative features
- Enhanced monitoring
- Performance optimizations

6. Security Considerations:

a) Password Security:
- Minimum length: 12 characters
- Complexity requirements
- Breach database checking
- Regular rotation policies
- Secure reset flows

b) Rate Limiting:
- Login attempts
- Password resets
- MFA verification
- API endpoints

c) Audit Logging:
- Authentication attempts
- Password changes
- MFA events
- Session management
- Administrative actions

7. Performance Targets:

- Authentication response time: < 200ms
- Password hashing time: < 500ms
- Session validation: < 50ms
- API rate limits: 100 requests per minute per IP
- Concurrent sessions: Up to 5 per user

8. Monitoring and Metrics:

- Authentication success/failure rates
- MFA adoption rates
- Password strength metrics
- Session duration statistics
- API endpoint performance
- Security incident tracking

This technical breakdown provides a comprehensive foundation for implementing the authentication system. Would you like me to elaborate on any specific aspect or move forward with implementing a particular component?
