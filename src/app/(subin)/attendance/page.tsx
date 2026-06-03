import { AttendanceRegister } from "@/components/forms/attendance-register";
import { PageHeader } from "@/components/layout/app-shell";
import { Card } from "@/components/ui/card";
import { getAttendance, getBatches, getStudents } from "@/lib/data";

export const metadata = { title: "Attendance" };


export default async function AttendancePage() {
  const [students, batches, attendance] = await Promise.all([getStudents(), getBatches(), getAttendance(new Date())]);
  return (
    <>
      <PageHeader title="Attendance" description="Monthly register with single-click status selection and auto-save." />
      <Card>
        <AttendanceRegister students={students} batches={batches} attendance={attendance} />
      </Card>
    </>
  );
}
