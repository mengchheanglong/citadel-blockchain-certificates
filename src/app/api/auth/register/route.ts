import { NextResponse } from 'next/server';
import { z } from 'zod';
import { prisma } from '@/lib/db';

const registerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  description: z.string().optional(),
  website: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parseResult = registerSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          errors: parseResult.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { id, name, email, description, website } = parseResult.data;
    const normalizedEmail = email.toLowerCase().trim();

    const existingOrganization = await prisma.organization.findFirst({
      where: {
        OR: [
          ...(id ? [{ id }] : []),
          { email: normalizedEmail },
        ],
      },
    });

    if (existingOrganization) {
      // Update existing record if needed
      const updated = await prisma.organization.update({
        where: { id: existingOrganization.id },
        data: {
          name: name.trim(),
          description: description || existingOrganization.description,
          website: website || existingOrganization.website,
        },
      });

      return NextResponse.json(
        {
          success: true,
          message: 'Organization profile updated',
          organization: updated,
        },
        { status: 200 }
      );
    }

    const organization = await prisma.organization.create({
      data: {
        ...(id ? { id } : {}),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash: 'supabase-auth-managed',
        description: description || null,
        website: website || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Organization profile created successfully',
        organization,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Organization sync/register error:', error);
    return NextResponse.json(
      {
        success: false,
        message: error?.message || 'Internal server error',
      },
      { status: 500 }
    );
  }
}
