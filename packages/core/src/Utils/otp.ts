/** Default number of OTP digit slots. */
export const DEFAULT_OTP_LENGTH = 6;

/**
 * Character set accepted by an OTP field.
 */
export type OtpInputType = "numeric" | "alphanumeric";

/**
 * Result of applying a keystroke or paste to OTP digit slots.
 */
export type OtpDigitsUpdate = {
  /**
   * Digit values after the update (always `length` entries; empty string for
   * vacant slots).
   */
  digits: string[];

  /**
   * Index that should receive focus after the update, or `null` to leave focus
   * unchanged.
   */
  focusIndex: null | number;
};

/**
 * Returns whether `char` is allowed for the given OTP input type.
 */
export function isOtpCharAllowed(char: string, type: OtpInputType): boolean {
  if (char.length !== 1) {
    return false;
  }

  if (type === "numeric") {
    return /^\d$/.test(char);
  }

  return /^[a-zA-Z0-9]$/.test(char);
}

/**
 * Clamps `length` to a positive integer (minimum 1).
 */
export function resolveOtpLength(length?: number): number {
  if (length == null || !Number.isFinite(length)) {
    return DEFAULT_OTP_LENGTH;
  }

  return Math.max(1, Math.floor(length));
}

/**
 * Normalizes a raw value into a string of at most `length` allowed characters.
 */
export function normalizeOtpValue(
  value: null | string | undefined,
  length: number,
  type: OtpInputType,
): string {
  if (value == null || value === "") {
    return "";
  }

  const resolvedLength = resolveOtpLength(length);
  let result = "";

  for (const char of String(value)) {
    if (!isOtpCharAllowed(char, type)) {
      continue;
    }

    result += type === "alphanumeric" ? char.toUpperCase() : char;

    if (result.length >= resolvedLength) {
      break;
    }
  }

  return result;
}

/**
 * Splits a normalized OTP string into a fixed-length digit array.
 */
export function splitOtpValue(value: string, length: number): string[] {
  const resolvedLength = resolveOtpLength(length);
  const digits = Array.from({ length: resolvedLength }, () => "");

  for (let index = 0; index < resolvedLength; index += 1) {
    digits[index] = value[index] ?? "";
  }

  return digits;
}

/**
 * Joins digit slots into a single OTP string (empty slots are omitted from the
 * middle only when trailing — vacant holes keep preceding filled digits).
 */
export function joinOtpDigits(digits: readonly string[]): string {
  return digits.join("");
}

/**
 * Applies a single-character (or empty) edit at `index`.
 */
export function applyOtpInput(options: {
  digits: readonly string[];
  index: number;
  input: string;
  type: OtpInputType;
}): OtpDigitsUpdate {
  const { type, index, input, digits } = options;
  const length = digits.length;
  const next = [...digits];

  if (index < 0 || index >= length) {
    return { digits: next, focusIndex: null };
  }

  if (input === "") {
    next[index] = "";
    return { digits: next, focusIndex: index };
  }

  const chars = [...input].filter((char) => isOtpCharAllowed(char, type));

  if (chars.length === 0) {
    return { digits: next, focusIndex: null };
  }

  if (chars.length === 1) {
    next[index] = type === "alphanumeric" ? chars[0]!.toUpperCase() : chars[0]!;
    const focusIndex = index < length - 1 ? index + 1 : index;
    return { focusIndex, digits: next };
  }

  return applyOtpPaste({ type, index, digits, pasted: chars.join("") });
}

/**
 * Spreads pasted text across digit slots starting at `index`.
 */
export function applyOtpPaste(options: {
  digits: readonly string[];
  index: number;
  pasted: string;
  type: OtpInputType;
}): OtpDigitsUpdate {
  const { type, index, digits, pasted } = options;
  const length = digits.length;
  const next = [...digits];
  const start = Math.min(Math.max(index, 0), length - 1);
  const normalized = normalizeOtpValue(pasted, length - start, type);

  if (normalized.length === 0) {
    return { digits: next, focusIndex: null };
  }

  for (let offset = 0; offset < normalized.length; offset += 1) {
    next[start + offset] = normalized[offset]!;
  }

  const lastFilled = start + normalized.length - 1;
  const focusIndex = lastFilled < length - 1 ? lastFilled + 1 : lastFilled;

  return { focusIndex, digits: next };
}

/**
 * Handles Backspace / ArrowLeft / ArrowRight navigation between OTP slots.
 * Returns `null` when the key is not handled.
 */
export function applyOtpKeyNavigation(options: {
  digits: readonly string[];
  index: number;
  key: string;
}): null | OtpDigitsUpdate {
  const { key, index, digits } = options;
  const length = digits.length;

  if (key === "Backspace") {
    const next = [...digits];

    if (next[index]) {
      next[index] = "";
      return { digits: next, focusIndex: index };
    }

    if (index > 0) {
      next[index - 1] = "";
      return { digits: next, focusIndex: index - 1 };
    }

    return { digits: next, focusIndex: index };
  }

  if (key === "ArrowLeft" && index > 0) {
    return { digits: [...digits], focusIndex: index - 1 };
  }

  if (key === "ArrowRight" && index < length - 1) {
    return { digits: [...digits], focusIndex: index + 1 };
  }

  if (key === "Delete") {
    const next = [...digits];
    next[index] = "";
    return { digits: next, focusIndex: index };
  }

  return null;
}

/**
 * Returns whether `value` fills every OTP slot.
 */
export function isOtpComplete(
  value: string,
  length: number = DEFAULT_OTP_LENGTH,
): boolean {
  return value.length === resolveOtpLength(length);
}
