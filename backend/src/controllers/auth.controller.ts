import { Request, Response } from 'express';
import * as authService from '../services/auth.service';
import { AuthRequest } from '../middleware/auth';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password, name, grade, school, track } = req.body;

    if (!email || !password || !name) {
      res.status(400).json({ error: '???, ????, ??? ?????.' });
      return;
    }

    const result = await authService.register({
      email,
      password,
      name,
      grade,
      school,
      track,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ error: '???? ????? ??????.' });
      return;
    }

    const result = await authService.login({ email, password });

    res.status(200).json(result);
  } catch (error) {
    res.status(401).json({ error: (error as Error).message });
  }
};

export const getProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const profile = await authService.getProfile(req.user.userId);

    res.status(200).json(profile);
  } catch (error) {
    res.status(404).json({ error: (error as Error).message });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ error: '??? ?????.' });
      return;
    }

    const { name, grade, school, track } = req.body;

    const updatedProfile = await authService.updateProfile(req.user.userId, {
      name,
      grade,
      school,
      track,
    });

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};
