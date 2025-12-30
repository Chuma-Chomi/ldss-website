import { Request, Response, NextFunction } from 'express';
import { prisma } from '../lib/prisma';
import { ApiError } from '../utils/errors';
import { asyncHandler } from '../utils/asyncHandler';
import { z } from 'zod';
import { StaffRole } from '@prisma/client';

const staffSchema = z.object({
  tsNumber: z.string().min(3).optional(),
  position: z.nativeEnum(StaffRole),
  subjects: z.any().optional(),
  profile: z.object({
    firstName: z.string().min(2),
    lastName: z.string().min(2),
    phone: z.string().optional(),
  }),
});

export const listStaff = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const staff = await prisma.staff.findMany({
      include: { profile: true, classes: true },
      orderBy: { createdAt: 'desc' },
    });
    return res.json(staff);
  } catch (error) {
    return next(error);
  }
};

export const getStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const staffMember = await prisma.staff.findUnique({
      where: { id },
      include: { profile: true, classes: true },
    });

    if (!staffMember) throw new ApiError(404, 'Staff member not found');
    return res.json(staffMember);
  } catch (error) {
    return next(error);
  }
};

export const createStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = staffSchema.parse(req.body);

    const staff = await prisma.staff.create({
      data: {
        tsNumber: payload.tsNumber || `TS-${Date.now()}`,
        position: payload.position,
        subjects: payload.subjects,
        profile: {
          create: {
            firstName: payload.profile.firstName,
            lastName: payload.profile.lastName,
            phone: payload.profile.phone,
            type: 'STAFF',
          },
        },
      },
      include: { profile: true },
    });

    return res.status(201).json(staff);
  } catch (error) {
    return next(error);
  }
};

export const updateStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const payload = staffSchema.partial().parse(req.body);

    const existing = await prisma.staff.findUnique({ where: { id } });
    if (!existing) throw new ApiError(404, 'Staff member not found');

    const staff = await prisma.staff.update({
      where: { id },
      data: {
        position: payload.position,
        subjects: payload.subjects,
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

    return res.json(staff);
  } catch (error) {
    return next(error);
  }
};

export const deleteStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    await prisma.staff.delete({ where: { id } });
    return res.status(204).send();
  } catch (error) {
    return next(error);
  }
};

// Mark attendance for a class
export const markAttendance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { classId, date, attendanceRecords } = req.body;
  
  // Delete existing attendance for this class and date
  await prisma.attendance.deleteMany({
    where: {
      classId,
      date: new Date(date)
    }
  });

  // Create new attendance records
  const attendance = await prisma.attendance.createMany({
    data: attendanceRecords.map((record: any) => ({
      studentId: record.studentId,
      classId,
      date: new Date(date),
      status: record.status, // 'PRESENT', 'ABSENT', 'LATE'
      remarks: record.remarks || ''
    }))
  });

  res.json({
    success: true,
    data: attendance,
    message: 'Attendance marked successfully'
  });
});

// Get attendance for a class on a specific date
export const getAttendance = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { classId, date } = req.query;
  
  const attendance = await prisma.attendance.findMany({
    where: {
      classId: classId as string,
      date: new Date(date as string)
    },
    include: {
      student: {
        include: {
          profile: true
        }
      }
    }
  });

  res.json({
    success: true,
    data: attendance
  });
});

// Get classes for a staff member
export const getStaffClasses = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as any;
  const userId = authReq.user?.userId;
  
  // First get the staff record for this user
  const staff = await prisma.staff.findFirst({
    where: {
      profile: {
        userId
      }
    }
  });

  if (!staff) {
    return res.status(404).json({
      success: false,
      message: 'Staff record not found'
    });
  }
  
  const classes = await prisma.class.findMany({
    where: {
      instructorId: staff.id
    },
    include: {
      enrollments: {
        include: {
          student: {
            include: {
              profile: true
            }
          }
        }
      }
    }
  });

  res.json({
    success: true,
    data: classes
  });
});

// Submit grades for students (using announcements for now since no Grade model exists)
export const submitGrades = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const { classId, subject, examType, grades } = req.body;
  
  // For now, we'll store grades as announcements since there's no Grade model
  // In a real implementation, you'd want to add a Grade model to the schema
  
  const gradeAnnouncement = await prisma.announcement.create({
    data: {
      title: `Grades: ${subject} - ${examType}`,
      body: JSON.stringify({
        classId,
        subject,
        examType,
        grades: grades.map((grade: any) => ({
          studentId: grade.studentId,
          marks: grade.marks,
          maxMarks: grade.maxMarks,
          grade: grade.grade,
          remarks: grade.remarks || ''
        }))
      }),
      audience: 'STAFF', // Only visible to staff
      published: true
    }
  });

  res.json({
    success: true,
    data: gradeAnnouncement,
    message: 'Grades submitted successfully'
  });
});
