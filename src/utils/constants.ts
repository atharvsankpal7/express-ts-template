/**
 * Regular expression for validating usernames.
 *
 * The username must:
 * - Be between 8 and 31 characters long.
 * - Only contain alphanumeric characters, dots (.), and underscores (_).
 * - Not contain consecutive dots or underscores.
 * - Not start or end with a dot or underscore.
 */
export const USERNAME_REGEX =
  /^(?=[a-zA-Z0-9._]{8,31}$)(?!.*[_.]{2})[^_.].*[^_.]$^(?=[a-zA-Z0-9._]{8,31}$)(?!.*[_.]{2})[^_.].*[^_.]$/

/**
 * Regular expression to validate full names.
 *
 * This regex allows for names that consist of:
 * - One or more letters (Unicode property \p{L})
 * - Optional hyphens (Unicode property \p{Pd}), spaces (Unicode property \p{Zs}), or apostrophes (')
 * - Ensures that the name starts and ends with a letter.
 * - Be between 3 and 63 characters long.
 *
 * It matches:
 * - "John Doe"
 * - "O'Connor"
 * - "Anne-Marie"
 *
 * It does not match:
 * - "12345"
 * - "John  "
 */
export const FULLNAME_REGEX =
  /^(?=.{3,63}$)(?=.*[\\p{L}])[\\p{L}][\\p{L}\\p{Pd}\\p{Zs}']*[\\p{L}]$|^(?=.{3,63}$)[\\p{L}]+$/

/**
 * A regular expression that validates passwords.
 * The password must:
 * - Be between 8 and 63 characters long
 * - Contain at least one lowercase letter
 * - Contain at least one uppercase letter
 * - Contain at least one digit
 * - Contain at least one special character
 */
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,63}$/
