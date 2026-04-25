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
  hasMore: boolean;
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

function scoreFieldMatch(value: string, query?: string): number {
  const normalizedValue = normalize(value);
  const normalizedQuery = normalize(query);

  if (!normalizedValue || !normalizedQuery) {
    return 0;
  }

  if (normalizedValue.includes(normalizedQuery)) {
    return 3;
  }

  return tokenize(normalizedQuery).reduce((acc, token) => acc + (normalizedValue.includes(token) ? 1 : 0), 0);
}

export async function searchPatients(
  query?: string,
  locationFilter?: string,
  page: number = 1,
): Promise<SearchResponse<PatientDiscoveryItem>> {
  try {
    const session = await auth();
    const normalizedQuery = normalize(query);
    const normalizedLocation = normalize(locationFilter);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    let studentNeedKeywords: string[] = [];

    if (session?.user?.id && session.user.role === 'student') {
      const studentProfile = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { casesJson: true },
      });
      studentNeedKeywords = getCaseKeywords(parseCasesJson(studentProfile?.casesJson));
    }

    const dbPatients = await prisma.user.findMany({
      where: { role: 'patient' },
      select: {
        id: true,
        fullName: true,
        concern: true,
        location: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: pageSize + 1,
      skip: skip,
    });

    const hasMore = dbPatients.length > pageSize;
    const itemsToReturn = dbPatients.slice(0, pageSize);

    const combined: PatientDiscoveryItem[] = itemsToReturn.map((patient) => ({
      id: patient.id,
      fullName: patient.fullName,
      concern: patient.concern ?? '',
      location: patient.location ?? '',
    }));

    const ranked = combined
      .map((patient, index) => ({
        patient,
        index,
        score:
          scoreByKeywordOverlap(patient.concern, studentNeedKeywords) * 4 +
          scoreFieldMatch(`${patient.fullName} ${patient.concern}`, normalizedQuery) * 2 +
          scoreFieldMatch(patient.location, normalizedLocation),
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
      hasMore,
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
  specialtyFilter?: string,
  locationFilter?: string,
  page: number = 1,
): Promise<SearchResponse<StudentDiscoveryItem>> {
  try {
    const session = await auth();
    const normalizedQuery = normalize(query);
    const normalizedSpecialty = normalize(specialtyFilter);
    const normalizedLocation = normalize(locationFilter);
    const pageSize = 10;
    const skip = (page - 1) * pageSize;

    let patientNeedKeywords: string[] = [];

    if (session?.user?.id && session.user.role === 'patient') {
      const patientProfile = await prisma.user.findUnique({
        where: { id: session.user.id },
        select: { concern: true },
      });
      patientNeedKeywords = tokenize(patientProfile?.concern ?? '');
    }

    const dbStudents = await prisma.user.findMany({
      where: { role: 'student' },
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
      take: pageSize + 1,
      skip: skip,
    });

    const hasMore = dbStudents.length > pageSize;
    const itemsToReturn = dbStudents.slice(0, pageSize);

    const combined: StudentDiscoveryItem[] = itemsToReturn.map((student) => ({
      id: student.id,
      fullName: student.fullName,
      school: student.school ?? '',
      yearLevel: student.yearLevel ?? '',
      clinicAddress: student.clinicAddress ?? '',
      cases: parseCasesJson(student.casesJson),
      availabilityJson: student.availabilityJson,
    }));

    const ranked = combined
      .map((student, index) => {
        const studentKeywords = getCaseKeywords(student.cases);
        const score = patientNeedKeywords.length
          ? scoreByKeywordOverlap(studentKeywords.join(' '), patientNeedKeywords) * 4
          : 0;

        const specialtyBoost = normalizedSpecialty
          ? student.cases.some((item) => item.name && item.name.trim().length > 0 && item.name.trim().toLowerCase().includes(normalizedSpecialty)) ||
            student.cases.some((item) => item.name && item.name.trim().length > 0 && item.name.trim().toLowerCase() === normalizedSpecialty)
            ? 2
            : 0
          : 0;

        const queryBoost = scoreFieldMatch(`${student.fullName} ${student.clinicAddress}`, normalizedQuery) * 2;
        const locationBoost = scoreFieldMatch(student.clinicAddress, normalizedLocation);

        return {
          student,
          index,
          score: score + specialtyBoost + queryBoost + locationBoost,
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
      hasMore,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      success: false,
      error: `Failed to search students: ${message}`,
    };
  }
}
