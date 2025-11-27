'use client';

import { useState, useEffect } from 'react';
import { Button, FloatButton, message, Spin } from 'antd';
import { EditOutlined, EyeOutlined } from '@ant-design/icons';
import ProfileDisplay from '@/components/ProfileDisplay';
import ProfileForm from '@/components/ProfileForm';
import PDFExport from '@/components/PDFExport';
import { ProfileData } from '@/types/profile';

export default function Home() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/profile');
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      } else if (response.status === 404) {
        // 如果没有找到profile，加载模拟数据
        loadMockData();
      } else {
        // 其他错误（如500），也使用模拟数据
        console.warn('API错误，使用模拟数据');
        loadMockData();
      }
    } catch (error) {
      console.error('获取个人信息失败，使用模拟数据:', error);
      loadMockData();
    } finally {
      setLoading(false);
    }
  };

  const loadMockData = () => {
    const mockProfile: ProfileData = {
      id: 'mock-1',
      name: '张三',
      title: '高级前端工程师',
      email: 'zhangsan@example.com',
      phone: '+86 138-0000-0000',
      location: '北京市朝阳区',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
      summary: '5年以上前端开发经验，精通React、Vue、Next.js等现代前端框架。擅长构建高性能、可扩展的Web应用。热爱开源，积极参与技术社区。',
      github: 'https://github.com/yourusername',
      linkedin: 'https://linkedin.com/in/yourusername',
      website: 'https://yourwebsite.com',
      blog: 'https://yourblog.com',
      skills: [
        { name: 'React', level: 5, category: '前端' },
        { name: 'Next.js', level: 5, category: '前端' },
        { name: 'TypeScript', level: 5, category: '前端' },
        { name: 'Vue.js', level: 4, category: '前端' },
        { name: 'Node.js', level: 4, category: '后端' },
        { name: 'PostgreSQL', level: 4, category: '数据库' },
        { name: 'MongoDB', level: 3, category: '数据库' },
        { name: 'Git', level: 5, category: '工具' },
        { name: 'Docker', level: 4, category: '工具' },
        { name: 'AWS', level: 3, category: '工具' },
      ],
      experiences: [
        {
          id: '1',
          company: '某科技有限公司',
          position: '高级前端工程师',
          startDate: '2021-06',
          endDate: null,
          current: true,
          description: '负责公司核心产品的前端架构设计与开发，带领团队完成多个重要项目。',
          achievements: [
            '主导重构核心业务系统，性能提升40%',
            '建立前端代码规范和最佳实践，提升团队协作效率',
            '引入自动化测试，代码覆盖率达到80%以上',
          ],
          technologies: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'GraphQL'],
        },
        {
          id: '2',
          company: '互联网公司',
          position: '前端工程师',
          startDate: '2019-03',
          endDate: '2021-05',
          current: false,
          description: '参与多个Web应用的开发，主要负责前端功能实现与性能优化。',
          achievements: [
            '开发并维护公司主要产品的前端应用',
            '优化页面加载速度，首屏渲染时间减少50%',
            '参与技术分享，提升团队整体技术水平',
          ],
          technologies: ['Vue.js', 'JavaScript', 'Webpack', 'Element UI'],
        },
      ],
      education: [
        {
          id: '1',
          school: '某大学',
          degree: '本科',
          major: '计算机科学与技术',
          startDate: '2015-09',
          endDate: '2019-06',
          gpa: '3.7/4.0',
          description: '主修课程：数据结构、算法、操作系统、计算机网络、数据库原理',
        },
      ],
      projects: [
        {
          id: '1',
          name: '企业级管理系统',
          description: '为大型企业开发的综合管理系统，包含人力资源、财务、项目管理等多个模块。',
          role: '前端技术负责人',
          startDate: '2022-01',
          endDate: '2023-06',
          technologies: ['React', 'TypeScript', 'Ant Design', 'Redux', 'React Query'],
          url: 'https://example.com/project1',
          github: 'https://github.com/yourusername/project1',
          highlights: [
            '设计并实现了灵活的权限管理系统',
            '开发了可复用的组件库，提高开发效率30%',
            '实现了实时数据同步功能，用户体验显著提升',
          ],
        },
        {
          id: '2',
          name: '电商平台',
          description: 'B2C电商平台，包含商品展示、购物车、订单管理、支付等完整功能。',
          role: '核心开发者',
          startDate: '2020-06',
          endDate: '2021-12',
          technologies: ['Vue.js', 'Vuex', 'Element UI', 'Nuxt.js'],
          highlights: [
            '实现了商品推荐算法的前端展示',
            '优化了购物流程，转化率提升25%',
            '支持多种支付方式集成',
          ],
        },
      ],
      certifications: [
        {
          id: '1',
          name: 'AWS Certified Developer - Associate',
          issuer: 'Amazon Web Services',
          date: '2022-08',
          url: 'https://aws.amazon.com/certification/',
        },
      ],
      languages: [
        { name: '中文', level: '母语' },
        { name: '英语', level: '流利' },
      ],
    };
    setProfile(mockProfile);
    message.info('数据库未配置，正在使用模拟数据预览');
  };

  const handleSave = async (data: ProfileData) => {
    try {
      const method = profile?.id ? 'PUT' : 'POST';
      const body = profile?.id ? { ...data, id: profile.id } : data;

      const response = await fetch('/api/profile', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        const savedProfile = await response.json();
        setProfile(savedProfile);
        setEditMode(false);
        message.success('保存成功！');
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

  if (editMode) {
    return (
      <ProfileForm
        initialData={profile || undefined}
        onSave={handleSave}
        onCancel={() => {
          if (profile) {
            setEditMode(false);
          }
        }}
      />
    );
  }

  if (!profile) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', flexDirection: 'column', gap: 16 }}>
        <h2>还没有个人信息</h2>
        <Button type="primary" size="large" onClick={() => setEditMode(true)}>
          创建个人信息
        </Button>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f0f2f5', padding: '24px 0' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1>个人简历</h1>
          <div style={{ display: 'flex', gap: 8 }}>
            <PDFExport profile={profile} />
            <Button 
              type="primary" 
              icon={<EditOutlined />}
              onClick={() => setEditMode(true)}
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
