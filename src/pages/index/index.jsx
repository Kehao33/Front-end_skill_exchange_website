import React, { Component } from 'react'
import { Button, Typography } from 'antd'
import ReactFullpage from '@fullpage/react-fullpage'
import './index.less'
import Header from './../../components/header/header.jsx'
const { Title, Paragraph } = Typography

class Index extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }

  render() {
    return (
      <div className="index-wrap">
        <Header />
        <ReactFullpage
          //fullpage options
          loopBottom={true}
          licenseKey={'JakeQu'}
          scrollingSpeed={500} /* Options here */
          scrollHorizontally={true}
          navigation={true}
          slidesNavigation={true}
          scrollOverflowReset={true}
          render={({ state, fullpageApi }) => {
            return (
              <ReactFullpage.Wrapper>
                <div className="index section present">
                  <div className="intro">
                    <p className="motto">我们一起UP, 让前端更前端</p>
                    <p className="up">有志者,事竟成</p>
                    <Button
                      type="primary"
                      block
                      size="small"
                      style={{
                        width: '86px',
                        height: '36px',
                        minWidth: 86,
                        minHeight: 36,
                        marginBottom: 148,
                      }}
                    >
                      Learn More
                    </Button>

                    <div className="copyright">
                      CopyRight©2020 JakeQu 版权所有
                    </div>
                  </div>
                </div>
                <div className="index section  corner">
                  <div className="fl">
                    <Typography>
                      <Title level={2}>知识角</Title>
                      <b>没有独立的技术，那就撸起袖子加油干</b>
                      <Paragraph>
                        <ul style={{ marginTop: 10 }}>
                          <li>
                            <span>前端</span>
                            <p>
                              Web前端这一技术是从美工演变而来的，其名称具有很明显的时代特征。而且现在越来越多的IT企业对用户体验更加注重，因此Web前端人员的需求量也是越来越大，更重要的是前端入门比较简单。
                            </p>
                          </li>
                          <li>
                            <span>NodeJS</span>
                            <p>你不知道的Javascript，向全栈进阶</p>
                          </li>
                          <li>
                            <span>数据结构&算法</span>
                            <p>
                              不论是在前端，还是在后台，亦或者是学习AI人工智能等，如果你想有一个突破性的提升，那么数据结构和算法就是你必须要踏上的台阶,因为它可以让你的编程思维更加有维度、更加有逻辑性。
                            </p>
                          </li>
                        </ul>
                      </Paragraph>
                    </Typography>
                  </div>

                  <div className="fr">
                    <div className="fr-img"></div>
                  </div>
                </div>
                <div className="index section nutrition">
                  <div className="nutri-title">这里有料</div>
                  <ul>
                    <li>
                      <a
                        href="https://juejin.im/post/582e96a00ce463006cf15198"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="nutr-card">
                          <div className="nutr-header-wrap">
                            <span>推荐网站</span>
                            <p>
                              我们一起，
                              <br /> 则其善者而从之
                            </p>
                          </div>
                          <hr className="index-line" />
                          <Button type="primary">点击get</Button>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://www.zhihu.com/question/56200585"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="nutr-card">
                          <div className="nutr-header-wrap">
                            <span>前端学习路线</span>
                            <p>
                              学习路线，
                              <br /> 让每天的拉弓都有意义
                            </p>
                          </div>
                          <hr className="index-line" />
                          <Button type="primary">点击get</Button>
                        </div>
                      </a>
                    </li>
                    <li>
                      <a
                        href="https://juejin.im/post/5d387f696fb9a07eeb13ea60"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <div className="nutr-card">
                          <div className="nutr-header-wrap">
                            <span>精品文章推荐</span>
                            <p>
                              善于阅读，
                              <br /> 可以让我们越来越聪明
                            </p>
                          </div>
                          <hr className="index-line" />
                          <Button type="primary">点击get</Button>
                        </div>
                      </a>
                    </li>
                  </ul>
                </div>
              </ReactFullpage.Wrapper>
            )
          }}
        />
      </div>
    )
  }
}

export default Index
