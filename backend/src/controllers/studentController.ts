import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { ApiError } from '../utils/errors';
import { GradeLevel } from '@prisma/client';

const studentSchema = z.object({
  learnerId: z.string().min(3).optional(),
  grade: z.nativeEnum(GradeLevel),
  section: z.string().optional(),
  guardians: z.any().optional(),
  profile: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().optional(),
  }),
});

export const listStudents = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const students = await prisma.student.findMany({
      include: {
        profile: true,
        enrollments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(students);
  } catch (error) {
    return next(error);
  }
};

export const getStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id },
      include: { profile: true, enrollments: { include: { class: true } }, attendance: true },
    });

    if (!student) throw new ApiError(404, 'Student not found');
    return res.json(student);
  } catch (error) {
    return next(error);
  }
};

export const createStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = studentSchema.parse(req.body);

    // Create user first
    const hashedPassword = await bcrypt.hash('temp123', 10);
    const user = await prisma.user.create({
      data: {
        id: `STU-${Date.now()}`,
        email: `${payload.profile.firstName.toLowerCase()}.${payload.profile.lastName.toLowerCase()}.${Date.now()}@ldss.local`,
        password: hashedPassword,
        role: 'STUDENT',
      },
    });

    const student = await prisma.student.create({
      data: {
        learnerId: payload.learnerId || `LDSS-${Date.now()}`,
        grade: payload.grade,
        section: payload.section,
        guardians: payload.guardians,
        profile: {
          create: {
            firstName: payload.profile.firstName,
            lastName: payload.profile.lastName,
            phone: payload.profile.phone,
            type: 'STUDENT',
            userId: user.id,
          },
        },
      },
      include: { profile: true },
    });

    return res.status(201).json(student);
  } catch (error) {
    return next(error);
  }
};

export const updateStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = studentSchema.partial().parse(req.body);

    const existing = await prisma.student.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, 'Student not found');

    const student = await prisma.student.update({
      where: { id },
      data: {
        grade: payload.grade,
        section: payload.section,
        guardians: payload.guardians,
        profile: payload.profile
          ? {
              update: {
                firstName: payload.profile.firstName,
                lastName: payload.profile.lastName,
                phone: payload.profile.phone,
              },
            }
          : undefined,
      },
      include: { profile: true },
    });

    return res.json(student);
  } catch (error) {
    return next(error);
  }
};

export const deleteStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.student.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};
