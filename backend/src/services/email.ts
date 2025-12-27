import { Resend } from 'resend';

// Initialize Resend client - will be null if not configured
const resend = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

// Default sender email
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@beheard.app';

/**
 * Result of an email send operation
 */
export interface EmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
  mocked: boolean;
}

/**
 * Send an invitation email to a partner
 *
 * @param to - Recipient email address
 * @param inviterName - Name of the person sending the invitation
 * @param invitationUrl - Deep link URL for accepting the invitation
 * @returns EmailResult indicating success or failure
 */
export async function sendInvitationEmail(
  to: string,
  inviterName: string,
  invitationUrl: string
): Promise<EmailResult> {
  // If Resend is not configured, mock the email send
  if (!resend) {
    console.log('[Email Mock] Would send invitation email:', {
      to,
      from: FROM_EMAIL,
      subject: `${inviterName} invited you to BeHeard`,
      invitationUrl,
    });

    return {
      success: true,
      messageId: `mock-${Date.now()}`,
      mocked: true,
    };
  }

  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `${inviterName} invited you to BeHeard`,
      html: buildInvitationEmailHtml(inviterName, invitationUrl),
      text: buildInvitationEmailText(inviterName, invitationUrl),
    });

    if (error) {
      console.error('[Email] Failed to send invitation:', error);
      return {
        success: false,
        error: error.message,
        mocked: false,
      };
    }

    console.log('[Email] Invitation sent successfully:', data?.id);
    return {
      success: true,
      messageId: data?.id,
      mocked: false,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error('[Email] Exception sending invitation:', errorMessage);
    return {
      success: false,
      error: errorMessage,
      mocked: false,
    };
  }
}

/**
 * Build the HTML content for an invitation email
 */
function buildInvitationEmailHtml(inviterName: string, invitationUrl: string): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BeHeard Invitation</title>
</head>
<body style="
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
  line-height: 1.6;
  color: #333;
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
">
  <div style="text-align: center; margin-bottom: 30px;">
    <h1 style="color: #4F46E5; margin-bottom: 10px;">BeHeard</h1>
  </div>

  <div style="background: #F9FAFB; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
    <h2 style="margin-top: 0; color: #111827;">You've been invited</h2>
    <p style="font-size: 16px; color: #4B5563;">
      <strong>${escapeHtml(inviterName)}</strong> wants to work through something together using BeHeard.
    </p>
    <p style="font-size: 14px; color: #6B7280;">
      BeHeard is a guided process that helps two people understand each other better and find common ground.
    </p>
  </div>

  <div style="text-align: center; margin-bottom: 30px;">
    <a href="${escapeHtml(invitationUrl)}" style="
      display: inline-block;
      background: #4F46E5;
      color: white;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
    ">Accept Invitation</a>
  </div>

  <div style="text-align: center; color: #9CA3AF; font-size: 12px;">
    <p>This invitation expires in 7 days.</p>
    <p>If you didn't expect this invitation, you can safely ignore this email.</p>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Build the plain text content for an invitation email
 */
function buildInvitationEmailText(inviterName: string, invitationUrl: string): string {
  return `
You've been invited to BeHeard

${inviterName} wants to work through something together using BeHeard.

BeHeard is a guided process that helps two people understand each other better and find common ground.

Accept the invitation here:
${invitationUrl}

This invitation expires in 7 days.

If you didn't expect this invitation, you can safely ignore this email.
  `.trim();
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char] || char);
}
