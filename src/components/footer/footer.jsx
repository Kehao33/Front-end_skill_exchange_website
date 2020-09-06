import React, { Component } from 'react'
import { Row, Col, BackTop } from 'antd'
import { footerOptions } from './../../options/options.js'

import './footer.less'

const { recommend_Opt, commonTool_Opt, jobOffer_Opt, back_Opt } = footerOptions

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
                  {recommend_Opt.map((item) => {
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.name}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </Col>
              <Col span={4}>
                <ul>
                  <li>
                    <h3>常用工具</h3>
                  </li>
                  {commonTool_Opt.map((item) => {
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.name}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </Col>
              <Col span={3}>
                <ul>
                  <li>
                    <h3>直击招聘</h3>
                  </li>

                  {jobOffer_Opt.map((item) => {
                    return (
                      <li key={item.href}>
                        <a
                          href={item.href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.name}
                        </a>
                      </li>
                    )
                  })}
                </ul>
              </Col>
              <Col span={4}>
                <ul>
                  <li>
                    <h3>基于NodeJS后台</h3>
                  </li>
                  {back_Opt.map((item) => (
                    <li key={item.href}>
                      <a
                        href={item.href}
                        rel="noopener noreferrer"
                        target="_blank"
                      >
                        {item.name}
                      </a>
                    </li>
                  ))}
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
