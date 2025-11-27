'use client';

import { useState } from 'react';
import { 
  Form, 
  Input, 
  Button, 
  Space, 
  Card, 
  Row, 
  Col,
  message,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Divider
} from 'antd';
import { PlusOutlined, MinusCircleOutlined } from '@ant-design/icons';
import { ProfileData } from '@/types/profile';
import dayjs from 'dayjs';

const { TextArea } = Input;

interface ProfileFormProps {
  initialData?: ProfileData;
  onSave: (data: ProfileData) => Promise<void>;
  onCancel: () => void;
}

export default function ProfileForm({ initialData, onSave, onCancel }: ProfileFormProps) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 处理日期格式
      const processedValues = {
        ...values,
        experiences: values.experiences?.map((exp: any) => ({
          ...exp,
          startDate: exp.startDate ? dayjs(exp.startDate).format('YYYY-MM') : '',
          endDate: exp.endDate ? dayjs(exp.endDate).format('YYYY-MM') : null,
        })),
        education: values.education?.map((edu: any) => ({
          ...edu,
          startDate: edu.startDate ? dayjs(edu.startDate).format('YYYY-MM') : '',
          endDate: edu.endDate ? dayjs(edu.endDate).format('YYYY-MM') : '',
        })),
        projects: values.projects?.map((proj: any) => ({
          ...proj,
          startDate: proj.startDate ? dayjs(proj.startDate).format('YYYY-MM') : '',
          endDate: proj.endDate ? dayjs(proj.endDate).format('YYYY-MM') : null,
        })),
        certifications: values.certifications?.map((cert: any) => ({
          ...cert,
          date: cert.date ? dayjs(cert.date).format('YYYY-MM') : '',
        })),
      };

      await onSave(processedValues);
      message.success('保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const initialValues = initialData ? {
    ...initialData,
    experiences: initialData.experiences?.map(exp => ({
      ...exp,
      startDate: exp.startDate ? dayjs(exp.startDate, 'YYYY-MM') : null,
      endDate: exp.endDate ? dayjs(exp.endDate, 'YYYY-MM') : null,
    })),
    education: initialData.education?.map(edu => ({
      ...edu,
      startDate: edu.startDate ? dayjs(edu.startDate, 'YYYY-MM') : null,
      endDate: edu.endDate ? dayjs(edu.endDate, 'YYYY-MM') : null,
    })),
    projects: initialData.projects?.map(proj => ({
      ...proj,
      startDate: proj.startDate ? dayjs(proj.startDate, 'YYYY-MM') : null,
      endDate: proj.endDate ? dayjs(proj.endDate, 'YYYY-MM') : null,
    })),
    certifications: initialData.certifications?.map(cert => ({
      ...cert,
      date: cert.date ? dayjs(cert.date, 'YYYY-MM') : null,
    })),
  } : {};

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={initialValues}
      style={{ maxWidth: 1200, margin: '0 auto', padding: 24 }}
    >
      <Card title="基本信息" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="nameEn" label="英文名">
              <Input placeholder="请输入英文名（选填）" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="title" label="职位/角色" rules={[{ required: true }]}>
              <Input placeholder="如: 高级前端工程师" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="email" label="邮箱" rules={[{ required: true, type: 'email' }]}>
              <Input placeholder="请输入邮箱" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="phone" label="电话">
              <Input placeholder="请输入电话" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="location" label="所在地">
              <Input placeholder="如: 北京市朝阳区" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="avatar" label="头像URL">
              <Input placeholder="请输入头像图片URL" />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item name="summary" label="个人简介">
              <TextArea rows={4} placeholder="简要介绍你的背景、专长和职业目标" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="社交链接" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="github" label="GitHub">
              <Input placeholder="https://github.com/username" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="linkedin" label="LinkedIn">
              <Input placeholder="https://linkedin.com/in/username" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="website" label="个人网站">
              <Input placeholder="https://yourwebsite.com" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="blog" label="博客">
              <Input placeholder="https://yourblog.com" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="技能" style={{ marginBottom: 24 }}>
        <Form.List name="skills">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} align="middle">
                  <Col span={8}>
                    <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                      <Input placeholder="技能名称" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...restField} name={[name, 'category']} rules={[{ required: true }]}>
                      <Select placeholder="分类">
                        <Select.Option value="前端">前端</Select.Option>
                        <Select.Option value="后端">后端</Select.Option>
                        <Select.Option value="数据库">数据库</Select.Option>
                        <Select.Option value="工具">工具</Select.Option>
                        <Select.Option value="其他">其他</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item {...restField} name={[name, 'level']} rules={[{ required: true }]}>
                      <InputNumber min={1} max={5} placeholder="熟练度(1-5)" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加技能
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      <Card title="工作经历" style={{ marginBottom: 24 }}>
        <Form.List name="experiences">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} type="inner" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'company']} label="公司" rules={[{ required: true }]}>
                        <Input placeholder="公司名称" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'position']} label="职位" rules={[{ required: true }]}>
                        <Input placeholder="职位名称" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...restField} name={[name, 'startDate']} label="开始时间" rules={[{ required: true }]}>
                        <DatePicker picker="month" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...restField} name={[name, 'endDate']} label="结束时间">
                        <DatePicker picker="month" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item {...restField} name={[name, 'current']} label="目前在职" valuePropName="checked">
                        <Switch />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, 'description']} label="工作描述">
                        <TextArea rows={3} placeholder="描述你的工作职责" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, 'achievements']} label="主要成就">
                        <Select mode="tags" placeholder="输入后按回车添加" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, 'technologies']} label="使用技术">
                        <Select mode="tags" placeholder="输入后按回车添加" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button danger onClick={() => remove(name)}>删除此条</Button>
                </Card>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加工作经历
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      <Card title="项目经验" style={{ marginBottom: 24 }}>
        <Form.List name="projects">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} type="inner" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'name']} label="项目名称" rules={[{ required: true }]}>
                        <Input placeholder="项目名称" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'role']} label="项目角色" rules={[{ required: true }]}>
                        <Input placeholder="如: 技术负责人" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'startDate']} label="开始时间" rules={[{ required: true }]}>
                        <DatePicker picker="month" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'endDate']} label="结束时间">
                        <DatePicker picker="month" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, 'description']} label="项目描述" rules={[{ required: true }]}>
                        <TextArea rows={3} placeholder="描述项目背景和目标" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, 'highlights']} label="项目亮点">
                        <Select mode="tags" placeholder="输入后按回车添加" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, 'technologies']} label="技术栈" rules={[{ required: true }]}>
                        <Select mode="tags" placeholder="输入后按回车添加" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'url']} label="项目链接">
                        <Input placeholder="https://..." />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'github']} label="GitHub">
                        <Input placeholder="https://github.com/..." />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button danger onClick={() => remove(name)}>删除此条</Button>
                </Card>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加项目经验
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      <Card title="教育背景" style={{ marginBottom: 24 }}>
        <Form.List name="education">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Card key={key} type="inner" style={{ marginBottom: 16 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'school']} label="学校" rules={[{ required: true }]}>
                        <Input placeholder="学校名称" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'degree']} label="学位" rules={[{ required: true }]}>
                        <Input placeholder="如: 本科" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'major']} label="专业" rules={[{ required: true }]}>
                        <Input placeholder="专业名称" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'gpa']} label="GPA">
                        <Input placeholder="如: 3.8/4.0" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'startDate']} label="开始时间" rules={[{ required: true }]}>
                        <DatePicker picker="month" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item {...restField} name={[name, 'endDate']} label="结束时间" rules={[{ required: true }]}>
                        <DatePicker picker="month" style={{ width: '100%' }} />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, 'description']} label="描述">
                        <TextArea rows={2} placeholder="相关课程、荣誉等" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button danger onClick={() => remove(name)}>删除此条</Button>
                </Card>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加教育背景
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      <Card title="证书与资质" style={{ marginBottom: 24 }}>
        <Form.List name="certifications">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} align="middle">
                  <Col span={7}>
                    <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                      <Input placeholder="证书名称" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item {...restField} name={[name, 'issuer']} rules={[{ required: true }]}>
                      <Input placeholder="颁发机构" />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item {...restField} name={[name, 'date']} rules={[{ required: true }]}>
                      <DatePicker picker="month" style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col span={5}>
                    <Form.Item {...restField} name={[name, 'url']}>
                      <Input placeholder="证书链接" />
                    </Form.Item>
                  </Col>
                  <Col span={1}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加证书
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      <Card title="语言能力" style={{ marginBottom: 24 }}>
        <Form.List name="languages">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} align="middle">
                  <Col span={11}>
                    <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                      <Input placeholder="语言" />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item {...restField} name={[name, 'level']} rules={[{ required: true }]}>
                      <Select placeholder="水平">
                        <Select.Option value="母语">母语</Select.Option>
                        <Select.Option value="流利">流利</Select.Option>
                        <Select.Option value="工作语言">工作语言</Select.Option>
                        <Select.Option value="基础">基础</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <MinusCircleOutlined onClick={() => remove(name)} />
                  </Col>
                </Row>
              ))}
              <Form.Item>
                <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
                  添加语言
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
      </Card>

      <Divider />

      <Form.Item>
        <Space>
          <Button type="primary" htmlType="submit" loading={loading} size="large">
            保存
          </Button>
          <Button onClick={onCancel} size="large">
            取消
          </Button>
        </Space>
      </Form.Item>
    </Form>
  );
}
