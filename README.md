# Gonka Wallet SDK

> JavaScript/TypeScript SDK for interacting with the Gonka blockchain

[![npm version](https://img.shields.io/npm/v/@gonka-ai/wallet.svg)](https://www.npmjs.com/package/@gonka-ai/wallet)

A powerful and easy-to-use SDK for building applications on the Gonka blockchain. Built on top of [CosmJS](https://github.com/cosmos/cosmjs), this SDK provides a simplified interface for wallet management, account queries, and transaction broadcasting.

## Features

- 🔐 **Wallet Management** - Create, import, and manage wallets with mnemonic phrases or seeds
- 💰 **Account Queries** - Check balances and account information
- 📤 **Transaction Broadcasting** - Send tokens with automatic gas estimation
- 🔑 **BIP39 Support** - Full support for BIP39 mnemonic phrases with optional passphrases
- 🛣️ **Custom HD Paths** - Support for custom derivation paths
- ⚡ **TypeScript First** - Full type safety with TypeScript support
- 🔄 **CosmJS Compatible** - Built on the industry-standard CosmJS library

## Installation

```bash
npm install @gonka-ai/wallet
```

```bash
yarn add @gonka-ai/wallet
```

```bash
pnpm add @gonka-ai/wallet
```

## Quick Start

```typescript
import { GonkaWalletSDK } from '@gonka-ai/wallet';

// Connect to the Gonka network
const sdk = await GonkaWalletSDK.connect({
  url: 'http://node1.gonka.ai',
  chainId: 'gonka-mainnet'
});

// Create a new wallet
const wallet = await sdk.wallet.create();
console.log('Address:', wallet.data.address);
console.log('Mnemonic:', wallet.data.mnemonic);

// Check balance
const balance = await sdk.account.balance(wallet.data.address);
console.log('Balance:', balance.data.amountGonka, 'GONKA');
```

## API Reference

### Connection

#### `GonkaWalletSDK.connect(options)`

Connect to the Gonka blockchain network.

**Parameters:**

```typescript
{
  url?: string;           // RPC URL (default: 'http://node1.gonka.ai')
  rpcPort?: number;       // RPC port (default: 26657)
  apiPort?: number;       // API port (default: 8000)
  chainId?: string;       // Chain ID (default: 'gonka-mainnet')
  denom?: string;         // Token denomination (default: 'ngonka')
  gasPrice?: string;      // Gas price (default: '0.025ngonka')
}
```

**Example:**

```typescript
const sdk = await GonkaWalletSDK.connect({
  url: 'http://node2.gonka.ai',
  chainId: 'gonka-mainnet',
  gasPrice: '0.025ngonka'
});
```

### Wallet Module

#### `wallet.create()`

Generate a new wallet with a 24-word mnemonic phrase.

**Returns:** `Promise<GonkaWallet>`

```typescript
const wallet = await sdk.wallet.create();
// {
//   success: true,
//   data: {
//     mnemonic: "word1 word2 ... word24",
//     address: "gonka1..."
//   }
// }
```

#### `wallet.fromMnemonic(mnemonic)`

Import a wallet from a BIP39 mnemonic phrase.

**Parameters:**
- `mnemonic` (string): The 12 or 24-word mnemonic phrase

**Returns:** `Promise<GonkaWallet>`

**Example:**

```typescript
const wallet = await sdk.wallet.fromMnemonic(
  'ladder invest pear illness second square cruel net holiday save lounge cheese teach unfair pelican step flat please engine work talk loop venture sweet'
);

console.log('Address:', wallet.data.address);
console.log('Signer:', wallet.data.signer); // OfflineSigner ready to use
```

#### `wallet.fromPrivateKey(privateKey)`

Import a wallet from a private key (hex-encoded).

**Parameters:**
- `privateKey` (string): 32-byte private key in hexadecimal format (64 characters)

**Returns:** `Promise<GonkaWallet>`

**Example:**

```typescript
const wallet = await sdk.wallet.fromPrivateKey(
  'a1b2c3d4e5f6...' // 64-character hex string
);

console.log('Address:', wallet.data.address);
```

#### `wallet.mnemonicToPrivateKey(mnemonic)`

Convert a mnemonic phrase to a private key.

**Parameters:**
- `mnemonic` (string): The 12 or 24-word mnemonic phrase

**Returns:** `Promise<string>` - Private key as hex string

**Example:**

```typescript
const privateKey = await sdk.wallet.mnemonicToPrivateKey(
  'ladder invest pear illness...'
);

console.log('Private Key:', privateKey); // 64-character hex string
```

#### `wallet.getSigner(value)`

Automatically detect the input type and return an appropriate signer.

**Parameters:**
- `value` (string): Can be either a mnemonic phrase (12/24 words) or a private key (64 hex chars)

**Returns:** `Promise<OfflineSigner>`

**Example:**

```typescript
// Works with mnemonic
const signer1 = await sdk.wallet.getSigner(
  'ladder invest pear illness...'
);

// Works with private key
const signer2 = await sdk.wallet.getSigner(
  'a1b2c3d4e5f6...'
);

// Use the signer with transactions
const result = await sdk.tx.send(signer1, recipient, amount);
```

### Account Module

#### `account.balance(address)`

Query the balance of a Gonka address.

**Parameters:**
- `address` (string): Bech32 Gonka address (gonka1...)

**Returns:** `Promise<AccountBalance>`

**Example:**

```typescript
const balance = await sdk.account.balance('gonka1...');
console.log(balance.data);
// {
//   address: "gonka1...",
//   denom: "ngonka",
//   amount: "1000000000",      // in ngonka (nano-gonka)
//   amountGonka: "1.0"         // in GONKA
// }
```

### Transaction Module

#### `tx.send(from, to, amount, options?)`

Send tokens from one address to another.

**Parameters:**
- `from` (OfflineSigner): Signer for the sending address
- `to` (string): Recipient's Gonka address
- `amount` (string): Amount to send in ngonka (1 GONKA = 1,000,000,000 ngonka)
- `options` (optional):
  - `memo` (string): Transaction memo
  - `gasPrice` (string): Custom gas price (e.g., '0.025ngonka')

**Returns:** `Promise<TxSendResults>`

**Example:**

```typescript
// Create a signer from mnemonic or private key
const signer = await sdk.wallet.getSigner(
  'your mnemonic phrase or private key here'
);

// Send 1 GONKA (1,000,000,000 ngonka)
const result = await sdk.tx.send(
  signer,
  'gonka1recipient...',
  '1000000000',
  { memo: 'Payment for services' }
);

console.log('Transaction Hash:', result.data.txHash);
console.log('Block Height:', result.data.height);
console.log('Gas Used:', result.data.gasUsed);
```

#### `tx.details(txHash)`

Query the status and details of a transaction.

**Parameters:**
- `details` (string): Transaction hash

**Returns:** `Promise<TxStatusResults>`

**Example:**

```typescript
const status = await sdk.tx.details('ABC123...');
if (status.success) {
  console.log('Status:', status.data.code === 0 ? 'Success' : 'Failed');
  console.log('Height:', status.data.height);
  console.log('Events:', status.data.events);
}
```

## Utility Functions

### Denomination Conversion

```typescript
import { toNgonka, fromNgonka } from '@gonka-ai/wallet';

// Convert GONKA to ngonka
const ngonka = toNgonka('1.5');  // '1500000000'

// Convert ngonka to GONKA
const gonka = fromNgonka('1500000000');  // '1.5'
```

## Advanced Usage

### Working with Private Keys

```typescript
// Import wallet from private key
const wallet = await sdk.wallet.fromPrivateKey(
  'a1b2c3d4e5f6...' // 64-character hex string
);

// Convert mnemonic to private key
const mnemonic = 'ladder invest pear illness...';
const privateKey = await sdk.wallet.mnemonicToPrivateKey(mnemonic);
console.log('Private Key:', privateKey);

// Import using the private key
const wallet2 = await sdk.wallet.fromPrivateKey(privateKey);
console.log('Address:', wallet2.data.address);
```

### Using the Automatic Signer Detection

```typescript
// Works with both mnemonic and private key
const signerFromMnemonic = await sdk.wallet.getSigner(
  'ladder invest pear illness second square cruel net...'
);

const signerFromPrivKey = await sdk.wallet.getSigner(
  'a1b2c3d4e5f6...'
);

// Both work the same way
await sdk.tx.send(signerFromMnemonic, recipient, amount);
await sdk.tx.send(signerFromPrivKey, recipient, amount);
```

### Custom Gas Estimation

```typescript
// Send with custom gas price
const result = await sdk.tx.send(
  signer,
  recipient,
  amount,
  { gasPrice: '0.03ngonka' }
);
```

### Error Handling

```typescript
try {
  const wallet = await sdk.wallet.fromMnemonic(mnemonic);
  const balance = await sdk.account.balance(wallet.data.address);
  
  if (balance.success) {
    console.log('Balance:', balance.data.amountGonka);
  }
} catch (error) {
  console.error('Operation failed:', error.message);
}
```

## Type Definitions

The SDK is fully typed. Import types for better TypeScript support:

```typescript
import type {
  GonkaWallet,
  GonkaConnectOptions,
  AccountBalance,
  TxSendResults,
  TxStatusResults,
  GonkaSigner
} from '@gonka-ai/wallet';
```

## Network Information

### Mainnet

- **Chain ID:** `gonka-mainnet`
- **RPC Endpoints:**
  - `http://node1.gonka.ai:26657`
  - `http://node2.gonka.ai:26657`
- **API Endpoints:**
  - `http://node1.gonka.ai:8000`
  - `http://node2.gonka.ai:8000`
- **Native Token:** GONKA
- **Base Denomination:** ngonka (1 GONKA = 1,000,000,000 ngonka)
- **Address Prefix:** `gonka`

## Examples

### Complete Send Transaction Example

```typescript
import { GonkaWalletSDK, toNgonka } from '@gonka-ai/wallet';

async function sendTokens() {
  // Connect to network
  const sdk = await GonkaWalletSDK.connect({
    url: 'http://node1.gonka.ai',
    chainId: 'gonka-mainnet'
  });

  // Import sender wallet
  const wallet = await sdk.wallet.fromMnemonic(
    'your mnemonic phrase here'
  );

  // Check balance
  const balance = await sdk.account.balance(wallet.data.address);
  console.log('Current balance:', balance.data.amountGonka, 'GONKA');

  // Use the signer from wallet
  const signer = wallet.data.signer;

  // Send 0.5 GONKA
  const amount = toNgonka('0.5');
  const result = await sdk.tx.send(
    signer,
    'gonka1recipient...',
    amount,
    { memo: 'Test transaction' }
  );

  console.log('✅ Transaction successful!');
  console.log('Hash:', result.data.txHash);
  console.log('Height:', result.data.height);
  
  // Query transaction status
  const status = await sdk.tx.details(result.data.txHash);
  console.log('Confirmed at height:', status.data.height);
}

sendTokens().catch(console.error);
```

### Wallet Recovery Example

```typescript
import { GonkaWalletSDK } from '@gonka-ai/wallet';

async function recoverWallet() {
  const sdk = await GonkaWalletSDK.connect({
    chainId: 'gonka-mainnet'
  });

  // Recover from mnemonic
  const wallet = await sdk.wallet.fromMnemonic(
    'your 24 word mnemonic phrase'
  );

  console.log('Recovered address:', wallet.data.address);

  // Check if wallet has balance
  const balance = await sdk.account.balance(wallet.data.address);
  console.log('Balance:', balance.data.amountGonka, 'GONKA');
}

recoverWallet().catch(console.error);
```

## Security Best Practices

1. **Never expose mnemonics or private keys** in your code or version control
2. **Use environment variables** for sensitive data:
   ```typescript
   const mnemonic = process.env.WALLET_MNEMONIC;
   const wallet = await sdk.wallet.fromMnemonic(mnemonic);
   ```
3. **Validate addresses** before sending transactions
4. **Store private keys securely** - consider using encrypted storage for production applications
5. **Test on testnet** before deploying to mainnet

## Development

```bash
# Install dependencies
pnpm install

# Build the SDK
pnpm build

# Run tests
pnpm test

# Type checking
pnpm typecheck

# Lint and format
pnpm biome:check
pnpm biome:fix
```

## Requirements

- Node.js >= 18
- TypeScript >= 5.0 (for development)

## Browser Support

This SDK works in both Node.js and modern browsers. For browser usage, make sure to use a bundler like Webpack, Vite, or Rollup.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- **Documentation:** [GitHub Repository](https://github.com/qdanik/gonka-ai-wallet)
- **Issues:** [GitHub Issues](https://github.com/qdanik/gonka-ai-wallet/issues)

## Acknowledgments

Built with [CosmJS](https://github.com/cosmos/cosmjs) - The TypeScript library for Cosmos SDK blockchains.

---

Made with ❤️ by the Gonka Community
