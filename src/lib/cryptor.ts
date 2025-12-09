import { createCipheriv, createDecipheriv, randomBytes } from 'crypto';

/**
 * Encrypter class for AES-192-CBC encryption/decryption
 * Used for encrypting sensitive data before storage
 */
export class Encrypter {
    private algorithm = 'aes-192-cbc';
    private key: Buffer;

    constructor(encryptionKey?: string) {
        // Use provided key or get from environment
        const keyString = encryptionKey || process.env.ENCRYPTION_KEY || 'default-key-please-change';

        // Create a 24-byte key for AES-192
        this.key = Buffer.from(keyString.padEnd(24, '0').substring(0, 24));
    }

    /**
     * Encrypt a string value
     * @param text - Plain text to encrypt
     * @returns Encrypted string in format: iv:encryptedData
     */
    encrypt(text: string): string {
        try {
            // Generate random initialization vector
            const iv = randomBytes(16);

            // Create cipher
            const cipher = createCipheriv(this.algorithm, this.key, iv);

            // Encrypt the text
            let encrypted = cipher.update(text, 'utf8', 'hex');
            encrypted += cipher.final('hex');

            // Return iv and encrypted data separated by ':'
            return `${iv.toString('hex')}:${encrypted}`;
        } catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    /**
     * Decrypt an encrypted string
     * @param encryptedText - Encrypted string in format: iv:encryptedData
     * @returns Decrypted plain text
     */
    decrypt(encryptedText: string): string {
        try {
            // Split iv and encrypted data
            const parts = encryptedText.split(':');
            if (parts.length !== 2) {
                throw new Error('Invalid encrypted text format');
            }

            const iv = Buffer.from(parts[0], 'hex');
            const encryptedData = parts[1];

            // Create decipher
            const decipher = createDecipheriv(this.algorithm, this.key, iv);

            // Decrypt the data
            let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
            decrypted += decipher.final('utf8');

            return decrypted;
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }
}

// Export a singleton instance
export const encrypter = new Encrypter();
