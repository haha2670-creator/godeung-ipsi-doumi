import { Request, Response } from 'express';
import * as dataService from '../services/data.service';
import * as publicDataService from '../services/publicData.service';

export const getSchool = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = (Array.isArray(req.params.name) ? req.params.name[0] : req.params.name) as string;
    if (!name) {
      res.status(400).json({ error: '학교명이 필요합니다.' });
      return;
    }
    const school = await dataService.getSchool(name);

    if (!school) {
      res.status(404).json({ error: '학교를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(school);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSchoolCalendar = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = (Array.isArray(req.params.name) ? req.params.name[0] : req.params.name) as string;
    if (!name) {
      res.status(400).json({ error: '학교명이 필요합니다.' });
      return;
    }
    const calendar = await dataService.getSchoolCalendar(name);

    if (!calendar) {
      res.status(404).json({ error: '학사일정을 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(calendar);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSchools = async (_req: Request, res: Response): Promise<void> => {
  try {
    const schools = await dataService.getSchools();
    res.status(200).json(schools);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUniversity = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = (Array.isArray(req.params.name) ? req.params.name[0] : req.params.name) as string;
    if (!name) {
      res.status(400).json({ error: '대학명이 필요합니다.' });
      return;
    }
    const university = await dataService.getUniversity(name);

    if (!university) {
      res.status(404).json({ error: '대학을 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(university);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUniversities = async (_req: Request, res: Response): Promise<void> => {
  try {
    const universities = await dataService.getUniversities();
    res.status(200).json(universities);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUniversityMajors = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = (Array.isArray(req.params.name) ? req.params.name[0] : req.params.name) as string;
    if (!name) {
      res.status(400).json({ error: '대학명이 필요합니다.' });
      return;
    }
    const majors = await dataService.getUniversityMajors(name);

    if (!majors) {
      res.status(404).json({ error: '학과 정보를 찾을 수 없습니다.' });
      return;
    }

    res.status(200).json(majors);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// 공공?�이??API - ?�???�계 (경쟁�???
export const getPublicDataStatus = async (_req: Request, res: Response): Promise<void> => {
  try {
    const enabled = publicDataService.isPublicDataEnabled();
    res.status(200).json({ enabled });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUniversityStatsFromPublic = async (req: Request, res: Response): Promise<void> => {
  try {
    const name = (Array.isArray(req.params.name) ? req.params.name[0] : req.params.name) as string;
    if (!name) {
      res.status(400).json({ error: '대학명이 필요합니다.' });
      return;
    }

    const stats = await publicDataService.getUniversityStatsByName(name);
    if (!stats) {
      res.status(404).json({
        error: '공공데이터에서 해당 대학 정보를 찾을 수 없습니다.',
        hint: 'DATA_GO_KR_SERVICE_KEY 설정 및 공공데이터포털 이용신청 확인하세요',
      });
      return;
    }

    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
