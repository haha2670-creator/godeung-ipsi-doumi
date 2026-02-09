
import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as goalService from '../services/goal.service';

export const createGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const goal = await goalService.createGoal({
      userId: req.user.userId,
      ...req.body,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getGoals = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const goals = await goalService.getGoals(req.user.userId);
    res.status(200).json(goals);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await goalService.updateGoal(id, req.user.userId, req.body);

    res.status(200).json({ message: '??? ?????????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await goalService.deleteGoal(id, req.user.userId);

    res.status(200).json({ message: '??? ???????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getRoadmap = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '인증이 필요합니다.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    const useAI = req.query.ai === 'true' || req.query.ai === '1';
    const roadmap = await goalService.generateRoadmap(req.user.userId, id, useAI);

    res.status(200).json(roadmap);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
