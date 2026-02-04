import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as subjectsService from '../services/subjects.service';

export const saveSelectedSubjects = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { grade, subjects } = req.body;

    if (!grade || !subjects || !Array.isArray(subjects)) {
      return res.status(400).json({ error: '학년과 과목 목록이 필요합니다.' });
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

export const getSelectedSubjects = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { grade } = req.query;

    if (grade) {
      const result = await subjectsService.getSelectedSubjectsByGrade(
        req.user.userId,
        grade as string
      );
      return res.status(200).json(result);
    }

    const results = await subjectsService.getSelectedSubjects(req.user.userId);
    res.status(200).json(results);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSchoolSubjects = async (req: AuthRequest, res: Response) => {
  try {
    const { schoolName } = req.params;

    const subjects = await subjectsService.getSchoolSubjects(schoolName);

    if (!subjects) {
      return res.status(404).json({ error: '학교 정보를 찾을 수 없습니다.' });
    }

    res.status(200).json(subjects);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
