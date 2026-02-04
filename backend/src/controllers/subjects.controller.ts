import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as subjectsService from '../services/subjects.service';

export const saveSelectedSubjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const { grade, subjects } = req.body;

    if (!grade || !subjects || !Array.isArray(subjects)) {
      res.status(400).json({ error: '??? ??? ?????.' });
      return;
    }

    const result = await subjectsService.saveSelectedSubjects({
      userId: req.user.userId,
      grade,
      subjects,
    });

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSelectedSubjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const { grade } = req.query;

    if (grade) {
      const result = await subjectsService.getSelectedSubjectsByGrade(
        req.user.userId,
        grade as string
      );
      res.status(200).json(result);
      return;
    }

    const results = await subjectsService.getSelectedSubjects(req.user.userId);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSchoolSubjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schoolName = (Array.isArray(req.params.schoolName) ? req.params.schoolName[0] : req.params.schoolName) as string;
    if (!schoolName) {
      res.status(400).json({ error: '???? ?????.' });
      return;
    }

    const subjects = await subjectsService.getSchoolSubjects(schoolName);

    if (!subjects) {
      res.status(404).json({ error: '?? ??? ??? ?? ? ????.' });
      return;
    }

    res.status(200).json(subjects);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
