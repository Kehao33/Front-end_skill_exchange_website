import React, { Component } from 'react'
import { NavLink, withRouter, Link } from 'react-router-dom'
import { Menu, Avatar, Dropdown, Modal, Form, Input } from 'antd'
import { connect } from 'react-redux'
import {
  SoundOutlined,
  FolderOpenOutlined,
  TagsOutlined,
  UserOutlined,
  DownOutlined,
  HighlightOutlined,
  UserAddOutlined,
  ClusterOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import { logOutUser, modifyUserPass } from './../../redux/user.redux.js'

import './header.less'
const { confirm } = Modal

// connect将redux中的数据和操作函数相关联，让本组件可以通过this.props访问从redux中导入的方法或者是数据
// @connect((state) => state.user, { logOutUser })
class Header extends Component {
  constructor(props) {
    super(props)
    this.onFinish = this.onFinish.bind(this)
    this.loginOut = this.loginOut.bind(this)
    this.formRef = React.createRef()
    this.state = {
      visible: false,
    }
  }

  // 用户修改基本信息提交操作调用
  onFinish(formData) {
    this.props.modifyUserPass(formData)
    this.props.history.replace('/login')
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

  handleCancel = (e) => {
    this.setState({
      visible: false,
    })
  }

  loginOut() {
    const self = this
    confirm({
      title: '是否确定退出登录?',
      cancelText: '取消',
      okText: '确定',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        self.props.history.push('/login')
        self.props.logOutUser()
      },
      onCancel() {},
    })
  }

  render() {
    const menu = (
      <Menu>
        <Menu.Item>
          <span
            rel="noopener noreferrer"
            onClick={() =>
              this.props.history.push(`/user/${this.props.userObj._id}`)
            }
          >
            个人中心
          </span>
        </Menu.Item>
        <Menu.Item>
          <span rel="noopener noreferrer" onClick={this.loginOut}>
            退出登录
          </span>
        </Menu.Item>
        <Menu.Item>
          <span onClick={this.showModal}>快速修改密码</span>
        </Menu.Item>
      </Menu>
    )

    const { location, userObj } = this.props

    let pathNav = location.pathname
    let flag = /\/admin.*/.test(pathNav)

    const formLayout = {
      labelCol: {
        span: 5,
      },
      wrapperCol: {
        span: 19,
      },
    }
    const headerRight = userObj ? (
      <div className="header-right">
        <div className="write-btn">
          <NavLink activeClassName="write-ative" to="/user/write">
            <HighlightOutlined /> &nbsp;创作中心
          </NavLink>
        </div>

        <div className="oper-user">
          <Link to={`/user/${this.props.userObj._id}`}>
            {userObj && userObj.avatarUrl ? (
              <Avatar src={userObj.avatarUrl} />
            ) : (
              <Avatar>U</Avatar>
            )}
          </Link>
          &nbsp;
          <Dropdown overlay={menu}>
            <span
              className="ant-dropdown-link"
              onClick={(e) => e.preventDefault()}
            >
              {userObj && userObj.nickName} &nbsp;&nbsp;
              <DownOutlined />
            </span>
          </Dropdown>
        </div>
      </div>
    ) : (
      <div className="header-right">
        <div>
          <UserOutlined />
          &nbsp;
          <NavLink activeClassName="active" to="/login">
            登录
          </NavLink>
        </div>

        <div>
          <UserAddOutlined />
          &nbsp;
          <NavLink activeClassName="active" to="/register">
            注册
          </NavLink>
        </div>
      </div>
    )

    const head = flag ? null : (
      <div
        className="header"
        style={pathNav === '/index' ? { position: 'absolute' } : null}
      >
        <div className="header-left">
          <div>
            <NavLink activeClassName="active" to="/index">
              <img src="/img/logo.png" alt="logo.png" />
            </NavLink>
          </div>
          <div>
            <SoundOutlined />
            &nbsp;
            <NavLink activeClassName="active" to="/dynamic">
              前端动态
            </NavLink>
          </div>
          <div>
            <FolderOpenOutlined />
            &nbsp;
            <NavLink activeClassName="active" to="/resource">
              资源共享
            </NavLink>
          </div>
          <div>
            <TagsOutlined />
            &nbsp;
            <NavLink activeClassName="active" to="/algorithm">
              数据结构&算法
            </NavLink>
          </div>
          {userObj && userObj.userRole === 'admin' ? (
            <div>
              <NavLink activeClassName="write-ative" to="/admin">
                <ClusterOutlined /> &nbsp;后台管理
              </NavLink>
            </div>
          ) : null}
        </div>
        {headerRight}

        <Modal
          visible={this.state.visible}
          bodyStyle={{ paddingRight: 25 }}
          centered
          title="修改基本信息"
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
      </div>
    )
    return <header>{head}</header>
  }
}

export default connect((state) => state.user, { logOutUser, modifyUserPass })(
  withRouter(Header)
)
