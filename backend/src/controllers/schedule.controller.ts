import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as scheduleService from '../services/schedule.service';

export const createSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const schedule = await scheduleService.createSchedule({
      userId: req.user.userId,
      ...req.body,
      date: new Date(req.body.date),
    });

    res.status(201).json(schedule);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getSchedules = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const { type, year, month } = req.query;

    let schedules;
    if (year && month) {
      schedules = await scheduleService.getSchedulesByMonth(
        req.user.userId,
        parseInt(year as string),
        parseInt(month as string)
      );
    } else {
      schedules = await scheduleService.getSchedules(req.user.userId, type as string);
    }

    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await scheduleService.updateSchedule(id, req.user.userId, req.body);

    res.status(200).json({ message: '??? ?????????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteSchedule = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await scheduleService.deleteSchedule(id, req.user.userId);

    res.status(200).json({ message: '??? ???????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUpcoming = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const { days } = req.query;
    const schedules = await scheduleService.getUpcomingSchedules(
      req.user.userId,
      days ? parseInt(days as string) : 30
    );

    res.status(200).json(schedules);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
