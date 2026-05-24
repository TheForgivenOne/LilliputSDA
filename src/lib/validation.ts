export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validateRequired(value: string, maxLength?: number): boolean {
  if (!value || !value.trim()) return false;
  if (maxLength && value.length > maxLength) return false;
  return true;
}

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/;
  return phoneRegex.test(phone);
}

export function validatePassword(password: string): boolean {
  if (password.length < 8 || password.length > 100) return false;

  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);

  return hasUppercase && hasLowercase && hasNumber;
}

export interface ValidationRule<T> {
  validate: (value: T) => boolean;
  message: string;
}

export function validateForm<T extends Record<string, unknown>>(
  data: T,
  rules: Record<string, ValidationRule<unknown>[]>
): Record<string, string> {
  const errors: Record<string, string> = {};
  
  for (const field in rules) {
    const fieldRules = rules[field];
    for (const rule of fieldRules) {
      if (!rule.validate(data[field])) {
        errors[field] = rule.message;
        break;
      }
    }
  }
  
  return errors;
}
