import prisma from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';
import { validatePassword } from '../utils/passwordValidation';
import { generateToken } from '../config/jwt';

interface RegisterData {
  email: string;
  password: string;
  name: string;
  grade?: string;
  school?: string;
  track?: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const register = async (data: RegisterData) => {
  // 이메일 중복 체크
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('이미 존재하는 이메일입니다.');
  }

  // 비밀번호 유효성 검사
  const passwordValidation = validatePassword(data.password);
  if (!passwordValidation.isValid) {
    throw new Error(passwordValidation.errors.join(' '));
  }

  // 비밀번호 해싱
  const hashedPassword = await hashPassword(data.password);

  // 사용자 생성
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      grade: data.grade,
      school: data.school,
      track: data.track,
    },
  });

  // 비밀번호 제외하고 반환
  const { password, ...userWithoutPassword } = user;

  // JWT 토큰 생성
  const token = generateToken({ userId: user.id, email: user.email });

  return { user: userWithoutPassword, token };
};

export const login = async (data: LoginData) => {
  // 사용자 찾기
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  // 비밀번호 확인
  const isPasswordValid = await comparePassword(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error('이메일 또는 비밀번호가 올바르지 않습니다.');
  }

  // 비밀번호 제외하고 반환
  const { password, ...userWithoutPassword } = user;

  // JWT 토큰 생성
  const token = generateToken({ userId: user.id, email: user.email });

  return { user: userWithoutPassword, token };
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      grade: true,
      school: true,
      schoolType: true,
      track: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!user) {
    throw new Error('사용자를 찾을 수 없습니다.');
  }

  return user;
};

export const updateProfile = async (userId: string, data: Partial<RegisterData>) => {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      name: data.name,
      grade: data.grade,
      school: data.school,
      track: data.track,
    },
    select: {
      id: true,
      email: true,
      name: true,
      grade: true,
      school: true,
      schoolType: true,
      track: true,
      role: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return user;
};
