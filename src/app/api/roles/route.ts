import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthUser } from '@/lib/auth'

export async function GET() {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const roles = await prisma.role.findMany({
      include: { _count: { select: { employees: true } } },
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ roles })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getAuthUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { name, description } = await req.json()
    if (!name) return NextResponse.json({ error: 'Name is required' }, { status: 400 })

    const role = await prisma.role.create({ data: { name, description } })
    return NextResponse.json({ role }, { status: 201 })
  } catch (err: any) {
    if (err.code === 'P2002')
      return NextResponse.json({ error: 'Role name already exists' }, { status: 409 })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

