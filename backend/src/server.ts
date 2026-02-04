import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import routes from './routes';
import { errorHandler, notFound } from './middleware/errorHandler';

// 환경 변수 로드
dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const CORS_ORIGIN = process.env.CORS_ORIGIN || 'http://localhost:3000';

// 미들웨어
app.use(helmet()); // 보안 헤더
app.use(cors({ origin: CORS_ORIGIN })); // CORS
app.use(express.json()); // JSON 파싱
app.use(express.urlencoded({ extended: true })); // URL 인코딩 파싱

// 로그 미들웨어
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// API 라우트
app.use('/api', routes);

// 루트 경로
app.get('/', (_req, res) => {
  res.json({
    message: '🎓 고등학생 입시 올인원 툴킷 API 서버',
    version: '2.0.0',
    status: '✅ 모든 API 준비 완료',
    endpoints: {
      health: 'GET /api/health',
      auth: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile',
        updateProfile: 'PUT /api/auth/profile',
      },
      ai: {
        setech: 'POST /api/ai/setech',
        personalStatement: 'POST /api/ai/personal-statement',
        interviewQuestions: 'POST /api/ai/interview-questions',
        studyPlan: 'POST /api/ai/study-plan',
        admissionChance: 'POST /api/ai/admission-chance',
      },
      grades: {
        list: 'GET /api/grades',
        create: 'POST /api/grades',
        average: 'GET /api/grades/average',
        update: 'PUT /api/grades/:id',
        delete: 'DELETE /api/grades/:id',
      },
      mockExams: {
        list: 'GET /api/mock-exams',
        create: 'POST /api/mock-exams',
        trend: 'GET /api/mock-exams/trend',
        update: 'PUT /api/mock-exams/:id',
        delete: 'DELETE /api/mock-exams/:id',
      },
      records: {
        list: 'GET /api/records',
        create: 'POST /api/records',
        stats: 'GET /api/records/stats',
        update: 'PUT /api/records/:id',
        delete: 'DELETE /api/records/:id',
      },
      goals: {
        list: 'GET /api/goals',
        create: 'POST /api/goals',
        roadmap: 'GET /api/goals/:id/roadmap',
        update: 'PUT /api/goals/:id',
        delete: 'DELETE /api/goals/:id',
      },
      schedules: {
        list: 'GET /api/schedules',
        create: 'POST /api/schedules',
        upcoming: 'GET /api/schedules/upcoming',
        update: 'PUT /api/schedules/:id',
        delete: 'DELETE /api/schedules/:id',
      },
      clubs: {
        list: 'GET /api/clubs',
        create: 'POST /api/clubs',
        schoolClubs: 'GET /api/clubs/school/:schoolName',
        update: 'PUT /api/clubs/:id',
        delete: 'DELETE /api/clubs/:id',
        activities: 'GET /api/clubs/:clubId/activities',
      },
      data: {
        schools: 'GET /api/data/schools',
        universities: 'GET /api/data/universities',
        universityMajors: 'GET /api/data/universities/:name/majors',
      },
    },
  });
});

// 404 핸들러
app.use(notFound);

// 에러 핸들러
app.use(errorHandler);

// 서버 시작
app.listen(PORT, () => {
  // Railway 또는 다른 플랫폼의 공개 도메인 확인
  const publicDomain = process.env.RAILWAY_PUBLIC_DOMAIN || process.env.RENDER_EXTERNAL_URL || process.env.FLY_APP_NAME 
    ? `https://${process.env.RAILWAY_PUBLIC_DOMAIN || process.env.RENDER_EXTERNAL_URL || `${process.env.FLY_APP_NAME}.fly.dev`}`
    : `http://localhost:${PORT}`;
  
  console.log('');
  console.log('🚀 서버 시작!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`📡 포트: ${PORT}`);
  console.log(`🌐 로컬 URL: http://localhost:${PORT}`);
  if (publicDomain !== `http://localhost:${PORT}`) {
    console.log(`🌍 공개 URL: ${publicDomain}`);
  }
  console.log(`🔧 환경: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔐 CORS: ${CORS_ORIGIN}`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('');
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM 신호 수신. 서버 종료 중...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('\n서버 종료 중...');
  process.exit(0);
});
