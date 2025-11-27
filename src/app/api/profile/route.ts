import { NextResponse } from 'next/server';

// Edge Runtime configuration for Cloudflare Pages
export const runtime = 'edge';

// CORS headers
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Helper to get Cloudflare environment
function getEnv(request: Request): any {
  // @ts-ignore - Cloudflare adds env to request
  return (request as any).env || (globalThis as any).env || {};
}

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
    const env = getEnv(request);
    const db = env.DB as D1Database;
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      // 根据 ID 获取特定简历
      const result = await db.prepare('SELECT * FROM Profile WHERE id = ?').bind(id).first();
      
      if (!result) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404, headers: corsHeaders });
      }

      return NextResponse.json(parseJsonFields(result), { headers: corsHeaders });
    } else {
      // 默认返回第一个简历
      const result = await db.prepare('SELECT * FROM Profile ORDER BY createdAt ASC LIMIT 1').first();
      
      if (!result) {
        return NextResponse.json({ error: 'Profile not found' }, { status: 404, headers: corsHeaders });
      }

      return NextResponse.json(parseJsonFields(result), { headers: corsHeaders });
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json({ error: 'Failed to fetch profile', details: String(error) }, { status: 500, headers: corsHeaders });
  }
}

export async function POST(request: Request) {
  try {
    const env = getEnv(request);
    const db = env.DB as D1Database;
    const body = await request.json();
    const data = stringifyJsonFields(body);
    
    await db.prepare(`
      INSERT INTO Profile (id, name, nameEn, title, email, phone, location, summary, avatar, skills, experiences, education, projects, certifications, languages)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).bind(
      data.id,
      data.name,
      data.nameEn || null,
      data.title,
      data.email,
      data.phone,
      data.location,
      data.summary,
      data.avatar || null,
      data.skills,
      data.experiences,
      data.education,
      data.projects,
      data.certifications,
      data.languages
    ).run();

    const result = await db.prepare('SELECT * FROM Profile WHERE id = ?').bind(data.id).first();
    return NextResponse.json(parseJsonFields(result), { headers: corsHeaders });
  } catch (error) {
    console.error('Error creating profile:', error);
    return NextResponse.json({ error: 'Failed to create profile', details: String(error) }, { status: 500, headers: corsHeaders });
  }
}

export async function PUT(request: Request) {
  try {
    const env = getEnv(request);
    const db = env.DB as D1Database;
    const body = await request.json();
    const { id, ...updateData } = body as any;
    const data = stringifyJsonFields(updateData);

    await db.prepare(`
      UPDATE Profile SET 
        name = ?, nameEn = ?, title = ?, email = ?, phone = ?, location = ?, summary = ?, avatar = ?,
        skills = ?, experiences = ?, education = ?, projects = ?, certifications = ?, languages = ?,
        updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).bind(
      data.name,
      data.nameEn || null,
      data.title,
      data.email,
      data.phone,
      data.location,
      data.summary,
      data.avatar || null,
      data.skills,
      data.experiences,
      data.education,
      data.projects,
      data.certifications,
      data.languages,
      id
    ).run();

    const result = await db.prepare('SELECT * FROM Profile WHERE id = ?').bind(id).first();
    return NextResponse.json(parseJsonFields(result), { headers: corsHeaders });
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json({ error: 'Failed to update profile', details: String(error) }, { status: 500, headers: corsHeaders });
  }
}

