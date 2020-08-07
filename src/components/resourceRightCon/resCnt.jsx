import React, { useState, useEffect } from 'react'
import { Row, Col, Card, Avatar, Input, Button, Skeleton, message } from 'antd'
import { CalendarOutlined } from '@ant-design/icons'
import { formatDate } from './../../tools.js'

import './resCnt.less'
const { Search } = Input
function RightContent(props) {
  const { resource_data, isContentLoading, rTitle } = props
  const [isSearch, setIsSearch] = useState(false)
  const [contentLoading, setContentLoading] = useState(isContentLoading)
  const searchData = new Set()
  const [renderData, setRenderData] = useState(resource_data)

  useEffect(() => {
    if (resource_data.length !== 0) {
      setContentLoading(false)
      setRenderData(resource_data)
    }
  }, [resource_data])

  function handleSearch(value) {
    setIsSearch(true)
    if (value.trim().length === 0) {
      setRenderData(resource_data)
      message.warning('搜索数据不能为空')
    } else {
      let regx = new RegExp(value, 'gi')
      resource_data.forEach((item) => {
        for (let attr in item) {
          // 如果搜索框的所有内容在请求的数据中，那么就将该项数据添加到 searchData中
          if (regx.test(item[attr] + '')) searchData.add(item)
        }
      })
      if (searchData.size !== 0) {
        setRenderData([...searchData])
        if (renderData.length !== 0) {
          message.success('筛选成功')
        }
      } else {
        setRenderData(resource_data)
        message.warning('资源不存在')
      }
    }

    searchData.clear()
    setIsSearch(false)

    // console.log('searchData,searchData: ', searchData)
  }

  const contentCom =
    renderData.length !== 0 ? (
      renderData.map((item) => (
        <Card
          key={item._id}
          hoverable
        >
          <div className="res-content-header">
            <Row justify="start">
              <Col span={2}>
                {item && item.author.avatarUrl ? (
                  <Avatar src={item.author.avatarUrl} />
                ) : (
                  <Avatar>U</Avatar>
                )}
              </Col>
              <Col span={12} style={{ textAlign: 'left', marginLeft: 24 }}>
                <span className="share-detail">
                  <span className="share-username">
                    {item && item.author.nickName.substr(0, 20)}
                  </span>
                  <span>
                    <CalendarOutlined /> &nbsp;
                    {item && formatDate(item.publishDate)}
                  </span>
                </span>
              </Col>
              <Col span={6}>
                <Button className="share-get">
                  <a href={item && item.href}>点击获取</a>
                </Button>
              </Col>
            </Row>
          </div>
          <div className="res-article">
            <h3>{item && item.title}</h3>
            <p className="res-content">
              {item &&
                item.content.replace(/<[^>]+>/g, '').substr(0, 86) + '...'}
            </p>
          </div>
        </Card>
      ))
    ) : (
      <div>现在还没有数据</div>
    )

  return (
    <div className="resource-right">
      <div className="resource-header">
        <h3>{rTitle}</h3>
        <Search
          placeholder="请输入搜索关键字"
          loading={isSearch}
          onSearch={(value) => handleSearch(value)}
          style={{ width: 300 }}
        />
      </div>
      <div className="resource-content-wrap">
        <Skeleton loading={contentLoading} active>
          {contentCom}
        </Skeleton>
      </div>
    </div>
  )
}

export default RightContent
