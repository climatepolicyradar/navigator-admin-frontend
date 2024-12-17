/**
 * Converts an empty string or undefined/null to null.
 * @param value - The value to check and convert.
 * @returns The original value if it's not empty, otherwise null.
 */
export const convertEmptyToNull = (
  value: string | undefined | null,
): string | null => {
  return !value || value.trim() === '' ? null : value
}
