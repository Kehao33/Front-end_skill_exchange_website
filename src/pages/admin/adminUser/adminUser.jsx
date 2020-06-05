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
              title="确定永久删除吗?"
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

// import React, { Component } from 'react'
// import { Table, Button, Popconfirm, Modal, Form, Input, Select } from 'antd'
// import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
// import '../adminTable.less'

// export default class AdminUser extends Component {
//   constructor(props) {
//     super(props)
//     this.columns = [
//       {
//         title: '用户ID',
//         dataIndex: 'user_id',
//         align: 'center',
//         ellipsis: true,
//       },
//       {
//         title: '用户名',
//         dataIndex: 'user_name',
//         align: 'center',
//         ellipsis: true,
//       },
//       {
//         title: '邮箱',
//         dataIndex: 'user_email',
//         align: 'center',
//         ellipsis: true,
//       },
//       {
//         title: '角色',
//         dataIndex: 'user_role',
//         align: 'center',
//         ellipsis: true,
//       },
//       {
//         title: '启用状态',
//         dataIndex: 'user_status',
//         align: 'center',
//         ellipsis: true,
//       },
//       {
//         title: '用户操作',
//         dataIndex: 'operation',
//         render: (text, record) =>
//           this.state.dataSource.length >= 1 ? (
//             <div className="operation-wrap">
//               {/* <a href="/edit">编辑</a> */}
//               <FormOutlined
//                 onClick={this.showModal}
//                 style={{ color: '#58a', fontSize: 16 }}
//               />
//               <Popconfirm
//                 title="确定永久删除吗?"
//                 onConfirm={() => this.handleDelete(record.key)}
//               >
//                 {/* <a href="/delete">删除</a> */}
//                 <DeleteOutlined style={{ color: '#f00', fontSize: 16 }} />
//               </Popconfirm>
//             </div>
//           ) : null,
//         align: 'center',
//         ellipsis: true,
//       },
//     ]
//     this.state = {
//       visible: false,
//       dataSource: [
//         {
//           key: '0',
//           user_id: '0',
//           user_name: 'jakeQu',
//           user_email: 'jakeQu@email.com',
//           user_role: '超级管理员',
//           user_status: '启用',
//         },
//         {
//           key: '1',
//           user_id: '1',
//           user_name: 'jakeQu',
//           user_email: 'jakeQu@email.com',
//           user_role: '超级管理员',
//           user_status: '启用',
//         },
//         {
//           key: '2',
//           user_id: '2',
//           user_name: 'jakeQu',
//           user_email: 'jakeQu@email.com',
//           user_role: '普通',
//           user_status: '启用',
//         },
//         {
//           key: '3',
//           user_id: '3',
//           user_name: 'jake',
//           user_email: 'jakeQu@email.com',
//           user_role: '超级管理员',
//           user_status: '启用',
//         },
//       ],
//       count: 2,
//     }
//   }

//   showModal = () => {
//     this.setState({
//       visible: true,
//     })
//   }

//   handleOk = () => {
//     this.setState({ loading: true })
//     setTimeout(() => {
//       this.setState({ loading: false, visible: false })
//     }, 3000)
//   }

//   handleCancel = () => {
//     this.setState({ visible: false })
//   }

//   handleDelete = (key) => {
//     const dataSource = [...this.state.dataSource]
//     this.setState({
//       dataSource: dataSource.filter((item) => item.key !== key),
//     })
//   }

//   handleAdd = () => {
//     this.showModal()
//     // const { count, dataSource } = this.state
//     // const newData = {
//     //   key: count,
//     //   name: `Edward King ${count}`,
//     //   age: 32,
//     //   address: `London, Park Lane no. ${count}`,
//     // }
//     // this.setState({
//     //   dataSource: [...dataSource, newData],
//     //   count: count + 1,
//     // })
//   }

//   //表单提交的时候触发，values为表单里的值对应的对象
//   onFinish = (values) => {
//     console.log('Success:', values)
//   }

//   handleSave = (row) => {
//     const newData = [...this.state.dataSource]
//     const index = newData.findIndex((item) => row.key === item.key)
//     const item = newData[index]
//     newData.splice(index, 1, { ...item, ...row })
//     this.setState({
//       dataSource: newData,
//     })
//   }

//   render() {
//     const tailLayout = {
//       wrapperCol: { offset: 16, span: 12 },
//     }
//     const formLayout = {
//       labelCol: {
//         span: 2,
//       },
//       wrapperCol: {
//         span: 22,
//       },
//     }
//     return (
//       <div>
//         <Button
//           onClick={this.handleAdd}
//           type="primary"
//           style={{
//             marginBottom: 16,
//           }}
//         >
//           新增用户
//         </Button>
//         <Table
//           rowClassName={() => 'editable-row'}
//           bordered
//           dataSource={this.state.dataSource}
//           columns={this.columns}
//         />

//         <Modal
//           visible={this.state.visible}
//           title="个人资料"
//           // style={{ top: 1, right: -40 }}
//           width="70%"
//           onOk={this.handleOk}
//           onCancel={this.handleCancel}
//           footer={null}
//         >
//           <Form
//             {...formLayout}
//             onFinish={this.onFinish}
//             scrollToFirstError={true}
//             layout="horizontal"
//           >
//             <Form.Item
//               name="user_email"
//               label="邮箱"
//               rules={[
//                 {
//                   type: 'email',
//                   required: true,
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>
//             <Form.Item
//               name="user_name"
//               label="用户名"
//               rules={[
//                 {
//                   required: true,
//                   message: '请填写用户名',
//                 },
//               ]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               label="身份确认"
//               name="user_role"
//               rules={[
//                 {
//                   required: true,
//                   message: '请确认身份',
//                 },
//               ]}
//             >
//               <Select>
//                 <Select.Option value="0">管理员</Select.Option>
//                 <Select.Option value="1">普通用户</Select.Option>
//               </Select>
//             </Form.Item>
//             <Form.Item
//               label="启用与否"
//               name="user_state"
//               rules={[
//                 {
//                   required: true,
//                   message: '请确认身份',
//                 },
//               ]}
//             >
//               <Select>
//                 <Select.Option value="1">启用</Select.Option>
//                 <Select.Option value="0">禁用</Select.Option>
//               </Select>
//             </Form.Item>
//             <Form.Item {...tailLayout}>
//               <Button key="back" onClick={this.handleCancel}>
//                 返回
//               </Button>
//               &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
//               <Button
//                 key="submit"
//                 type="primary"
//                 htmlType="submit"
//                 loading={this.state.loading}
//                 onClick={this.handleOk}
//               >
//                 确定修改
//               </Button>
//             </Form.Item>
//           </Form>
//         </Modal>
//       </div>
//     )
//   }
// }
