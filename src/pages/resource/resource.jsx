import React, { Component } from 'react'
import { Row, Col, Tabs } from 'antd'
// import RightContent from './rightContent'
import RightContent from './../../components/resourceRightCon/resCnt'
import './resource.less'
import Footer from './../../components/footer/footer.jsx'
import { reqResource } from './../../requestAPI/operHttp.js'

const { TabPane } = Tabs
class Resource extends Component {
  constructor(props) {
    super(props)
    this.state = {
      isSearch: false,
      allData: [], //请求到的所有数据
      isContentLoading: true,
      videoData: [],
      bookData: [],
      softData: [],
      otherData: [],
    }
    this.changeTablePane = this.changeTablePane.bind(this) // 视频教程的数据 // 电子书籍的数据 // 好用软件的数据 // 其他资源的数据
  }

  changeTablePane(key) {
    console.log(key)
  }

  async componentDidMount() {
    const { data } = await reqResource()
    data.data.forEach((item) => (item['href'] = '/article/' + item._id))
    this.setState({
      allData: data.data,
      videoData: data.data.filter(
        (item) => item.artType.search(/视频教程/g) !== -1
      ),
      bookData: data.data.filter(
        (item) => item.artType.search(/电子书籍/g) !== -1
      ),
      softData: data.data.filter(
        (item) => item.artType.search(/好用软件/g) !== -1
      ),
      otherData: data.data.filter(
        (item) => item.artType.search(/其他/g) !== -1
      ),
      isContentLoading: false,
    })
  }

  render() {
    const {
      allData,
      bookData,
      videoData,
      softData,
      otherData,
      isContentLoading,
    } = this.state

    return (
      <div className="resource">
        {/* <Header/> */}
        <div className="resource-main">
          <Tabs
            defaultActiveKey="1"
            tabPosition="left"
            onChange={this.changeTablePane}
          >
            <TabPane
              tab={<h2 className="res-class">资源分类</h2>}
              key="资源分类"
              style={{ textAlign: 'left' }}
              disabled
            />
            <TabPane
              tab={
                <Row style={{ width: 120 }}>
                  <Col span={12}>
                    <div className="res-title">全部</div>
                  </Col>
                  <Col span={12}>
                    <div className="res-title-num">{allData.length}</div>
                  </Col>
                </Row>
              }
              key="allData"
            >
              <RightContent
                isContentLoading={isContentLoading}
                resource_data={allData}
                rTitle="全部"
              />
            </TabPane>
            <TabPane
              tab={
                <Row style={{ width: 120 }}>
                  <Col span={12}>
                    <div className="res-title">视频教程</div>
                  </Col>
                  <Col span={12}>
                    <div className="res-title-num">{videoData.length}</div>
                  </Col>
                </Row>
              }
              key="videoData"
            >
              <RightContent
                isContentLoading={isContentLoading}
                resource_data={videoData}
                rTitle="视频教程"
              />
            </TabPane>
            <TabPane
              tab={
                <Row style={{ width: 120 }}>
                  <Col span={12}>
                    <div className="res-title">电子书籍</div>
                  </Col>
                  <Col span={12}>
                    <div className="res-title-num">{bookData.length}</div>
                  </Col>
                </Row>
              }
              key="bookData"
            >
              <RightContent
                isContentLoading={isContentLoading}
                resource_data={bookData}
                rTitle="电子书籍"
              />
            </TabPane>
            <TabPane
              tab={
                <Row style={{ width: 120 }}>
                  <Col span={12}>
                    <div className="res-title">好用软件</div>
                  </Col>
                  <Col span={12}>
                    <div className="res-title-num">{softData.length}</div>
                  </Col>
                </Row>
              }
              key="softData"
            >
              <RightContent
                isContentLoading={isContentLoading}
                resource_data={softData}
                rTitle="好用软件"
              />
            </TabPane>
            <TabPane
              tab={
                <Row style={{ width: 120 }}>
                  <Col span={12}>
                    <div className="res-title">其他资源</div>
                  </Col>
                  <Col span={12}>
                    <div className="res-title-num">{otherData.length}</div>
                  </Col>
                </Row>
              }
              key="otherData"
            >
              <RightContent
                isContentLoading={isContentLoading}
                resource_data={otherData}
                rTitle="其他资源"
              />
            </TabPane>
          </Tabs>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Resource
