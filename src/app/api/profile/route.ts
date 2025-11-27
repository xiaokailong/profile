import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

// Edge Runtime configuration for Cloudflare Pages
export const runtime = 'edge';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper function to parse JSON fields
function parseJsonFields(profile: any) {
  if (!profile) return null;
  
  return {
    ...profile,
    skills: profile.skills ? JSON.parse(profile.skills) : null,
    experiences: profile.experiences ? JSON.parse(profile.experiences) : null,
    education: profile.education ? JSON.parse(profile.education) : null,
    projects: profile.projects ? JSON.parse(profile.projects) : null,
    certifications: profile.certifications ? JSON.parse(profile.certifications) : null,
    languages: profile.languages ? JSON.parse(profile.languages) : null,
  };
}

// Helper function to stringify JSON fields
function stringifyJsonFields(data: any) {
  const { skills, experiences, education, projects, certifications, languages, ...rest } = data;
  
  return {
    ...rest,
    skills: skills ? JSON.stringify(skills) : null,
    experiences: experiences ? JSON.stringify(experiences) : null,
    education: education ? JSON.stringify(education) : null,
    projects: projects ? JSON.stringify(projects) : null,
    certifications: certifications ? JSON.stringify(certifications) : null,
    languages: languages ? JSON.stringify(languages) : null,
  };
}

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // 根据 ID 获取特定简历
      const profile = await prisma.profile.findUnique({
        where: { id }
      });
      
      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404, headers: corsHeaders });
      }

      return NextResponse.json(parseJsonFields(profile), { headers: corsHeaders });
    } else {
      // 默认返回第一个简历（您的简历）
      const profile = await prisma.profile.findFirst({
        orderBy: { createdAt: 'asc' }
      });
      
      if (!profile) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404, headers: corsHeaders });
      }

      return NextResponse.json(parseJsonFields(profile), { headers: corsHeaders });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const profile = await prisma.profile.create({
      data: stringifyJsonFields(body)
    });

    return NextResponse.json(parseJsonFields(profile), { headers: corsHeaders });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Failed to create profile' }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    const profile = await prisma.profile.update({
      where: { id },
      data: stringifyJsonFields(data)
    });

    return NextResponse.json(parseJsonFields(profile), { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500, headers: corsHeaders });
  }
}
