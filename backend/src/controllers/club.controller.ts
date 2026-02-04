import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as clubService from '../services/club.service';

export const createClub = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const club = await clubService.createClub({
      userId: req.user.userId,
      ...req.body,
    });

    return res.status(201).json(club);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const getClubs = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const clubs = await clubService.getClubs(req.user.userId);
    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const updateClub = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await clubService.updateClub(id, req.user.userId, req.body);

    return res.status(200).json({ message: '동아리가 수정되었습니다.' });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteClub = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await clubService.deleteClub(id, req.user.userId);

    return res.status(200).json({ message: '동아리가 삭제되었습니다.' });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const createActivity = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const activity = await clubService.createClubActivity({
      ...req.body,
      date: new Date(req.body.date),
    });

    return res.status(201).json(activity);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const getActivities = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const clubId = Array.isArray(req.params.clubId) ? req.params.clubId[0] : req.params.clubId;
    const activities = await clubService.getClubActivities(clubId);

    return res.status(200).json(activities);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteActivity = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await clubService.deleteClubActivity(id);

    return res.status(200).json({ message: '활동이 삭제되었습니다.' });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const getSchoolClubs = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    const schoolName = Array.isArray(req.params.schoolName) ? req.params.schoolName[0] : req.params.schoolName;
    const clubs = await clubService.getSchoolClubs(schoolName);

    return res.status(200).json(clubs);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};
