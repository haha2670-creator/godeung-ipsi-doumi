import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as aiService from '../services/ai.service';

/**
 * AI ??? ?? ???
 */
export const generateSetech = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { category, title, content, grade, subject } = req.body;

    if (!category || !title || !content) {
      res.status(400).json({ 
        error: '????, ??, ??? ?????.' 
      });
      return;
    }

    const result = await aiService.generateSetech({
      category,
      title,
      content,
      grade,
      subject,
    });

    res.status(200).json({ 
      success: true,
      setech: result 
    });
  } catch (error) {
    console.error('?? ?? ??:', error);
    res.status(500).json({ 
      error: (error as Error).message 
    });
  }
};

/**
 * AI ??????????? ??? */
export const generatePersonalStatement = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { prompt, activities } = req.body;

    if (!prompt || !activities || !Array.isArray(activities)) {
      res.status(400).json({ 
        error: '????? ??? ?????.' 
      });
      return;
    }

    const result = await aiService.generatePersonalStatement(prompt, activities);

    res.status(200).json({ 
      success: true,
      essay: result 
    });
  } catch (error) {
    console.error('????? ?? ??:', error);
    res.status(500).json({ 
      error: (error as Error).message 
    });
  }
};

/**
 * AI ?? ??? ?? ???
 */
export const generateInterviewQuestions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { university, major, activities } = req.body;

    if (!university || !major || !activities || !Array.isArray(activities)) {
      res.status(400).json({ 
        error: '???, ??, ??? ?????.' 
      });
      return;
    }

    const questions = await aiService.generateInterviewQuestions(
      university,
      major,
      activities
    );

    res.status(200).json({ 
      success: true,
      questions 
    });
  } catch (error) {
    console.error('?? ?? ?? ??:', error);
    res.status(500).json({ 
      error: (error as Error).message 
    });
  }
};

/**
 * AI ??? ?? ??
 */
export const generateStudyPlan = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { grade, targetUniversity, targetMajor, currentGrades } = req.body;

    if (!grade || !targetUniversity || !targetMajor) {
      res.status(400).json({ 
        error: '??, ?? ???, ?? ??? ?????.' 
      });
      return;
    }

    const plan = await aiService.generateStudyPlan(
      grade,
      targetUniversity,
      targetMajor,
      currentGrades || []
    );

    res.status(200).json({ 
      success: true,
      plan 
    });
  } catch (error) {
    console.error('?? ?? ?? ??:', error);
    res.status(500).json({ 
      error: (error as Error).message 
    });
  }
};

/**
 * ??? ???? ??
 */
export const analyzeAdmissionChance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { targetUniversity, targetMajor, admissionType, studentProfile } = req.body;

    if (!targetUniversity || !targetMajor || !admissionType) {
      res.status(400).json({ 
        error: '?? ???, ?? ??, ??? ?????.' 
      });
      return;
    }

    const analysis = await aiService.analyzeAdmissionChance(
      targetUniversity,
      targetMajor,
      admissionType,
      studentProfile || {}
    );

    res.status(200).json({ 
      success: true,
      analysis 
    });
  } catch (error) {
    console.error('?? ??? ?? ??:', error);
    res.status(500).json({ 
      error: (error as Error).message 
    });
  }
};
