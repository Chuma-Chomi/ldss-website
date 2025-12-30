import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/errors';

const timetableSchema = z.object({
  classId: z.string(),
  subject: z.string(),
  teacherId: z.string(),
  dayOfWeek: z.enum(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY']),
  startTime: z.string(),
  endTime: z.string(),
  room: z.string(),
  term: z.string(),
});

export const createTimetableEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = timetableSchema.parse(req.body);

    // Check for conflicts
    const conflict = await prisma.timetable.findFirst({
      where: {
        classId: data.classId,
        dayOfWeek: data.dayOfWeek,
        OR: [
          {
            startTime: { lt: data.endTime },
            endTime: { gt: data.startTime },
          },
        ],
      },
    });

    if (conflict) {
      throw new ApiError(400, 'Time slot conflict for this class');
    }

    const timetable = await prisma.timetable.create({
      data,
      include: {
        class: true,
        teacher: {
          include: {
            profile: true,
          },
        },
      },
    });

    res.status(201).json(timetable);
  } catch (error) {
    next(error);
  }
};

export const getTimetableByClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params;
    const { term } = req.query;

    const timetable = await prisma.timetable.findMany({
      where: {
        classId,
        ...(term && { term: term as string }),
      },
      include: {
        class: true,
        teacher: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    res.json(timetable);
  } catch (error) {
    next(error);
  }
};

export const getTimetableByTeacher = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { teacherId } = req.params;
    const { term } = req.query;

    const timetable = await prisma.timetable.findMany({
      where: {
        teacherId,
        ...(term && { term: term as string }),
      },
      include: {
        class: true,
        teacher: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' },
      ],
    });

    res.json(timetable);
  } catch (error) {
    next(error);
  }
};

export const updateTimetableEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = timetableSchema.partial().parse(req.body);

    const timetable = await prisma.timetable.update({
      where: { id },
      data,
      include: {
        class: true,
        teacher: {
          include: {
            profile: true,
          },
        },
      },
    });

    res.json(timetable);
  } catch (error) {
    next(error);
  }
};

export const deleteTimetableEntry = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.timetable.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getTodaySchedule = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params;
    const today = new Date().toLocaleDateString('en-US', { weekday: 'uppercase' }) as any;

    const schedule = await prisma.timetable.findMany({
      where: {
        classId,
        dayOfWeek: today,
      },
      include: {
        class: true,
        teacher: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    res.json(schedule);
  } catch (error) {
    next(error);
  }
};
