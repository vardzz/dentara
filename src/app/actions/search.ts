'use server';

import type { Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';

type CaseRequirement = {
  name: string;
  count: number;
};

type PatientDiscoveryItem = {
  id: string;
  fullName: string;
  concern: string;
  location: string;
};

type StudentDiscoveryItem = {
  id: string;
  fullName: string;
  school: string;
  yearLevel: string;
  clinicAddress: string;
  cases: CaseRequirement[];
};

type SearchSuccess<T> = {
  success: true;
  data: T[];
};

type SearchFailure = {
  success: false;
  error: string;
};

type SearchResponse<T> = SearchSuccess<T> | SearchFailure;

function normalize(value?: string): string {
  return value?.trim().toLowerCase() ?? '';
}

function parseCasesJson(input: unknown): CaseRequirement[] {
  if (Array.isArray(input)) {
    return input.filter(
      (item): item is CaseRequirement =>
        !!item &&
        typeof item === 'object' &&
        'name' in item &&
        'count' in item &&
        typeof (item as { name?: unknown }).name === 'string' &&
        typeof (item as { count?: unknown }).count === 'number',
    );
  }

  if (typeof input === 'string' && input.trim().length > 0) {
    try {
      const parsed = JSON.parse(input) as unknown;
      return parseCasesJson(parsed);
    } catch {
      return [];
    }
  }

  return [];
}

export async function searchPatients(
  query?: string,
  locationFilter?: string,
): Promise<SearchResponse<PatientDiscoveryItem>> {
  const mockPatients: PatientDiscoveryItem[] = [
    {
      id: 'mock-patient-1',
      fullName: 'Isabella Torres',
      concern: 'Impacted Wisdom Tooth',
      location: 'Makati City',
    },
    {
      id: 'mock-patient-2',
      fullName: 'Daniel Cruz',
      concern: 'Deep Dental Cleaning',
      location: 'Taguig City',
    },
    {
      id: 'mock-patient-3',
      fullName: 'Sofia Ramirez',
      concern: 'Front Tooth Restoration',
      location: 'Quezon City',
    },
  ];

  try {
    const normalizedQuery = normalize(query);
    const normalizedLocation = normalize(locationFilter);

    const where: Prisma.UserWhereInput = {
      role: 'patient',
      ...(normalizedQuery
        ? {
            OR: [
              { fullName: { contains: normalizedQuery, mode: 'insensitive' } },
              { concern: { contains: normalizedQuery, mode: 'insensitive' } },
            ],
          }
        : {}),
      ...(normalizedLocation
        ? {
            location: { contains: normalizedLocation, mode: 'insensitive' },
          }
        : {}),
    };

    const dbPatients = await prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        concern: true,
        location: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const filteredMockPatients = mockPatients.filter((patient) => {
      const matchesQuery =
        !normalizedQuery ||
        normalize(patient.fullName).includes(normalizedQuery) ||
        normalize(patient.concern).includes(normalizedQuery);

      const matchesLocation =
        !normalizedLocation ||
        normalize(patient.location).includes(normalizedLocation);

      return matchesQuery && matchesLocation;
    });

    const normalizedDbPatients: PatientDiscoveryItem[] = dbPatients.map((patient) => ({
      id: patient.id,
      fullName: patient.fullName,
      concern: patient.concern ?? '',
      location: patient.location ?? '',
    }));

    return {
      success: true,
      data: [...normalizedDbPatients, ...filteredMockPatients],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to search patients: ${message}`,
    };
  }
}

export async function searchStudents(
  query?: string,
  schoolFilter?: string,
  locationFilter?: string,
): Promise<SearchResponse<StudentDiscoveryItem>> {
  const mockStudents: StudentDiscoveryItem[] = [
    {
      id: 'mock-student-1',
      fullName: 'Clinician Mateo',
      school: 'UP College of Dentistry',
      yearLevel: '5th Year',
      clinicAddress: 'Pedro Gil, Manila',
      cases: [
        { name: 'Prosthodontics', count: 2 },
        { name: 'Endodontics', count: 1 },
      ],
    },
    {
      id: 'mock-student-2',
      fullName: 'Ariana Delgado',
      school: 'Centro Escolar University School of Dentistry',
      yearLevel: '4th Year',
      clinicAddress: 'Mendiola, Manila',
      cases: [
        { name: 'Extraction', count: 3 },
        { name: 'Oral Prophylaxis', count: 2 },
      ],
    },
    {
      id: 'mock-student-3',
      fullName: 'Liam Bautista',
      school: 'University of the East College of Dentistry',
      yearLevel: '5th Year',
      clinicAddress: 'Caloocan City',
      cases: [
        { name: 'Operative Dentistry', count: 2 },
        { name: 'Crown Preparation', count: 1 },
      ],
    },
  ];

  try {
    const normalizedQuery = normalize(query);
    const normalizedSchool = normalize(schoolFilter);
    const normalizedLocation = normalize(locationFilter);

    const where: Prisma.UserWhereInput = {
      role: 'student',
      ...(normalizedQuery
        ? {
            OR: [
              { fullName: { contains: normalizedQuery, mode: 'insensitive' } },
              {
                clinicAddress: {
                  contains: normalizedQuery,
                  mode: 'insensitive',
                },
              },
            ],
          }
        : {}),
      ...(normalizedSchool
        ? {
            school: {
              equals: schoolFilter?.trim(),
              mode: 'insensitive',
            },
          }
        : {}),
      ...(normalizedLocation
        ? {
            clinicAddress: {
              contains: normalizedLocation,
              mode: 'insensitive',
            },
          }
        : {}),
    };

    const dbStudents = await prisma.user.findMany({
      where,
      select: {
        id: true,
        fullName: true,
        school: true,
        yearLevel: true,
        clinicAddress: true,
        casesJson: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    const filteredMockStudents = mockStudents.filter((student) => {
      const matchesQuery =
        !normalizedQuery ||
        normalize(student.fullName).includes(normalizedQuery) ||
        normalize(student.clinicAddress).includes(normalizedQuery);

      const matchesSchool =
        !normalizedSchool || normalize(student.school) === normalizedSchool;

      const matchesLocation =
        !normalizedLocation ||
        normalize(student.clinicAddress).includes(normalizedLocation);

      return matchesQuery && matchesSchool && matchesLocation;
    });

    const normalizedDbStudents: StudentDiscoveryItem[] = dbStudents.map((student) => ({
      id: student.id,
      fullName: student.fullName,
      school: student.school ?? '',
      yearLevel: student.yearLevel ?? '',
      clinicAddress: student.clinicAddress ?? '',
      cases: parseCasesJson(student.casesJson),
    }));

    return {
      success: true,
      data: [...normalizedDbStudents, ...filteredMockStudents],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to search students: ${message}`,
    };
  }
}
