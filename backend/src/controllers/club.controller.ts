import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as clubService from '../services/club.service';

export const createClub = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const club = await clubService.createClub({
      userId: req.user.userId,
      ...req.body,
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getClubs = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const clubs = await clubService.getClubs(req.user.userId);
    res.status(200).json(clubs);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateClub = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { id } = req.params;
    await clubService.updateClub(id, req.user.userId, req.body);

    res.status(200).json({ message: '동아리가 수정되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteClub = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { id } = req.params;
    await clubService.deleteClub(id, req.user.userId);

    res.status(200).json({ message: '동아리가 삭제되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const createActivity = async (req: AuthRequest, res: Response) => {
  try {
    const activity = await clubService.createClubActivity({
      ...req.body,
      date: new Date(req.body.date),
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getActivities = async (req: AuthRequest, res: Response) => {
  try {
    const { clubId } = req.params;
    const activities = await clubService.getClubActivities(clubId);

    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteActivity = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    await clubService.deleteClubActivity(id);

    res.status(200).json({ message: '활동이 삭제되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSchoolClubs = async (req: AuthRequest, res: Response) => {
  try {
    const { schoolName } = req.params;
    const clubs = await clubService.getSchoolClubs(schoolName);

    res.status(200).json(clubs);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
