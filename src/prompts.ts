import { GUIDE_BY_ID, type Guide } from "./guides.js";
import { GUIDE_URI_PREFIX } from "./resources.js";

export interface PromptArgumentDescriptor {
  name: string;
  description: string;
  required?: boolean;
}

export interface PromptDescriptor {
  name: string;
  description: string;
  arguments: PromptArgumentDescriptor[];
  /** Guide IDs whose content is embedded as resource links in the prompt. */
  guideIds: string[];
  /** The user-role message body. Gets {{arg}} substitutions applied. */
  template: string;
}

const ARG_SUBACCOUNT: PromptArgumentDescriptor = {
  name: "subAccountId",
  description: "Optional sub-account ID to scope the flow to. Omit for the main account.",
};

export const PROMPTS: PromptDescriptor[] = [
  {
    name: "avenia_flow_pix_to_stablecoin_onchain",
    description:
      "End-to-end: accept a Pix pay-in in BRL, convert to USDC/USDT, and send the stablecoin to an external wallet on-chain.",
    arguments: [
      { name: "amountBRL", description: "Amount in BRL to receive via Pix (e.g. 10000).", required: true },
      { name: "outputCurrency", description: "Target stablecoin (USDC or USDT). Default: USDC." },
      { name: "outputChain", description: "Destination chain (Polygon, Base, Ethereum, etc). Default: Polygon." },
      { name: "walletAddress", description: "Destination wallet address.", required: true },
      ARG_SUBACCOUNT,
    ],
    guideIds: ["usecase-pix2stable-onchain", "operations-quotes-and-tickets", "beneficiary-wallets"],
    template: `Run the full Pix → Stablecoin → On-Chain Transfer flow for {{amountBRL}} BRL into {{outputCurrency|USDC}} on {{outputChain|Polygon}} to wallet \`{{walletAddress}}\`{{#subAccountId}} (sub-account {{subAccountId}}){{/subAccountId}}.

Steps, in order, using the Avenia MCP tools:
1. Confirm KYC is clear (\`avenia_get_access_info\`, \`avenia_get_attempts\`).
2. Register the destination wallet as a beneficiary if not already (\`avenia_create_beneficiary_wallet\`).
3. Get a fixed-rate quote BRL→{{outputCurrency|USDC}} via Pix in, on-chain out (\`avenia_get_fixed_rate_quote\`).
4. Create the ticket (\`avenia_create_ticket\`) using the \`quoteToken\` from the quote.
5. Return the Pix QR / BR Code / copia-e-cola from the ticket so the payer can settle it.
6. Poll \`avenia_get_ticket_by_id\` until status = PAID / COMPLETED, then return the on-chain tx hash.

Read the \`avenia-guide://usecase-pix2stable-onchain\` resource first for the authoritative step-by-step. Cross-reference \`avenia-guide://operations-quotes-and-tickets\` for quote/ticket semantics. Don't skip webhook setup if this is a production run (\`avenia-guide://webhooks-management\`).`,
  },
  {
    name: "avenia_flow_stablecoin_to_pix",
    description: "Reverse on-ramp: spend stablecoin balance and pay out via Pix to a BRL beneficiary.",
    arguments: [
      { name: "amountStable", description: "Stablecoin amount to convert (e.g. 500).", required: true },
      { name: "inputCurrency", description: "Source stablecoin (USDC, USDT, BRLA). Default: USDC." },
      { name: "pixKey", description: "Destination Pix key (CPF/CNPJ/email/phone/random).", required: true },
      ARG_SUBACCOUNT,
    ],
    guideIds: ["usecase-pix2stable-stable2pix", "operations-quotes-and-tickets", "beneficiary-bank-brl"],
    template: `Pay out {{amountStable}} {{inputCurrency|USDC}} to Pix key \`{{pixKey}}\`{{#subAccountId}} from sub-account {{subAccountId}}{{/subAccountId}}.

Steps:
1. Look up Pix info (\`avenia_get_pix_info\` with \`decodePixKey=true\`) to confirm the key resolves to a valid recipient.
2. Create (or find) a BRL beneficiary for that Pix key (\`avenia_create_beneficiary_brl_bank_account\`).
3. Quote {{inputCurrency|USDC}}→BRL via on-chain in, Pix out (\`avenia_get_fixed_rate_quote\`).
4. Create the ticket (\`avenia_create_ticket\`) referencing the beneficiary and quote.
5. Confirm the balance is sufficient (\`avenia_get_account_wallet_balances\`) before executing.
6. Poll \`avenia_get_ticket_by_id\` until COMPLETED and fetch the receipt (\`avenia_get_ticket_receipt\`).

Canonical reference: \`avenia-guide://usecase-pix2stable-stable2pix\`.`,
  },
  {
    name: "avenia_flow_kyc_level_1",
    description: "Submit individual KYC Level 1 (via API) and poll until it clears.",
    arguments: [
      {
        name: "submissionMode",
        description: "\"api\" (direct submission) or \"web-sdk\" (link for end-user to complete). Default: api.",
      },
      ARG_SUBACCOUNT,
    ],
    guideIds: ["kyc-level-1"],
    template: `Start a KYC Level 1 submission{{#subAccountId}} for sub-account {{subAccountId}}{{/subAccountId}} using mode "{{submissionMode|api}}".

Steps:
1. Call \`avenia_new_level_1_api\` (or \`avenia_new_level_1_web_sdk\` if mode=web-sdk) with the applicant's data.
2. Record the returned attempt ID.
3. Poll \`avenia_get_attempt_by_id\` until status is APPROVED or REJECTED.
4. If APPROVED, confirm the account now has the expected permissions via \`avenia_get_access_info\`.

Read \`avenia-guide://kyc-level-1\` for the exact required fields and document formats.`,
  },
  {
    name: "avenia_flow_kyb_level_1_api",
    description: "Business KYB Level 1 via API (for company accounts).",
    arguments: [ARG_SUBACCOUNT],
    guideIds: ["kyb-level-1-api", "kyb-level-1"],
    template: `Run KYB Level 1 programmatically{{#subAccountId}} for sub-account {{subAccountId}}{{/subAccountId}}.

Walk the user through the flow per \`avenia-guide://kyb-level-1-api\`: collect legal entity data, uploaded documents, UBO declarations, then submit and poll for approval. If USD or EUR operations will be needed, also reference \`avenia-guide://kyb-usd\` or \`avenia-guide://kyb-eur\` for the additional requirements.`,
  },
  {
    name: "avenia_flow_register_webhook",
    description: "Register a webhook endpoint and verify the first delivery signature using the public key.",
    arguments: [
      { name: "endpointUrl", description: "Your HTTPS endpoint that will receive events.", required: true },
      {
        name: "events",
        description: "Comma-separated event types (TICKET, KYC_ATTEMPT, BENEFICIARY, etc.).",
        required: true,
      },
    ],
    guideIds: ["webhooks-management", "webhooks-events", "webhooks-verifying-authenticity"],
    template: `Register a webhook on {{endpointUrl}} subscribed to: {{events}}.

Steps:
1. Register the subscription with \`avenia_register_webhook\`.
2. Trigger a test event (for TICKET: create a trivial sandbox ticket; for KYC: re-query a recent attempt).
3. Retrieve the event with \`avenia_get_webhook_events\`, then \`avenia_get_webhook_event_by_id\`.
4. Verify the signature: follow \`avenia-guide://webhooks-verifying-authenticity\` — fetch \`avenia_get_public_key\` and validate the JWS header on the delivery.
5. Inspect retry state via \`avenia_get_webhook_event_submissions\` if the first attempt failed.

Cross-reference \`avenia-guide://webhooks-events\` for the full event-type catalog and payload shapes.`,
  },
  {
    name: "avenia_flow_sandbox_mock_funds",
    description: "Receive mock funds in sandbox so you can test pay-in / conversion flows end-to-end.",
    arguments: [
      { name: "amountBRL", description: "BRL amount to credit (e.g. 5000).", required: true },
      ARG_SUBACCOUNT,
    ],
    guideIds: ["sandbox-receive-mock-funds"],
    template: `We're on sandbox and need to simulate a Pix deposit of {{amountBRL}} BRL{{#subAccountId}} into sub-account {{subAccountId}}{{/subAccountId}}.

Follow \`avenia-guide://sandbox-receive-mock-funds\` step-by-step. After the mock credit, confirm the balance via \`avenia_get_account_wallet_balances\` and the statement via \`avenia_get_statement\`.

Reminder: this only works when \`AVENIA_ENV=sandbox\`. If the env is production, stop and ask for confirmation.`,
  },
  {
    name: "avenia_flow_create_subaccount_with_kyc",
    description: "Create a sub-account for an end customer and run KYC Level 1 on it.",
    arguments: [
      { name: "name", description: "Sub-account display name.", required: true },
      { name: "accountType", description: "\"INDIVIDUAL\" or \"BUSINESS\". Default: INDIVIDUAL." },
    ],
    guideIds: ["subaccounts", "kyc-level-1", "kyb-level-1"],
    template: `Create a {{accountType|INDIVIDUAL}} sub-account named "{{name}}" and run KYC on it.

1. Create the sub-account: \`avenia_create_sub_account\`. Capture the new \`subAccountId\`.
2. Depending on type: \`avenia_new_level_1_api\` (individual → KYC) or KYB flow (business → \`avenia-guide://kyb-level-1-api\`).
3. Poll \`avenia_get_attempt_by_id\` with the new sub-account's scope until APPROVED.
4. Confirm with \`avenia_get_sub_account_by_id\`.

Canonical reference: \`avenia-guide://subaccounts\`.`,
  },
  {
    name: "avenia_flow_payout_brcode",
    description: "Pay out by charging a dynamic Pix BR Code (copia-e-cola).",
    arguments: [
      { name: "brCode", description: "The dynamic BR Code (copia-e-cola string) to pay.", required: true },
      ARG_SUBACCOUNT,
    ],
    guideIds: ["usecase-payout-brcode", "operations-quotes-and-tickets"],
    template: `Pay the BR Code: \`{{brCode}}\`{{#subAccountId}} from sub-account {{subAccountId}}{{/subAccountId}}.

Steps per \`avenia-guide://usecase-payout-brcode\`:
1. Get a fixed-rate quote with \`outputBrCode\` set to the copia-e-cola (\`avenia_get_fixed_rate_quote\`).
2. Verify the resolved recipient + amount make sense before creating the ticket.
3. Create the ticket (\`avenia_create_ticket\`) referencing the quote.
4. Poll \`avenia_get_ticket_by_id\` until COMPLETED and fetch the receipt.`,
  },
];

