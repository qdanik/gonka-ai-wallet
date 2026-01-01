import { NGONKA_DECIMALS } from "@/constants";

const INTEGER_MASK = /^0+(?=\d)/;
const FRACTIONAL_MASK = /0+$/;

/**
 * Asserts that the given address has the expected "gonka" prefix
 * @param {string} address - bech32 address
 * @throws {Error} if the address does not have the expected prefix
 */
export function assertGonkaPrefix(address: string) {
  if (!address.startsWith(`gonka1`)) {
    throw new Error(`Invalid address prefix: expected gonka1... got ${address}`);
  }
}

/**
 * Converts amount from gonka (display unit) to ngonka (base unit)
 * displayGonka: can be "1", "0.5", "12.345"
 * @param {string} displayGonka
 * @param {number} decimals
 * @returns {string} - amount in ngonka (base unit)
 */
export function toNgonka(displayGonka: string, decimals: number = NGONKA_DECIMALS): string {
  const [integerPart, fractionalPart = ""] = displayGonka.split(".");
  const fractional = (fractionalPart + "0".repeat(decimals)).slice(0, decimals);

  const normalizedInt = integerPart.replace(INTEGER_MASK, "") || "0";
  const whole = normalizedInt + fractional;
  return whole.replace(INTEGER_MASK, "") || "0";
}

/**
 * Converts amount from ngonka (base unit) to gonka (display unit)
 * @param {string} amountNgonka
 * @param {number} decimals
 * @returns {string} - amount in gonka (display unit)
 */
export function fromNgonka(amountNgonka: string, decimals: number = NGONKA_DECIMALS): string {
  const value = amountNgonka.replace(INTEGER_MASK, "") || "0";
  if (value.length <= decimals) {
    const padded = value.padStart(decimals + 1, "0");
    const integerPart = padded.slice(0, -decimals);
    const fractionalPart = padded.slice(-decimals).replace(FRACTIONAL_MASK, "");
    return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
  }

  const integerPart = value.slice(0, -decimals);
  const fractionalPart = value.slice(-decimals).replace(FRACTIONAL_MASK, "");
  return fractionalPart ? `${integerPart}.${fractionalPart}` : integerPart;
}
