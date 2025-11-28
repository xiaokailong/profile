'use client';

import { Card, Row, Col, Statistic, Tag } from 'antd';
import { 
  CodeOutlined, 
  TeamOutlined, 
  RocketOutlined, 
  TrophyOutlined,
  ClockCircleOutlined,
  FireOutlined
} from '@ant-design/icons';
import { ProfileData } from '@/types/profile';

interface StatsOverviewProps {
  profile: ProfileData;
}

export default function StatsOverview({ profile }: StatsOverviewProps) {
  // 计算工作年限
  const calculateYearsOfExperience = () => {
    if (!profile.experiences || profile.experiences.length === 0) return 0;
    const firstJob = profile.experiences[profile.experiences.length - 1];
    const startYear = parseInt(firstJob.startDate.split('-')[0]);
    const currentYear = new Date().getFullYear();
    return currentYear - startYear;
  };

  const yearsOfExperience = calculateYearsOfExperience();
  const totalProjects = profile.projects?.length || 0;
  const totalSkills = profile.skills?.length || 0;
  const totalExperience = profile.experiences?.length || 0;
  const totalCertifications = profile.certifications?.length || 0;

  return (
    <>
      {/* 主要统计数据 */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="工作年限"
              value={yearsOfExperience}
              suffix="年"
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#3f8600', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="项目经验"
              value={totalProjects}
              suffix="个"
              prefix={<RocketOutlined />}
              valueStyle={{ color: '#1890ff', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="技能掌握"
              value={totalSkills}
              suffix="项"
              prefix={<FireOutlined />}
              valueStyle={{ color: '#cf1322', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="工作经历"
              value={totalExperience}
              suffix="家"
              prefix={<TeamOutlined />}
              valueStyle={{ color: '#722ed1', fontSize: '24px' }}
            />
          </Card>
        </Col>
        <Col xs={12} sm={8} md={4}>
          <Card>
            <Statistic
              title="专业认证"
              value={totalCertifications}
              suffix="个"
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#fa8c16', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* 技能标签云 */}
      {profile.skills && profile.skills.length > 0 && (
        <Card 
          title="技能标签" 
          style={{ marginBottom: 24 }}
        >
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {profile.skills.map((skill) => (
              <Tag 
                key={skill.name} 
                color="blue"
                style={{ fontSize: '14px', padding: '4px 12px' }}
              >
                {skill.name}
              </Tag>
            ))}
          </div>
        </Card>
      )}
    </>
  );
}
