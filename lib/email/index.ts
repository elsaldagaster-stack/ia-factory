import { Resend } from 'resend';

let _client: Resend | null = null;

export interface SendEmailParams {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
}

export type SendEmailResult =
  | { success: true; id: string }
  | { success: false; error: string };

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return { success: false, error: 'RESEND_API_KEY not configured' };
  }

  const from = params.from ?? process.env.RESEND_FROM_EMAIL;
  if (!from) {
    return { success: false, error: 'RESEND_FROM_EMAIL not configured' };
  }

  try {
    if (!_client) _client = new Resend(apiKey);
    const { data, error } = await _client.emails.send({
      from,
      to: params.to,
      subject: params.subject,
      html: params.html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data?.id) {
      return { success: false, error: 'Resend returned no message id' };
    }

    return { success: true, id: data.id };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, error: message };
  }
}
