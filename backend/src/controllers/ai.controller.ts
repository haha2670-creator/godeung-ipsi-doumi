import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as aiService from '../services/ai.service';

/**
 * AI 세특 초안 생성
 */
export const generateSetech = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { category, title, content, grade, subject } = req.body;

    if (!category || !title || !content) {
      return res.status(400).json({ 
        error: '카테고리, 제목, 내용은 필수입니다.' 
      });
    }

    const result = await aiService.generateSetech({
      category,
      title,
      content,
      grade,
      subject,
    });

    return res.status(200).json({ 
      success: true,
      setech: result 
    });
  } catch (error) {
    console.error('세특 생성 오류:', error);
    return res.status(500).json({ 
      error: (error as Error).message 
    });
  }
};

/**
 * AI 자기소개서 작성 지원
 */
export const generatePersonalStatement = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { prompt, activities } = req.body;

    if (!prompt || !activities || !Array.isArray(activities)) {
      return res.status(400).json({ 
        error: '문항과 활동 내역이 필요합니다.' 
      });
    }

    const result = await aiService.generatePersonalStatement(prompt, activities);

    return res.status(200).json({ 
      success: true,
      essay: result 
    });
  } catch (error) {
    console.error('자소서 생성 오류:', error);
    return res.status(500).json({ 
      error: (error as Error).message 
    });
  }
};

/**
 * AI 면접 예상 질문 생성
 */
export const generateInterviewQuestions = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { university, major, activities } = req.body;

    if (!university || !major || !activities || !Array.isArray(activities)) {
      return res.status(400).json({ 
        error: '대학, 학과, 활동 내역이 필요합니다.' 
      });
    }

    const questions = await aiService.generateInterviewQuestions(
      university,
      major,
      activities
    );

    return res.status(200).json({ 
      success: true,
      questions 
    });
  } catch (error) {
    console.error('면접 질문 생성 오류:', error);
    return res.status(500).json({ 
      error: (error as Error).message 
    });
  }
};

/**
 * AI 학습 계획 추천
 */
export const generateStudyPlan = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { grade, targetUniversity, targetMajor, currentGrades } = req.body;

    if (!grade || !targetUniversity || !targetMajor) {
      return res.status(400).json({ 
        error: '학년, 목표 대학, 목표 학과가 필요합니다.' 
      });
    }

    const plan = await aiService.generateStudyPlan(
      grade,
      targetUniversity,
      targetMajor,
      currentGrades || []
    );

    return res.status(200).json({ 
      success: true,
      plan 
    });
  } catch (error) {
    console.error('학습 계획 생성 오류:', error);
    return res.status(500).json({ 
      error: (error as Error).message 
    });
  }
};

/**
 * 합격 가능성 분석
 */
export const analyzeAdmissionChance = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const { targetUniversity, targetMajor, admissionType, studentProfile } = req.body;

    if (!targetUniversity || !targetMajor || !admissionType) {
      return res.status(400).json({ 
        error: '대학, 학과, 전형 정보가 필요합니다.' 
      });
    }

    const analysis = await aiService.analyzeAdmissionChance(
      targetUniversity,
      targetMajor,
      admissionType,
      studentProfile || {}
    );

    return res.status(200).json({ 
      success: true,
      analysis 
    });
  } catch (error) {
    console.error('합격 가능성 분석 오류:', error);
    return res.status(500).json({ 
      error: (error as Error).message 
    });
  }
};
