import React, { useState, useMemo, useRef } from 'react';
import * as XLSX from 'xlsx';

import {
  User,
  UserRole,
  AttendanceRecord,
  AttendanceStatus
} from '../types';

import { MOCK_COURSES, LUMINA_STUDENT_ROSTER } from '../constants';

interface AttendancePageProps {
  user: User;
}

const INITIAL_STUDENTS = LUMINA_STUDENT_ROSTER.map((name, idx) => ({
  id: `std-${idx}`,
  name,
  email: `${name.replace(/\s+/g, '.').toLowerCase()}@lumina.edu`
}));

const AttendancePage: React.FC<AttendancePageProps> = ({ user }) => {
  const isStaff =
    user.role === UserRole.INSTRUCTOR || user.role === UserRole.ADMIN;

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [students, setStudents] = useState(INITIAL_STUDENTS);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const [selectedCourseId, setSelectedCourseId] = useState(
    MOCK_COURSES[0].id
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  const [viewMode, setViewMode] = useState<'MARK' | 'HISTORY' | 'STATS'>(
    'MARK'
  );

  const [isSaving, setIsSaving] = useState(false);

  const [instructorRegister, setInstructorRegister] = useState<
    Record<string, AttendanceStatus>
  >(
    INITIAL_STUDENTS.reduce(
      (acc, s) => ({ ...acc, [s.id]: AttendanceStatus.PRESENT }),
      {}
    )
  );

  /* -------------------- STATS CALCULATION -------------------- */
  const calculateStatsForStudent = (studentId: string) => {
    const userRecords = records.filter(r => r.studentId === studentId);
    const total = userRecords.length;

    if (total === 0)
      return { total: 0, present: 0, absent: 0, late: 0, percentage: 0 };

    const present = userRecords.filter(
      r => r.status === AttendanceStatus.PRESENT
    ).length;

    const late = userRecords.filter(
      r => r.status === AttendanceStatus.LATE
    ).length;

    const absent = userRecords.filter(
      r => r.status === AttendanceStatus.ABSENT
    ).length;

    const percentage = Math.round(((present + late) / total) * 100);

    return { total, present, late, absent, percentage };
  };

  /* -------------------- SAVE ATTENDANCE -------------------- */
  const saveAttendance = () => {
    setIsSaving(true);

    setTimeout(() => {
      const newRecords: AttendanceRecord[] = Object.entries(
        instructorRegister
      ).map(([studentId, status]) => ({
        id: crypto.randomUUID(),
        studentId,
        studentName:
          students.find(s => s.id === studentId)?.name || 'Unknown',
        courseId: selectedCourseId,
        date: selectedDate,
        status
      }));

      setRecords(prev => [...newRecords, ...prev]);
      setIsSaving(false);

      alert(`Attendance saved for ${selectedDate}`);
    }, 800);
  };

  /* -------------------- CSV ROSTER UPLOAD -------------------- */
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = e => {
      const text = e.target?.result as string;
      const rows = text.split('\n').slice(1);

      const newStudents = rows
        .filter(r => r.trim())
        .map(row => {
          const [name, email] = row.split(',').map(s => s.trim());
          return {
            id: crypto.randomUUID(),
            name,
            email
          };
        });

      setStudents(prev => [...prev, ...newStudents]);

      setInstructorRegister(prev => {
        const copy = { ...prev };
        newStudents.forEach(s => {
          copy[s.id] = AttendanceStatus.PRESENT;
        });
        return copy;
      });

      alert(`Synced ${newStudents.length} students`);
    };

    reader.readAsText(file);
  };

  /* -------------------- EXPORT: DAILY ATTENDANCE -------------------- */
  const exportDailyAttendanceExcel = () => {
    const dailyRecords = records.filter(
      r => r.date === selectedDate && r.courseId === selectedCourseId
    );

    if (dailyRecords.length === 0) {
      alert('No records found for this date');
      return;
    }

    const data = dailyRecords.map(r => ({
      Date: r.date,
      Course:
        MOCK_COURSES.find(c => c.id === r.courseId)?.title || '',
      Student: r.studentName,
      Status:
        r.status === AttendanceStatus.LATE
          ? 'Late (Present)'
          : r.status
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(wb, ws, 'Attendance');
    XLSX.writeFile(wb, `Attendance_${selectedDate}.xlsx`);
  };

  /* -------------------- EXPORT: COMPLETE ATTENDANCE -------------------- */
  const exportAllAttendanceExcel = () => {
    if (records.length === 0) {
      alert('No attendance data available');
      return;
    }

    const wb = XLSX.utils.book_new();

    const uniqueDates = Array.from(
      new Set(records.map(r => r.date))
    ).sort();

    uniqueDates.forEach(date => {
      const dayRecords = records.filter(r => r.date === date);

      const sheetData = dayRecords.map(r => ({
        Date: r.date,
        Course:
          MOCK_COURSES.find(c => c.id === r.courseId)?.title || '',
        Student: r.studentName,
        Status:
          r.status === AttendanceStatus.LATE
            ? 'Late (Present)'
            : r.status
      }));

      const ws = XLSX.utils.json_to_sheet(sheetData);
      XLSX.utils.book_append_sheet(wb, ws, date);
    });

    XLSX.writeFile(wb, 'Complete_Attendance_Report.xlsx');
  };

  /* -------------------- STUDENT VIEW -------------------- */
  const studentStats = useMemo(
    () => calculateStatsForStudent(user.id),
    [records, user.id]
  );

  /* -------------------- UI -------------------- */
  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h2 className="text-4xl font-black mb-2">Attendance Intelligence</h2>
      <p className="text-gray-500 mb-10">
        Day-wise attendance tracking & Excel export
      </p>

      {user.role === UserRole.STUDENT ? (
        <div className="bg-white p-10 rounded-3xl shadow">
          <h3 className="text-2xl font-black mb-6">My Attendance</h3>
          <p>Total Sessions: {studentStats.total}</p>
          <p>Present (Incl. Late): {studentStats.present + studentStats.late}</p>
          <p>Absent: {studentStats.absent}</p>
          <p>Percentage: {studentStats.percentage}%</p>
        </div>
      ) : (
        <>
          {/* CONTROLS */}
          <div className="flex flex-wrap gap-4 mb-8">
            <input
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-100 font-bold"
            />

            <select
              value={selectedCourseId}
              onChange={e => setSelectedCourseId(e.target.value)}
              className="px-4 py-2 rounded-xl bg-gray-100 font-bold"
            >
              {MOCK_COURSES.map(c => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>

            <button
              onClick={exportDailyAttendanceExcel}
              className="px-6 py-2 rounded-xl bg-emerald-500 text-white font-black"
            >
              Export Daily Attendance
            </button>

            <button
              onClick={exportAllAttendanceExcel}
              className="px-6 py-2 rounded-xl bg-indigo-500 text-white font-black"
            >
              Export Full Attendance
            </button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".csv"
              hidden
            />

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-6 py-2 rounded-xl bg-gray-200 font-black"
            >
              Sync Roster
            </button>
          </div>

          {/* MARK ATTENDANCE */}
          <div className="bg-white rounded-3xl shadow p-8">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs uppercase text-gray-400">
                  <th>Student</th>
                  <th className="text-center">Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map(s => (
                  <tr key={s.id} className="border-t">
                    <td className="py-4 font-bold">{s.name}</td>
                    <td className="flex justify-center gap-2 py-4">
                      {[AttendanceStatus.PRESENT,
                        AttendanceStatus.ABSENT,
                        AttendanceStatus.LATE].map(status => (
                        <button
                          key={status}
                          onClick={() =>
                            setInstructorRegister(prev => ({
                              ...prev,
                              [s.id]: status
                            }))
                          }
                          className={`px-4 py-2 rounded-xl text-xs font-black ${
                            instructorRegister[s.id] === status
                              ? 'bg-indigo-500 text-white'
                              : 'bg-gray-100'
                          }`}
                        >
                          {status === AttendanceStatus.LATE
                            ? 'Late (Present)'
                            : status}
                        </button>
                      ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <button
              onClick={saveAttendance}
              disabled={isSaving}
              className="w-full mt-8 py-4 bg-purple-600 text-white font-black rounded-2xl"
            >
              {isSaving ? 'Saving...' : 'Finalize Attendance'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AttendancePage;
