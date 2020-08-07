import React, { Component } from 'react'
import { Tabs } from 'antd'
import './algorithm.less'
import Footer from './../../components/footer/footer.jsx'

import AlgoRightCon from './../../components/algoRightCon/algoRightConClass.jsx'

const { TabPane } = Tabs
class Resource extends Component {
  constructor(props) {
    super(props)

    this.changeTablePane = this.changeTablePane.bind(this)
  }

  // 点击tablePane的时候触发改函数
  changeTablePane(key) {
    console.log('tablepane key: ', key)
  }

  render() {
    return (
      <div className="algo">
        <div className="algo-main">
          <Tabs
            defaultActiveKey="allData"
            tabPosition="left"
            onChange={this.changeTablePane}
          >
            <TabPane
              tab={<h2 className="algo-class">数据结构&算法</h2>}
              key="0"
              style={{ textAlign: 'left' }}
              disabled
            />
            <TabPane
              tab={<div className="algo-title">全部资源</div>}
              key="allData"
            >
              <AlgoRightCon rTitle="allData" />
            </TabPane>
            <TabPane
              tab={<div className="algo-title">数据结构</div>}
              key="structData"
            >
              <AlgoRightCon rTitle="structData" />
            </TabPane>

            <TabPane
              tab={<div className="algo-title">算法文章</div>}
              key="algoData"
            >
              <AlgoRightCon rTitle="algoData" />
            </TabPane>
            <TabPane
              tab={<div className="algo-title">其他资源</div>}
              key="otherData"
            >
              <AlgoRightCon rTitle="otherData" />
            </TabPane>
          </Tabs>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Resource
