/**
 * 비밀번호 유효성 검사
 */

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

/**
 * 비밀번호 규칙:
 * - 최소 8자 이상
 * - 영문자(대소문자)와 숫자 조합
 * - 특수문자 포함 권장 (선택사항)
 */
export const validatePassword = (password: string): PasswordValidationResult => {
  const errors: string[] = [];

  // 최소 길이 체크
  if (password.length < 8) {
    errors.push('비밀번호는 8자 이상이어야 합니다.');
  }

  // 최대 길이 체크 (보안상 100자 제한)
  if (password.length > 100) {
    errors.push('비밀번호는 100자 이하여야 합니다.');
  }

  // 영문자 포함 체크
  if (!/[a-zA-Z]/.test(password)) {
    errors.push('비밀번호에 영문자가 포함되어야 합니다.');
  }

  // 숫자 포함 체크
  if (!/[0-9]/.test(password)) {
    errors.push('비밀번호에 숫자가 포함되어야 합니다.');
  }

  // 공백 포함 체크
  if (/\s/.test(password)) {
    errors.push('비밀번호에 공백을 포함할 수 없습니다.');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * 비밀번호 강도 평가
 */
export const getPasswordStrength = (password: string): 'weak' | 'medium' | 'strong' => {
  let score = 0;

  // 길이 점수
  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;

  // 문자 종류 점수
  if (/[a-z]/.test(password)) score += 1; // 소문자
  if (/[A-Z]/.test(password)) score += 1; // 대문자
  if (/[0-9]/.test(password)) score += 1; // 숫자
  if (/[^a-zA-Z0-9]/.test(password)) score += 1; // 특수문자

  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};
