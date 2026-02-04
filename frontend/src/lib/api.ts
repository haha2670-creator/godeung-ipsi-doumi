import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 토큰 자동 추가
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// 에러 처리
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; name: string; grade?: string; school?: string; track?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data: any) => api.put('/auth/profile', data),
};

// AI API
export const aiApi = {
  generateSetech: (data: { category: string; title: string; content: string; grade?: string; subject?: string }) =>
    api.post('/ai/setech', data),
  generatePersonalStatement: (data: { prompt: string; activities: string[] }) =>
    api.post('/ai/personal-statement', data),
  generateInterviewQuestions: (data: { university: string; major: string; activities: string[] }) =>
    api.post('/ai/interview-questions', data),
  generateStudyPlan: (data: { grade: string; targetUniversity: string; targetMajor: string; currentGrades?: any[] }) =>
    api.post('/ai/study-plan', data),
  analyzeAdmissionChance: (data: { targetUniversity: string; targetMajor: string; admissionType: string; studentProfile?: any }) =>
    api.post('/ai/admission-chance', data),
};

// Grades API
export const gradesApi = {
  list: (semester?: string) => api.get('/grades', { params: { semester } }),
  create: (data: any) => api.post('/grades', data),
  update: (id: string, data: any) => api.put(`/grades/${id}`, data),
  delete: (id: string) => api.delete(`/grades/${id}`),
  average: (semester?: string) => api.get('/grades/average', { params: { semester } }),
};

// Mock Exams API
export const mockExamsApi = {
  list: () => api.get('/mock-exams'),
  create: (data: any) => api.post('/mock-exams', data),
  update: (id: string, data: any) => api.put(`/mock-exams/${id}`, data),
  delete: (id: string) => api.delete(`/mock-exams/${id}`),
  trend: () => api.get('/mock-exams/trend'),
};

// Records API
export const recordsApi = {
  list: (category?: string) => api.get('/records', { params: { category } }),
  create: (data: any) => api.post('/records', data),
  update: (id: string, data: any) => api.put(`/records/${id}`, data),
  delete: (id: string) => api.delete(`/records/${id}`),
  stats: () => api.get('/records/stats'),
};

// Goals API
export const goalsApi = {
  list: () => api.get('/goals'),
  create: (data: any) => api.post('/goals', data),
  update: (id: string, data: any) => api.put(`/goals/${id}`, data),
  delete: (id: string) => api.delete(`/goals/${id}`),
  roadmap: (id: string) => api.get(`/goals/${id}/roadmap?t=${Date.now()}`),
};

// Schedules API
export const schedulesApi = {
  list: (params?: { type?: string; year?: number; month?: number }) => api.get('/schedules', { params }),
  create: (data: any) => api.post('/schedules', data),
  update: (id: string, data: any) => api.put(`/schedules/${id}`, data),
  delete: (id: string) => api.delete(`/schedules/${id}`),
  upcoming: (days?: number) => api.get('/schedules/upcoming', { params: { days } }),
};

// Academy Schedule API
export const academyApi = {
  list: () => api.get('/academy'),
  create: (data: { academyName: string; subject: string; dayOfWeek: string; startTime: string; endTime: string }) =>
    api.post('/academy', data),
  update: (id: string, data: any) => api.put(`/academy/${id}`, data),
  delete: (id: string) => api.delete(`/academy/${id}`),
};

// Clubs API
export const clubsApi = {
  list: () => api.get('/clubs'),
  create: (data: any) => api.post('/clubs', data),
  update: (id: string, data: any) => api.put(`/clubs/${id}`, data),
  delete: (id: string) => api.delete(`/clubs/${id}`),
  schoolClubs: (schoolName: string) => api.get(`/clubs/school/${encodeURIComponent(schoolName)}`),
  createActivity: (data: any) => api.post('/clubs/activities', data),
  getActivities: (clubId: string) => api.get(`/clubs/${clubId}/activities`),
  deleteActivity: (id: string) => api.delete(`/clubs/activities/${id}`),
};

// Data API
export const dataApi = {
  schools: () => api.get('/data/schools'),
  school: (name: string) => api.get(`/data/schools/${encodeURIComponent(name)}`),
  universities: () => api.get('/data/universities'),
  university: (name: string) => api.get(`/data/universities/${encodeURIComponent(name)}`),
  universityMajors: (name: string) => api.get(`/data/universities/${encodeURIComponent(name)}/majors`),
  // 공공데이터(대학알리미) 연동
  publicDataStatus: () => api.get('/data/public/status'),
  universityStatsFromPublic: (name: string) =>
    api.get(`/data/public/universities/${encodeURIComponent(name)}/stats`),
};

// Subjects API
export const subjectsApi = {
  list: (grade?: string) => api.get('/subjects', { params: { grade } }),
  save: (data: { grade: string; subjects: string[] }) => api.post('/subjects', data),
  schoolSubjects: (schoolName: string) => api.get(`/subjects/school/${encodeURIComponent(schoolName)}`),
};
