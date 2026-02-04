import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// D-Day 계산
export function calculateDDay(dateString: string): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateString);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'D-Day';
  if (diffDays > 0) return `D-${diffDays}`;
  return `D+${Math.abs(diffDays)}`;
}

// 날짜 포맷
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// 등급 색상
export function getGradeColor(grade: number): string {
  if (grade <= 2) return 'text-green-600';
  if (grade <= 4) return 'text-blue-600';
  if (grade <= 6) return 'text-yellow-600';
  return 'text-red-600';
}

// 등급 배경색
export function getGradeBgColor(grade: number): string {
  if (grade <= 2) return 'bg-green-100';
  if (grade <= 4) return 'bg-blue-100';
  if (grade <= 6) return 'bg-yellow-100';
  return 'bg-red-100';
}
