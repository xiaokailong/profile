'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Spin, App } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import ProfileForm from '@/components/ProfileForm';
import { ProfileData } from '@/types/profile';
import { fetchAPI } from '@/lib/api';

interface EditProfilePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditProfilePage({ params }: EditProfilePageProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [profileId, setProfileId] = useState<string>('');
  const router = useRouter();
  const { message } = App.useApp();

  useEffect(() => {
    // Next.js 15: params is a Promise
    params.then((resolvedParams) => {
      setProfileId(resolvedParams.id);
    });
  }, [params]);

  useEffect(() => {
    if (profileId) {
      fetchProfile();
    }
  }, [profileId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      console.log('[Edit Page] Fetching profile with id:', profileId);
      const response = await fetchAPI(`/api/profile?id=${profileId}`);
      if (response.ok) {
        const data = await response.json() as ProfileData;
        console.log('[Edit Page] Fetched data:', { id: data?.id, profileId });
        
        if (!data || !data.id) {
          console.error('[Edit Page] Missing id in response:', data);
          message.error('简历数据不完整');
          setProfile(null);
          return;
        }
        
        setProfile(data);
      } else {
        const errorText = await response.text();
        console.error('[Edit Page] Fetch failed:', response.status, errorText);
        setProfile(null);
      }
    } catch (error) {
      console.error('获取个人信息失败:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (data: ProfileData) => {
    try {
      const response = await fetchAPI('/api/profile', {
        method: 'PUT',
        body: JSON.stringify({ ...data, id: parseInt(profileId) }),
      });

      if (response.ok) {
        const savedProfile = await response.json() as ProfileData;
        setProfile(savedProfile);
        message.success('保存成功！');
        // Navigate back to public profile page using userId
        router.push(`/profile/${savedProfile.userId}`);
      } else {
        throw new Error('保存失败');
      }
    } catch (error) {
      console.error('保存失败:', error);
      throw error;
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <h2>简历不存在</h2>
        <p>ID: {profileId}</p>
        <Button type="primary" size="large" onClick={() => router.push('/')}>
          返回首页
        </Button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>编辑个人信息</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>简历 ID: {profileId}</p>
          </div>
          <Button 
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push(`/profile/${profileId}`)}
          >
            返回简历
          </Button>
        </div>

        <ProfileForm
          initialData={profile}
          onSave={handleSave}
          onCancel={() => router.push(`/profile/${profile.userId}`)}
        />
      </div>
    </div>
  );
}

// Edge Runtime configuration for Cloudflare Pages
export const runtime = 'edge';
