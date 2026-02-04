import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as goalService from '../services/goal.service';

export const createGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const goal = await goalService.createGoal({
      userId: req.user.userId,
      ...req.body,
    });

    res.status(201).json(goal);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getGoals = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const goals = await goalService.getGoals(req.user.userId);
    res.status(200).json(goals);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { id } = req.params;
    await goalService.updateGoal(id, req.user.userId, req.body);

    res.status(200).json({ message: '목표가 수정되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteGoal = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { id } = req.params;
    await goalService.deleteGoal(id, req.user.userId);

    res.status(200).json({ message: '목표가 삭제되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getRoadmap = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { id } = req.params;
    const roadmap = await goalService.generateRoadmap(req.user.userId, id);

    res.status(200).json(roadmap);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
