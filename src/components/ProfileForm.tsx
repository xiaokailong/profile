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
  App,
  InputNumber,
  Select,
  DatePicker,
  Switch,
  Divider,
  AutoComplete
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
  const { message } = App.useApp();

  const handleSubmit = async (values: any) => {
    setLoading(true);
    try {
      // 处理日期格式
      const processedValues = {
        ...values,
        // 将 Select(tags) 的字符串数组转换为对象数组以符合后端类型
        skills: values.skills?.map((name: string) => ({ name })),
        experiences: values.experiences?.map((exp: any) => ({
          ...exp,
          startDate: exp.startDate ? dayjs(exp.startDate).format('YYYY-MM') : '',
          endDate: exp.endDate ? dayjs(exp.endDate).format('YYYY-MM') : null,
        })),
        education: values.education ? {
          ...values.education,
          startDate: values.education.startDate ? dayjs(values.education.startDate).format('YYYY-MM') : '',
          endDate: values.education.endDate ? dayjs(values.education.endDate).format('YYYY-MM') : '',
        } : undefined,
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
    } catch (error) {
      message.error('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const initialValues = initialData ? {
    ...initialData,
    // 将技能对象映射为字符串数组以便 Select(tags) 正确回显
    skills: initialData.skills?.map(s => s.name),
    experiences: initialData.experiences?.map(exp => ({
      ...exp,
      startDate: exp.startDate ? dayjs(exp.startDate, 'YYYY-MM') : null,
      endDate: exp.endDate ? dayjs(exp.endDate, 'YYYY-MM') : null,
    })),
    education: initialData.education ? {
      ...initialData.education,
      startDate: initialData.education.startDate ? dayjs(initialData.education.startDate, 'YYYY-MM') : null,
      endDate: initialData.education.endDate ? dayjs(initialData.education.endDate, 'YYYY-MM') : null,
    } : undefined,
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
          {!initialData && (
            <Col span={24}>
              <Form.Item 
                name="userId" 
                label="简历 ID" 
                rules={[
                  { required: true, message: '请输入简历 ID' },
                  { pattern: /^[a-zA-Z0-9-_]+$/, message: '只能包含字母、数字、中划线和下划线' },
                  { min: 3, message: '至少3个字符' },
                  { max: 50, message: '最多50个字符' }
                ]}
                extra="这将成为您的个人简历访问地址，例如: /profile/your-id"
              >
                <Input placeholder="请输入简历 ID (如: zhang-san, john-doe)" />
              </Form.Item>
            </Col>
          )}
          <Col span={12}>
            <Form.Item name="name" label="姓名" rules={[{ required: true }]}>
              <Input placeholder="请输入姓名" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="nameEn" label="英文名/拼音">
              <Input placeholder="请输入英文名或拼音（选填）" />
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
            <Form.Item name="phone" label="电话" rules={[{ required: true, message: '请输入电话' }]}>
              <Input placeholder="请输入电话" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="location" label="所在地">
              <Input placeholder="如: 北京市朝阳区" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="gender" label="性别" rules={[{ required: true, message: '请选择性别' }]}>
              <Select placeholder="请选择性别">
                <Select.Option value="男">男</Select.Option>
                <Select.Option value="女">女</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="age" label="年龄">
              <InputNumber min={18} max={100} placeholder="请输入年龄" style={{ width: '100%' }} />
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

      {/* 最高学历背景 */}
      <Card title="最高学历背景" style={{ marginBottom: 24 }}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name={['education', 'school']} label="学校">
              <Input placeholder="学校名称" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['education', 'degree']} label="学位">
              <Input placeholder="如: 本科、硕士" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name={['education', 'major']} label="专业">
              <Input placeholder="专业名称" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={['education', 'startDate']} label="开始时间">
              <DatePicker picker="month" style={{ width: '100%' }} placeholder="选择日期" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name={['education', 'endDate']} label="结束时间">
              <DatePicker picker="month" style={{ width: '100%' }} placeholder="选择日期" />
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
            <Form.Item name="website" label="个人网站">
              <Input placeholder="https://yourwebsite.com" />
            </Form.Item>
          </Col>
        </Row>
      </Card>

      <Card title="专业技能" style={{ marginBottom: 24 }}>
        <Form.Item 
          name="skills" 
          label="技能标签"
          extra="输入技能名称后按回车键添加，如：React、Vue、Node.js 等"
        >
          <Select 
            mode="tags" 
            placeholder="请输入技能名称后按回车键添加"
            style={{ width: '100%' }}
            tokenSeparators={[',', '，']}
          />
        </Form.Item>
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
                        <TextArea rows={2} placeholder="描述项目的主要亮点和成果" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, 'technologies']} label="技术栈" rules={[{ required: true }]}>
                        <Select mode="tags" placeholder="输入后按回车添加" />
                      </Form.Item>
                    </Col>
                    <Col span={24}>
                      <Form.Item {...restField} name={[name, 'url']} label="项目链接">
                        <Input placeholder="https://..." />
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

      <Card title="证书与资质" style={{ marginBottom: 24 }}>
        <Form.List name="certifications">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key} gutter={16} align="middle">
                  <Col span={9}>
                    <Form.Item {...restField} name={[name, 'name']} rules={[{ required: true }]}>
                      <Input placeholder="证书名称" />
                    </Form.Item>
                  </Col>
                  <Col span={6}>
                    <Form.Item {...restField} name={[name, 'date']}>
                      <DatePicker picker="month" style={{ width: '100%' }} placeholder="获得时间（选填）" />
                    </Form.Item>
                  </Col>
                  <Col span={8}>
                    <Form.Item {...restField} name={[name, 'url']}>
                      <Input placeholder="证书链接（选填）" />
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
                      <AutoComplete
                        placeholder="水平（可选择或手动输入）"
                        options={[
                          { value: '母语' },
                          { value: '流利' },
                          { value: '熟练' },
                          { value: '工作语言' },
                          { value: '基础' }
                        ]}
                      />
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
