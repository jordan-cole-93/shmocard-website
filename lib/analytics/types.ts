// Meta Pixel + Conversions API shared types.
//
// Phase 9: 3 site-side standard events (D-07). PascalCase enforced via union (Pitfall 3).
// The checkout-completion event is NOT in the union — the Shopify channel app
// owns it on shop.shmocard.com (D-04).

export type MetaEventName = "ViewContent" | "AddToCart" | "InitiateCheckout";

export type MetaContentEntry = {
  id: string;
  quantity: number;
};

export type MetaCustomData = {
  content_ids?: string[];
  content_type?: "product";
  contents?: MetaContentEntry[];
  value?: number;
  currency?: "USD";
};

export type MetaUserData = {
  client_ip_address?: string;
  client_user_agent?: string;
  fbp?: string;
  fbc?: string;
  em?: string[]; // SHA-256 hex, lowercase, trim before hash (Phase 9 collects no email; reserved)
  ph?: string[]; // SHA-256 hex, digits only, no symbols (Phase 9 collects no phone; reserved)
};

export type MetaEventPayload = {
  event_name: MetaEventName;
  event_time: number; // unix seconds
  event_id: string;
  event_source_url: string;
  action_source: "website";
  user_data: MetaUserData;
  custom_data?: MetaCustomData;
};
