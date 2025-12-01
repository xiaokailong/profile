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
      <Card style={{ marginBottom: 12, background: '#ffff', borderRadius: 8 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <Title level={2} style={{ color: '#333', marginTop: 0, marginBottom: 8, lineHeight: 1.2 }}>
              {profile.name}
              {profile.nameEn && <Text style={{ color: '#333', fontSize: '0.7em', marginLeft: 8 }}>({profile.nameEn})</Text>}
            </Title>
            <div style={{ marginBottom: 12, lineHeight: 1.5 }}>
              <Text strong style={{ fontSize: '16px', color: '#333' }}>{profile.title}</Text>
              {profile.gender && (
                <Text style={{ color: '#333', marginLeft: 12 }}>
                  <span style={{ verticalAlign: 'middle' }}>
                    {profile.gender === '男' ? <ManOutlined style={{ marginRight: 4 }} /> : <WomanOutlined style={{ marginRight: 4 }} />}
                    {profile.gender}
                  </span>
                </Text>
              )}
              {profile.age && (
                <Text style={{ color: '#333', marginLeft: 12 }}>
                  {profile.age}岁
                </Text>
              )}
            </div>
            <div style={{ marginBottom: 8 }}>
              {profile.email && (
                <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 8 }}>
                  <Text style={{ color: '#333' }}>
                    <MailOutlined style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    <span style={{ verticalAlign: 'middle' }}>{profile.email}</span>
                  </Text>
                </div>
              )}
              {profile.phone && (
                <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 8 }}>
                  <Text style={{ color: '#333' }}>
                    <PhoneOutlined style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    <span style={{ verticalAlign: 'middle' }}>{profile.phone}</span>
                  </Text>
                </div>
              )}
              {profile.location && (
                <div style={{ display: 'inline-block', marginRight: 16, marginBottom: 8 }}>
                  <Text style={{ color: '#333' }}>
                    <EnvironmentOutlined style={{ marginRight: 4, verticalAlign: 'middle' }} />
                    <span style={{ verticalAlign: 'middle' }}>{profile.location}</span>
                  </Text>
                </div>
              )}
            </div>
            {/* 社交链接 */}
            <div style={{ marginTop: 8 }}>
              {profile.github && (
                <a href={profile.github} target="_blank" rel="noopener noreferrer" style={{ color: '#262626', marginRight: 16, display: 'inline-block' }}>
                  <GithubOutlined style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  <span style={{ verticalAlign: 'middle' }}>GitHub</span>
                </a>
              )}
              {profile.website && (
                <a href={profile.website} target="_blank" rel="noopener noreferrer" style={{ color: '#262626', display: 'inline-block' }}>
                  <GlobalOutlined style={{ marginRight: 4, verticalAlign: 'middle' }} />
                  <span style={{ verticalAlign: 'middle' }}>个人网站</span>
                </a>
              )}
            </div>
          </div>
          {profile.avatar && (
            <img 
              src={profile.avatar}
              alt={profile.name}
              crossOrigin="anonymous"
              style={{ 
                border: '2px solid #d9d9d9',
                width: '113px',
                height: '151px',
                borderRadius: '4px',
                flexShrink: 0,
                objectFit: 'cover'
              }}
            />
          )}
        </div>
      </Card>

      {/* 数据统计概览 */}
      {/* <StatsOverview profile={profile} /> */}

      {/* 个人简介 */}
      {profile.summary && (
        <Card title="个人简介" style={{ marginBottom: 12 }}>
          <div 
            className="rich-text-display" 
            style={{ fontSize: '15px', lineHeight: '1.8' }}
            dangerouslySetInnerHTML={{ __html: profile.summary }}
          />
        </Card>
      )}

      {/* 学历/语言 */}
      {(profile.education && profile.education.school) || (profile.languages && profile.languages.length > 0) ? (
        <Card title="学历/语言" style={{ marginBottom: 12 }}>
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
        <Card title="专业技能" style={{ marginBottom: 12 }}>
          <div 
            className="rich-text-display"
            dangerouslySetInnerHTML={{ __html: profile.skills }}
          />
        </Card>
      )}

      {/* 工作经历 */}
      {profile.experiences && profile.experiences.length > 0 && (
        <Card title="工作经历" style={{ marginBottom: 12 }}>
          <Timeline
            items={profile.experiences.map((exp: Experience) => ({
              color: exp.current ? 'green' : 'blue',
              icon: exp.current ? <ClockCircleOutlined style={{ fontSize: '16px' }} /> : undefined,
              content: (
                <div key={exp.id}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <Text strong style={{ margin: 0 }}>{exp.company}</Text> - 
                      <Text strong style={{ fontSize: '15px' }}>{exp.position}</Text>
                      {exp.current && <Badge status="processing" text="在职" />}
                    </div>
                    <Text type="secondary">
                      {exp.startDate} - {exp.current ? '至今' : exp.endDate}
                    </Text>
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
                  <Space wrap>
                    {exp.technologies && exp.technologies.map((tech, idx) => (
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
        <Card title="项目经验" style={{ marginBottom: 12 }}>
          <div>
            {profile.projects.map((project: Project, index) => (
              <div 
                key={project.id} 
                style={{ 
                  paddingBottom: 16, 
                  marginBottom: 16,
                  borderBottom: index < (profile.projects?.length || 0) - 1 ? '1px solid #e8e8e8' : 'none'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <div>
                    <Text strong style={{ fontSize: '15px' }}>{project.name}</Text>
                    <Text strong style={{ color: '#1890ff', marginLeft: 8 }}>{project.role}</Text>
                  </div>
                  <Text type="secondary">
                    {project.startDate} - {project.endDate || '至今'}
                  </Text>
                </div>
                <div style={{ marginTop: 8 }}>
                  <div 
                    className="rich-text-display"
                    dangerouslySetInnerHTML={{ __html: project.description }}
                  />
                </div>
                {project.highlights && (
                  <div style={{ marginTop: 8, paddingLeft: 12, borderLeft: '3px solid #1890ff' }}>
                    <Text type="secondary" style={{ fontSize: '13px' }}>项目亮点：</Text>
                    <div 
                      className="rich-text-display" 
                      style={{ marginTop: 4 }}
                      dangerouslySetInnerHTML={{ __html: project.highlights }}
                    />
                  </div>
                )}
                {project.technologies && project.technologies.length > 0 && (
                  <div style={{ marginTop: 8 }}>
                    <Space wrap size="small">
                      {project.technologies.map((tech, idx) => (
                        <Tag color="blue" key={idx}>{tech}</Tag>
                      ))}
                    </Space>
                  </div>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* 证书与资质 */}
      {profile.certifications && profile.certifications.length > 0 && (
        <Card title="证书" style={{ marginBottom: 12 }}>
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
