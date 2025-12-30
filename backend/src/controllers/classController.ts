import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/errors';
import { z } from 'zod';
import { GradeLevel } from '@prisma/client';

const classSchema = z.object({
  name: z.string().min(2),
  grade: z.nativeEnum(GradeLevel),
  section: z.string().optional(),
  capacity: z.number().positive().optional(),
  instructorId: z.string().optional(),
});

export const listClasses = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const classes = await prisma.class.findMany({
      include: { instructor: { include: { profile: true } }, enrollments: { include: { student: { include: { profile: true } } } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(classes);
  } catch (error) {
    return next(error);
  }
};

export const getClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const cls = await prisma.class.findUnique({
      where: { id },
      include: {
        instructor: { include: { profile: true } },
        enrollments: { include: { student: { include: { profile: true } } } },
        schedules: true,
      },
    });

    if (!cls) throw new ApiError(404, 'Class not found');
    return res.json(cls);
  } catch (error) {
    return next(error);
  }
};

export const createClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = classSchema.parse(req.body);

    const cls = await prisma.class.create({
      data: {
        name: payload.name,
        grade: payload.grade,
        section: payload.section,
        capacity: payload.capacity,
        instructorId: payload.instructorId,
      },
      include: { instructor: { include: { profile: true } } },
    });

    return res.status(201).json(cls);
  } catch (error) {
    return next(error);
  }
};

export const updateClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = classSchema.partial().parse(req.body);

    const existing = await prisma.class.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, 'Class not found');

    const cls = await prisma.class.update({
      where: { id },
      data: {
        name: payload.name,
        grade: payload.grade,
        section: payload.section,
        capacity: payload.capacity,
        instructorId: payload.instructorId,
      },
      include: { instructor: { include: { profile: true } } },
    });

    return res.json(cls);
  } catch (error) {
    return next(error);
  }
};

export const deleteClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.class.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
