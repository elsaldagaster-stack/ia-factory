import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { sendEmail } from '../../lib/email/index';

const mockSend = vi.hoisted(() => vi.fn());

vi.mock('resend', () => {
  class MockResend {
    emails = { send: mockSend };
  }
  return { Resend: MockResend };
});

describe('sendEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv('RESEND_API_KEY', 'test-key');
    vi.stubEnv('RESEND_FROM_EMAIL', 'noreply@test.com');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('returns success with id on valid params', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: 'email-123' }, error: null });

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
    });

    expect(result).toEqual({ success: true, id: 'email-123' });
    expect(mockSend).toHaveBeenCalledWith({
      from: 'noreply@test.com',
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
    });
  });

  it('uses provided from instead of env default', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: 'email-456' }, error: null });

    await sendEmail({
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
      from: 'custom@domain.com',
    });

    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ from: 'custom@domain.com' }),
    );
  });

  it('accepts array of recipients', async () => {
    mockSend.mockResolvedValueOnce({ data: { id: 'email-789' }, error: null });

    const result = await sendEmail({
      to: ['a@x.com', 'b@x.com'],
      subject: 'Bulk',
      html: '<p>Hi all</p>',
    });

    expect(result).toEqual({ success: true, id: 'email-789' });
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({ to: ['a@x.com', 'b@x.com'] }),
    );
  });

  it('returns failure when Resend returns error object', async () => {
    mockSend.mockResolvedValueOnce({
      data: null,
      error: { message: 'Invalid API key', statusCode: 401, name: 'api_error' },
    });

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
    });

    expect(result).toEqual({ success: false, error: 'Invalid API key' });
  });

  it('returns failure when send throws exception', async () => {
    mockSend.mockRejectedValueOnce(new Error('Network failure'));

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
    });

    expect(result).toEqual({ success: false, error: 'Network failure' });
  });

  it('returns failure when Resend returns null data and null error', async () => {
    mockSend.mockResolvedValueOnce({ data: null, error: null });

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
    });

    expect(result).toEqual({ success: false, error: 'Resend returned no message id' });
  });

  it('returns failure when RESEND_API_KEY is missing', async () => {
    vi.stubEnv('RESEND_API_KEY', '');

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
    });

    expect(result).toEqual({ success: false, error: 'RESEND_API_KEY not configured' });
    expect(mockSend).not.toHaveBeenCalled();
  });

  it('returns failure when RESEND_FROM_EMAIL is missing and no from provided', async () => {
    vi.stubEnv('RESEND_FROM_EMAIL', '');

    const result = await sendEmail({
      to: 'user@example.com',
      subject: 'Hello',
      html: '<p>Hi</p>',
    });

    expect(result).toEqual({ success: false, error: 'RESEND_FROM_EMAIL not configured' });
    expect(mockSend).not.toHaveBeenCalled();
  });
});
