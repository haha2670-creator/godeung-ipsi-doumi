import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as mockExamService from '../services/mockExam.service';

export const createMockExam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const mockExam = await mockExamService.createMockExam({
      userId: req.user.userId,
      ...req.body,
      date: new Date(req.body.date),
    });

    res.status(201).json(mockExam);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getMockExams = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const mockExams = await mockExamService.getMockExams(req.user.userId);
    res.status(200).json(mockExams);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateMockExam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await mockExamService.updateMockExam(id, req.user.userId, req.body);

    res.status(200).json({ message: '????? ?????????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteMockExam = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await mockExamService.deleteMockExam(id, req.user.userId);

    res.status(200).json({ message: '????? ???????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getTrend = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const trend = await mockExamService.getMockExamTrend(req.user.userId);
    res.status(200).json(trend);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
