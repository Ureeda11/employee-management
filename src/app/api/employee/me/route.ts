import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const token = req.cookies.get('employee-token')?.value
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const payload = verifyToken(token)
    if (!payload) return NextResponse.json({ error: 'Invalid token' }, { status: 401 })

    const employee = await prisma.employee.findUnique({
      where: { id: payload.id },
      include: { department: true, role: true, salary: true },
    })

    if (!employee) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    // Password return mat karo
    const { password: _, ...safeEmployee } = employee
    return NextResponse.json({ employee: safeEmployee })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
