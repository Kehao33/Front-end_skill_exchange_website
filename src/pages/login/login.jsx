import React, { Component } from 'react'
import { Form, Input, Button, Checkbox, Row, Col } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import Footer from './../../components/footer/footer.jsx'
import { Redirect } from 'react-router-dom'
import { login } from './../../redux/user.redux.js'
import { connect } from 'react-redux'
import './login.less'

// 这个将redux和react组件相互连接，所以login可以通过this.props.login来访问
// @connect((state) => state.user, { login })
class Login extends Component {
  // 提交登录信息触发
  onFinish = async (loginForm) => {
    console.log('loginForm: ',loginForm)
    this.props.login(loginForm)
  }
  render() {
    const { redirectTo, userObj } = this.props

    if (redirectTo && userObj) {
      return <Redirect to={redirectTo} />
    }
    const loginFromOut = {
      xs: {
        span: 9,
      },
      sm: {
        span: 24,
      },
    }
    const loginFrom = {
      xs: {
        span: 24,
      },
      sm: {
        span: 12,
      },
      offset: 14,
    }

    return (
      <>
        <div className="login">
          <div>
            <Row align="center" style={{ width: '100%' }} {...loginFromOut}>
              <Col span={15}>
                <div className="login-box login-pic"></div>
              </Col>
              <Col span={9}>
                <div className="login-box  login-wrap">
                  <div className="login-form-wrap">
                    <Form
                      name="login-form"
                      // initialValues={{
                      //   remember: true,
                      // }}
                      onFinish={this.onFinish}
                    >
                      <div className="login-title">用户登录</div>
                      <Form.Item
                        name="userEmail"
                        rules={[
                          {
                            required: true,
                            message: '请输入您的账号!',
                          },
                        ]}
                      >
                        <Input
                          style={{ width: '80%' }}
                          prefix={<UserOutlined />}
                          placeholder="请输入邮箱账号"
                          size="large"
                        />
                      </Form.Item>
                      <Form.Item
                        name="userPwd"
                        rules={[
                          {
                            required: true,
                            message: '请输入您的密码!',
                          },
                        ]}
                      >
                        <Input
                          style={{ width: '80%' }}
                          prefix={<LockOutlined />}
                          type="password"
                          size="large"
                          placeholder="请输入密码"
                        />
                      </Form.Item>
                      {/* <Form.Item>
                        <Row justify="space-between">
                          <Col {...loginFrom}>
                            <Form.Item
                              name="remember"
                              valuePropName="checked"
                              noStyle
                            >
                              <Checkbox>记住密码</Checkbox>
                            </Form.Item>
                          </Col>
                          <Col {...loginFrom}>
                            <a
                              className="login-form-forgot"
                              href="www.baidu.com"
                            >
                              忘记密码
                            </a>
                          </Col>
                        </Row>
                      </Form.Item> */}

                      <Form.Item>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="login-form-button"
                        >
                          登录
                        </Button>
                        <br /> <br />
                        没有账号, <a href="#/register">现在去注册!</a>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <div className="login-footer">
            <Footer />
          </div>
        </div>
      </>
    )
  }
}

// export default Login
export default connect((state) => state.user, { login })(Login)
