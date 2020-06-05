import React, { useEffect, useState, createRef } from 'react'
import { useParams } from 'react-router-dom'
import { Input, Button, Form, List, Avatar, message } from 'antd'
import { connect } from 'react-redux'
import './article.less'
import { reqArtById, reqCommentArt } from './../../requestAPI/operHttp.js'
import { formatDate } from './../../tools.js'
import Footer from './../../components/footer/footer'

const Article = (props) => {
  // cntData: 文章对应的评论数据
  const formRef = createRef()
  const [cntData, setCntData] = useState([])
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
    const { data } = await reqCommentArt('/user/commentArt', formData, 'POST')
    data.isOk && message.success(data.msg)
    !data.isOk && message.warning(data.msg)
    getArtData(id)
    formRef.current.resetFields()
  }

  // 获取文章的信息
  async function getArtData(aid) {
    const { data } = await reqArtById({ id: aid })
    setArtData(data.showArt)
    setCntData(data.comments)
  }

  function createContent(artData) {
    if (artData) return { __html: artData.content }
  }

  return (
    <div className="article">
      <div className="container">
        <div className="article-header">
          <h2 className="article-title">{artData && artData.title}</h2>
          <div className="article-info">
            <a
              className="author"
              href={`#/user/${artData && artData.author._id}`}
            >
              {artData && artData.author.nickName}
            </a>
            <span> | {artData && formatDate(artData.publishDate)}</span>
          </div>
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
              <Form.Item name="content" label="评论">
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

          <div className="comment-list">
            <List
              itemLayout="horizontal"
              dataSource={cntData && cntData}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <a href={`#/user/${item && item.authorId._id}`}>
                        <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
                      </a>
                    }
                    title={
                      <a href={`#/user/${item && item.authorId._id}`}>
                        {item && item.authorId.nickName}
                      </a>
                    }
                    description={item && item.content}
                    // description="{item && item.content}"
                  />
                </List.Item>
              )}
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default connect((state) => state.user, {})(Article)
