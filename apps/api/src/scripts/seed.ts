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
  deptData.forEach((d) => {
    deptMap[d.name] = d.id;
  });

  // 4 — assign departments to employees
  const employeesWithDepts = employees.map((emp, i) => ({
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
}

seed();
