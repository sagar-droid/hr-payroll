import "../lib/env";
import { supabase } from "../lib/supabase";

const departments = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Operations",
];

const employees = [
  {
    first_name: "Alice",
    last_name: "Johnson",
    email: "alice.johnson@company.com",
    job_title: "Senior Engineer",
    employment_type: "FULL_TIME",
    employment_status: "ACTIVE",
    salary: 95000,
  },
  {
    first_name: "Bob",
    last_name: "Smith",
    email: "bob.smith@company.com",
    job_title: "Product Manager",
    employment_type: "FULL_TIME",
    employment_status: "ACTIVE",
    salary: 88000,
  },
  {
    first_name: "Carol",
    last_name: "White",
    email: "carol.white@company.com",
    job_title: "HR Specialist",
    employment_type: "FULL_TIME",
    employment_status: "ACTIVE",
    salary: 62000,
  },
  {
    first_name: "David",
    last_name: "Brown",
    email: "david.brown@company.com",
    job_title: "Financial Analyst",
    employment_type: "FULL_TIME",
    employment_status: "ACTIVE",
    salary: 72000,
  },
  {
    first_name: "Eve",
    last_name: "Davis",
    email: "eve.davis@company.com",
    job_title: "Marketing Lead",
    employment_type: "FULL_TIME",
    employment_status: "ACTIVE",
    salary: 78000,
  },
  {
    first_name: "Frank",
    last_name: "Miller",
    email: "frank.miller@company.com",
    job_title: "Junior Engineer",
    employment_type: "FULL_TIME",
    employment_status: "ACTIVE",
    salary: 65000,
  },
  {
    first_name: "Grace",
    last_name: "Wilson",
    email: "grace.wilson@company.com",
    job_title: "DevOps Engineer",
    employment_type: "FULL_TIME",
    employment_status: "ACTIVE",
    salary: 90000,
  },
  {
    first_name: "Henry",
    last_name: "Moore",
    email: "henry.moore@company.com",
    job_title: "Accountant",
    employment_type: "PART_TIME",
    employment_status: "ACTIVE",
    salary: 45000,
  },
  {
    first_name: "Iris",
    last_name: "Taylor",
    email: "iris.taylor@company.com",
    job_title: "UI Designer",
    employment_type: "CONTRACT",
    employment_status: "ACTIVE",
    salary: 70000,
  },
  {
    first_name: "Jack",
    last_name: "Anderson",
    email: "jack.anderson@company.com",
    job_title: "Operations Manager",
    employment_type: "FULL_TIME",
    employment_status: "ON_LEAVE",
    salary: 82000,
  },
  {
    first_name: "Karen",
    last_name: "Thomas",
    email: "karen.thomas@company.com",
    job_title: "Data Analyst",
    employment_type: "FULL_TIME",
    employment_status: "ACTIVE",
    salary: 74000,
  },
  {
    first_name: "Leo",
    last_name: "Jackson",
    email: "leo.jackson@company.com",
    job_title: "Backend Engineer",
    employment_type: "FULL_TIME",
    employment_status: "ACTIVE",
    salary: 87000,
  },
];

async function seed() {
  console.log("🌱 Seeding database...");

  // 1 — clear existing data (order matters due to FK constraints)
  console.log("Clearing existing data...");
  await supabase
    .from("employees")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");
  await supabase
    .from("departments")
    .delete()
    .neq("id", "00000000-0000-0000-0000-000000000000");

  // 2 — seed departments
  console.log("Seeding departments...");
  const { data: deptData, error: deptError } = await supabase
    .from("departments")
    .insert(departments.map((name) => ({ name })))
    .select();

  if (deptError) {
    console.error("Failed to seed departments:", deptError.message);
    process.exit(1);
  }

  console.log(`✓ Created ${deptData.length} departments`);

  // 3 — map department names to ids
  const deptMap: Record<string, string> = {};
  deptData.forEach((d: { id: string; name: string }) => {
    deptMap[d.name] = d.id;
  });

  // 4 — assign departments to employees
  const employeesWithDepts = employees.map((emp: any, i: number) => ({
    ...emp,
    department_id: deptData[i % deptData.length].id,
    joined_at: new Date(
      Date.now() - Math.floor(Math.random() * 365 * 2) * 24 * 60 * 60 * 1000
    )
      .toISOString()
      .split("T")[0],
  }));

  // 5 — seed employees
  console.log("Seeding employees...");
  const { data: empData, error: empError } = await supabase
    .from("employees")
    .insert(employeesWithDepts)
    .select();

  if (empError) {
    console.error("Failed to seed employees:", empError.message);
    process.exit(1);
  }

  console.log(`✓ Created ${empData.length} employees`);
  console.log("✅ Seeding complete!");

  // 6 — seed attendance records (last 30 days for each employee)
  console.log("Seeding attendance records...");
  const attendanceRecords: {
    employee_id: string;
    date: string;
    check_in: string;
    check_out: string;
    hours_worked: number;
  }[] = [];
  const today = new Date();

  for (const emp of empData) {
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);

      // skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      // 90% attendance rate
      if (Math.random() > 0.9) continue;

      const checkInHour = 8 + Math.floor(Math.random() * 2);
      const checkInMin = Math.floor(Math.random() * 60);
      const checkIn = new Date(date);
      checkIn.setHours(checkInHour, checkInMin, 0, 0);

      const checkOut = new Date(checkIn);
      checkOut.setHours(
        checkInHour + 7 + Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 60),
        0,
        0
      );

      const hours_worked =
        Math.round(
          ((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60)) * 100
        ) / 100;

      attendanceRecords.push({
        employee_id: emp.id,
        date: date.toISOString().split("T")[0],
        check_in: checkIn.toISOString(),
        check_out: checkOut.toISOString(),
        hours_worked,
      });
    }
  }

  const { error: attError } = await supabase
    .from("attendance_records")
    .insert(attendanceRecords);

  if (attError) {
    console.error("Failed to seed attendance:", attError.message);
    process.exit(1);
  }

  console.log(`✓ Created ${attendanceRecords.length} attendance records`);

  // 7 — seed leave requests
  console.log("Seeding leave requests...");
  const { data: leaveTypes } = await supabase
    .from("leave_types")
    .select("id")
    .limit(3);

  if (leaveTypes && leaveTypes.length > 0) {
    const leaveRequests = empData.slice(0, 6).map((emp: any, i: number) => ({
      employee_id: emp.id,
      leave_type_id: leaveTypes[i % leaveTypes.length].id,
      start_date: new Date(today.getTime() + (i + 1) * 7 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      end_date: new Date(
        today.getTime() + ((i + 1) * 7 + 3) * 24 * 60 * 60 * 1000
      )
        .toISOString()
        .split("T")[0],
      days_requested: 3,
      status: i < 2 ? "APPROVED" : i < 4 ? "REJECTED" : "PENDING",
      reason: "Personal reasons",
    }));

    const { error: leaveError } = await supabase
      .from("leave_requests")
      .insert(leaveRequests);

    if (leaveError) {
      console.error("Failed to seed leave requests:", leaveError.message);
    } else {
      console.log(`✓ Created ${leaveRequests.length} leave requests`);
    }
  }
}

seed();
