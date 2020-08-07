import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import {
  List,
  Avatar,
  Carousel,
  Skeleton,
  Divider,
  message,
  Button,
} from 'antd'
import { MessageOutlined, LikeOutlined, EyeOutlined } from '@ant-design/icons'
import './dynamic.less'

import Footer from './../../components/footer/footer.jsx'
import {
  reqDynamic,
  reqHotArt,
  reqCarArt,
} from './../../requestAPI/operHttp.js'
// 请求文章的跳过的条数
// let count = 0
// 动态标签展示数据
let setArr = new Set()
class Dynamic extends Component {
  constructor(props) {
    super(props)
    // 热门文章的数据
    this.hotArtData = []
    this.count = 0
    this.getCarouselData = this.getCarouselData.bind(this)
    this.getHotData = this.getHotData.bind(this)

    this.state = {
      showBtn: true,
      loading: true,
      initLoading: true,
      list: [],
      hotArtData: [],
      carArtData: [],
    }
  }

  // 得到轮播图的文章信息
  async getCarouselData() {
    let carNumber = 4
    this.setState({ loading: true })
    var { data } = await reqCarArt({ carcount: carNumber })
    this.setState({ carArtData: data.data })
    this.setState({ loading: false })
  }
  async getHotData() {
    let hotNumber = 4
    // 请求热门文章
    const { data } = await reqHotArt({ hotcount: hotNumber })
    this.setState({ hotArtData: data.data })
  }
  componentDidMount() {
    this.getHotData()
    this.getCarouselData()
    this.getLeftData((res) => {
      this.setState({
        initLoading: false,
        list: res.data,
        contentLoading: false,
      })
    })
  }

  getLeftData = async (callback) => {
    const { data } = await reqDynamic({ count: this.count })
    // 获取跑马灯下的文章列表
    if (data.data.length === 0) {
      message.warning('已加载完所有数据')
      this.setState({
        contentLoading: false,
        initListLoading: false,
        showBtn: false,
      })
      return 0
    } else {
      this.setState({ shwoBtn: true })
      callback(data)
    }
    this.count += 4
    callback(data)
  }

  onLoadMore = () => {
    this.setState({
      contentLoading: true,
    })
    this.getLeftData((res) => {
      this.setState(
        {
          list: this.state.list.concat(res.data),
          contentLoading: false,
        },
        () => {
          window.dispatchEvent(new Event('resize'))
        }
      )
    })
  }

  render() {
    const {
      initLoading,
      contentLoading,
      showBtn,
      carArtData,
      list,
      hotArtData,
    } = this.state
    // 将动态标签去重后添加到页面上
    list.forEach((item) => {
      item.artTags && setArr.add(...item.artTags.split(','))
    })

    // 加载更多
    const loadMore = showBtn ? (
      <div
        style={{
          textAlign: 'center',
          marginTop: 12,
          height: 32,
          lineHeight: '32px',
          cursor: 'pointer',
        }}
      >
        <Button
          className="loading-more-button"
          size="large"
          loading={contentLoading}
          style={{ borderRadius: 24, marginTop: 20, marginBottom: 24 }}
          onClick={this.onLoadMore}
        >
          加载更多
        </Button>
      </div>
    ) : null

    const IconText = ({ icon, text }) => (
      <span>
        {React.createElement(icon, { style: { marginRight: 3 } })}
        {text}
      </span>
    )

    console.log('list', list)
    return (
      <div className="dynamic-wrap">
        <div className="dynamic">
          <div className="dynamic-left">
            <Skeleton loading={this.state.loading} active>
              <div className="dynamic-carousel">
                <Carousel effect="fade" autoplay={true} easing>
                  {carArtData.map((item, index) => (
                    <div className={`carousel-div${index + 1}`} key={item._id}>
                      <Link to={`/article/${item && item._id}`}>
                        {item && item.title}
                      </Link>
                    </div>
                  ))}
                </Carousel>
              </div>
            </Skeleton>
            <div className="dynamic-article-list-wrap">
              <List
                itemLayout="vertical"
                loading={initLoading}
                loadMore={loadMore}
                dataSource={list}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      <Link
                        to={`/user/${item.author._id}`}
                        className="u-center"
                      >
                        <Avatar src={item && item.author.avatarUrl} />
                        &nbsp;&nbsp;{item && item.author.nickName}
                      </Link>,
                      <IconText
                        icon={EyeOutlined}
                        text={item && item.readNumber}
                        key="list-vertical-star-o"
                      />,
                      <IconText
                        icon={LikeOutlined}
                        text={item && item.likeNumber}
                        key="list-vertical-like-o"
                      />,
                      <IconText
                        icon={MessageOutlined}
                        text={item && item.commentNumber}
                        key="list-vertical-message"
                      />,
                    ]}
                  >
                    <Skeleton
                      title={false}
                      loading={item && item.loading}
                      active
                    >
                      <List.Item.Meta
                        title={
                          <a
                            className="article-title"
                            href={`/article/${item._id}`}
                            rel="noopener noreferrer"
                            target="_blank"
                          >
                            {item && item.title}
                          </a>
                        }
                      />
                      <a
                        className="article-content"
                        href={`/article/${item._id}`}
                        target='_blank'
                        rel="noopener noreferrer"
                      >
                        {item &&
                          item.content.replace(/<[^>]+>/g, '').substr(0, 150) +
                            '...'}
                      </a>
                    </Skeleton>
                  </List.Item>
                )}
              />
            </div>
          </div>

          <div className="dynamic-right">
            <div className="label">
              <Divider orientation="left">动态标签</Divider>
              <Button ghost  style={{ margin: 5 }}>
                推荐
              </Button>
              {/* 在此遍历生成标签 */}
              {[...setArr].map((v) => (
                <Button key={v} style={{ margin: 5 }}>
                  {v}
                </Button>
              ))}
            </div>
            <div className="hot-article-wrap">
              <Divider orientation="left">热门文章</Divider>
              <div className="hot-article">
                <div className="hot-article-bottom">
                  <List
                    itemLayout="vertical"
                    size="large"
                    dataSource={hotArtData}
                    renderItem={(item) => (
                      <List.Item
                        key={item.title}
                        actions={[
                          <Link
                            to={`/user/${item.author._id}`}
                            className="u-center"
                          >
                            <Avatar src={item && item.author.avatarUrl} />
                            &nbsp;&nbsp;{item.author.nickName}
                          </Link>,
                          <IconText
                            icon={EyeOutlined}
                            text={item.readNumber}
                            key="list-vertical-star-o"
                          />,
                        ]}
                      >
                        <List.Item.Meta
                          title={
                            <Link
                              className="article-title"
                              to={`/article/${item && item._id}`}
                            >
                              {item.title}
                            </Link>
                          }
                        />
                        <Link
                          to={`/article/${item && item._id}`}
                          className="article-content"
                        >
                          {item.content.replace(/<[^>]+>/g, '').substr(0, 52) +
                            '...'}
                        </Link>
                      </List.Item>
                    )}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

export default Dynamic
