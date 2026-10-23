export interface WhatsAppSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export class WhatsAppService {
  private token: string;
  private phoneNumberId: string;
  private apiVersion: string;

  constructor() {
    this.token = process.env.WHATSAPP_TOKEN || '';
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '';
    this.apiVersion = process.env.WHATSAPP_API_VERSION || 'v21.0';
  }

  isConfigured(): boolean {
    return (
      Boolean(this.token) &&
      this.token !== 'dummy_token_for_local_dev' &&
      this.token !== 'your_meta_system_user_or_temporary_access_token_here' &&
      Boolean(this.phoneNumberId) &&
      this.phoneNumberId !== 'dummy_phone_number_id' &&
      this.phoneNumberId !== 'your_whatsapp_phone_number_id_here'
    );
  }

  /**
   * Sends a plain text message to a WhatsApp user using Cloud API.
   * Does NOT log tokens or sensitive payload details.
   */
  async sendWhatsAppMessage(to: string, text: string): Promise<WhatsAppSendResult> {
    if (!this.isConfigured()) {
      // In unconfigured / simulation mode, report explicitly that Meta API was skipped
      console.log(`[WhatsAppService (SIMULATION/UNCONFIGURED)] Message to ${to.slice(0, 4)}... length=${text.length} chars`);
      return {
        success: false,
        error: 'WhatsApp Cloud API is not configured with real Meta credentials (running in simulation mode).',
      };
    }

    const url = `https://graph.facebook.com/${this.apiVersion}/${this.phoneNumberId}/messages`;

    // WhatsApp Cloud API limit for a single text message is 4096 characters
    const safeText = text.length > 4000 ? text.slice(0, 4000) + '...' : text;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${this.token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          recipient_type: 'individual',
          to: to,
          type: 'text',
          text: {
            preview_url: true,
            body: safeText,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error(`[WhatsApp API Error] HTTP ${response.status}: ${errorData}`);
        return {
          success: false,
          error: `Meta Graph API responded with status ${response.status}`,
        };
      }

      const data: any = await response.json();
      const messageId = data?.messages?.[0]?.id;
      return {
        success: true,
        messageId,
      };
    } catch (err: any) {
      console.error(`[WhatsApp Network Error]: ${err.message}`);
      return {
        success: false,
        error: err.message,
      };
    }
  }

  /**
   * Sends multiple messages sequentially with a small delay
   */
  async sendMessages(to: string, messages: string[]): Promise<boolean[]> {
    const results: boolean[] = [];
    for (const msg of messages) {
      const res = await this.sendWhatsAppMessage(to, msg);
      results.push(res.success);
      // Small delay between consecutive messages to preserve WhatsApp delivery order
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return results;
  }
}

export const defaultWhatsAppService = new WhatsAppService();

export async function sendWhatsAppMessage(to: string, text: string): Promise<boolean> {
  const result = await defaultWhatsAppService.sendWhatsAppMessage(to, text);
  return result.success;
}
