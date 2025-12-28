# n8n-nodes-unit

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for the **Unit embedded banking platform**, providing complete access to Unit's Banking-as-a-Service (BaaS) API. Build powerful financial automation workflows with customer onboarding, account management, payments (ACH/Wire/Check), card issuing, and real-time webhook triggers.

![n8n](https://img.shields.io/badge/n8n-community--node-orange)
![Unit](https://img.shields.io/badge/Unit-BaaS-00D4AA)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- **26 Resource Categories** - Complete coverage of Unit's banking API
- **200+ Operations** - Full CRUD operations for all resources
- **Real-time Webhooks** - Trigger node for 50+ event types
- **Sandbox Support** - Test with Unit's sandbox environment
- **Type-Safe** - Full TypeScript implementation
- **JSON:API Compliant** - Proper Unit API integration

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install**
4. Enter `n8n-nodes-unit`
5. Click **Install**

### Manual Installation

```bash
# Navigate to your n8n installation
cd ~/.n8n

# Install the node
npm install n8n-nodes-unit

# Restart n8n
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-unit.git
cd n8n-nodes-unit

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n
npm link
cd ~/.n8n
npm link n8n-nodes-unit

# Restart n8n
```

## Credentials Setup

### Unit API Credentials

| Field | Description |
|-------|-------------|
| Environment | Select Production, Sandbox, or Custom |
| API Token | Your Unit API Bearer token |
| Org ID | Your Unit organization ID |
| User Token | Optional: For customer-scoped operations |
| Webhook Secret | Optional: For webhook signature verification |

### Unit Customer Token Credentials

| Field | Description |
|-------|-------------|
| Environment | Select Production, Sandbox, or Custom |
| Customer Token | Customer-scoped API token |
| Customer ID | The customer ID for this token |
| Token Expiration | When the token expires |

## Resources & Operations

### Customer Resource
- Create Individual Customer
- Create Business Customer
- Get / Update / List Customers
- Archive / Restore Customer
- Manage Authorized Users
- Get Customer Limits & Tags
- Create Customer Tokens

### Account Resource
- Create Deposit / Credit Accounts
- Get / List / Update Accounts
- Close / Freeze / Unfreeze / Reopen
- Get Balance, Limits, Transactions
- Get Statements & End of Day Balances

### Payment Resource
- Create ACH / Book / Wire / Check Payments
- Create Batch Payments
- Get / List / Cancel Payments
- Track Payment Status

### Card Resource
- Create Individual / Business Debit Cards
- Create Virtual Cards
- Activate / Freeze / Unfreeze / Close
- Get Card Details & Transactions

### Counterparty Resource
- Create ACH / Plaid Counterparties
- Get / List / Delete Counterparties

### Statement Resource
- Get / List Statements
- Download Statement PDFs

### Webhook Resource
- Create / Update / Delete Webhooks
- Enable / Disable Webhooks

### Event Resource
- Get / List Events
- Filter by Type / Customer / Account

### Recurring Payment Resource
- Create / Get / List Recurring Payments
- Enable / Disable Recurring Payments

### Received Payment Resource
- Get / List Received Payments
- Advance Received Payments

### Reward Resource
- Create / Get / List Rewards

### Fee Resource
- Create / Reverse Fees

### Check Deposit Resource
- Create / Get / List Check Deposits

### Document Resource
- Get / List Documents

### Sandbox Resource
- Simulate ACH Payments
- Simulate Card Transactions

### Utility Resource
- Validate Routing Numbers
- Get API Status

## Trigger Node

The **Unit Trigger** node receives webhook events in real-time:

### Application Events
- `application.created`, `application.approved`, `application.denied`

### Customer Events
- `customer.created`, `customer.updated`, `customer.archived`

### Account Events
- `account.created`, `account.closed`, `account.frozen`

### Transaction Events
- `transaction.created`, `transaction.updated`

### Payment Events
- `payment.created`, `payment.sent`, `payment.returned`

### Card Events
- `card.created`, `card.activated`, `card.frozen`
- `authorization.created`, `authorization.declined`

### And many more...

## Usage Examples

### Create a Customer and Open an Account

```javascript
// Node 1: Unit - Create Individual Customer
{
  "resource": "customer",
  "operation": "createIndividual",
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "phone": "5551234567",
  "dateOfBirth": "1990-01-15",
  "ssn": "123456789",
  "address": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94105"
  }
}

// Node 2: Unit - Create Deposit Account
{
  "resource": "account",
  "operation": "createDeposit",
  "customerId": "{{ $json.data.id }}",
  "depositProduct": "checking"
}
```

### Send an ACH Payment

```javascript
{
  "resource": "payment",
  "operation": "createAch",
  "accountId": "12345",
  "counterpartyId": "67890",
  "amount": 500.00,
  "direction": "Credit",
  "description": "Payment for services"
}
```

### Issue a Debit Card

```javascript
{
  "resource": "card",
  "operation": "createIndividualDebit",
  "accountId": "12345",
  "shippingAddress": {
    "street": "123 Main St",
    "city": "San Francisco",
    "state": "CA",
    "postalCode": "94105"
  }
}
```

### Create a Counterparty for External Transfers

```javascript
{
  "resource": "counterparty",
  "operation": "create",
  "customerId": "12345",
  "name": "Acme Corp",
  "routingNumber": "021000021",
  "accountNumber": "1234567890",
  "accountType": "Checking",
  "type": "Business"
}
```

## Unit Banking Concepts

| Concept | Description |
|---------|-------------|
| **Customer** | Individual or business account holder |
| **Application** | Customer onboarding/KYC request |
| **Deposit Account** | Checking or savings account |
| **Credit Account** | Line of credit |
| **Counterparty** | External payment recipient |
| **Book Payment** | Internal transfer between Unit accounts |
| **ACH** | Automated Clearing House (1-3 day settlement) |
| **Wire** | Same-day bank transfer |
| **Authorization** | Card transaction hold |
| **Received Payment** | Incoming ACH or wire |

## Environments

| Environment | API URL | Use Case |
|-------------|---------|----------|
| Production | `https://api.unit.co` | Live banking operations |
| Sandbox | `https://api.s.unit.sh` | Testing and development |

## Error Handling

The node provides detailed error messages from the Unit API:

```javascript
// Example error response
{
  "error": "Unit API Error (invalid_routing_number): The routing number is invalid"
}
```

Enable **Continue On Fail** in node settings to handle errors gracefully.

## Security Best Practices

1. **Never log API tokens** - Use n8n's credential system
2. **Use sandbox for testing** - Don't use production for development
3. **Verify webhook signatures** - Enable signature verification
4. **Handle PII carefully** - SSN and account numbers are sensitive
5. **Use customer tokens** - For customer-facing applications
6. **Implement rate limiting** - Respect Unit's API limits

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix lint issues
npm run lint:fix
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

- **Documentation**: [Unit API Docs](https://docs.unit.co/)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-unit/issues)
- **Community**: [n8n Community Forum](https://community.n8n.io/)

## Acknowledgments

- [Unit](https://unit.co/) - For providing an excellent Banking-as-a-Service platform
- [n8n](https://n8n.io/) - For the powerful workflow automation platform
- The open-source community for inspiration and support
