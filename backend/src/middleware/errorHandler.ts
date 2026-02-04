import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('❌ 오류 발생:', error);

  const statusCode = res.statusCode !== 200 ? res.statusCode : 500;

  res.status(statusCode).json({
    error: error.message || '서버 오류가 발생했습니다.',
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};

export const notFound = (_req: Request, res: Response, _next: NextFunction): void => {
  res.status(404).json({ error: '요청하신 리소스를 찾을 수 없습니다.' });
};
