import React, { Component } from 'react'
import { Row, Col, BackTop } from 'antd'
import './footer.less'

class Footer extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return (
      <footer>
        <div className="footer">
          <BackTop />
          <div className="footer-content">
            <Row>
              <Col span={5} offset={3}>
                <ul>
                  <li>
                    <h3>此网站</h3>
                  </li>
                  <li>
                    <a href="/index">关于本站</a>
                  </li>
                  <li>
                    <a href="/register">加入我们</a>
                  </li>
                  <li>
                    <span>联系方式: 3121894148@qq.com</span>
                  </li>
                </ul>
              </Col>
              <Col span={4}>
                <ul>
                  <li>
                    <h3>推荐学习</h3>
                  </li>
                  <li>
                    <a
                      href="https://cn.vuejs.org/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      VueJS
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://reactjs.org"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      ReactJS
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://juejin.im/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      掘金社区
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.runoob.com/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      菜鸟教程
                    </a>
                  </li>
                </ul>
              </Col>
              <Col span={4}>
                <ul>
                  <li>
                    <h3>常用工具</h3>
                  </li>
                  <li>
                    <a
                      href="https://github.com/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      GitHub
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://ant.design/index-cn"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Ant Design
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://juejin.im/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      npmJS
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://stackoverflow.com/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      StackOverflow
                    </a>
                  </li>
                </ul>
              </Col>
              <Col span={3}>
                <ul>
                  <li>
                    <h3>直击招聘</h3>
                  </li>
                  <li>
                    <a
                      href="https://www.lagou.com/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      拉钩网
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.nowcoder.com/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      牛客网
                    </a>
                  </li>
                </ul>
              </Col>
              <Col span={4}>
                <ul>
                  <li>
                    <h3>基于NodeJS后台</h3>
                  </li>
                  <li>
                    <a
                      href="https://www.expressjs.com.cn/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Express
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://www.koajs.com.cn/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      Koa
                    </a>
                  </li>
                  <li>
                    <a
                      href="https://eggjs.org/zh-cn/"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      EggJS
                    </a>
                  </li>
                </ul>
              </Col>
            </Row>
            <hr />
            <Row>
              <Col span={8}>
                <span className="right">© 2019-2020 JakeQuc 版权所有</span>
              </Col>
            </Row>
          </div>
        </div>
      </footer>
    )
  }
}

export default Footer
