import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const employee = await prisma.employee.findUnique({
      where: { id },
      include: { department: true, role: true, salary: true },
    })
    if (!employee) return NextResponse.json({ error: 'Employee not found' }, { status: 404 })
    return NextResponse.json({ employee })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    const body = await req.json()
    const {
      firstName, lastName, email, phone, address,
      dateOfBirth, joinDate, status, departmentId, roleId,
      basicSalary, allowances, deductions,
    } = body

    const employee = await prisma.employee.update({
      where: { id },
      data: {
        firstName, lastName, email,
        phone:       phone       || null,
        address:     address     || null,
        dateOfBirth: dateOfBirth ? new Date(dateOfBirth) : null,
        joinDate:    joinDate    ? new Date(joinDate)    : undefined,
        status,
        departmentId,   // string ObjectId
        roleId,
        salary: {
          upsert: {
            create: {
              basic:      parseFloat(basicSalary) || 0,
              allowances: parseFloat(allowances)  || 0,
              deductions: parseFloat(deductions)  || 0,
            },
            update: {
              basic:      parseFloat(basicSalary) || 0,
              allowances: parseFloat(allowances)  || 0,
              deductions: parseFloat(deductions)  || 0,
            },
          },
        },
      },
      include: { department: true, role: true, salary: true },
    })

    return NextResponse.json({ employee })
  } catch (err: any) {
    console.error(err)
    if (err.code === 'P2002')
      return NextResponse.json({ error: 'Email already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { id } = await params
    await prisma.employee.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}