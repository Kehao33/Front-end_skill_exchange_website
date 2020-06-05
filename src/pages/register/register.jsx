import React, { Component } from 'react'
import { Form, Input, Card, Button } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
import { Redirect } from 'react-router-dom'
// 获取register中的register方法
import { register } from '../../redux/user.redux.js'
import { connect } from 'react-redux'
import Footer from './../../components/footer/footer.jsx'
import './register.less'

@connect((state) => state.user, { register })
class Register extends Component {
  // 表单提交的时候自动触发的事件，values是表单内容对象
  onFinish = (formData) => {
    this.props.register(formData)
    this.props.history.replace('/login')
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 5,
        },
      },
      wrapperCol: {
        xs: {
          span: 24,
        },
        sm: {
          span: 19,
        },
      },
    }
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 6,
        },
      },
    }

    let { redirectTo } = this.props // 从redux中获取的，用来判断当前页面应该跳转到哪里

    const regCom = (
      <>
        <div className="register-header">
          <UserAddOutlined />
          注册表
        </div>
        <Card>
          <Form
            {...formItemLayout}
            name="register"
            onFinish={this.onFinish}
            scrollToFirstError
            size="middle"
          >
            <Form.Item
              name="nickName"
              label="昵称"
              rules={[
                {
                  required: true,
                  message: '请输入您的昵称!',
                  whitespace: true,
                },
              ]}
            >
              <Input className="register-input" />
            </Form.Item>

            <Form.Item
              name="userEmail"
              label="邮箱"
              rules={[
                {
                  type: 'email',
                  message: '请输入正确的邮箱格式!',
                },
                {
                  required: true,
                  message: '请输入您的邮箱号!',
                },
              ]}
            >
              <Input className="register-input" />
            </Form.Item>

            <Form.Item
              name="userPwd"
              label="密码"
              rules={[
                {
                  required: true,
                  message: '请输入您的密码!',
                },
              ]}
              hasFeedback
            >
              <Input.Password className="register-input" />
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
              <Input.Password className="register-input" />
            </Form.Item>

            {/* <Form.Item label="邮箱验证">
              <Row gutter={8} style={{ marginLeft: -4, marginRight: 16 }}>
                <Col span={21}>
                  <Form.Item
                    name="captcha"
                    noStyle
                    rules={[
                      {
                        required: true,
                        message: '请输入您得到的验证码!',
                      },
                    ]}
                  >
                    <Input
                      placeholder="正确的邮箱验证确保是您本人在操作"
                      style={{ width: 470 }}
                    />
                  </Form.Item>
                </Col>
                <Col span={3}>
                  <Button>获取验证码</Button>
                </Col>
              </Row>
            </Form.Item> */}

            <Form.Item {...tailFormItemLayout}>
              <Button
                type="primary"
                htmlType="submit"
                style={{ fontSize: '18px' }}
                size="large"
              >
                立即注册
              </Button>
              <div style={{ marginTop: 20 }}>
                有账号, <a href="#/login">现在就去登录!</a>
              </div>
            </Form.Item>
          </Form>
        </Card>
        <div style={{ width: '100%' }}>
          <Footer />
        </div>
      </>
    )

    return (
      <div className="register">
        {/* <Header/> */}
        {/* {redirectTo ? <Redirect to={redirectTo} /> : regCom} */}
        {regCom}
      </div>
    )
  }
}

export default Register
