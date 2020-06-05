import React, { useState, useEffect } from 'react'
import { Input, Skeleton, Button, List, message, Avatar } from 'antd'
import { MessageOutlined, LikeOutlined, EyeOutlined } from '@ant-design/icons'
import './algoRightCon.less'
import { reqAlgorithm } from './../../requestAPI/operHttp.js'

let skipcount = 0 //每次跳过的数据条数，初始值为0
let reqcount = 4 //每次请求4条数据
const { Search } = Input

function AlgoRightCon(props) {
  const IconText = ({ icon, text }) => (
    <span>
      {React.createElement(icon, { style: { marginRight: 3 } })}
      {text}
    </span>
  )
  const { rTitle } = props
  const [isSearch, setIsSearch] = useState(false)
  const [initListLoading, setInitListLoading] = useState(true)
  const [contentLoading, setContentLoading] = useState(true)
  const searchData = new Set()
  const [renderData, setRenderData] = useState([])
  const [list, setList] = useState([])
  // skeData的数据是用来动态显示Skeleton骨架的作用
  const [skeData, setSkeData] = useState([])

  // 获取数据的方法
  const getData = async (callback) => {
    const { data } = await reqAlgorithm(`/user/algorithm-article`, {
      skipcount,
      reqcount,
    })
    callback(data)
  }

  const onLoadMore = () => {
    setContentLoading(true)
    setList(
      skeData.concat(
        [...new Array(reqcount)].map(() => ({
          contentLoading: true,
          author: { name: '' },
        }))
      )
    )
    getData((res) => {
      if (res.isOk) {
        setSkeData(skeData.concat(res.data))
        setList(skeData)
        setContentLoading(false)
        window.dispatchEvent(new Event('resize'))
      } else {
        message.warning(res.msg)
      }
    })
  }

  useEffect(() => {
    if (renderData.length !== 0) {
      setRenderData(list)
      setInitListLoading(false)
    }
  }, [list, renderData, rTitle])

  const loadMore =
    !initListLoading && !contentLoading ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
        }}
      >
        <Button
          size="large"
          onClick={onLoadMore}
          style={{ borderRadius: 24, marginTop: 20, marginBottom: 24 }}
        >
          加载更多
        </Button>
      </div>
    ) : null

  function handleSearch(value) {
    setIsSearch(true)
    if (value.trim().length === 0) {
      setRenderData(renderData)
      message.warning('搜索数据不能为空')
    } else {
      let regx = new RegExp(value, 'gi')
      renderData.forEach((item) => {
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
        setRenderData(renderData)
        message.warning('资源不存在')
      }
    }

    searchData.clear()
    setIsSearch(false)
  }

  getData((res) => {
    setSkeData(res.data)
    setList(res.data) //list 列表渲染的数据
    setContentLoading(false)
    setRenderData(list) // 将获取的list值保存在渲染数据中
  })

  return (
    <div className="algo-right">
      <div className="algo-header">
        <h3>{rTitle}</h3>
        <Search
          placeholder="请输入搜索关键字"
          loading={isSearch}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
      </div>
      <div className="algo-content-wrap">
        <List
          itemLayout="vertical"
          loading={initListLoading}
          loadMore={loadMore}
          dataSource={renderData}
          renderItem={(item) => (
            <Skeleton loading={item && item.contentLoading} active>
              <List.Item
                actions={[
                  <a
                    href={`/user/${item._id && item.author._id}`}
                    className="u-center"
                  >
                    <Avatar src="/img/a3.jpg" />
                    &nbsp;&nbsp;{item._id && item.author.nickName}
                  </a>,
                  <IconText
                    icon={EyeOutlined}
                    text={item._id && item.readNumber}
                    key="list-star"
                  />,
                  <IconText
                    icon={LikeOutlined}
                    text={item._id && item.likeNumber}
                    key="list-like"
                  />,
                  <IconText
                    icon={MessageOutlined}
                    text={item._id && item.commentNumber}
                    key="list-message"
                  />,
                ]}
              >
                <List.Item.Meta
                  title={
                    <a
                      className="article-title"
                      href={`#/article/${item && item._id}`}
                    >
                      {item._id && item.title}
                    </a>
                  }
                />
                <a className="article-content" href={`#/article/${item._id}`}>
                  {item._id &&
                    item.content.replace(/<[^>]+>/g, '').substr(0, 88) + '...'}
                </a>
              </List.Item>
            </Skeleton>
          )}
        />
      </div>
    </div>
  )
}

export default AlgoRightCon
