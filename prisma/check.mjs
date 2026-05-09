import { createRequire } from 'module'
import { config } from 'dotenv'
config()

const require = createRequire(import.meta.url)
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const admins = await prisma.admin.findMany()
console.log('✅ Admins in DB:', JSON.stringify(admins, null, 2))

const emps = await prisma.employee.findMany()
console.log('✅ Employees in DB:', emps.length)

await prisma.$disconnect()