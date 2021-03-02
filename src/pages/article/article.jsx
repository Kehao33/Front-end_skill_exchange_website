import React, { useEffect, useState, createRef } from 'react'
import { useParams } from 'react-router-dom'
import {
  Input,
  Button,
  Form,
  List,
  Avatar,
  message,
  Divider,
  Modal,
  Skeleton,
  Tag,
} from 'antd'
import { connect } from 'react-redux'
import {
  MessageOutlined,
  LikeOutlined,
  EyeOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import './article.less'
import {
  reqArtById,
  reqCommentArt,
  reqHitLike,
} from './../../requestAPI/operHttp.js'
import { formatDate } from './../../tools.js'
import Footer from './../../components/footer/footer'
import {tagColor} from './../../options/options'
const { confirm } = Modal
const Article = (props) => {
  // cntData: 文章对应的评论数据
  const formRef = createRef()
  const [cntData, setCntData] = useState([])
  const [showLike, setShowLike] = useState(false)
  const [artLoading, setArtLoading] = useState(true)
  const { userObj } = props
  const [artData, setArtData] = useState(null)
  const { id } = useParams()
  useEffect(() => {
    getArtData(id)
  }, [id])

  const layout = {
    labelCol: { span: 1 },
    wrapperCol: { span: 23 },
  }

  // 实现文章评论功能
  async function onFinish(formData) {
    if (userObj) {
      const { data } = await reqCommentArt('/user/commentArt', formData, 'POST')
      data.isOk && message.success(data.msg)
      !data.isOk && message.warning(data.msg)
      getArtData(id)
      formRef.current.resetFields()
    } else {
      confrimFun('评论')
    }
  }
  function confrimFun(operInfo) {
    confirm({
      icon: <ExclamationCircleOutlined />,
      title: '友情提示',
      okText: '去登录',
      cancelText: '放弃登录',
      content: <p>{`${operInfo}需要登录权限，请选择是否登录`}</p>,
      onOk() {
        props.history.push('/login')
      },
    })
  }
  // 获取文章的信息
  async function getArtData(aid) {
    const { data } = await reqArtById({ id: aid })
    setArtLoading(false)
    setArtData(data.showArt)
    setCntData(data.comments)
    // console.log('data.comments',data.comments)
    data.likeStatus && setShowLike(true)
  }

  function createContent(artData) {
    if (artData) return { __html: artData.content }
  }

  async function hitLike() {
    if (userObj) {
      const { data } = await reqHitLike({
        articleId: id,
        authorId: userObj && userObj._id,
      })

      if (data.data.isLike) {
        setShowLike(true)
        setArtData(data.data.showArt)
        setCntData(data.data.comments)
      } else {
        setShowLike(false)
        setArtData(data.data.showArt)
      }
    } else {
      confrimFun('点赞')
    }
  }
  const likeCss = showLike ? { color: '#f00' } : {}
  return (
    <article>
      <div className="article">
        <Skeleton
          loading={artLoading}
          paragraph={{ rows: 13, width: 500 }}
          active
        >
          <div className="container">
            <div className="article-header">
              <h2 className="article-title">{artData && artData.title}</h2>
              <div className="article-info">
                <div className="article-fl">
                  <a
                    className="author"
                    href={`/user/${
                      artData && artData.author && artData.author._id
                    }`}
                    onClick={(e) => {
                      e.preventDefault()
                      if (!userObj) {
                        confrimFun('查看用户信息')
                        return
                      } else {
                        props.history.push(
                          `/user/${
                            artData && artData.author && artData.author._id
                          }`
                        )
                      }
                    }}
                  >
                    {artData && artData.author.nickName}
                  </a>
                  <span> | {artData && formatDate(artData.publishDate)}</span>
                  <span> |  {artData&&artData.artTags.split(',').map(item => <Tag key={item}>{item}</Tag>)}</span>
                </div>
                {/* 展示文章的阅读数，点赞，评论数量 */}

                <div className="article-fr">
                  <span className="mr">
                    <EyeOutlined />
                    &nbsp;
                    {artData && artData.readNumber}
                  </span>
                  <span className="mr" onClick={hitLike}>
                    <LikeOutlined style={likeCss} />
                    &nbsp;
                    {artData && artData.likeNumber}
                  </span>
                  <span className="mr">
                    <MessageOutlined />
                    &nbsp;
                    {artData && artData.commentNumber}
                  </span>
                </div>
              </div>
              <Divider />
            </div>
            <div
              className="article-content"
              dangerouslySetInnerHTML={createContent(artData)}
            ></div>
            <div className="article-comment">
              <div className="comment-form">
                <Form
                  {...layout}
                  name="comment-form"
                  onFinish={onFinish}
                  ref={formRef}
                  initialValues={{
                    content: '',
                    articleId: id && id,
                    authorId: userObj && userObj._id,
                  }}
                >
                  <Form.Item name="content" className="cmt-box" label="评论">
                    <Input.TextArea
                      placeholder="评论内容.."
                      allowClear
                      autoSize={{ minRows: 4, maxRows: 4 }}
                      style={{ resize: 'none' }}
                    />
                  </Form.Item>
                  <Form.Item name="articleId" style={{ display: 'none' }}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item name="authorId" style={{ display: 'none' }}>
                    <Input type="hidden" />
                  </Form.Item>
                  <Form.Item>
                    <Button
                      type="primary"
                      className="cmt-btn"
                      danger
                      htmlType="submit"
                    >
                      发表评论
                    </Button>
                  </Form.Item>
                </Form>
              </div>
              <Divider orientation="left">评论数据</Divider>
              <div className="comment-list">
                <List
                  itemLayout="horizontal"
                  dataSource={cntData && cntData}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <a
                            href={`/user/${
                              item && item.authorId && item.authorId._id
                            }`}
                          >
                            {item &&
                            item.authorId &&
                            item.authorId.avatarUrl ? (
                              <Avatar src={item.authorId.avatarUrl} />
                            ) : (
                              <Avatar>U</Avatar>
                            )}
                          </a>
                        }
                        title={
                          <a
                            href={`/user/${
                              item && item.authorId && item.authorId._id
                            }`}
                          >
                            {item && item.authorId.nickName}
                          </a>
                        }
                        description={item && item.content}
                      />
                    </List.Item>
                  )}
                />
              </div>
            </div>
          </div>
          <Footer />
        </Skeleton>
      </div>
    </article>
  )
}

export default connect((state) => state.user, {})(Article)
