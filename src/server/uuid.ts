/**
 * Universal Unique IDentifier (UUID)
 */

/**
 * Validate Universal Unique IDentifier (UUID).
 *
 * Check if a given Universal Unique IDentifier (UUID) string is valid
 * according to RFC 4122 and RFC 9562.
 *
 * @param {string} uuid - The UUID string to validate.
 * @param {boolean} isNil - Whether to allow Nil UUID (all zero).
 * @returns {boolean} True if the UUID is valid, false otherwise.
 */
function isValid(uuid: string, isNil: boolean = false): boolean {
  // UUID version 1-8 with RFC 4122 and RFC 9562
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
  // Nil UUID, all zero (RFC 9562, Section 5.9)
  const uuidNilRegex = /^0{8}-0{4}-0{4}-0{4}-0{12}$/i

  return uuidRegex.test(uuid) || (isNil && uuidNilRegex.test(uuid));
};

/**
 * Universal Unique IDentifier (UUID) Version 7
 *
 * Generate an RFC 9562 compliant UUID V7 string.
 *
 *  0                   1                   2                   3
 *  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |                           unix_ts_ms                          |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |          unix_ts_ms           |  ver  |       rand_a          |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |var|                        rand_b                             |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 * |                            rand_b                             |
 * +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+
 *
 * - 48-bits unix_ts_ms : big-endian unsigned Unix timestamp in milliseconds
 * -  4-bits ver        : version, set to 0b0111 (7)
 * - 12 bits rand_a     : pseudorandom data to provide uniqueness
 * -  2-bits var        : variant, set to 0b10
 * - 62 bits rand_b     : pseudorandom data to provide uniqueness
 *
 * @returns {string} The generated UUID V7 string.
 */
function v7(): string {
  const bufferArray = new Uint8Array(16);

  // Fill bytes 6..15 with cryptographically strong randomness
  // The `subarray` is a view over the same buffer (writes in place)
  crypto.getRandomValues(bufferArray.subarray(6));

  const view = new DataView(bufferArray.buffer);

  // 48-bit big-endian unsigned Unix timestamp in milliseconds into bytes 0..5.
  // Split into top 16 bits + bottom 32 bits.
  // (JavaScript bit operations are 32-bit only)
  const ts = Date.now();
  view.setUint16(0, Math.floor(ts / 2 ** 32)); // bits 47..32
  view.setUint32(2, ts >>> 0); // bits 31..0

  // Overwrite the high nibble of byte 6 with the version (0b0111 = 7).
  view.setUint8(6, (view.getUint8(6) & 0x0f) | 0x70);
  // Overwrite the top two bits of byte 8 with the variant (0b10).
  view.setUint8(8, (view.getUint8(8) & 0x3f) | 0x80);

  return format(bufferArray);
}

/**
 * Format Universal Unique IDentifier (UUID) Version 7
 *
 * Format 16 bytes as a canonical lowercase 8-4-4-4-12 hex string.
 *
 * @param {Uint8Array} byteArray - The byte array to format.
 * @returns {string} The formatted UUID string.
 */
function format(byteArray: Uint8Array): string {
  let hex = "";

  for (const byte of byteArray) {
    hex += byte.toString(16).padStart(2, "0");
  }

  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20),
  ].join("-");
}

export {
  isValid,
  v7
};

