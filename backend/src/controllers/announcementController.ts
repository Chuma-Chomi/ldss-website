import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/errors';
import { z } from 'zod';
import { Audience } from '@prisma/client';

const announcementSchema = z.object({
  title: z.string().min(2),
  body: z.string().min(5),
  audience: z.nativeEnum(Audience),
  published: z.boolean().optional(),
});

export const listAnnouncements = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const announcements = await prisma.announcement.findMany({
      include: { createdBy: { include: { profile: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(announcements);
  } catch (error) {
    return next(error);
  }
};

export const getAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const announcement = await prisma.announcement.findUnique({
      where: { id },
      include: { createdBy: { include: { profile: true } } },
    });

    if (!announcement) throw new ApiError(404, 'Announcement not found');
    return res.json(announcement);
  } catch (error) {
    return next(error);
  }
};

export const createAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = announcementSchema.parse(req.body);
    const user = (req as any).user;

    const announcement = await prisma.announcement.create({
      data: {
        title: payload.title,
        body: payload.body,
        audience: payload.audience,
        published: payload.published ?? false,
        staffId: user.userId,
      },
      include: { createdBy: { include: { profile: true } } },
    });

    return res.status(201).json(announcement);
  } catch (error) {
    return next(error);
  }
};

export const updateAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = announcementSchema.partial().parse(req.body);

    const existing = await prisma.announcement.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, 'Announcement not found');

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: payload.title,
        body: payload.body,
        audience: payload.audience,
        published: payload.published,
      },
      include: { createdBy: { include: { profile: true } } },
    });

    return res.json(announcement);
  } catch (error) {
    return next(error);
  }
};

export const deleteAnnouncement = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.announcement.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
