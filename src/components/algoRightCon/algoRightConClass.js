import React, { Component } from 'react'
import { Input, Skeleton, Button, List, message, Avatar } from 'antd'
import { MessageOutlined, LikeOutlined, EyeOutlined } from '@ant-design/icons'
import './algoRightCon.less'
import { reqAlgorithm } from './../../requestAPI/operHttp.js'

const { Search } = Input

const searchData = new Set()
class AlgoRightCon extends Component {
  constructor(props) {
    super(props)
    this.skipcount = 0 //每次跳过的数据条数，初始值为0
    this.reqcount = 4 //每次请求4条数据
    this.onLoadMore = this.onLoadMore.bind(this)
    this.handleSearch = this.handleSearch.bind(this)
    // 文章的请求类型，根据父组件传递过来的 rTitle 来确定
    this.reqObj = {
      allData: '全部资源',
      structData: '数据结构',
      algoData: '算法文章',
      otherData: '其他资源',
    }
    this.state = {
      initListLoading: true,
      contentLoading: false,
      isSearch: false, // 搜索框是否显示搜索图表
      renderData: [], // 最终渲染的数据，用来保存list和搜索到的所有数据
      listData: [], // 将所有的加载数据保存
      showBtn: true,
    }
  }

  componentDidMount() {
    this.getData((res) => {
      this.setState({
        initListLoading: false,
        listData: res.data,
        renderData: res.data,
      })
    })
  }

  // 获取数据的方法
  getData = async (callback) => {
    const { data } = await reqAlgorithm({
      reqtype: this.props.rTitle,
      skipcount: this.skipcount,
      reqcount: this.reqcount,
    })
    if (data.data.length === 0) {
      message.warning('已加载完所有数据')
      this.setState({
        contentLoading: false,
        initListLoading: false,
        showBtn: false,
      })
      return 0
    } else {
      this.skipcount += 4 //每次比上次多跳过4条数据查询数据
      callback(data)
    }
  }

  onLoadMore() {
    this.setState({
      contentLoading: true,
    })

    this.getData((res) => {
      if (res.isOk) {
        this.setState({
          listData: this.state.listData.concat(res.data),
          renderData: this.state.listData.concat(res.data),
          contentLoading: false,
        })
      }
    })
  }

  handleSearch(value) {
    this.setState({ isSearch: true })
    if (value.trim().length === 0) {
      this.setState({ renderData: this.state.listData })
      message.warning('搜索数据不能为空')
    } else {
      let regx = new RegExp(value, 'gi')
      this.state.renderData.forEach((item) => {
        for (let attr in item) {
          // 如果搜索框的所有内容在请求的数据中，那么就将该项数据添加到 searchData中
          if (regx.test(item[attr] + '')) searchData.add(item)
        }
      })
      if (searchData.size !== 0) {
        this.setState({ renderData: [...searchData] })
        if (this.state.renderData.length !== 0) {
          message.success('筛选成功')
        }
      } else {
        this.setState({ renderData: this.state.listData })
        message.warning('资源不存在')
      }
    }

    searchData.clear()
    this.setState({ isSearch: false })
  }

  render() {
    const {
      showBtn,
      initListLoading,
      renderData,
      isSearch,
      contentLoading,
    } = this.state
    const { rTitle } = this.props
    const IconText = ({ icon, text }) => (
      <span>
        {React.createElement(icon, { style: { marginRight: 3 } })}
        {text}
      </span>
    )
    const loadMore = showBtn ? (
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
          loading={contentLoading}
          onClick={this.onLoadMore}
          style={{ borderRadius: 24, marginTop: 20, marginBottom: 24 }}
        >
          加载更多
        </Button>
      </div>
    ) : null

    return (
      <div className="algo-right">
        <div className="algo-header">
          <h2>{this.reqObj[rTitle]}</h2>
          <Search
            placeholder="请输入搜索关键字"
            loading={isSearch}
            onSearch={this.handleSearch}
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
                      href={`#/user/${item._id && item.author._id}`}
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
                      item.content.replace(/<[^>]+>/g, '').substr(0, 88) +
                        '...'}
                  </a>
                </List.Item>
              </Skeleton>
            )}
          />
        </div>
      </div>
    )
  }
}

export default AlgoRightCon
