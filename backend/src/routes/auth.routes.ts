import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

// 회원가입
router.post('/register', authController.register as any);

// 로그인
router.post('/login', authController.login as any);

// 프로필 조회 (인증 필요)
router.get('/profile', authenticate as any, authController.getProfile as any);

// 프로필 수정 (인증 필요)
router.put('/profile', authenticate as any, authController.updateProfile as any);

export default router;
