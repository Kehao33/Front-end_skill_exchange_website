import React, { useState, useEffect } from 'react'
import {
  Table,
  Button,
  Popconfirm,
  Modal,
  message,
  Form,
  Input,
  Select,
} from 'antd'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
import {
  reqAllUser,
  reqDelByUid,
  reqAddUser,
  reqModUser,
} from './../../../requestAPI/operHttp.js'
import '../adminTable.less'

function AdminUser(props) {
  const columns = [
    {
      title: '用户ID',
      dataIndex: '_id',
      align: 'center',
    },
    {
      title: '用户昵称',
      dataIndex: 'nickName',
      align: 'center',
    },
    {
      title: '用户账号',
      dataIndex: 'userEmail',
      align: 'center',
    },
    {
      title: '角色',
      dataIndex: 'userRole',
      align: 'center',
    },
    {
      title: '启用状态',
      dataIndex: 'state',
      render: (state, record) => {
        if (state) return '启用'
        else return '禁用'
      },
      align: 'center',
    },
    {
      title: '用户操作',
      dataIndex: 'operation',
      render: (text, record) =>
        dataSource.length >= 1 ? (
          <div className="operation-wrap">
            {/* <a href="/edit">编辑</a> */}
            <FormOutlined
              onClick={() => editUserInfo(record)}
              style={{ color: '#58a', fontSize: 16 }}
            />
            <Popconfirm
              cancelText="取消"
              okText="确定"
              title="数据不可修复，确定永久删除吗?"
              onConfirm={() => handleDelete(record._id)}
            >
              <DeleteOutlined style={{ color: '#f00', fontSize: 16 }} />
            </Popconfirm>
          </div>
        ) : null,
      align: 'center',
    },
  ]
  const [form] = Form.useForm()
  const [visible, setVisible] = useState(false)
  // 是添加操作?
  const [isAdd, setAddOper] = useState(false)
  const [dataSource, setDataSource] = useState([])

  useEffect(() => {
    getData()
  }, [])

  // 编辑用户函数
  function editUserInfo(record) {
    setAddOper(false)
    form.setFieldsValue({
      uid: record._id,
      nickName: record.nickName,
      userEmail: record.userEmail,
      userRole: record.userRole,
      state: record.state ? '启用' : '禁用',
      signature: record.signature,
      brief: record.brief,
      firm: record.firm,
      contact: record.contact,
      realName: record.realName,
    })
    showModal()
  }

  async function getData() {
    const { data } = await reqAllUser()
    if (data.isOk) {
      data.data.forEach((item) => {
        item['key'] = item._id
      })
      setDataSource(data.data)
    } else {
      message.error(data.msg)
    }
  }
  function showModal() {
    setVisible(true)
  }

  function closeModal() {
    setVisible(false)
  }

  function handleOk() {
    closeModal()
    form.submit()
  }

  async function handleDelete(_id) {
    const { data } = await reqDelByUid({ uid: _id })
    if (data.isOk) {
      message.success(data.msg)
      getData()
    } else {
      message.error(data.msg)
    }
  }

  function handleAdd() {
    setAddOper(true)
    form.resetFields()
    showModal()
  }

  //表单提交的时候触发，values为表单里的值对应的对象
  // 如果isAdd为true则表示要添加新的用户
  async function onFinish(formData, isAddOper) {
    console.log('formData:', formData)
    if (isAddOper) {
      //添加用户
      const { data } = await reqAddUser(formData)
      if (data.isOk) {
        message.success(data.msg)
        getData()
      } else {
        message.error(data.msg)
      }
    } else {
      //修改用户数据
      const { state } = formData
      if (state === '启用') formData.state = true
      else formData.state = false
      const { data } = await reqModUser(formData)
      if (data.isOk) {
        message.success(data.msg)
        getData()
      } else {
        message.error(data.msg)
      }
    }
  }

  const formLayout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 22,
    },
  }

  console.log('dataSource:', dataSource)
  return (
    <div>
      <Button
        onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        新增用户
      </Button>
      <Table
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource && dataSource}
        columns={columns}
      />

      <Modal
        visible={visible}
        title="个人资料"
        cancelText="取消"
        okText="确定"
        width="80%"
        onOk={handleOk}
        onCancel={closeModal}
      >
        <Form
          {...formLayout}
          onFinish={(values) => {
            onFinish(values, isAdd)
          }}
          form={form}
          scrollToFirstError={true}
          layout="horizontal"
        >
          <Form.Item
            name="userEmail"
            label="用户账号"
            rules={[
              {
                type: 'email',
                required: true,
              },
            ]}
          >
            <Input placeholder="请输入注册邮箱" />
          </Form.Item>

          {isAdd ? (
            <>
              {' '}
              <Form.Item
                name="userPwd"
                label="用户密码"
                rules={[
                  {
                    required: true,
                    message: '请输入注册密码!',
                  },
                ]}
              >
                <Input type="password" placeholder="请输入密码" />
              </Form.Item>
              <Form.Item
                name="confirmPwd"
                label="确定密码"
                dependencies={['userPwd']}
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: '请核对您的密码!',
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue('userPwd') === value) {
                        return Promise.resolve()
                      }

                      return Promise.reject('请确保两次密码输入一致!')
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
            </>
          ) : null}

          <Form.Item
            name="nickName"
            label="用户昵称"
            rules={[
              {
                required: true,
                message: '请填写用户昵称',
              },
            ]}
          >
            <Input placeholder="请输入用户昵称" />
          </Form.Item>

          <Form.Item
            label="身份确认"
            name="userRole"
            rules={[
              {
                required: true,
                message: '请确认身份',
              },
            ]}
          >
            <Select placeholder="请身份确认">
              <Select.Option value="admin">管理员</Select.Option>
              <Select.Option value="normal">普通用户</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="启用与否"
            name="state"
            rules={[
              {
                required: true,
                message: '请确认身份',
              },
            ]}
          >
            <Select placeholder="请选择启用状态">
              <Select.Option value="true">启用</Select.Option>
              <Select.Option value="false">禁用</Select.Option>
            </Select>
          </Form.Item>

          {!isAdd && (
            <>
              <Form.Item name="realName" label="真实姓名">
                <Input />
              </Form.Item>
              <Form.Item name="uid" label="用户Id" style={{ display: 'none' }}>
                <Input />
              </Form.Item>
              <Form.Item name="contact" label="联系方式">
                <Input />
              </Form.Item>
              <Form.Item name="firm" label="就职公司">
                <Input />
              </Form.Item>
              <Form.Item name="signature" label="个性签名">
                <Input />
              </Form.Item>
              <Form.Item name="brief" label="个人简历">
                <Input />
              </Form.Item>
            </>
          )}
        </Form>
      </Modal>
    </div>
  )
}

export default AdminUser
