import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as clubService from '../services/club.service';

export const createClub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const club = await clubService.createClub({
      userId: req.user.userId,
      ...req.body,
    });

    res.status(201).json(club);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getClubs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const clubs = await clubService.getClubs(req.user.userId);
    res.status(200).json(clubs);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateClub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await clubService.updateClub(id, req.user.userId, req.body);

    res.status(200).json({ message: '???? ?????????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteClub = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await clubService.deleteClub(id, req.user.userId);

    res.status(200).json({ message: '???? ???????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const createActivity = async (req: AuthRequest, res: Response): Promise<void> => {
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

export const getActivities = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const clubId = (Array.isArray(req.params.clubId) ? req.params.clubId[0] : req.params.clubId) as string;
    const activities = await clubService.getClubActivities(clubId);

    res.status(200).json(activities);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteActivity = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await clubService.deleteClubActivity(id);

    res.status(200).json({ message: '??? ???????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSchoolClubs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const schoolName = (Array.isArray(req.params.schoolName) ? req.params.schoolName[0] : req.params.schoolName) as string;
    const clubs = await clubService.getSchoolClubs(schoolName);

    res.status(200).json(clubs);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
