'use client';

import { Card, Avatar, Tag, Space, Typography, Timeline, Badge } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  GithubOutlined,
  GlobalOutlined,
  TrophyOutlined,
  CodeOutlined,
  ClockCircleOutlined,
  ManOutlined,
  WomanOutlined
} from '@ant-design/icons';
import { ProfileData, Experience, Education, Project } from '@/types/profile';
import StatsOverview from './StatsOverview';

const { Title, Paragraph, Text } = Typography;

interface ProfileDisplayProps {
  profile: ProfileData;
}

export default function ProfileDisplay({ profile }: ProfileDisplayProps) {
  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0' }}>
      {/* 头部个人信息卡片 */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {profile.avatar && (
            <Avatar 
              size={120} 
              src={profile.avatar}
              style={{ border: '4px solid white' }}
            >
              {profile.name?.[0]}
            </Avatar>
          )}
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ color: 'white', marginTop: 0 }}>
              {profile.name}
              {profile.nameEn && <Text style={{ color: '#f0f0f0', fontSize: '0.7em', marginLeft: 8 }}>({profile.nameEn})</Text>}
            </Title>
            <Title level={4} style={{ color: '#f0f0f0', marginTop: 0 }}>{profile.title}
              {profile.gender && (
                <Text style={{ color: 'white', marginLeft: 12 }}>
                  {profile.gender === '男' ? <ManOutlined /> : <WomanOutlined />} 
                  {profile.gender}
                </Text>
              )}
              {profile.age && (
                <Text style={{ color: 'white', marginLeft: 12 }}>
                  {profile.age}岁
                </Text>
              )}</Title>
            <Space wrap style={{ color: 'white' }}>
              {profile.email && (
                <Text style={{ color: 'white' }}>
                  <MailOutlined /> {profile.email}
                </Text>
              )}
              {profile.phone && (
                <Text style={{ color: 'white' }}>
                  <PhoneOutlined /> {profile.phone}
                </Text>
              )}
              {profile.location && (
                <Text style={{ color: 'white' }}>
                  <EnvironmentOutlined /> {profile.location}
                </Text>
              )}
            </Space>
            {/* 社交链接 */}
            <div style={{ marginTop: 12 }}>
              <Space wrap>
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                    <GithubOutlined /> GitHub
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: 'white' }}>
                    <GlobalOutlined /> 个人网站
                  </a>
                )}
              </Space>
            </div>
          </div>
        </div>
      </Card>

      {/* 数据统计概览 */}
      {/* <StatsOverview profile={profile} /> */}

      {/* 个人简介 */}
      {profile.summary && (
        <Card title="个人简介" style={{ marginBottom: 24 }}>
          <Paragraph style={{ fontSize: '15px', lineHeight: '1.8' }}>{profile.summary}</Paragraph>
        </Card>
      )}

      {/* 学历/语言 */}
      {(profile.education && profile.education.school) || (profile.languages && profile.languages.length > 0) ? (
        <Card title="学历/语言" style={{ marginBottom: 24 }}>
          {profile.education && profile.education.school && (
            <div style={{ marginBottom: profile.languages && profile.languages.length > 0 ? 12 : 0 }}>
              <Text strong>{profile.education.school} - {profile.education.major} - {profile.education.degree} </Text>
              <Text type="secondary" style={{ float: 'right' }}>
                {profile.education.startDate} - {profile.education.endDate}
              </Text>
            </div>
          )}
          {profile.languages && profile.languages.length > 0 && (
            <div>
              <Space wrap size="small" style={{display: 'block'}}>
                {profile.languages.map((lang, idx) => (
                  <span key={idx}>
                    <Text strong>{lang.name}</Text>
                    <Text type="secondary" style={{ float: 'right' }}> {lang.level}</Text>
                    {idx < profile.languages.length - 1 && <Text type="secondary" style={{ margin: '0 8px' }}>|</Text>}
                  </span>
                ))}
              </Space>
            </div>
          )}
        </Card>
      ) : null}

      {/* 专业技能 */}
      {profile.skills && profile.skills.length > 0 && (
        <Card title="专业技能" style={{ marginBottom: 24 }}>
          <Space wrap size="middle">
            {profile.skills.map((skill, idx) => (
              <Tag color="blue" key={idx} style={{ fontSize: '14px', padding: '6px 14px', margin: '4px' }}>
                {typeof skill === 'string' ? skill : skill.name}
              </Tag>
            ))}
          </Space>
        </Card>
      )}

      {/* 工作经历 */}
      {profile.experiences && profile.experiences.length > 0 && (
        <Card title="工作经历" style={{ marginBottom: 24 }}>
          <Timeline
            items={profile.experiences.map((exp: Experience) => ({
              color: exp.current ? 'green' : 'blue',
              dot: exp.current ? <ClockCircleOutlined style={{ fontSize: '16px' }} /> : undefined,
              children: (
                <div key={exp.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Title level={5} style={{ margin: 0 }}>{exp.position}</Title>
                    {exp.current && <Badge status="processing" text="在职" />}
                  </div>
                  <Text strong style={{ fontSize: '15px' }}>{exp.company}</Text>
                  <div>
                    <Text type="secondary">
                      {exp.startDate} - {exp.current ? '至今' : exp.endDate}
                    </Text>
                  </div>
                  <Paragraph style={{ marginTop: 8 }}>{exp.description}</Paragraph>
                  {exp.achievements && exp.achievements.length > 0 && (
                    <ul style={{ marginTop: 8 }}>
                      {exp.achievements.map((achievement, idx) => (
                        <li key={idx} style={{ marginBottom: 4 }}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                  <Space wrap style={{ marginTop: 8 }}>
                    {exp.technologies.map((tech, idx) => (
                      <Tag color="blue" key={idx}>{tech}</Tag>
                    ))}
                  </Space>
                </div>
              )
            }))}
          />
        </Card>
      )}

      {/* 项目经验 */}
      {profile.projects && profile.projects.length > 0 && (
        <Card title="项目经验" style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="large">
            {profile.projects.map((project: Project) => (
              <Card key={project.id} type="inner" style={{ background: '#fafafa' }}>
                <Title level={5}>{project.name}</Title>
                <Text strong style={{ color: '#1890ff' }}>{project.role}</Text>
                <div>
                  <Text type="secondary">
                    {project.startDate} - {project.endDate || '至今'}
                  </Text>
                </div>
                <Paragraph style={{ marginTop: 8 }}>{project.description}</Paragraph>
                {project.highlights && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: '#fff', borderRadius: '4px', borderLeft: '3px solid #1890ff' }}>
                    <Text type="secondary" style={{ fontSize: '13px' }}>项目亮点：</Text>
                    <Paragraph style={{ marginTop: 4, marginBottom: 0, whiteSpace: 'pre-wrap' }}>{project.highlights}</Paragraph>
                  </div>
                )}
                <Space wrap style={{ marginTop: 8 }}>
                  {project.technologies.map((tech, idx) => (
                    <Tag color="green" key={idx}>{tech}</Tag>
                  ))}
                </Space>
                {project.url && (
                  <div style={{ marginTop: 12 }}>
                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                      <GlobalOutlined /> 项目链接
                    </a>
                  </div>
                )}
              </Card>
            ))}
          </Space>
        </Card>
      )}

      {/* 证书与资质 */}
      {profile.certifications && profile.certifications.length > 0 && (
        <Card title="证书" style={{ marginBottom: 24 }}>
          <Space direction="vertical" style={{ width: '100%' }} size="middle">
            {profile.certifications.map((cert) => (
              <div key={cert.id} style={{ borderBottom: '1px dashed #e8e8e8', paddingBottom: 12 }}>
                <Text strong style={{ fontSize: '15px' }}>{cert.name}</Text>
                <Text type="secondary" style={{float: 'right'}}>{cert.date}</Text>
                {cert.url && (
                  <a href={cert.url} target="_blank" rel="noopener noreferrer" style={{ marginTop: 4, display: 'inline-block', float: 'right' }}>
                    查看证书
                  </a>
                )}
              </div>
            ))}
          </Space>
        </Card>
      )}
    </div>
  );
}
