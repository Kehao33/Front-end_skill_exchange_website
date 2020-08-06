import React, { Component, createRef } from 'react'
import { Form, Input, Card, Button, Row, Col, message } from 'antd'
import { UserAddOutlined } from '@ant-design/icons'
// 获取register中的register方法
import { Redirect } from 'react-router-dom'
import { register } from '../../redux/user.redux.js'
import { connect } from 'react-redux'
import { reqGetCaptcha } from './../../requestAPI/operHttp'
import Footer from './../../components/footer/footer.jsx'
import './register.less'

@connect((state) => state.user, { register })
class Register extends Component {
  constructor(props) {
    super(props)
    this.captchaRef = createRef()
  }

  // 表单提交的时候自动触发的事件，values是表单内容对象
  onFinish = (formData) => {
    const { history, register, isAuth } = this.props
    register(formData)
    if (isAuth) {
      history.replace('/login')
    }
  }

  // this.refs.captchaRef.current.src = `http://localhost:3000/public/captcha`

  getCaptcha = () => {
    const timer = setTimeout(async () => {
      await reqGetCaptcha({ time: Date.now() })
      this.captchaRef.current.src = `/public/captcha?time=${Date.now()}`
      clearTimeout(timer)
    }, 300)
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
          offset: 4,
        },
      },
    }
    const { isAuth, redirectTo } = this.props
    if (isAuth && redirectTo === '/login') {
      return <Redirect to="/login" />
    }

    const regCom = (
      <>
        <div className="register-header">
          <UserAddOutlined />
          注册表
        </div>
        <Card>
          <div className="form-wrap">
            <Form
              {...formItemLayout}
              name="register"
              onFinish={this.onFinish}
              scrollToFirstError
              size="large"
            >
              <Row>
                <Form.Item
                  name="nickName"
                  label="用户昵称"
                  rules={[
                    {
                      required: true,
                      message: '昵称不能为空且不能超过16个字符!',
                      max: 16,
                      whitespace: true,
                    },
                  ]}
                >
                  <Input
                    size="large"
                    placeholder="请填写您可爱的昵称哦"
                    className="register-input"
                  />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  name="userEmail"
                  label="邮箱账号"
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
                  <Input
                    size="large"
                    placeholder="这也是您的登录账号"
                    className="register-input"
                  />
                </Form.Item>
              </Row>
              <Row>
                <Form.Item
                  name="userPwd"
                  label="登录密码"
                  rules={[
                    {
                      required: true,
                      min: 6,
                      message: '请输入您的密码!',
                    },
                    {
                      type: 'string',
                      max: 18,
                      min: 6,
                      message: '密码必须在6~18之间',
                    },
                  ]}
                  hasFeedback
                >
                  <Input.Password
                    size="large"
                    placeholder="请填写登录密码"
                    className="register-input"
                  />
                </Form.Item>
              </Row>
              <Row>
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
                    {
                      type: 'string',
                      max: 18,
                      min: 6,
                      message: '密码必须在6~18之间',
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
                  <Input.Password
                    size="large"
                    className="register-input"
                    placeholder="请再次确认登录密码"
                  />
                </Form.Item>
              </Row>

              <Row gutter={2}>
                <Col span={18} className="captcha-input">
                  <Form.Item
                    label="注册校验"
                    name="captcha"
                    rules={[
                      {
                        required: true,
                        message: '请输入正确的验证码!',
                      },
                    ]}
                  >
                    <Input size="large" placeholder="点击图片可刷新验证码" />
                  </Form.Item>
                </Col>
                <Col span={4}>
                  <img
                    ref={this.captchaRef}
                    className="captcha-img"
                    style={{ zIndex: 999 }}
                    onClick={this.getCaptcha}
                    // src={`http://localhost:3000/public/captcha`}
                    // 第一次的时候src会主动进行请求服务端的数据
                    src={`/public/captcha`}
                    alt="验证码照片"
                  />
                </Col>
              </Row>

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
                  有账号, <a href="/login">现在就去登录!</a>
                </div>
              </Form.Item>
            </Form>
          </div>
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
