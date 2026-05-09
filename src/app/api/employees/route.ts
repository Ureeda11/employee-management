import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const search       = searchParams.get('search') ?? ''
    const departmentId = searchParams.get('departmentId')
    const status       = searchParams.get('status')
    const page         = parseInt(searchParams.get('page') ?? '1')
    const limit        = parseInt(searchParams.get('limit') ?? '10')
    const skip         = (page - 1) * limit

    const where: any = {}
    if (search) {
      where.OR = [
        { firstName:  { contains: search, mode: 'insensitive' } },
        { lastName:   { contains: search, mode: 'insensitive' } },
        { email:      { contains: search, mode: 'insensitive' } },
        { employeeId: { contains: search, mode: 'insensitive' } },
      ]
    }
    if (departmentId) where.departmentId = departmentId  
    if (status)       where.status = status

    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where, skip, take: limit,
        include: { department: true, role: true, salary: true },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.employee.count({ where }),
    ])

    return NextResponse.json({
      employees,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const body = await req.json()
    const {
      firstName, lastName, email, phone, address,
      dateOfBirth, joinDate, status, departmentId, roleId,
      basicSalary, allowances, deductions,
    } = body

    if (!firstName || !lastName || !email || !departmentId || !roleId)
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })

    const count = await prisma.employee.count()
    const employeeId = `EMP${String(count + 1).padStart(3, '0')}`

    const employee = await prisma.employee.create({
      data: {
        employeeId,
        firstName, lastName, email,
        phone:       phone       || null,
        address:     address     || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        joinDate:    joinDate    ? new Date(joinDate)    : new Date(),
        status:      status      ?? 'active',
        departmentId,   
        roleId,
        salary: {
          create: {
            basic:      parseFloat(basicSalary) || 0,
            allowances: parseFloat(allowances)  || 0,
            deductions: parseFloat(deductions)  || 0,
          },
        },
      },
      include: { department: true, role: true, salary: true },
    })

    return NextResponse.json({ employee }, { status: 201 })
  } catch (err: any) {
    console.error(err)
    if (err.code === 'P2002')
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}