import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as academyService from '../services/academy.service';

export const create = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const { academyName, subject, dayOfWeek, startTime, endTime } = req.body;
    if (!academyName || !subject || !dayOfWeek || !startTime || !endTime) {
      res.status(400).json({ error: '???, ??, ??/??? ?????.' });
      return;
    }

    const schedule = await academyService.createAcademySchedule({
      userId: req.user.userId,
      academyName,
      subject,
      dayOfWeek,
      startTime,
      endTime,
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const list = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const schedules = await academyService.getAcademySchedules(req.user.userId);
    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await academyService.updateAcademySchedule(id, req.user.userId, req.body);
    res.status(200).json({ message: '?? ??? ?????????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await academyService.deleteAcademySchedule(id, req.user.userId);
    res.status(200).json({ message: '?? ??? ???????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
