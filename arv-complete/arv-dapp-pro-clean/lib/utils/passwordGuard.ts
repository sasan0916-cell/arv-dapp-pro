/**
 * lib/utils/passwordGuard.ts
 *
 * 🔐 Password Strength Validator
 * قوانین رمز عبور قوی برای کیف پول‌های ARV:
 * 1. حداقل ۱۲ کاراکتر
 * 2. حداقل ۱ حرف بزرگ (A-Z)
 * 3. حداقل ۱ حرف کوچک (a-z)
 * 4. حداقل ۱ عدد (0-9)
 * 5. حداقل ۱ نماد (!@#$%...)
 * 6. اخطار برای رمزهای رایج
 *
 * @version v6.15
 */

export interface PasswordCheck {
  ok: boolean;
  errors: string[];
  strength: 'weak' | 'medium' | 'strong' | 'very-strong';
  score: number; // 0-100
}

const COMMON_PASSWORDS = [
  'password', '12345678', '123456789', 'qwerty123', '11111111',
  'password1', 'admin123', 'letmein', 'welcome', 'iloveyou',
  '1234567890', 'qwertyuiop', '123123123', 'abc123456',
];

/**
 * بررسی قدرت رمز عبور
 */
export function checkPasswordStrength(password: string): PasswordCheck {
  const errors: string[] = [];
  let score = 0;

  // 1. طول
  if (!password) {
    return { ok: false, errors: ['رمز عبور را وارد کنید'], strength: 'weak', score: 0 };
  }
  if (password.length < 12) {
    errors.push('رمز عبور باید حداقل ۱۲ کاراکتر باشد');
  } else {
    score += 25;
  }

  // 2. حرف بزرگ
  if (!/[A-Z]/.test(password)) {
    errors.push('حداقل یک حرف بزرگ (A-Z) لازم است');
  } else {
    score += 20;
  }

  // 3. حرف کوچک
  if (!/[a-z]/.test(password)) {
    errors.push('حداقل یک حرف کوچک (a-z) لازم است');
  } else {
    score += 20;
  }

  // 4. عدد
  if (!/[0-9]/.test(password)) {
    errors.push('حداقل یک عدد (0-9) لازم است');
  } else {
    score += 20;
  }

  // 5. نماد
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~`]/.test(password)) {
    errors.push('حداقل یک نماد (!@#$%^&*...) لازم است');
  } else {
    score += 15;
  }

  // 6. رمز رایج
  const lower = password.toLowerCase();
  if (COMMON_PASSWORDS.some((c) => lower.includes(c))) {
    errors.push('این رمز بسیار رایج است — رمز دیگری انتخاب کنید');
    score = Math.max(0, score - 30);
  }

  // 7. توالی ساده (مثل 123456)
  if (/0123456789|1234567890|qwerty|asdf|abcdef/i.test(password)) {
    errors.push('رمز شامل توالی ساده است');
    score = Math.max(0, score - 20);
  }

  // 8. کاراکتر تکراری (مثل aaaaaa)
  if (/(.)\1{3,}/.test(password)) {
    errors.push('رمز نباید بیش از ۳ کاراکتر تکراری پشت سر هم داشته باشد');
    score = Math.max(0, score - 15);
  }

  // تعیین سطح
  let strength: PasswordCheck['strength'] = 'weak';
  if (score >= 85) strength = 'very-strong';
  else if (score >= 65) strength = 'strong';
  else if (score >= 40) strength = 'medium';

  return {
    ok: errors.length === 0,
    errors,
    strength,
    score: Math.min(100, Math.max(0, score)),
  };
}

/**
 * لیبل فارسی سطح قدرت
 */
export function getStrengthLabel(strength: PasswordCheck['strength']): string {
  switch (strength) {
    case 'very-strong': return 'بسیار قوی';
    case 'strong': return 'قوی';
    case 'medium': return 'متوسط';
    case 'weak': return 'ضعیف';
  }
}

/**
 * رنگ Tailwind برای سطح قدرت
 */
export function getStrengthColor(strength: PasswordCheck['strength']): string {
  switch (strength) {
    case 'very-strong': return 'var(--arv-success)';
    case 'strong': return 'var(--arv-success)';
    case 'medium': return 'var(--arv-warning)';
    case 'weak': return 'var(--arv-danger)';
  }
}
