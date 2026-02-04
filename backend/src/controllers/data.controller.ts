import { Request, Response } from 'express';
import * as dataService from '../services/data.service';
import * as publicDataService from '../services/publicData.service';

export const getSchool = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const school = await dataService.getSchool(name);

    if (!school) {
      return res.status(404).json({ error: '학교를 찾을 수 없습니다.' });
    }

    res.status(200).json(school);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSchools = async (req: Request, res: Response) => {
  try {
    const schools = await dataService.getSchools();
    res.status(200).json(schools);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUniversity = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const university = await dataService.getUniversity(name);

    if (!university) {
      return res.status(404).json({ error: '대학을 찾을 수 없습니다.' });
    }

    res.status(200).json(university);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUniversities = async (req: Request, res: Response) => {
  try {
    const universities = await dataService.getUniversities();
    res.status(200).json(universities);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUniversityMajors = async (req: Request, res: Response) => {
  try {
    const { name } = req.params;
    const majors = await dataService.getUniversityMajors(name);

    if (!majors) {
      return res.status(404).json({ error: '대학 정보를 찾을 수 없습니다.' });
    }

    res.status(200).json(majors);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

// 공공데이터 API - 대학 통계 (경쟁률 등)
export const getPublicDataStatus = async (_req: Request, res: Response) => {
  try {
    const enabled = publicDataService.isPublicDataEnabled();
    res.status(200).json({ enabled });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUniversityStatsFromPublic = async (req: Request, res: Response) => {
  try {
    const name = Array.isArray(req.params.name) ? req.params.name[0] : req.params.name;
    if (!name) {
      return res.status(400).json({ error: '대학명이 필요합니다.' });
    }

    const stats = await publicDataService.getUniversityStatsByName(name);
    if (!stats) {
      return res.status(404).json({
        error: '공공데이터에서 해당 대학 정보를 찾을 수 없습니다.',
        hint: 'DATA_GO_KR_SERVICE_KEY 설정 및 공공데이터포털 활용신청을 확인하세요.',
      });
    }

    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
