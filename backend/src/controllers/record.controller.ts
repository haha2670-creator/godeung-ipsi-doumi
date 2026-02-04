import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import * as recordService from '../services/record.service';

export const createRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const record = await recordService.createRecord({
      userId: req.user.userId,
      ...req.body,
    });

    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getRecords = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

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

export const updateRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await recordService.updateRecord(id, req.user.userId, req.body);

    res.status(200).json({ message: '???? ?????????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const deleteRecord = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const id = (Array.isArray(req.params.id) ? req.params.id[0] : req.params.id) as string;
    await recordService.deleteRecord(id, req.user.userId);

    res.status(200).json({ message: '???? ???????.' });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getStats = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const stats = await recordService.getRecordStats(req.user.userId);
    res.status(200).json(stats);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
