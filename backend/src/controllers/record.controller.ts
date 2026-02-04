import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as recordService from '../services/record.service';

export const createRecord = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const record = await recordService.createRecord({
      userId: req.user.userId,
      ...req.body,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getRecords = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { category } = req.query;
    const records = await recordService.getRecords(
      req.user.userId,
      category as string
    );

    res.status(200).json(records);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateRecord = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { id } = req.params;
    await recordService.updateRecord(id, req.user.userId, req.body);

    res.status(200).json({ message: '생기부가 수정되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteRecord = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const { id } = req.params;
    await recordService.deleteRecord(id, req.user.userId);

    res.status(200).json({ message: '생기부가 삭제되었습니다.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getStats = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: '인증이 필요합니다.' });

    const stats = await recordService.getRecordStats(req.user.userId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
