'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, FloatButton, message, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import ProfileDisplay from '@/components/ProfileDisplay';
import PDFExport from '@/components/PDFExport';
import { ProfileData } from '@/types/profile';

export default function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      // 默认获取第一个简历（数据库中的第一条记录）
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json() as ProfileData;
        setProfile(data);
      } else if (response.status === 404) {
        message.error('数据库中没有找到简历数据');
        setProfile(null);
      } else {
        message.error('获取简历失败');
        setProfile(null);
      }
    } catch (error) {
      console.error('获取个人信息失败:', error);
      message.error('无法连接到数据库');
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
        <h2>还没有个人信息</h2>
        <Button type="primary" size="large" onClick={() => router.push('/edit')}>
          创建个人信息
        </Button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1>个人简历</h1>
            <p style={{ color: '#666', fontSize: '14px' }}>简历 ID: {profile.id}</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <PDFExport profile={profile} />
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => router.push(`/edit/${profile.id}`)}
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