export const PROMPT_BY_NAME = new Map<string, PromptDescriptor>(PROMPTS.map((p) => [p.name, p]));

/** Fill {{var}} and {{#var}}...{{/var}} blocks with provided args. */
export function renderPromptBody(tpl: string, args: Record<string, string | undefined>): string {
  // Section blocks: {{#var}}...{{/var}}
  let out = tpl.replace(/\{\{#(\w+)\}\}([\s\S]*?)\{\{\/\1\}\}/g, (_, name, inner) => {
    const v = args[name];
    return v ? inner.replace(/\{\{(\w+)\}\}/g, (__: string, n: string) => args[n] ?? "") : "";
  });
  // {{var|default}} and {{var}}
  out = out.replace(/\{\{(\w+)(?:\|([^}]*))?\}\}/g, (_, name, def) => {
    const v = args[name];
    return v && v !== "" ? v : def ?? "";
  });
  return out.trim();
}

/** Turn guide IDs into MCP resource link entries the assistant can read. */
export function guideResourceLinks(ids: string[]): Array<{ uri: string; name: string; description: string; mimeType: string }> {
  return ids
    .map((id) => GUIDE_BY_ID.get(id))
    .filter((g): g is Guide => !!g)
    .map((g) => ({
      uri: `${GUIDE_URI_PREFIX}${g.id}`,
      name: g.title,
      description: g.summary,
      mimeType: "text/markdown",
    }));
}
