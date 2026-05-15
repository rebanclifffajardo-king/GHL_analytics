// ============================================================
// types/conversations.ts
// Type definitions for the Conversations Overview
// ============================================================

/** A single conversation/message record from the GHL CSV */
export interface ConvRecord {
  id: string;
  dateOnly: string;           // "YYYY-MM-DD"
  fullName: string;
  email: string;
  phone: string;
  messageType: 'SMS' | 'Email';
  direction: 'inbound' | 'outbound';
  sourceType: 'AGENT / MANUAL' | 'AUTOMATION' | 'CUSTOMER REPLY';
  lastMessageBody: string;
  lastMessageDirection: 'inbound' | 'outbound';
  unreadCount: number;
  contactId: string;
}

/** Conversation KPI summary */
export interface ConvSummary {
  total: number;
  uniqueContacts: number;
  sms: number;
  email: number;
  outbound: number;
  inbound: number;
  agentManual: number;
  automation: number;
  customerReply: number;
  optOuts: number;
  inboxUnread: number;
  smsPct: string;
  emailPct: string;
  outboundPct: string;
  inboundPct: string;
  optOutRate: string;
  replyRate: string;
  dateRange: string;
}

/** Daily stats for line/bar charts */
export interface ConvDailyStats {
  date: string;
  total: number;
  sms: number;
  email: number;
  inbound: number;
  outbound: number;
  agentManual: number;
  automation: number;
  customerReply: number;
}

/** SMS template message usage */
export interface TemplateCount {
  label: string;
  fullBody: string;
  count: number;
}

/** Source × channel cross-tab */
export interface SourceChannelRow {
  source: string;
  sms: number;
  email: number;
  total: number;
}

/** A single conversation record for the data table */
export interface ConvTableRow {
  id: string;
  dateOnly: string;
  fullName: string;
  email: string;
  phone: string;
  messageType: 'SMS' | 'Email';
  direction: 'inbound' | 'outbound';
  sourceType: string;
  bodyPreview: string;
  unreadCount: number;
}

/** Filter state for conversations */
export interface ConvFilter {
  dateFrom: string;
  dateTo: string;
  messageType: '' | 'SMS' | 'Email';
  direction: '' | 'inbound' | 'outbound';
  sourceType: '' | 'AGENT / MANUAL' | 'AUTOMATION' | 'CUSTOMER REPLY';
  search: string;
}
