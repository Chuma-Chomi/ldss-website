import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/errors';

const attendanceSchema = z.object({
  studentId: z.string(),
  classId: z.string(),
  date: z.string(),
  status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
  notes: z.string().optional(),
});

export const markAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = attendanceSchema.parse(req.body);
    
    // Check if attendance already exists for this student, class, and date
    const existing = await prisma.attendance.findFirst({
      where: {
        studentId: data.studentId,
        classId: data.classId,
        date: new Date(data.date),
      },
    });

    if (existing) {
      throw new ApiError(400, 'Attendance already marked for this date');
    }

    const attendance = await prisma.attendance.create({
      data: {
        studentId: data.studentId,
        classId: data.classId,
        date: new Date(data.date),
        status: data.status,
        notes: data.notes,
      },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
        class: true,
      },
    });

    res.status(201).json(attendance);
  } catch (error) {
    next(error);
  }
};

export const getAttendanceByClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params;
    const { date } = req.query;

    const attendance = await prisma.attendance.findMany({
      where: {
        classId,
        date: date ? new Date(date as string) : undefined,
      },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
        class: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

export const getAttendanceByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    const attendance = await prisma.attendance.findMany({
      where: {
        studentId,
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      },
      include: {
        class: true,
      },
      orderBy: {
        date: 'desc',
      },
    });

    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

export const updateAttendance = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = attendanceSchema.partial().parse(req.body);

    const attendance = await prisma.attendance.update({
      where: { id },
      data,
      include: {
        student: {
          include: {
            profile: true,
          },
        },
        class: true,
      },
    });

    res.json(attendance);
  } catch (error) {
    next(error);
  }
};

export const getAttendanceReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;

    const attendance = await prisma.attendance.findMany({
      where: {
        classId,
        date: {
          gte: startDate ? new Date(startDate as string) : undefined,
          lte: endDate ? new Date(endDate as string) : undefined,
        },
      },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: [
        { date: 'asc' },
        { student: { profile: { firstName: 'asc' } } },
      ],
    });

    // Calculate attendance statistics
    const stats = attendance.reduce((acc, record) => {
      const studentId = record.studentId;
      if (!acc[studentId]) {
        acc[studentId] = {
          student: record.student,
          total: 0,
          present: 0,
          absent: 0,
          late: 0,
          excused: 0,
        };
      }
      acc[studentId].total++;
      acc[studentId][record.status.toLowerCase() as keyof typeof acc[typeof studentId]]++;
      return acc;
    }, {} as any);

    res.json({
      summary: Object.values(stats),
      raw: attendance,
    });
  } catch (error) {
    next(error);
  }
};
