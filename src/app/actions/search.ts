'use server';

import { auth } from '@/auth';
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
  availabilityJson: string | null;
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

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .map((token) => token.trim())
    .filter((token) => token.length >= 3);
}

function getCaseKeywords(cases: CaseRequirement[]): string[] {
  const synonyms: Record<string, string[]> = {
    extraction: ['extract', 'removal', 'remove', 'impacted', 'wisdom'],
    endodontics: ['root', 'canal', 'pulp'],
    prosthodontics: ['crown', 'bridge', 'denture', 'prosthetic'],
    orthodontics: ['braces', 'aligner', 'malocclusion'],
    periodontics: ['gum', 'gingiva', 'periodontal'],
    cleaning: ['cleaning', 'prophylaxis', 'oral', 'hygiene'],
    restoration: ['filling', 'restoration', 'restorative'],
    surgery: ['surgery', 'surgical', 'operation'],
  };

  const keywordSet = new Set<string>();

  for (const item of cases) {
    const baseTokens = tokenize(item.name);
    for (const token of baseTokens) {
      keywordSet.add(token);
      const related = synonyms[token];
      if (related) {
        for (const synonym of related) {
          keywordSet.add(synonym);
        }
      }
    }
  }

  return Array.from(keywordSet);
}

function scoreByKeywordOverlap(text: string, keywords: string[]): number {
  if (!text || !keywords.length) {
    return 0;
  }

  const normalizedText = text.toLowerCase();
  let score = 0;

  for (const keyword of keywords) {
    if (normalizedText.includes(keyword)) {
      score += 1;
    }
  }

  return score;
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
    const session = await auth();
    const normalizedQuery = normalize(query);
    const normalizedLocation = normalize(locationFilter);

    let studentNeedKeywords: string[] = [];

    if (session?.user?.id && session.user.role === 'student') {
      const studentProfile = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { casesJson: true },
      });
      studentNeedKeywords = getCaseKeywords(parseCasesJson(studentProfile?.casesJson));
    }

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

    const combined = [...normalizedDbPatients, ...filteredMockPatients];
    const ranked = combined
      .map((patient, index) => ({
        patient,
        index,
        score: scoreByKeywordOverlap(patient.concern, studentNeedKeywords),
      }))
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.index - b.index;
      })
      .map((item) => item.patient);

    return {
      success: true,
      data: ranked,
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
      availabilityJson: JSON.stringify({ Mon: true, Tue: true, Wed: true, Thu: true, Fri: true }),
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
      availabilityJson: JSON.stringify({ Mon: true, Tue: true, Wed: false, Thu: true, Fri: true }),
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
      availabilityJson: JSON.stringify({ Tue: true, Thu: true, Sat: true }),
    },
  ];

  try {
    const session = await auth();
    const normalizedQuery = normalize(query);
    const normalizedSchool = normalize(schoolFilter);
    const normalizedLocation = normalize(locationFilter);

    let patientNeedKeywords: string[] = [];

    if (session?.user?.id && session.user.role === 'patient') {
      const patientProfile = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { concern: true },
      });
      patientNeedKeywords = tokenize(patientProfile?.concern ?? '');
    }

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
        availabilityJson: true,
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
      availabilityJson: student.availabilityJson,
    }));

    const combined = [...normalizedDbStudents, ...filteredMockStudents];
    const ranked = combined
      .map((student, index) => {
        const studentKeywords = getCaseKeywords(student.cases);
        const score = patientNeedKeywords.length
          ? scoreByKeywordOverlap(studentKeywords.join(' '), patientNeedKeywords)
          : 0;

        return {
          student,
          index,
          score,
        };
      })
      .sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.index - b.index;
      })
      .map((item) => item.student);

    return {
      success: true,
      data: ranked,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to search students: ${message}`,
    };
  }
}
