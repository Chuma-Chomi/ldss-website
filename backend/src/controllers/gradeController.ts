import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/errors';

const gradeSchema = z.object({
  studentId: z.string(),
  classId: z.string(),
  subject: z.string(),
  term: z.string(),
  assessmentType: z.enum(['HOMEWORK', 'QUIZ', 'TEST', 'EXAM', 'PROJECT']),
  score: z.number().min(0).max(100),
  maxScore: z.number().min(1),
  comments: z.string().optional(),
  date: z.string(),
});

export const createGrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = gradeSchema.parse(req.body);

    const grade = await prisma.grade.create({
      data: {
        studentId: data.studentId,
        classId: data.classId,
        subject: data.subject,
        term: data.term,
        assessmentType: data.assessmentType,
        score: data.score,
        maxScore: data.maxScore,
        percentage: (data.score / data.maxScore) * 100,
        comments: data.comments,
        date: new Date(data.date),
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

    res.status(201).json(grade);
  } catch (error) {
    next(error);
  }
};

export const getGradesByStudent = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const { term, subject } = req.query;

    const grades = await prisma.grade.findMany({
      where: {
        studentId,
        ...(term && { term: term as string }),
        ...(subject && { subject: subject as string }),
      },
      include: {
        class: true,
      },
      orderBy: [
        { term: 'desc' },
        { date: 'desc' },
      ],
    });

    res.json(grades);
  } catch (error) {
    next(error);
  }
};

export const getGradesByClass = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { classId } = req.params;
    const { term, subject } = req.query;

    const grades = await prisma.grade.findMany({
      where: {
        classId,
        ...(term && { term: term as string }),
        ...(subject && { subject: subject as string }),
      },
      include: {
        student: {
          include: {
            profile: true,
          },
        },
      },
      orderBy: [
        { term: 'desc' },
        { date: 'desc' },
      ],
    });

    res.json(grades);
  } catch (error) {
    next(error);
  }
};

export const updateGrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const data = gradeSchema.partial().parse(req.body);

    const grade = await prisma.grade.update({
      where: { id },
      data: {
        ...data,
        ...(data.score && data.maxScore && {
          percentage: (data.score / data.maxScore) * 100,
        }),
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

    res.json(grade);
  } catch (error) {
    next(error);
  }
};

export const deleteGrade = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    await prisma.grade.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export const getStudentReport = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { studentId } = req.params;
    const { term } = req.query;

    const grades = await prisma.grade.findMany({
      where: {
        studentId,
        ...(term && { term: term as string }),
      },
      include: {
        class: true,
      },
      orderBy: [
        { term: 'desc' },
        { subject: 'asc' },
        { assessmentType: 'asc' },
      ],
    });

    // Calculate subject averages
    const subjectStats = grades.reduce((acc, grade) => {
      if (!acc[grade.subject]) {
        acc[grade.subject] = {
          total: 0,
          count: 0,
          assessments: [],
        };
      }
      acc[grade.subject].total += grade.percentage;
      acc[grade.subject].count++;
      acc[grade.subject].assessments.push(grade);
      return acc;
    }, {} as any);

    const report = {
      student: grades[0]?.student,
      term: term || 'All Terms',
      subjects: Object.entries(subjectStats).map(([subject, stats]: [string, any]) => ({
        subject,
        average: stats.total / stats.count,
        assessments: stats.assessments,
      })),
      overallAverage: Object.values(subjectStats).reduce((acc: number, stats: any) => {
        return acc + stats.total / stats.count;
      }, 0) / Object.keys(subjectStats).length,
    };

    res.json(report);
  } catch (error) {
    next(error);
  }
};
