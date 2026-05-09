// prisma/seed.mjs
import { createRequire } from 'module'
import { config } from 'dotenv'
config()

const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Admin
  const pw = await bcrypt.hash('ureeda123', 12)
  await prisma.admin.upsert({
    where: { email: 'ureeda@company.com' },
    update: {},
    create: { email: 'ureeda@company.com', password: pw, name: 'Ureeda', role: 'superadmin' },
  })
  console.log('✅ Admin created')

  // Departments
  const deptData = [
    { name: 'Engineering',     description: 'Software development and infrastructure' },
    { name: 'Marketing',       description: 'Brand and growth strategies' },
    { name: 'Human Resources', description: 'People operations and culture' },
    { name: 'Finance',         description: 'Accounting and financial planning' },
    { name: 'Product',         description: 'Product design and management' },
  ]
  for (const d of deptData) {
    await prisma.department.upsert({ where: { name: d.name }, update: {}, create: d })
  }
  console.log('✅ Departments created')

  // Roles
  const roleData = [
    { name: 'Software Engineer', description: 'Develops software products' },
    { name: 'Senior Engineer',   description: 'Leads technical projects' },
    { name: 'Manager',           description: 'Team management and strategy' },
    { name: 'Designer',          description: 'UI/UX design' },
    { name: 'Analyst',           description: 'Data and business analysis' },
    { name: 'HR Specialist',     description: 'HR operations' },
  ]
  for (const r of roleData) {
    await prisma.role.upsert({ where: { name: r.name }, update: {}, create: r })
  }
  console.log('✅ Roles created')

  // Employees
  const eng = await prisma.department.findUnique({ where: { name: 'Engineering' } })
  const mkt = await prisma.department.findUnique({ where: { name: 'Marketing' } })
  const hr  = await prisma.department.findUnique({ where: { name: 'Human Resources' } })
  const se  = await prisma.role.findUnique({ where: { name: 'Software Engineer' } })
  const mgr = await prisma.role.findUnique({ where: { name: 'Manager' } })
  const hrs = await prisma.role.findUnique({ where: { name: 'HR Specialist' } })

  const employees = [
    { employeeId: 'EMP001', firstName: 'Alice', lastName: 'Johnson', email: 'alice@company.com', phone: '+1-555-0101', departmentId: eng.id, roleId: se.id,  status: 'active',   salary: { basic: 85000, allowances: 10000, deductions: 5000 } },
    { employeeId: 'EMP002', firstName: 'Bob',   lastName: 'Smith',   email: 'bob@company.com',   phone: '+1-555-0102', departmentId: eng.id, roleId: mgr.id, status: 'active',   salary: { basic: 120000, allowances: 20000, deductions: 8000 } },
    { employeeId: 'EMP003', firstName: 'Carol', lastName: 'Williams',email: 'carol@company.com', phone: '+1-555-0103', departmentId: mkt.id, roleId: mgr.id, status: 'active',   salary: { basic: 95000, allowances: 15000, deductions: 6000 } },
    { employeeId: 'EMP004', firstName: 'David', lastName: 'Brown',   email: 'david@company.com', phone: '+1-555-0104', departmentId: hr.id,  roleId: hrs.id, status: 'on_leave', salary: { basic: 65000, allowances: 8000,  deductions: 4000 } },
    { employeeId: 'EMP005', firstName: 'Eve',   lastName: 'Davis',   email: 'eve@company.com',   phone: '+1-555-0105', departmentId: eng.id, roleId: se.id,  status: 'active',   salary: { basic: 90000, allowances: 12000, deductions: 5500 } },
  ]

  for (const { salary, ...emp } of employees) {
    const created = await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: emp,
    })
    await prisma.salary.upsert({
      where: { employeeId: created.id },
      update: {},
      create: { employeeId: created.id, ...salary },
    })
  }
  console.log('✅ Employees created')
  console.log('')
  console.log('🎉 Done! Login: ureeda@company.com / ureeda123')
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())