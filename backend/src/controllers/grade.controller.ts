import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as gradeService from '../services/grade.service';

export const createGrade = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const grade = await gradeService.createGrade({
      userId: req.user.userId,
      ...req.body,
    });

    res.status(201).json(grade);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getGrades = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { semester } = req.query;
    
    const grades = semester
      ? await gradeService.getGradesBySemester(req.user.userId, semester as string)
      : await gradeService.getGrades(req.user.userId);

    res.status(200).json(grades);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateGrade = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { id } = req.params;
    await gradeService.updateGrade(id, req.user.userId, req.body);

    res.status(200).json({ message: '성적이 수정되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteGrade = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { id } = req.params;
    await gradeService.deleteGrade(id, req.user.userId);

    res.status(200).json({ message: '성적이 삭제되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getAverageGrade = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { semester } = req.query;
    const average = await gradeService.calculateAverageGrade(
      req.user.userId,
      semester as string
    );

    res.status(200).json({ average });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
