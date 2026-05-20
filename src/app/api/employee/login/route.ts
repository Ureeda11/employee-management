import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json()

    if (!email || !password)
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 })

    const employee = await prisma.employee.findUnique({
      where: { email },
      include: { department: true, role: true }
    })

    if (!employee || !employee.password)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, employee.password)
    if (!valid)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    if (employee.status === 'inactive')
      return NextResponse.json({ error: 'Your account is inactive' }, { status: 403 })

    const token = signToken({
      id: employee.id,
      email: employee.email,
      role: 'employee'
    })

    const res = NextResponse.json({
      success: true,
      employee: {
        id: employee.id,
        name: `${employee.firstName} ${employee.lastName}`,
        email: employee.email,
        role: employee.role.name,
        department: employee.department.name,
      }
    })

    res.cookies.set('employee-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })

    return res
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}