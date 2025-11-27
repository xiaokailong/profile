'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, message, Spin } from 'antd';
import { ArrowLeftOutlined, HomeOutlined } from '@ant-design/icons';
import ProfileForm from '@/components/ProfileForm';
import { ProfileData } from '@/types/profile';

interface EditProfilePageProps {
  params: {
    id: string;
  };
}

export default function EditProfilePage({ params }: EditProfilePageProps) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const profileId = params.id;

  useEffect(() => {
    fetchProfile();
  }, [profileId]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/profile?id=${profileId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else {
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
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...data, id: profileId }),
      });

      if (response.ok) {
        const savedProfile = await response.json();
        setProfile(savedProfile);
        message.success('保存成功！');
        router.push(`/profile/${profileId}`);
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
          onCancel={() => router.push(`/profile/${profileId}`)}
        />
      </div>
    </div>
  );
}

// Edge Runtime configuration for Cloudflare Pages
export const runtime = 'edge';
