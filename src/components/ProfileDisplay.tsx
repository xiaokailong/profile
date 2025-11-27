'use client';

import { Card, Avatar, Tag, Space, Divider, Row, Col, Typography, Timeline, Progress } from 'antd';
import { 
  MailOutlined, 
  PhoneOutlined, 
  EnvironmentOutlined,
  GithubOutlined,
  LinkedinOutlined,
  GlobalOutlined,
  BookOutlined,
  TrophyOutlined,
  CodeOutlined
} from '@ant-design/icons';
import { ProfileData, Experience, Education, Project, Skill } from '@/types/profile';

const { Title, Paragraph, Text } = Typography;

interface ProfileDisplayProps {
  profile: ProfileData;
}

export default function ProfileDisplay({ profile }: ProfileDisplayProps) {
  const skillsByCategory = profile.skills?.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {} as Record<string, Skill[]>);

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px' }}>
      {/* 头部个人信息卡片 */}
      <Card style={{ marginBottom: 24, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <Row gutter={24} align="middle">
          <Col xs={24} md={6} style={{ textAlign: 'center' }}>
            <Avatar 
              size={120} 
              src={profile.avatar}
              style={{ border: '4px solid white' }}
            >
              {profile.name?.[0]}
            </Avatar>
          </Col>
          <Col xs={24} md={18}>
            <Title level={2} style={{ color: 'white', marginTop: 0 }}>{profile.name}</Title>
            <Title level={4} style={{ color: '#f0f0f0', marginTop: 0 }}>{profile.title}</Title>
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
            <div style={{ marginTop: 12 }}>
              <Space>
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer">
                    <GithubOutlined style={{ fontSize: 24, color: 'white' }} />
                  </a>
                )}
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer">
                    <LinkedinOutlined style={{ fontSize: 24, color: 'white' }} />
                  </a>
                )}
                {profile.website && (
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    <GlobalOutlined style={{ fontSize: 24, color: 'white' }} />
                  </a>
                )}
                {profile.blog && (
                  <a href={profile.blog} target="_blank" rel="noopener noreferrer">
                    <BookOutlined style={{ fontSize: 24, color: 'white' }} />
                  </a>
                )}
              </Space>
            </div>
          </Col>
        </Row>
      </Card>

      <Row gutter={24}>
        <Col xs={24} lg={16}>
          {/* 个人简介 */}
          {profile.summary && (
            <Card title="个人简介" style={{ marginBottom: 24 }}>
              <Paragraph>{profile.summary}</Paragraph>
            </Card>
          )}

          {/* 工作经历 */}
          {profile.experiences && profile.experiences.length > 0 && (
            <Card title={<><CodeOutlined /> 工作经历</>} style={{ marginBottom: 24 }}>
              <Timeline
                items={profile.experiences.map((exp: Experience) => ({
                  children: (
                    <div key={exp.id}>
                      <Title level={5}>{exp.position}</Title>
                      <Text strong>{exp.company}</Text>
                      <div>
                        <Text type="secondary">
                          {exp.startDate} - {exp.current ? '至今' : exp.endDate}
                        </Text>
                      </div>
                      <Paragraph style={{ marginTop: 8 }}>{exp.description}</Paragraph>
                      {exp.achievements && exp.achievements.length > 0 && (
                        <ul>
                          {exp.achievements.map((achievement, idx) => (
                            <li key={idx}>{achievement}</li>
                          ))}
                        </ul>
                      )}
                      <Space wrap>
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
                  <Card key={project.id} type="inner">
                    <Title level={5}>{project.name}</Title>
                    <Text strong>{project.role}</Text>
                    <div>
                      <Text type="secondary">
                        {project.startDate} - {project.endDate || '至今'}
                      </Text>
                    </div>
                    <Paragraph style={{ marginTop: 8 }}>{project.description}</Paragraph>
                    {project.highlights && project.highlights.length > 0 && (
                      <ul>
                        {project.highlights.map((highlight, idx) => (
                          <li key={idx}>{highlight}</li>
                        ))}
                      </ul>
                    )}
                    <Space wrap>
                      {project.technologies.map((tech, idx) => (
                        <Tag color="green" key={idx}>{tech}</Tag>
                      ))}
                    </Space>
                    {(project.url || project.github) && (
                      <div style={{ marginTop: 8 }}>
                        {project.url && (
                          <a href={project.url} target="_blank" rel="noopener noreferrer" style={{ marginRight: 12 }}>
                            <GlobalOutlined /> 项目链接
                          </a>
                        )}
                        {project.github && (
                          <a href={project.github} target="_blank" rel="noopener noreferrer">
                            <GithubOutlined /> GitHub
                          </a>
                        )}
                      </div>
                    )}
                  </Card>
                ))}
              </Space>
            </Card>
          )}

          {/* 教育背景 */}
          {profile.education && profile.education.length > 0 && (
            <Card title="教育背景" style={{ marginBottom: 24 }}>
              <Timeline
                items={profile.education.map((edu: Education) => ({
                  children: (
                    <div key={edu.id}>
                      <Title level={5}>{edu.school}</Title>
                      <Text strong>{edu.degree} - {edu.major}</Text>
                      <div>
                        <Text type="secondary">
                          {edu.startDate} - {edu.endDate}
                        </Text>
                      </div>
                      {edu.gpa && <div><Text>GPA: {edu.gpa}</Text></div>}
                      {edu.description && <Paragraph style={{ marginTop: 8 }}>{edu.description}</Paragraph>}
                    </div>
                  )
                }))}
              />
            </Card>
          )}
        </Col>

        <Col xs={24} lg={8}>
          {/* 技能 */}
          {skillsByCategory && Object.keys(skillsByCategory).length > 0 && (
            <Card title="技能" style={{ marginBottom: 24 }}>
              {Object.entries(skillsByCategory).map(([category, skills]) => (
                <div key={category} style={{ marginBottom: 16 }}>
                  <Title level={5}>{category}</Title>
                  <Space direction="vertical" style={{ width: '100%' }}>
                    {skills.map((skill, idx) => (
                      <div key={idx}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Text>{skill.name}</Text>
                          <Text type="secondary">{skill.level}/5</Text>
                        </div>
                        <Progress 
                          percent={skill.level * 20} 
                          showInfo={false}
                          strokeColor={{
                            '0%': '#108ee9',
                            '100%': '#87d068',
                          }}
                        />
                      </div>
                    ))}
                  </Space>
                  <Divider />
                </div>
              ))}
            </Card>
          )}

          {/* 证书 */}
          {profile.certifications && profile.certifications.length > 0 && (
            <Card title={<><TrophyOutlined /> 证书与资质</>} style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {profile.certifications.map((cert) => (
                  <div key={cert.id}>
                    <Text strong>{cert.name}</Text>
                    <div>
                      <Text type="secondary">{cert.issuer}</Text>
                    </div>
                    <div>
                      <Text type="secondary">{cert.date}</Text>
                    </div>
                    {cert.url && (
                      <a href={cert.url} target="_blank" rel="noopener noreferrer">
                        查看证书
                      </a>
                    )}
                    <Divider />
                  </div>
                ))}
              </Space>
            </Card>
          )}

          {/* 语言能力 */}
          {profile.languages && profile.languages.length > 0 && (
            <Card title="语言能力" style={{ marginBottom: 24 }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                {profile.languages.map((lang, idx) => (
                  <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Text strong>{lang.name}</Text>
                    <Tag color="blue">{lang.level}</Tag>
                  </div>
                ))}
              </Space>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
}
