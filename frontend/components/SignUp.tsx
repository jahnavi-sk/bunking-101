"use client";
import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

type SignProps = {
  onBack: () => void;
};

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

export default function SignUp({ onBack }: SignProps) {
  const [step, setStep] = useState(1);
  const [numSubjects, setNumSubjects] = useState(0);
  const [subjectNames, setSubjectNames] = useState<string[]>([]);
  const [numClassesPerDay, setNumClassesPerDay] = useState(0);
  const [timetable, setTimetable] = useState<string[][]>([]);
  const [attendance, setAttendance] = useState<
    { subject: string; total: number; attended: number }[]
  >([]);

  const handleBasicInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleAcademicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Proceed to attendance step
    setAttendance(subjectNames.map(subject => ({ subject, total: 0, attended: 0 })));
    setStep(3);
  };

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitted data:", {
      subjectNames,
      numClassesPerDay,
      timetable,
      attendance,
    });
    // Submit to backend later
  };

  const handleSubjectChange = (index: number, value: string) => {
    const updated = [...subjectNames];
    updated[index] = value;
    setSubjectNames(updated);
  };

  const generateEmptyTimetable = () => {
    const empty = Array(days.length)
      .fill(null)
      .map(() => Array(numClassesPerDay).fill(""));
    setTimetable(empty);
  };

  const handleTimetableChange = (dayIdx: number, slotIdx: number, value: string) => {
    const updated = [...timetable];
    updated[dayIdx][slotIdx] = value;
    setTimetable(updated);
  };

  const handleAttendanceChange = (index: number, field: "total" | "attended", value: number) => {
    const updated = [...attendance];
    updated[index][field] = value;
    setAttendance(updated);
  };

  // Fixed number input handlers
  const handleNumSubjectsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setNumSubjects(0);
      setSubjectNames([]);
      return;
    }
    const val = parseInt(value);
    if (!isNaN(val) && val >= 0) {
      setNumSubjects(val);
      setSubjectNames(Array(val).fill(""));
    }
  };

  const handleNumClassesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '') {
      setNumClassesPerDay(0);
      setTimetable([]);
      return;
    }
    const val = parseInt(value);
    if (!isNaN(val) && val >= 0) {
      setNumClassesPerDay(val);
      if (val > 0) {
        const empty = Array(days.length)
          .fill(null)
          .map(() => Array(val).fill(""));
        setTimetable(empty);
      } else {
        setTimetable([]);
      }
    }
  };

  return (
    <div className="mx-auto md:p-8 shadow-lg bg-white dark:bg-black rounded-xl space-y-6">
      {step === 1 && (
        <>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Hey, hey look who's here!</h2>
          <p className="text-neutral-600 dark:text-neutral-300 text-sm">
            Fill in your basic information to get started.
          </p>
          <form onSubmit={handleBasicInfoSubmit} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <LabelInputContainer>
                <Label>First name</Label>
                <Input placeholder="Tyler" type="text" />
              </LabelInputContainer>
              <LabelInputContainer>
                <Label>Last name</Label>
                <Input placeholder="Durden" type="text" />
              </LabelInputContainer>
            </div>
            <LabelInputContainer>
              <Label>Email</Label>
              <Input placeholder="projectmayhem@fc.com" type="email" />
            </LabelInputContainer>
            <LabelInputContainer>
              <Label>Password</Label>
              <Input placeholder="••••••••" type="password" />
            </LabelInputContainer>
            <button className="bg-gradient-to-r from-black to-gray-800 text-white rounded-md py-2 px-6 mt-4 w-full">
              Next →
            </button>
          </form>
        </>
      )}

      {step === 2 && (
        <>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Your Subjects & Timetable</h2>
          <form onSubmit={handleAcademicSubmit} className="flex flex-col lg:flex-row gap-6">
            {/* Left: Subject Input */}
            <div className="w-full lg:w-80 xl:w-96 space-y-4">
              <LabelInputContainer>
                <Label>Number of Subjects</Label>
                <Input
                  type="number"
                  value={numSubjects || ''}
                  onChange={handleNumSubjectsChange}
                  min="0"
                  placeholder="Enter number of subjects"
                />
              </LabelInputContainer>

              {subjectNames.map((subject, idx) => (
                <LabelInputContainer key={idx}>
                  <Label>Subject {idx + 1}</Label>
                  <Input
                    placeholder={`Subject ${idx + 1}`}
                    value={subject}
                    onChange={(e) => handleSubjectChange(idx, e.target.value)}
                  />
                </LabelInputContainer>
              ))}

              <LabelInputContainer>
                <Label>Number of Classes per Day</Label>
                <Input
                  type="number"
                  value={numClassesPerDay || ''}
                  onChange={handleNumClassesChange}
                  min="0"
                  placeholder="Enter classes per day"
                />
              </LabelInputContainer>
            </div>

            {/* Right: Timetable */}
            {numClassesPerDay > 0 && (
              // <div className="flex-1 min-w-0 border p-4 rounded-md bg-neutral-100 dark:bg-neutral-800">
                <div className="flex-1 min-w-0 border p-4 rounded-md bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center">

                <h3 className="text-lg font-semibold text-neutral-800 dark:text-neutral-200 mb-4">Weekly Timetable</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr>
                        <th className="text-left p-2 font-semibold w-20">Day</th>
                        {Array.from({ length: numClassesPerDay }).map((_, i) => (
                          <th key={i} className="text-left p-2 font-semibold">Class {i + 1}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {timetable.map((row, dayIdx) => (
                        <tr key={dayIdx}>
                          <td className="p-2 font-medium text-sm">{days[dayIdx]}</td>
                          {row.map((val, slotIdx) => (
                            <td key={slotIdx} className="p-2">
                              <select
                                className="w-full max-w-36 border rounded p-1 bg-white dark:bg-neutral-700 text-sm"
                                value={val}
                                onChange={(e) =>
                                  handleTimetableChange(dayIdx, slotIdx, e.target.value)
                                }
                              >
                                <option value="">Select Subject</option>
                                {subjectNames.filter(s => s.trim() !== '').map((subject, i) => (
                                  <option key={i} value={subject}>
                                    {subject}
                                  </option>
                                ))}
                              </select>
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </form>

          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setStep(1)}
              className="bg-gray-500 hover:bg-gray-600 text-white rounded-md py-2 px-6"
            >
              ← Back
            </button>
            <button
              onClick={() => setStep(3)}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-md py-2 px-6"
            >
              Next →
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200">Attendance Info</h2>
           <p className="text-neutral-600 dark:text-neutral-300 text-sm">
            Just a few more details to complete your setup!
          </p>
          <form onSubmit={handleAttendanceSubmit} className="space-y-4">
            {attendance.map((data, idx) => (
              <div key={idx} className="flex flex-col md:flex-row items-start md:items-center gap-4 p-4 border border-neutral-200 dark:border-neutral-700 rounded-lg">
                <div className="w-full md:w-1/3 font-semibold text-neutral-800 dark:text-neutral-200">
                  {data.subject}
                </div>
                <div className="w-full md:w-1/3">
                  <Label>Total Classes</Label>
                  <Input
                    type="number"
                    value={data.total}
                    min="0"
                    onChange={(e) => handleAttendanceChange(idx, "total", parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="w-full md:w-1/3">
                  <Label>Classes Attended</Label>
                  <Input
                    type="number"
                    value={data.attended}
                    min="0"
                    max={data.total}
                    onChange={(e) => handleAttendanceChange(idx, "attended", parseInt(e.target.value) || 0)}
                  />
                </div>
              </div>
            ))}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="bg-gray-500 hover:bg-gray-600 text-white rounded-md py-2 px-6 transition-colors"
              >
                ← Back
              </button>
              <button
                type="submit"
                className="bg-gradient-to-r from-black to-gray-800 hover:from-gray-800 hover:to-black text-white rounded-md py-2 px-6 transition-all"
              >
                Finish &rarr;
              </button>
            </div>
          </form>
        </>
      )}
    </div>
  );
}

const LabelInputContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={cn("flex w-full flex-col space-y-1", className)}>{children}</div>
);