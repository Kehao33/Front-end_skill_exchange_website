import React, { Component, createRef } from 'react'
import { NavLink, withRouter } from 'react-router-dom'
import {
  Menu,
  Layout,
  Dropdown,
  Modal,
  Form,
  Input,
  message,
} from 'antd'
import {
  FileOutlined,
  UserOutlined,
  DownOutlined,
  CommentOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { connect } from 'react-redux'


import { logOutUser, modifyUserPass } from './redux/user.redux'
import './admin.less'
const { Header, Content, Sider } = Layout
const { confirm } = Modal

class Admin extends Component {
  constructor(props) {
    super(props)
    this.formRef = createRef()
    this.getBase64 = this.getBase64.bind(this)
    this.onFinish = this.onFinish.bind(this)
    this.loginOut = this.loginOut.bind(this)
  }
  state = {
    loading: false,
    visible: false,
  }

  onFinish(formData) {
    this.props.modifyUserPass(formData)
    this.props.history.replace('/login')
  }

  getBase64(img, callback) {
    const reader = new FileReader()
    reader.addEventListener('load', () => callback(reader.result))
    reader.readAsDataURL(img)
  }

  beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!')
    }
    const isLt2M = file.size / 1024 / 1024 < 2
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!')
    }
    return isJpgOrPng && isLt2M
  }

  handleChange = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({ loading: true })
      return
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, (imageUrl) =>
        this.setState({
          imageUrl,
          loading: false,
        })
      )
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    })
    this.formRef.current.submit()
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  loginOut() {
    const self = this
    confirm({
      title: '是否确定退出登录?',
      cancelText: '取消',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        self.props.logOutUser()
        self.props.history.push('/login')
      },
      onCancel() {},
    })
  }

  render() {
    const { location } = this.props
    const menu = (
      <Menu>
        <Menu.Item>
          <span
            rel="noopener noreferrer"
            onClick={() =>
              this.props.history.push(`/user/${this.props.userObj._id}`)
            }
          >
            个人中心/普通模式
          </span>
        </Menu.Item>
        <Menu.Item>
          <span rel="noopener noreferrer" onClick={this.loginOut}>
            退出登录
          </span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={this.showModal}>修改基本信息</span>
        </Menu.Item>
      </Menu>
    )

    const formLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    }

    const { userObj } = this.props

    return (
      <Layout>
        <Sider>
          <div className="logo">
            <img src="/img/logo.png" alt="" />
          </div>
          <Menu theme="dark" mode="inline">
            <Menu.Item
              key="1"
              className={
                location.pathname === '/admin/user'
                  ? 'ant-menu-item-selected'
                  : ''
              }
            >
              <UserOutlined />
              <NavLink to="/admin/user" activeClassName="active">
                <span className="nav-text">用户管理</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="2"
              className={
                location.pathname === '/admin/article'
                  ? 'ant-menu-item-selected'
                  : ''
              }
            >
              <FileOutlined />

              <NavLink to="/admin/article" activeClassName="active">
                <span className="nav-text">文章管理</span>
              </NavLink>
            </Menu.Item>
            <Menu.Item
              key="3"
              className={
                location.pathname === '/admin/comment'
                  ? 'ant-menu-item-selected'
                  : ''
              }
            >
             <CommentOutlined />

              <NavLink to="/admin/comment" activeClassName="active">
                <span className="nav-text">评论管理</span>
              </NavLink>
            </Menu.Item>
          </Menu>
        </Sider>

        <Layout>
          <Header style={{ padding: 0 }}>
            <span
              className="userbar"
              style={{ float: 'right', marginRight: 26 }}
            >
              <Dropdown overlay={menu}>
                <span
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  {userObj && userObj.nickName} <DownOutlined />
                </span>
              </Dropdown>
            </span>
          </Header>
          <Content style={{ margin: '24px 16px 0' }}>
            <div className="admin-content" style={{ padding: 26 }}>
              {!this.props.children ? (
                <div>欢迎来到后台管理页面</div>
              ) : (
                this.props.children
              )}
            </div>
          </Content>
        </Layout>

        <Modal
          visible={this.state.visible}
          title="修改基本信息"
          bodyStyle={{ paddingRight: 25 }}
          centered
          cancelText="取消"
          okText="确定修改"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          onBlur={() => {
            console.log('modal onblur')
          }}
          afterClose={() => this.formRef.current.resetFields()}
        >
          <Form
            ref={this.formRef}
            {...formLayout}
            layout="horizontal"
            name="changePwd"
            onFinish={this.onFinish}
            scrollToFirstError
            initialValues={{
              userEmail: userObj && userObj.userEmail,
              nickName: userObj && userObj.nickName,
            }}
          >
            <Form.Item
              style={{ display: 'none' }}
              name="userEmail"
              label="邮箱"
              rules={[
                {
                  type: 'email',
                  required: true,
                },
              ]}
            >
              <Input disabled={true} />
            </Form.Item>
            <Form.Item
              name="nickName"
              label="用户名"
              rules={[
                {
                  required: true,
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="oldPwd"
              label="旧密码"
              placeholder="请输入您的旧密码"
              rules={[
                {
                  required: true,
                  message: '请输入您的旧密码!',
                },
              ]}
              hasFeedback
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="userPwd"
              label="新密码"
              placeholder="请输入您的新密码"
              rules={[
                {
                  required: true,
                  message: '请输入您的新密码!',
                },
              ]}
              hasFeedback
            >
              <Input.Password className="register-input" />
            </Form.Item>

            <Form.Item
              name="confirmPwd"
              label="确定新密码"
              placeholder="请再次输入您的新密码"
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
          </Form>
        </Modal>
      </Layout>
    )
  }
}

export default connect((state) => state.user, { logOutUser, modifyUserPass })(
  withRouter(Admin)
)
