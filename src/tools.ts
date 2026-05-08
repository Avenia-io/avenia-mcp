// AUTO-GENERATED from the Avenia OpenAPI spec. Do not edit by hand.
// Source: https://api-reference.avenia.io/openapi.json
// Regenerate with: python3 scripts/gen_tools.py

import type { HttpMethod } from "./client.js";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  method: HttpMethod;
  pathTemplate: string;
  pathParams: string[];
  queryParams: string[];
  bodyUnwrap: boolean;
  skipAuth?: boolean;
}

export const TOOLS: readonly ToolDefinition[] = [
  {
    "name": "avenia_account_get_payment_session_by_id_private",
    "description": "Get Payment Session by ID (Private)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "payment-session-id": {
          "type": "string",
          "description": "ID of the payment session"
        }
      },
      "additionalProperties": false,
      "required": [
        "payment-session-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/payment-sessions/{payment-session-id}",
    "pathParams": [
      "payment-session-id"
    ],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
            {
    "name": "avenia_create_beneficiary_ars_bank_account",
    "description": "Create Beneficiary ARS Bank Account",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "alias": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "cvu": {
              "type": "string"
            }
          },
          "required": [
            "alias",
            "description",
            "cvu"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/ars",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_create_beneficiary_brl_bank_account",
    "description": "Create Beneficiary BRL Bank Account",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "alias": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "pixKey": {
              "type": "string"
            },
            "taxId": {
              "type": "string"
            },
            "userName": {
              "type": "string"
            },
            "bankCode": {
              "type": "string"
            },
            "branchCode": {
              "type": "string"
            },
            "accountNumber": {
              "type": "string"
            },
            "accountType": {
              "type": "string"
            }
          },
          "required": [
            "alias",
            "description",
            "pixKey",
            "taxId",
            "userName",
            "bankCode",
            "branchCode",
            "accountNumber",
            "accountType"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/brl",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_create_beneficiary_eur_bank_account",
    "description": "Create Beneficiary EUR Bank Account",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "alias": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "iban": {
              "type": "string"
            },
            "bic": {
              "type": "string"
            },
            "country": {
              "type": "string"
            },
            "bankBeneficiaryName": {
              "type": "string"
            },
            "isBusiness": {
              "type": "boolean"
            }
          },
          "required": [
            "alias",
            "description",
            "iban",
            "bic",
            "country",
            "bankBeneficiaryName",
            "isBusiness"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/eur",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_create_beneficiary_usd_bank_account",
    "description": "Create Beneficiary USD Bank Account",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "alias": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "bankAccountNumber": {
              "type": "string"
            },
            "bankRoutingNumber": {
              "type": "string"
            },
            "bankBeneficiaryName": {
              "type": "string"
            },
            "beneficiaryAddress": {
              "type": "object",
              "properties": {
                "streetAddress": {
                  "type": "string"
                },
                "city": {
                  "type": "string"
                },
                "state": {
                  "type": "string"
                },
                "zipCode": {
                  "type": "string"
                },
                "country": {
                  "type": "string"
                }
              },
              "required": [
                "streetAddress",
                "city",
                "state",
                "zipCode",
                "country"
              ]
            },
            "bankName": {
              "type": "string"
            },
            "bankAddress": {
              "type": "object",
              "properties": {
                "streetAddress": {
                  "type": "string"
                },
                "city": {
                  "type": "string"
                },
                "state": {
                  "type": "string"
                },
                "zipCode": {
                  "type": "string"
                },
                "country": {
                  "type": "string"
                }
              },
              "required": [
                "streetAddress",
                "city",
                "state",
                "zipCode",
                "country"
              ]
            }
          },
          "required": [
            "alias",
            "description",
            "bankAccountNumber",
            "bankRoutingNumber",
            "bankBeneficiaryName",
            "beneficiaryAddress",
            "bankName",
            "bankAddress"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/usd",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_create_beneficiary_wallet",
    "description": "Create Beneficiary Wallet",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "alias": {
              "type": "string"
            },
            "description": {
              "type": "string"
            },
            "walletAddress": {
              "type": "string"
            },
            "walletChain": {
              "type": "string"
            },
            "walletMemo": {
              "type": "string"
            }
          },
          "required": [
            "alias",
            "description",
            "walletAddress",
            "walletChain",
            "walletMemo"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/account/beneficiaries/wallets",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
    {
    "name": "avenia_create_payment_session",
    "description": "Create Payment Session",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "externalId": {
              "type": "string"
            },
            "metadata": {
              "type": "object",
              "properties": {
                "key1": {
                  "type": "string"
                },
                "key2": {
                  "type": "string"
                }
              },
              "required": [
                "key1",
                "key2"
              ]
            },
            "onCompleteRedirectionUrl": {
              "type": "string"
            },
            "paymentOptions": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "inputCurrency": {
                    "type": "string"
                  },
                  "inputPaymentMethod": {
                    "type": "string"
                  },
                  "outputCurrency": {
                    "type": "string"
                  },
                  "outputPaymentMethod": {
                    "type": "string"
                  }
                },
                "required": [
                  "inputCurrency",
                  "inputPaymentMethod",
                  "outputCurrency",
                  "outputPaymentMethod"
                ]
              }
            },
            "outputCurrency": {
              "type": "string"
            },
            "appearance": {
              "type": "object",
              "properties": {
                "primaryColor": {
                  "type": "string"
                },
                "logoUrl": {
                  "type": "string"
                }
              },
              "required": [
                "primaryColor",
                "logoUrl"
              ]
            },
            "expirationInMinutes": {
              "type": "integer"
            }
          },
          "required": [
            "externalId",
            "metadata",
            "onCompleteRedirectionUrl",
            "paymentOptions",
            "outputCurrency",
            "appearance",
            "expirationInMinutes"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/account/payment-session",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_create_payment_session_ticket",
    "description": "Create Payment Session Ticket",
    "inputSchema": {
      "type": "object",
      "properties": {
        "payment-session-id": {
          "type": "string",
          "description": "ID of the payment session"
        }
      },
      "additionalProperties": false,
      "required": [
        "payment-session-id"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/payment-session/{payment-session-id}/create-ticket",
    "pathParams": [
      "payment-session-id"
    ],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_create_sub_account",
    "description": "Create Sub-Account",
    "inputSchema": {
      "type": "object",
      "properties": {
        "body": {
          "type": "object",
          "properties": {
            "accountType": {
              "type": "string"
            },
            "name": {
              "type": "string"
            }
          },
          "required": [
            "accountType",
            "name"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/account/sub-accounts",
    "pathParams": [],
    "queryParams": [],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_create_ticket",
    "description": "Create Ticket",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "quoteToken": {
              "type": "string"
            },
            "ticketBrlPixInput": {
              "type": "object",
              "properties": {
                "remitterId": {
                  "type": "string"
                },
                "additionalData": {
                  "type": "string"
                }
              },
              "required": [
                "remitterId",
                "additionalData"
              ]
            },
            "ticketBlockchainInput": {
              "type": "object",
              "properties": {
                "walletAddress": {
                  "type": "string"
                },
                "permit": {
                  "type": "object",
                  "properties": {
                    "r": {
                      "type": "string"
                    },
                    "s": {
                      "type": "string"
                    },
                    "v": {
                      "type": "integer"
                    },
                    "nonce": {
                      "type": "integer"
                    },
                    "deadline": {
                      "type": "integer"
                    }
                  },
                  "required": [
                    "r",
                    "s",
                    "v",
                    "nonce",
                    "deadline"
                  ]
                },
                "personal": {
                  "type": "object",
                  "properties": {
                    "signature": {
                      "type": "string"
                    },
                    "deadline": {
                      "type": "integer"
                    }
                  },
                  "required": [
                    "signature",
                    "deadline"
                  ]
                }
              },
              "required": [
                "walletAddress",
                "permit",
                "personal"
              ]
            },
            "ticketMarkupInput": {
              "type": "object",
              "properties": {
                "markupWalletAddress": {
                  "type": "string"
                }
              },
              "required": [
                "markupWalletAddress"
              ]
            }
          },
          "required": [
            "quoteToken",
            "ticketBrlPixInput",
            "ticketBlockchainInput",
            "ticketMarkupInput"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/account/tickets",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_create_w8_ben",
    "description": "Create W8-BEN",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "useDigitalSignature": {
              "type": "boolean"
            },
            "foreignTinNotLegallyRequired": {
              "type": "boolean"
            },
            "isClaimingTaxTreatyBenefits": {
              "type": "boolean"
            },
            "treatyArticle": {
              "type": "string"
            },
            "treatyIncomeType": {
              "type": "string"
            },
            "treatyWithholdingRate": {
              "type": "string"
            },
            "treatyExplanation": {
              "type": "string"
            },
            "usTin": {
              "type": "string"
            },
            "referenceNumber": {
              "type": "string"
            },
            "mailingAddress": {
              "type": "object",
              "properties": {
                "streetAddress": {
                  "type": "string"
                },
                "city": {
                  "type": "string"
                },
                "state": {
                  "type": "string"
                },
                "zipCode": {
                  "type": "string"
                },
                "country": {
                  "type": "string"
                }
              },
              "required": [
                "streetAddress",
                "city",
                "state",
                "zipCode",
                "country"
              ]
            }
          },
          "required": [
            "useDigitalSignature",
            "foreignTinNotLegallyRequired",
            "isClaimingTaxTreatyBenefits",
            "treatyArticle",
            "treatyIncomeType",
            "treatyWithholdingRate",
            "treatyExplanation",
            "usTin",
            "referenceNumber",
            "mailingAddress"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/kyc/w8ben",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
      {
    "name": "avenia_delete_beneficiary_brl_bank_account",
    "description": "Delete Beneficiary BRL Bank Account",
    "inputSchema": {
      "type": "object",
      "properties": {
        "bank-account-id": {
          "type": "string",
          "description": "ID of the bank account"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "bank-account-id"
      ]
    },
    "method": "DELETE",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/brl/{bank-account-id}",
    "pathParams": [
      "bank-account-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_delete_beneficiary_wallet",
    "description": "Delete Beneficiary Wallet",
    "inputSchema": {
      "type": "object",
      "properties": {
        "wallet-id": {
          "type": "string",
          "description": "ID of the beneficiary wallet"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "wallet-id"
      ]
    },
    "method": "DELETE",
    "pathTemplate": "/v2/account/beneficiaries/wallets/{wallet-id}",
    "pathParams": [
      "wallet-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_delete_webhook",
    "description": "Delete Webhook",
    "inputSchema": {
      "type": "object",
      "properties": {
        "webhook-id": {
          "type": "string",
          "description": "ID of the webhook to delete"
        }
      },
      "additionalProperties": false,
      "required": [
        "webhook-id"
      ]
    },
    "method": "DELETE",
    "pathTemplate": "/v2/notifications/webhooks/{webhook-id}",
    "pathParams": [
      "webhook-id"
    ],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
      {
    "name": "avenia_get_access_info",
    "description": "Get Access Info",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/access-info",
    "pathParams": [],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
    {
    "name": "avenia_get_account_info",
    "description": "Get Account Info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID (if applicable)"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/account-info",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_account_wallet_balances",
    "description": "Get Account Wallet Balances",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID (optional)"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/balances",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
    {
    "name": "avenia_get_attempt_by_id",
    "description": "Get Attempt by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "attempt-id": {
          "type": "string",
          "description": "ID of the KYC attempt"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "attempt-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/kyc/attempts/{attempt-id}",
    "pathParams": [
      "attempt-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_attempts",
    "description": "Get Attempts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "createdAfter": {
          "type": "integer",
          "description": "Filter attempts created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter attempts created before timestamp"
        },
        "levelName": {
          "type": "string",
          "description": "Filter by KYC level name"
        },
        "status": {
          "type": "string",
          "description": "Filter by status"
        },
        "result": {
          "type": "string",
          "description": "Filter by result"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/kyc/attempts",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "createdAfter",
      "createdBefore",
      "levelName",
      "status",
      "result",
      "cursor"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_beneficiary_ars_bank_account_by_id",
    "description": "Get Beneficiary ARS Bank Account by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "bank-account-id": {
          "type": "string",
          "description": "ID of the bank account"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "bank-account-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/ars/{bank-account-id}",
    "pathParams": [
      "bank-account-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_beneficiary_ars_bank_accounts",
    "description": "Get Beneficiary ARS Bank Accounts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "createdAfter": {
          "type": "integer",
          "description": "Filter accounts created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter accounts created before timestamp"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        },
        "alias": {
          "type": "string",
          "description": "Filter by alias"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/ars",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "createdAfter",
      "createdBefore",
      "cursor",
      "alias"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_beneficiary_brl_bank_account_by_id",
    "description": "Get Beneficiary BRL Bank Account by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "bank-account-id": {
          "type": "string",
          "description": "ID of the bank account"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "bank-account-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/brl/{bank-account-id}",
    "pathParams": [
      "bank-account-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_beneficiary_brl_bank_accounts",
    "description": "Get Beneficiary BRL Bank Accounts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "createdAfter": {
          "type": "integer",
          "description": "Filter accounts created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter accounts created before timestamp"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        },
        "alias": {
          "type": "string",
          "description": "Filter by alias"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/brl",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "createdAfter",
      "createdBefore",
      "cursor",
      "alias"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_beneficiary_eur_bank_account_by_id",
    "description": "Get Beneficiary EUR Bank Account by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "bank-account-id": {
          "type": "string",
          "description": "ID of the bank account"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "bank-account-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/eur/{bank-account-id}",
    "pathParams": [
      "bank-account-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_beneficiary_eur_bank_accounts",
    "description": "Get Beneficiary EUR Bank Accounts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "createdAfter": {
          "type": "integer",
          "description": "Filter accounts created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter accounts created before timestamp"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        },
        "alias": {
          "type": "string",
          "description": "Filter by alias"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/eur",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "createdAfter",
      "createdBefore",
      "cursor",
      "alias"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_beneficiary_usd_bank_account_by_id",
    "description": "Get Beneficiary USD Bank Account by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "bank-account-id": {
          "type": "string",
          "description": "ID of the bank account"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "bank-account-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/usd/{bank-account-id}",
    "pathParams": [
      "bank-account-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_beneficiary_usd_bank_accounts",
    "description": "Get Beneficiary USD Bank Accounts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "createdAfter": {
          "type": "integer",
          "description": "Filter accounts created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter accounts created before timestamp"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        },
        "alias": {
          "type": "string",
          "description": "Filter by alias"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/beneficiaries/bank-accounts/usd",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "createdAfter",
      "createdBefore",
      "cursor",
      "alias"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_beneficiary_wallet_by_id",
    "description": "Get Beneficiary Wallet by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "wallet-id": {
          "type": "string",
          "description": "ID of the beneficiary wallet"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "wallet-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/beneficiaries/wallets/{wallet-id}",
    "pathParams": [
      "wallet-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_beneficiary_wallets",
    "description": "Get Beneficiary Wallets",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "createdAfter": {
          "type": "integer",
          "description": "Filter wallets created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter wallets created before timestamp"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        },
        "alias": {
          "type": "string",
          "description": "Filter by alias"
        },
        "walletAddress": {
          "type": "string",
          "description": "Filter by wallet address"
        },
        "walletChain": {
          "type": "string",
          "description": "Filter by wallet chain"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/beneficiaries/wallets",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "createdAfter",
      "createdBefore",
      "cursor",
      "alias",
      "walletAddress",
      "walletChain"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_brl_fiat_rail",
    "description": "Get BRL Fiat Rail",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/bank-accounts/brl",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_document_by_id",
    "description": "Get Document by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "document-id": {
          "type": "string",
          "description": "ID of the document"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "document-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/documents/{document-id}",
    "pathParams": [
      "document-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_email_notification_config",
    "description": "Get Email Notification Config",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/notifications/email-config",
    "pathParams": [],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_fixed_rate_quote",
    "description": "Get Fixed Rate Quote",
    "inputSchema": {
      "type": "object",
      "properties": {
        "inputCurrency": {
          "type": "string",
          "description": "Input currency code (e.g., \"BRL\")"
        },
        "inputPaymentMethod": {
          "type": "string",
          "description": "Input payment method"
        },
        "inputAmount": {
          "type": "string",
          "description": "Input amount"
        },
        "outputCurrency": {
          "type": "string",
          "description": "Output currency code (e.g., \"USD\")"
        },
        "outputPaymentMethod": {
          "type": "string",
          "description": "Output payment method"
        },
        "outputAmount": {
          "type": "string",
          "description": "Output amount"
        },
        "markupFloatingFee": {
          "type": "string",
          "description": "Markup floating fee percentage"
        },
        "markupInputFixedFee": {
          "type": "string",
          "description": "Markup input fixed fee"
        },
        "markupOutputFixedFee": {
          "type": "string",
          "description": "Markup output fixed fee"
        },
        "markupCurrency": {
          "type": "string",
          "description": "Markup currency"
        },
        "inputThirdParty": {
          "type": "boolean",
          "description": "Whether input is third party"
        },
        "outputThirdParty": {
          "type": "boolean",
          "description": "Whether output is third party"
        },
        "outputBrCode": {
          "type": "string",
          "description": "Output BR code"
        },
        "ticketRefundId": {
          "type": "string",
          "description": "Ticket refund ID"
        },
        "blockchainSendMethod": {
          "type": "string",
          "description": "Blockchain send method"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "inputCurrency",
        "inputPaymentMethod",
        "outputCurrency",
        "outputPaymentMethod",
        "inputThirdParty",
        "outputThirdParty"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/quote/fixed-rate",
    "pathParams": [],
    "queryParams": [
      "inputCurrency",
      "inputPaymentMethod",
      "inputAmount",
      "outputCurrency",
      "outputPaymentMethod",
      "outputAmount",
      "markupFloatingFee",
      "markupInputFixedFee",
      "markupOutputFixedFee",
      "markupCurrency",
      "inputThirdParty",
      "outputThirdParty",
      "outputBrCode",
      "ticketRefundId",
      "blockchainSendMethod",
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_limits",
    "description": "Get Limits",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID (optional)"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/limits",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_metadata",
    "description": "Get Metadata",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/metadata",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_payment_session_by_id",
    "description": "Get Payment Session by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "payment-session-id": {
          "type": "string",
          "description": "ID of the payment session"
        }
      },
      "additionalProperties": false,
      "required": [
        "payment-session-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/payment-session/{payment-session-id}",
    "pathParams": [
      "payment-session-id"
    ],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_payment_session_by_id_private",
    "description": "Get Payment Session by ID (Private)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "payment-session-id": {
          "type": "string",
          "description": "ID of the payment session"
        }
      },
      "additionalProperties": false,
      "required": [
        "payment-session-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/payment-session/{payment-session-id}",
    "pathParams": [
      "payment-session-id"
    ],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_payment_session_fixed_quote",
    "description": "Get Payment Session Fixed Quote",
    "inputSchema": {
      "type": "object",
      "properties": {
        "payment-session-id": {
          "type": "string",
          "description": "ID of the payment session"
        },
        "inputCurrency": {
          "type": "string",
          "description": "Input currency code (e.g., \"BRL\")"
        },
        "inputPaymentMethod": {
          "type": "string",
          "description": "Input payment method (e.g., \"PIX\")"
        },
        "inputAmount": {
          "type": "string",
          "description": "Input amount (if outputAmount is not provided)"
        },
        "outputAmount": {
          "type": "string",
          "description": "Output amount (if inputAmount is not provided)"
        },
        "inputThirdParty": {
          "type": "boolean",
          "description": "Whether input is third party"
        },
        "outputThirdParty": {
          "type": "boolean",
          "description": "Whether output is third party"
        }
      },
      "additionalProperties": false,
      "required": [
        "payment-session-id",
        "inputCurrency",
        "inputPaymentMethod",
        "inputThirdParty",
        "outputThirdParty"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/payment-session/{payment-session-id}/fixed-quote",
    "pathParams": [
      "payment-session-id"
    ],
    "queryParams": [
      "inputCurrency",
      "inputPaymentMethod",
      "inputAmount",
      "outputAmount",
      "inputThirdParty",
      "outputThirdParty"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_payment_session_preferences",
    "description": "Get Payment Session Preferences",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/payment-session/preferences",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_payment_session_ticket",
    "description": "Get Payment Session Ticket",
    "inputSchema": {
      "type": "object",
      "properties": {
        "payment-session-id": {
          "type": "string",
          "description": "ID of the payment session"
        }
      },
      "additionalProperties": false,
      "required": [
        "payment-session-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/payment-session/{payment-session-id}/get-ticket",
    "pathParams": [
      "payment-session-id"
    ],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_payment_sessions",
    "description": "Get Payment Sessions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "createdAfter": {
          "type": "integer",
          "description": "Filter sessions created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter sessions created before timestamp"
        },
        "externalId": {
          "type": "string",
          "description": "Filter by external ID"
        },
        "ticketStatus": {
          "type": "string",
          "description": "Filter by ticket status"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/payment-session",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "createdAfter",
      "createdBefore",
      "externalId",
      "ticketStatus",
      "cursor"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_pix_info",
    "description": "Get PIX Info",
    "inputSchema": {
      "type": "object",
      "properties": {
        "pixKey": {
          "type": "string",
          "description": "PIX key to query"
        },
        "decodePixKey": {
          "type": "boolean",
          "description": "Whether to decode PIX key"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/bank-accounts/brl/pix-info",
    "pathParams": [],
    "queryParams": [
      "pixKey",
      "decodePixKey",
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_public_key",
    "description": "Get Public Key",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/public-key",
    "pathParams": [],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": true
  },
  {
    "name": "avenia_get_statement",
    "description": "Get Statement",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "createdAfter": {
          "type": "integer",
          "description": "Filter logs created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter logs created before timestamp"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/statement",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "createdAfter",
      "createdBefore",
      "cursor"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_static_br_code",
    "description": "Get Static BR Code",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "amount": {
          "type": "string",
          "description": "Amount for the QR code"
        },
        "referenceLabel": {
          "type": "string",
          "description": "Reference label"
        },
        "additionalData": {
          "type": "string",
          "description": "Additional data"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/bank-accounts/brl/static-br-code",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "amount",
      "referenceLabel",
      "additionalData"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_sub_account_by_id",
    "description": "Get Sub-Account by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "sub-account-id": {
          "type": "string",
          "description": "ID of the sub-account"
        }
      },
      "additionalProperties": false,
      "required": [
        "sub-account-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/sub-accounts/{sub-account-id}",
    "pathParams": [
      "sub-account-id"
    ],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_sub_accounts",
    "description": "Get Sub-Accounts",
    "inputSchema": {
      "type": "object",
      "properties": {
        "createdAfter": {
          "type": "integer",
          "description": "Filter sub-accounts created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter sub-accounts created before timestamp"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        },
        "accountType": {
          "type": "string",
          "description": "Filter by account type"
        },
        "name": {
          "type": "string",
          "description": "Filter by name"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/sub-accounts",
    "pathParams": [],
    "queryParams": [
      "createdAfter",
      "createdBefore",
      "cursor",
      "accountType",
      "name"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_ticket_by_id",
    "description": "Get Ticket by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ticket-id": {
          "type": "string",
          "description": "ID of the ticket"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "ticket-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/tickets/{ticket-id}",
    "pathParams": [
      "ticket-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_ticket_receipt",
    "description": "Get Ticket Receipt",
    "inputSchema": {
      "type": "object",
      "properties": {
        "ticket-id": {
          "type": "string",
          "description": "ID of the ticket"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "ticket-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/account/tickets/{ticket-id}/receipt",
    "pathParams": [
      "ticket-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_tickets",
    "description": "Get Tickets",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "createdAfter": {
          "type": "integer",
          "description": "Filter tickets created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter tickets created before timestamp"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        },
        "status": {
          "type": "string",
          "description": "Filter by status"
        },
        "inputCurrency": {
          "type": "string",
          "description": "Filter by input currency"
        },
        "inputPaymentMethod": {
          "type": "string",
          "description": "Filter by input payment method"
        },
        "outputCurrency": {
          "type": "string",
          "description": "Filter by output currency"
        },
        "outputPaymentMethod": {
          "type": "string",
          "description": "Filter by output payment method"
        },
        "endToEndId": {
          "type": "string",
          "description": "Filter by end-to-end ID"
        },
        "externalId": {
          "type": "string",
          "description": "Filter by external ID"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/account/tickets",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "createdAfter",
      "createdBefore",
      "cursor",
      "status",
      "inputCurrency",
      "inputPaymentMethod",
      "outputCurrency",
      "outputPaymentMethod",
      "endToEndId",
      "externalId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_w8_ben_by_id",
    "description": "Get W8-BEN by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "w8ben-id": {
          "type": "string",
          "description": "ID of the W8-BEN form"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "w8ben-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/kyc/w8ben/{w8ben-id}",
    "pathParams": [
      "w8ben-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_w8_ben_forms",
    "description": "Get W8-BEN Forms",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/kyc/w8ben",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_webhook_by_id",
    "description": "Get Webhook by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "webhook-id": {
          "type": "string",
          "description": "ID of the webhook"
        }
      },
      "additionalProperties": false,
      "required": [
        "webhook-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/notifications/webhooks/{webhook-id}",
    "pathParams": [
      "webhook-id"
    ],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_webhook_event_by_id",
    "description": "Get Webhook Event by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "event-id": {
          "type": "string",
          "description": "ID of the event"
        }
      },
      "additionalProperties": false,
      "required": [
        "event-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/notifications/webhooks/events/{event-id}",
    "pathParams": [
      "event-id"
    ],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_webhook_event_submission_by_id",
    "description": "Get Webhook Event Submission by ID",
    "inputSchema": {
      "type": "object",
      "properties": {
        "attempt-id": {
          "type": "string",
          "description": "ID of the event submission"
        },
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        }
      },
      "additionalProperties": false,
      "required": [
        "attempt-id"
      ]
    },
    "method": "GET",
    "pathTemplate": "/v2/notifications/webhooks/attempts/{attempt-id}",
    "pathParams": [
      "attempt-id"
    ],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_webhook_event_submissions",
    "description": "Get Webhook Event Submissions",
    "inputSchema": {
      "type": "object",
      "properties": {
        "createdAfter": {
          "type": "integer",
          "description": "Filter submissions created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter submissions created before timestamp"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        },
        "webhookEventId": {
          "type": "string",
          "description": "Filter by webhook event ID"
        },
        "unackedOnly": {
          "type": "boolean",
          "description": "Filter unacknowledged submissions only"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/notifications/webhooks/attempts",
    "pathParams": [],
    "queryParams": [
      "createdAfter",
      "createdBefore",
      "cursor",
      "webhookEventId",
      "unackedOnly"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_webhook_events",
    "description": "Get Webhook Events",
    "inputSchema": {
      "type": "object",
      "properties": {
        "createdAfter": {
          "type": "integer",
          "description": "Filter events created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter events created before timestamp"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        },
        "subscription": {
          "type": "string",
          "description": "Filter by subscription type (KYC, WITHDRAW, DEPOSIT)"
        },
        "dataId": {
          "type": "string",
          "description": "Filter by ID of the data event (e.g., ticket ID, KYC attempt ID)"
        },
        "subAccountId": {
          "type": "string",
          "description": "Filter by sub-account ID"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/notifications/webhooks/events",
    "pathParams": [],
    "queryParams": [
      "createdAfter",
      "createdBefore",
      "cursor",
      "subscription",
      "dataId",
      "subAccountId"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_get_webhooks",
    "description": "Get Webhooks",
    "inputSchema": {
      "type": "object",
      "properties": {},
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/notifications/webhooks",
    "pathParams": [],
    "queryParams": [],
    "bodyUnwrap": false,
    "skipAuth": false
  },
  {
    "name": "avenia_import_token",
    "description": "Import Token",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "importToken": {
              "type": "string"
            }
          },
          "required": [
            "importToken"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/kyc/import-token",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_list_documents",
    "description": "List Documents",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "createdAfter": {
          "type": "integer",
          "description": "Filter documents created after timestamp"
        },
        "createdBefore": {
          "type": "integer",
          "description": "Filter documents created before timestamp"
        },
        "documentType": {
          "type": "string",
          "description": "Filter by document type"
        },
        "cursor": {
          "type": "string",
          "description": "Cursor for pagination"
        }
      },
      "additionalProperties": false
    },
    "method": "GET",
    "pathTemplate": "/v2/documents",
    "pathParams": [],
    "queryParams": [
      "subAccountId",
      "createdAfter",
      "createdBefore",
      "documentType",
      "cursor"
    ],
    "bodyUnwrap": false,
    "skipAuth": false
  },
      {
    "name": "avenia_new_level_1_api",
    "description": "New Level 1 (API)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "sandboxReject": {
              "type": "boolean"
            },
            "fullName": {
              "type": "string"
            },
            "dateOfBirth": {
              "type": "string"
            },
            "countryOfTaxId": {
              "type": "string"
            },
            "taxIdNumber": {
              "type": "string"
            },
            "email": {
              "type": "string"
            },
            "phone": {
              "type": "string"
            },
            "uploadedSelfieId": {
              "type": "string"
            },
            "uploadedDocumentId": {
              "type": "string"
            },
            "country": {
              "type": "string"
            },
            "state": {
              "type": "string"
            },
            "city": {
              "type": "string"
            },
            "zipCode": {
              "type": "string"
            },
            "streetAddress": {
              "type": "string"
            }
          },
          "required": [
            "sandboxReject",
            "fullName",
            "dateOfBirth",
            "countryOfTaxId",
            "taxIdNumber",
            "email",
            "phone",
            "uploadedSelfieId",
            "uploadedDocumentId",
            "country",
            "state",
            "city",
            "zipCode",
            "streetAddress"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/kyc/new-level-1/api",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_new_level_1_web_sdk",
    "description": "New Level 1 (Web SDK)",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "redirectUrl": {
              "type": "string"
            }
          },
          "required": [
            "redirectUrl"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/kyc/new-level-1/web-sdk",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
    {
    "name": "avenia_register_webhook",
    "description": "Register Webhook",
    "inputSchema": {
      "type": "object",
      "properties": {
        "body": {
          "type": "object",
          "properties": {
            "webhookUrl": {
              "type": "string"
            },
            "subscriptions": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "webhookUrl",
            "subscriptions"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/notifications/webhooks",
    "pathParams": [],
    "queryParams": [],
    "bodyUnwrap": true,
    "skipAuth": false
  },
      {
    "name": "avenia_save_payment_session_preferences",
    "description": "Save Payment Session Preferences",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "externalId": {
              "type": "string"
            },
            "paymentOptions": {
              "type": "array",
              "items": {
                "type": "object",
                "properties": {
                  "inputCurrency": {
                    "type": "string"
                  },
                  "inputPaymentMethod": {
                    "type": "string"
                  },
                  "outputCurrency": {
                    "type": "string"
                  },
                  "outputPaymentMethod": {
                    "type": "string"
                  }
                },
                "required": [
                  "inputCurrency",
                  "inputPaymentMethod",
                  "outputCurrency",
                  "outputPaymentMethod"
                ]
              }
            },
            "outputCurrency": {
              "type": "string"
            },
            "linkExpirationValue": {
              "type": "integer"
            },
            "linkExpirationUnit": {
              "type": "string"
            },
            "appearance": {
              "type": "object",
              "properties": {
                "primaryColor": {
                  "type": "string"
                },
                "logoUrl": {
                  "type": "string"
                }
              },
              "required": [
                "primaryColor",
                "logoUrl"
              ]
            }
          },
          "required": [
            "externalId",
            "paymentOptions",
            "outputCurrency",
            "linkExpirationValue",
            "linkExpirationUnit",
            "appearance"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/account/payment-session/preferences",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
      {
    "name": "avenia_update_webhook",
    "description": "Update Webhook",
    "inputSchema": {
      "type": "object",
      "properties": {
        "body": {
          "type": "object",
          "properties": {
            "webhookId": {
              "type": "string"
            },
            "webhookUrl": {
              "type": "string"
            },
            "subscriptions": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "webhookId",
            "webhookUrl",
            "subscriptions"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "PATCH",
    "pathTemplate": "/v2/notifications/webhooks",
    "pathParams": [],
    "queryParams": [],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_update_webhook_event_submission",
    "description": "Update Webhook Event Submission",
    "inputSchema": {
      "type": "object",
      "properties": {
        "body": {
          "type": "object",
          "properties": {
            "ids": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "ids"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "PATCH",
    "pathTemplate": "/v2/notifications/webhooks/attempts",
    "pathParams": [],
    "queryParams": [],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_upload_document",
    "description": "Upload Document",
    "inputSchema": {
      "type": "object",
      "properties": {
        "subAccountId": {
          "type": "string",
          "description": "Sub-account ID"
        },
        "body": {
          "type": "object",
          "properties": {
            "documentType": {
              "type": "string"
            },
            "isDoubleSided": {
              "type": "boolean"
            }
          },
          "required": [
            "documentType",
            "isDoubleSided"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "POST",
    "pathTemplate": "/v2/documents",
    "pathParams": [],
    "queryParams": [
      "subAccountId"
    ],
    "bodyUnwrap": true,
    "skipAuth": false
  },
  {
    "name": "avenia_upsert_email_notification_config",
    "description": "Upsert Email Notification Config",
    "inputSchema": {
      "type": "object",
      "properties": {
        "body": {
          "type": "object",
          "properties": {
            "email": {
              "type": "string"
            },
            "subscriptions": {
              "type": "array",
              "items": {
                "type": "string"
              }
            }
          },
          "required": [
            "email",
            "subscriptions"
          ],
          "description": " (request body)"
        }
      },
      "additionalProperties": false,
      "required": [
        "body"
      ]
    },
    "method": "PUT",
    "pathTemplate": "/v2/notifications/email-config",
    "pathParams": [],
    "queryParams": [],
    "bodyUnwrap": true,
    "skipAuth": false
  },
] as const;
