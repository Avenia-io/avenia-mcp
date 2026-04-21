// Integration-guide pages catalog. Source of truth: https://integration-guide.avenia.io/sitemap.xml
// Regenerate if the sitemap changes. Titles and summaries are hand-written from the docs index.

export interface Guide {
  /** Stable short ID used in resource URIs (avenia-guide://<id>). */
  id: string;
  /** Human-readable title shown to AI assistants. */
  title: string;
  /** Category (for grouping in the resource list). */
  category: string;
  /** Absolute URL to the live guide. */
  url: string;
  /** One-line purpose description shown to the assistant. */
  summary: string;
}

export const GUIDES: readonly Guide[] = [
  // Avenia Account Management
  {
    id: "account-about-login",
    title: "About Login",
    category: "Account Management",
    url: "https://integration-guide.avenia.io/docs/Avenia-Account-Management/aboutLogin",
    summary: "Overview of the Avenia login model (user accounts, accesses, permissions).",
  },
  {
    id: "account-login",
    title: "Login Flow",
    category: "Account Management",
    url: "https://integration-guide.avenia.io/docs/Avenia-Account-Management/login",
    summary: "Two-step login (email+password → OTP+TOTP) and token refresh.",
  },
  {
    id: "account-recovery",
    title: "Account Recovery",
    category: "Account Management",
    url: "https://integration-guide.avenia.io/docs/Avenia-Account-Management/recoveryGuide",
    summary: "Forgot-password and MFA-reset flows.",
  },
  {
    id: "account-statement",
    title: "Account Statement",
    category: "Account Management",
    url: "https://integration-guide.avenia.io/docs/Avenia-Account-Management/accountStatement",
    summary: "Pull balances, limits and transaction statements for an account or sub-account.",
  },
  {
    id: "account-address-api",
    title: "Address API",
    category: "Account Management",
    url: "https://integration-guide.avenia.io/docs/Avenia-Account-Management/addressApi",
    summary: "Managing the account address used for compliance checks.",
  },

  // Subaccounts
  {
    id: "subaccounts",
    title: "Subaccount Management",
    category: "Subaccounts",
    url: "https://integration-guide.avenia.io/docs/Avenia%20Subaccounts/subAccountManagement",
    summary: "Create and operate on behalf of sub-accounts (multi-tenant customer setups).",
  },

  // Bank Accounts (own fiat rails)
  {
    id: "bank-accounts-own",
    title: "Your Own Bank Accounts (Fiat Rails)",
    category: "Bank Accounts",
    url: "https://integration-guide.avenia.io/docs/Bank%20Accounts/bankAccounts",
    summary: "Get the BRL fiat rail (your Pix receiving details) tied to the account.",
  },
  {
    id: "bank-accounts-static-brcode",
    title: "Static BR Code (Pix QR)",
    category: "Bank Accounts",
    url: "https://integration-guide.avenia.io/docs/Bank%20Accounts/staticBrCode",
    summary: "Generate static Pix BR Code (QR) with optional amount, reference and additional data.",
  },

  // Beneficiaries — Bank Accounts
  {
    id: "beneficiary-bank-brl",
    title: "Beneficiary Bank Accounts (BRL)",
    category: "Beneficiaries",
    url: "https://integration-guide.avenia.io/docs/Beneficiaries-Bank-Accounts/beneficiariesBankAccountsGuideBrl",
    summary: "Register BRL beneficiaries (Pix keys, bank/branch/account) for pay-outs.",
  },
  {
    id: "beneficiary-bank-usd",
    title: "Beneficiary Bank Accounts (USD)",
    category: "Beneficiaries",
    url: "https://integration-guide.avenia.io/docs/Beneficiaries-Bank-Accounts/beneficiariesBankAccountsGuideUsd",
    summary: "Register USD beneficiaries (ABA/IBAN/SWIFT) for international pay-outs.",
  },
  {
    id: "beneficiary-bank-eur",
    title: "Beneficiary Bank Accounts (EUR)",
    category: "Beneficiaries",
    url: "https://integration-guide.avenia.io/docs/Beneficiaries-Bank-Accounts/beneficiariesBankAccountsGuideEur",
    summary: "Register EUR beneficiaries (IBAN/BIC) for SEPA pay-outs.",
  },
  {
    id: "beneficiary-wallets",
    title: "Beneficiary Wallets (On-Chain)",
    category: "Beneficiaries",
    url: "https://integration-guide.avenia.io/docs/Beneficiaries-Wallets/walletsGuide",
    summary: "Register crypto wallet beneficiaries across supported chains.",
  },

  // Email Notification
  {
    id: "email-notification",
    title: "Email Notifications",
    category: "Notifications",
    url: "https://integration-guide.avenia.io/docs/Email%20Notification/emailNotification",
    summary: "Configure which account events trigger email notifications.",
  },

  // Export / Migration
  {
    id: "export-infinia-migration",
    title: "Infinia Migration Guide",
    category: "Migration",
    url: "https://integration-guide.avenia.io/docs/Export/infiniaMigrationGuide",
    summary: "Moving workloads from the legacy Infinia product to Avenia.",
  },
  {
    id: "export-template",
    title: "Export Template",
    category: "Migration",
    url: "https://integration-guide.avenia.io/docs/Export/template",
    summary: "Template for bulk data exports.",
  },

  // KYB
  {
    id: "kyb-level-1",
    title: "KYB Level 1",
    category: "KYB",
    url: "https://integration-guide.avenia.io/docs/KYB/kybLevel1",
    summary: "Business KYB Level 1 (identity + basic verification).",
  },
  {
    id: "kyb-level-1-api",
    title: "KYB Level 1 — API",
    category: "KYB",
    url: "https://integration-guide.avenia.io/docs/KYB/kybLevel1Api",
    summary: "Programmatic KYB Level 1 submission via the API (no web SDK).",
  },
  {
    id: "kyb-usd",
    title: "KYB for USD",
    category: "KYB",
    url: "https://integration-guide.avenia.io/docs/KYB/kybUsd",
    summary: "Additional KYB requirements to unlock USD operations.",
  },
  {
    id: "kyb-eur",
    title: "KYB for EUR",
    category: "KYB",
    url: "https://integration-guide.avenia.io/docs/KYB/kybEur",
    summary: "Additional KYB requirements to unlock EUR operations.",
  },

  // KYC
  {
    id: "kyc-level-1",
    title: "KYC Level 1",
    category: "KYC",
    url: "https://integration-guide.avenia.io/docs/KYC/kycLevel1",
    summary: "Individual KYC Level 1 submission (API or Web SDK).",
  },
  {
    id: "kyc-usd",
    title: "KYC for USD",
    category: "KYC",
    url: "https://integration-guide.avenia.io/docs/KYC/kycUsd",
    summary: "Extra KYC forms (e.g. W8-BEN) required to operate in USD.",
  },
  {
    id: "kyc-eur",
    title: "KYC for EUR",
    category: "KYC",
    url: "https://integration-guide.avenia.io/docs/KYC/kycEur",
    summary: "Extra KYC requirements to operate in EUR.",
  },

  // Operations
  {
    id: "operations-overview",
    title: "Operations Overview",
    category: "Operations",
    url: "https://integration-guide.avenia.io/docs/Operations/",
    summary: "How tickets, quotes and combinations fit together end-to-end.",
  },
  {
    id: "operations-combinations",
    title: "Payment-Method Combinations",
    category: "Operations",
    url: "https://integration-guide.avenia.io/docs/Operations/combinations",
    summary: "Valid input/output currency × payment-method × on-chain combinations.",
  },
  {
    id: "operations-quotes-and-tickets",
    title: "Quotes and Tickets",
    category: "Operations",
    url: "https://integration-guide.avenia.io/docs/Operations/quotesAndTickets",
    summary: "How to get a fixed-rate quote and turn it into a ticket that moves money.",
  },
  {
    id: "operations-ticket-receipt",
    title: "Ticket Receipt",
    category: "Operations",
    url: "https://integration-guide.avenia.io/docs/Operations/ticket-receipt",
    summary: "Retrieve and share the PDF/JSON receipt for a completed ticket.",
  },

  // Sandbox
  {
    id: "sandbox-receive-mock-funds",
    title: "Receive Mock Funds (Sandbox)",
    category: "Sandbox",
    url: "https://integration-guide.avenia.io/docs/Sandbox%20Usecases/receiveMockFunds",
    summary: "Trigger mock Pix credits in sandbox so you can test pay-in flows end-to-end.",
  },

  // Security
  {
    id: "security-api-keys-guide",
    title: "API Keys — How They Work",
    category: "Security",
    url: "https://integration-guide.avenia.io/docs/Security/apiKeysGuide",
    summary: "Scopes, rotation and security considerations for Avenia API keys.",
  },
  {
    id: "security-api-keys-management",
    title: "API Keys — Management",
    category: "Security",
    url: "https://integration-guide.avenia.io/docs/Security/apiKeysManagements",
    summary: "Create, list, update and revoke API keys (uses JWE with the platform public key).",
  },
  {
    id: "security-mfa",
    title: "MFA (TOTP)",
    category: "Security",
    url: "https://integration-guide.avenia.io/docs/Security/mfaGuide",
    summary: "Enroll, validate and remove TOTP-based multi-factor authentication.",
  },

  // Use cases
  {
    id: "usecase-payout-brcode",
    title: "Use Case — Pay Out via BR Code",
    category: "Use Cases",
    url: "https://integration-guide.avenia.io/docs/Usecases/payOutBrCode",
    summary: "Dynamic Pix BR Code pay-out flow (quote → ticket → execute).",
  },
  {
    id: "usecase-pix2stable-onchain",
    title: "Use Case — Pix → Stablecoin (On-Chain Transfer)",
    category: "Use Cases",
    url: "https://integration-guide.avenia.io/docs/Usecases/pix2Stable&onChainTransfer",
    summary: "Accept Pix in BRL, convert to USDC/USDT, send to an external wallet on-chain.",
  },
  {
    id: "usecase-pix2stable-stable2pix",
    title: "Use Case — Pix ↔ Stablecoin Round-Trip",
    category: "Use Cases",
    url: "https://integration-guide.avenia.io/docs/Usecases/pix2Stable&stable2pix",
    summary: "Pix → stablecoin then stablecoin → Pix, covering both on/off-ramp directions.",
  },

  // Webhooks
  {
    id: "webhooks-management",
    title: "Webhook Management",
    category: "Webhooks",
    url: "https://integration-guide.avenia.io/docs/Webhooks/webhookManagement",
    summary: "Register, update and delete webhook subscriptions.",
  },
  {
    id: "webhooks-events",
    title: "Webhook Event Catalog",
    category: "Webhooks",
    url: "https://integration-guide.avenia.io/docs/Webhooks/webhookEvents",
    summary: "All webhook event types and their payload shapes.",
  },
  {
    id: "webhooks-verifying-authenticity",
    title: "Verifying Webhook Authenticity",
    category: "Webhooks",
    url: "https://integration-guide.avenia.io/docs/Webhooks/verifyingWebhookAuthenticity",
    summary: "How to verify webhook signatures with the Avenia public key.",
  },
];

export function findGuide(id: string): Guide | undefined {
  return GUIDES.find((g) => g.id === id);
}

export const GUIDE_BY_ID = new Map<string, Guide>(GUIDES.map((g) => [g.id, g]));
