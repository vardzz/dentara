'use client';

import React from 'react';
import { useRole } from '@/lib/role-context';
import StudentDashboard from '@/components/app/StudentDashboard';
import PatientDashboard from '@/components/app/PatientDashboard';

export default function AppHome() {
  const { role } = useRole();

  if (role === 'student') {
    return <StudentDashboard />;
  }

  return <PatientDashboard />;
}
