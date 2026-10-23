export interface RejectionAnalysisRequest {
  rawText: string;
  schemeName?: string;
  state?: string;
  language?: 'en' | 'hi' | 'kn';
  imageBase64?: string;
  imageMimeType?: string;
}

export interface RejectionAnalysisResult {
  // A. What the rejection message means
  meaning: string;

  // B. Why this may have happened
  statedReason: string;
  possibleReasons: string[];

  // C. What you should do now
  actionPlan: string[];
  documentsToCheck: string[];
  correctionsNeeded: string[];

  // D. Official next steps
  officialPortalName?: string;
  officialPortalUrl?: string;
  grievanceChannelName?: string;
  grievanceChannelUrl?: string;
  verifiedHelpline?: string;
  verifiedDeadline?: string; // Only populated if officially verified, otherwise undefined

  // E. What to do if the problem continues
  escalationOptions: string[];

  // Clarification questions if the notice was ambiguous
  needsClarification: boolean;
  followUpQuestions?: string[];

  // Safety & Privacy
  privacyNotice: string;
  disclaimer: string;

  // Formatted WhatsApp message ready for sending
  formattedMessage: string;
}
