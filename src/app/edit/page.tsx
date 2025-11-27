'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, message, Input, Card } from 'antd';
import { HomeOutlined, PlusOutlined } from '@ant-design/icons';
import ProfileForm from '@/components/ProfileForm';
import { ProfileData } from '@/types/profile';

export default function CreateProfilePage() {
  const [step, setStep] = useState<'input' | 'form'>('input');
  const [profileId, setProfileId] = useState('');
  const router = useRouter();

  const handleCreate = async (data: ProfileData) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const savedProfile = await response.json() as ProfileData;
        message.success(`简历创建成功！您的简历 ID 是: ${savedProfile.id}`);
        setTimeout(() => {
          router.push(`/profile/${savedProfile.id}`);
        }, 2000);
      } else {
        throw new Error('创建失败');
      }
    } catch (error) {
      console.error('创建失败:', error);
      throw error;
    }
  };

  const handleAccessExisting = () => {
    if (!profileId.trim()) {
      message.error('请输入简历 ID');
      return;
    }
    router.push(`/profile/${profileId.trim()}`);
  };

  if (step === 'input') {
    return (
      <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px 0' }}>
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h1>简历管理</h1>
            <Button 
              icon={<HomeOutlined />}
              onClick={() => router.push('/')}
            >
              返回首页
            </Button>
          </div>

          <Card title="访问已有简历" style={{ marginBottom: 24 }}>
            <p style={{ marginBottom: 16 }}>如果您已经有简历，请输入您的简历 ID：</p>
            <Input.Search
              placeholder="请输入简历 ID"
              size="large"
              enterButton="访问"
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              onSearch={handleAccessExisting}
            />
          </Card>

          <Card title="创建新简历">
            <p style={{ marginBottom: 16 }}>
              创建新的简历后，系统会为您生成一个唯一的简历 ID。
              <br />
              请务必记住这个 ID，您将需要它来访问和编辑您的简历。
            </p>
            <Button 
              type="primary" 
              size="large"
              icon={<PlusOutlined />}
              onClick={() => setStep('form')}
              block
            >
              创建新简历
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>创建新简历</h1>
          <Button 
            onClick={() => setStep('input')}
          >
            返回
          </Button>
        </div>

        <ProfileForm
          onSave={handleCreate}
          onCancel={() => setStep('input')}
        />
      </div>
    </div>
  );
}
