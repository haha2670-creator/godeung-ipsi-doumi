import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as academyService from '../services/academy.service';

export const create = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { academyName, subject, dayOfWeek, startTime, endTime } = req.body;
    if (!academyName || !subject || !dayOfWeek || !startTime || !endTime) {
      return res.status(400).json({ error: '학원명, 과목, 요일, 시작/종료 시간이 필요합니다.' });
    }

    const schedule = await academyService.createAcademySchedule({
      userId: req.user.userId,
      academyName,
      subject,
      dayOfWeek,
      startTime,
      endTime,
    });

    return res.status(201).json(schedule);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const list = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const schedules = await academyService.getAcademySchedules(req.user.userId);
    return res.status(200).json(schedules);
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const update = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await academyService.updateAcademySchedule(id, req.user.userId, req.body);
    return res.status(200).json({ message: '학원 스케줄이 수정되었습니다.' });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};

export const remove = async (req: AuthRequest, res: Response): Promise<Response | void> => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    await academyService.deleteAcademySchedule(id, req.user.userId);
    return res.status(200).json({ message: '학원 스케줄이 삭제되었습니다.' });
  } catch (error) {
    return res.status(400).json({ error: (error as Error).message });
  }
};
