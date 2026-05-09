import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { signToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password } = body

    if (!email || !password)
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 })

    console.log('✅ Login attempt:', email)
    const admin = await prisma.admin.findUnique({ where: { email } })
    console.log('✅ Admin found:', admin ? 'YES' : 'NO')
    if (!admin)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const valid = await bcrypt.compare(password, admin.password)
    console.log('✅ Password valid:', valid)
    if (!valid)
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = signToken({ id: admin.id, email: admin.email, role: admin.role })
    console.log('✅ Token created, setting cookie...')

    const res = NextResponse.json({
      success: true,
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    })

    res.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    })
    return res
  } catch (err) {
    console.error('LOGIN ERROR:', err)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
