import crypto from "crypto";

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY;
if (!ENCRYPTION_KEY) {
  throw new Error("ENCRYPTION_KEY is not set in environment variables.");
}
const KEY_BUFFER = Buffer.from(ENCRYPTION_KEY.padEnd(32, "0").slice(0, 32));

export function decrypt(text: string): string {
  try {
    // ✅ `iv` と `encryptedData` を分離
    const [ivHex, encryptedData] = text.split(":");
    if (!ivHex || !encryptedData) {
      throw new Error("Invalid encrypted text format");
    }

    // ✅ `iv` を `Buffer` に変換
    const iv = Buffer.from(ivHex, "hex");

    // ✅ `復号`
    const decipher = crypto.createDecipheriv("aes-256-cbc", KEY_BUFFER, iv);
    let decrypted = decipher.update(encryptedData, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("Decryption Error:", error);
    throw new Error("Decryption failed");
  }
}