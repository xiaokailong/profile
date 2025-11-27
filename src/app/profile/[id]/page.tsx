'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, FloatButton, message, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ProfileDisplay from '@/components/ProfileDisplay';
import PDFExport from '@/components/PDFExport';
import { ProfileData } from '@/types/profile';

interface ProfilePageProps {
  params: {
    id: string;
  };
}

export default function ProfilePage({ params }: ProfilePageProps) {
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
      } else if (response.status === 404) {
        message.error('简历不存在');
        setProfile(null);
      } else {
        message.error('获取简历失败');
        setProfile(null);
      }
    } catch (error) {
      console.error('获取个人信息失败:', error);
      message.error('获取简历失败');
      setProfile(null);
    } finally {
      setLoading(false);
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
            <h1>{profile.name} 的个人简历</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>简历 ID: {profileId}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <PDFExport profile={profile} />
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => router.push(`/edit/${profileId}`)}
            >
              编辑信息
            </Button>
          </div>
        </div>

        <ProfileDisplay profile={profile} />
      </div>

      <FloatButton.BackTop />
    </div>
  );
}
