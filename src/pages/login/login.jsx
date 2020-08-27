import React, { Component, createRef } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Checkbox, Row, Col } from 'antd';
import { UserOutlined, LockOutlined, SendOutlined } from '@ant-design/icons';
import { reqLoginCaptcha } from './../../requestAPI/operHttp.js';
import Footer from './../../components/footer/footer.jsx';
import { Redirect } from 'react-router-dom';
import { login } from './../../redux/user.redux.js';
import { throttle } from './../../tools.js';
import './login.less';

// 这个将redux和react组件相互连接，所以login可以通过this.props.login来访问
// @connect((state) => state.user, { login })
class Login extends Component {
  // 提交登录信息触发
  captcha = '';
  loginCaptcha = createRef();

  throttle_submit = (loginForm) => {
    this.props.login(loginForm);
  };
  // 节流，防止恶意点击
  onFinish = throttle(this.throttle_submit, 1000);

  getLoginCaptcha = () => {
    var timer = setTimeout(async () => {
      // console.log('是否执行');
      let data = await reqLoginCaptcha({ time: Date.now() });
      // 需要进行动态的更新数据才行
      this.loginCaptcha.current.src = data.config.url + '?time=' + Date.now();
      clearTimeout(timer);
    }, 300);
  };

  render() {
    const { redirectTo, userObj } = this.props;
    if (redirectTo && userObj) {
      return <Redirect to={redirectTo} />;
    }
    const loginFromOut = {
      xs: {
        span: 9,
      },
      sm: {
        span: 24,
      },
    };

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
                          placeholder="点击验证码可刷新"
                        />
                      </Form.Item>
                      <Form.Item
                        name="loginCaptcha"
                        rules={[
                          {
                            required: true,
                            message: '请输入验证码!',
                          },
                        ]}
                      >
                        <Input
                          style={{ width: '80%' }}
                          prefix={<SendOutlined />}
                          type=""
                          size="large"
                          placeholder="请输入验证码"
                        />
                      </Form.Item>
                      <img
                        ref={this.loginCaptcha}
                        src={`/public/log-captcha`}
                        className="login-captcha"
                        alt="验证码"
                        onClick={this.getLoginCaptcha}
                        title="点我刷新验证码"
                      />

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
                        没有账号, <a href="/register">现在去注册!</a>
                      </Form.Item>
                    </Form>
                  </div>
                </div>
              </Col>
            </Row>
          </div>

          <Footer />
        </div>
      </>
    );
  }
}

// export default Login
export default connect((state) => state.user, { login })(Login);
