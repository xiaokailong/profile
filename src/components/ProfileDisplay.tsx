'use client';

import { Card, Avatar, Tag, Space, Typography, Timeline, Badge } from 'antd';
import './RichTextEditor.css';
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
      <Card style={{ marginBottom: 24, background: '#ffff', borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {profile.avatar && (
            <Avatar 
              size={{ xs: 100, sm: 113, md: 113, lg: 113, xl: 113, xxl: 113 }}
              src={profile.avatar}
              style={{ 
                border: '2px solid #d9d9d9',
                width: '113px',
                height: '151px',
                borderRadius: '4px'
              }}
              shape="square"
            >
              {profile.name?.[0]}
            </Avatar>
          )}
          <div style={{ flex: 1 }}>
            <Title level={2} style={{ color: '#333', marginTop: 0 }}>
              {profile.name}
              {profile.nameEn && <Text style={{ color: '#333', fontSize: '0.7em', marginLeft: 8 }}>({profile.nameEn})</Text>}
            </Title>
            <Title level={4} style={{ color: '#333', marginTop: 0 }}>{profile.title}
              {profile.gender && (
                <Text style={{ color: '#333', marginLeft: 12 }}>
                  {profile.gender === '男' ? <ManOutlined /> : <WomanOutlined />} 
                  {profile.gender}
                </Text>
              )}
              {profile.age && (
                <Text style={{ color: '#333', marginLeft: 12 }}>
                  {profile.age}岁
                </Text>
              )}</Title>
            <Space wrap style={{ color: '#333' }}>
              {profile.email && (
                <Text style={{ color: '#333' }}>
                  <MailOutlined /> {profile.email}
                </Text>
              )}
              {profile.phone && (
                <Text style={{ color: '#333' }}>
                  <PhoneOutlined /> {profile.phone}
                </Text>
              )}
              {profile.location && (
                <Text style={{ color: '#333' }}>
                  <EnvironmentOutlined /> {profile.location}
                </Text>
              )}
            </Space>
            {/* 社交链接 */}
            <div style={{ marginTop: 12 }}>
              <Space wrap>
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>
                    <GithubOutlined /> GitHub
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#333' }}>
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
          <div 
            className="rich-text-display" 
            style={{ fontSize: '15px', lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: profile.summary }}
          />
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
                    {idx < (profile.languages?.length || 0) - 1 && <Text type="secondary" style={{ margin: '0 8px' }}>|</Text>}
                  </span>
                ))}
              </Space>
            </div>
          )}
        </Card>
      ) : null}

      {/* 专业技能 */}
      {profile.skills && (
        <Card title="专业技能" style={{ marginBottom: 24 }}>
          <div 
            className="rich-text-display"
            dangerouslySetInnerHTML={{ __html: profile.skills }}
          />
        </Card>
      )}

      {/* 工作经历 */}
      {profile.experiences && profile.experiences.length > 0 && (
        <Card title="工作经历" style={{ marginBottom: 24 }}>
          <Timeline
            items={profile.experiences.map((exp: Experience) => ({
              color: exp.current ? 'green' : 'blue',
              icon: exp.current ? <ClockCircleOutlined style={{ fontSize: '16px' }} /> : undefined,
              content: (
                <div key={exp.id}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <Text strong style={{ margin: 0 }}>{exp.position}</Text> - 
                    <Text strong style={{ fontSize: '15px' }}>{exp.company}</Text>
                    <Text type="secondary">
                      {exp.startDate} - {exp.current ? '至今' : exp.endDate}
                    </Text>
                    {exp.current && <Badge status="processing" text="在职" />}
                  </div>
                  <Paragraph style={{ marginTop: 8 }}>
                    <div 
                      className="rich-text-display"
                      dangerouslySetInnerHTML={{ __html: exp.description }}
                    />
                  </Paragraph>
                  {/* {exp.achievements && (
                    <div style={{ marginTop: 8, padding: '8px 12px', background: '#fff', borderRadius: '4px', borderLeft: '3px solid #52c41a' }}>
                      <Text type="secondary" style={{ fontSize: '13px' }}>主要成就：</Text>
                      <div 
                        className="rich-text-display" 
                        style={{ marginTop: 4 }}
                        dangerouslySetInnerHTML={{ __html: exp.achievements }}
                      />
                    </div>
                  )} */}
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
          <Space orientation="vertical" style={{ width: '100%' }} size="large">
            {profile.projects.map((project: Project) => (
              <Card key={project.id} type="inner" style={{ background: '#fafafa' }}>
                <Text strong>{project.name}</Text>
                <Text strong style={{ color: '#1890ff', marginLeft: 8 }}>{project.role}</Text>
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  {project.startDate} - {project.endDate || '至今'}
                </Text>
                {project.url && (
                    <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ float: 'right' }}>
                      <GlobalOutlined /> 项目链接
                    </a>
                )}
                <Paragraph style={{ marginTop: 8 }}>
                  <div 
                    className="rich-text-display"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </Paragraph>
                {project.highlights && (
                  <div style={{ marginTop: 8, padding: '8px 12px', background: '#fff', borderRadius: '4px', borderLeft: '3px solid #1890ff' }}>
                    <Text type="secondary" style={{ fontSize: '13px' }}>项目亮点：</Text>
                    <div 
                      className="rich-text-display" 
                      style={{ marginTop: 4, marginBottom: 0 }}
                      dangerouslySetInnerHTML={{ __html: project.highlights }}
                    />
                  </div>
                )}
                <Space wrap>
                  {project.technologies.map((tech, idx) => (
                    <Tag color="blue" key={idx}>{tech}</Tag>
                  ))}
                </Space>
              </Card>
            ))}
          </Space>
        </Card>
      )}

      {/* 证书与资质 */}
      {profile.certifications && profile.certifications.length > 0 && (
        <Card title="证书" style={{ marginBottom: 24 }}>
          <Space orientation="vertical" style={{ width: '100%' }} size="middle">
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
