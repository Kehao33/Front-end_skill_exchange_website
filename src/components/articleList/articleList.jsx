import React, { useState, useEffect, createRef } from 'react'
import {
  Tag,
  Input,
  Cascader,
  Select,
  message,
  Popconfirm,
  Modal,
  Form,
  Skeleton,
} from 'antd'
import { connect } from 'react-redux'
import TurndownService from 'turndown'
import Editor from 'for-editor'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
import './articleList.less'
import { formatDate } from './../../tools.js'
import { optionsChilren, artClass_OPTIONS } from './../../options/options.js'
const { Search } = Input

function ArticleList(props) {
  let editorRef = createRef()
  const { listData, renderUser, userObj, modifyArt, deleteArt } = props
  const tagColor = ['#f50', '#2db7f5', '#87d068', '#108ee9']
  const [renderData, setRenderData] = useState(listData)
  const [editorValue, setEditorValue] = useState('')
  const [isSearch, setIsSearch] = useState(false)
  const [canOpera, setCanOpera] = useState(false)
  const [contentLoading, setContentLoading] = useState(true)
  const [modalVisible, setModalVisible] = useState(false)
  const searchData = new Set()
  const [form] = Form.useForm()
  const turndownService = new TurndownService()

  const formLayout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 22,
    },
  }

  useEffect(() => {
    if (listData) {
      setRenderData(listData)
      setContentLoading(false)
    }
    if ((renderUser && renderUser._id) === (userObj && userObj._id))
      setCanOpera(true)
  }, [listData, renderUser, userObj])

  function handleSearch(value) {
    setIsSearch(true)
    if (value.trim().length === 0) {
      setRenderData(listData)
      message.warning('搜索数据不能为空')
    } else {
      let regx = new RegExp(value, 'gi')
      listData.forEach((item) => {
        // 如果搜索框的所有内容在请求的数据中，那么就将该项数据添加到 searchData中
        if (regx.test(item['title'] + '')) searchData.add(item)
      })
      if (searchData.size !== 0) {
        setRenderData([...searchData])
        if (renderData.length !== 0) {
          message.success('筛选成功')
        }
      } else {
        setRenderData(listData)
        message.warning('资源不存在')
      }
    }

    searchData.clear()
    setIsSearch(false)
  }

  function showModal() {
    setModalVisible(true)
  }

  // 当富文本的值改变的时候触发这个函数
  function handleEditorChange(value) {
    setEditorValue(value)
  }

  // 将子组件要删除文章的操作交给父组件
  function handleDelete(deleteId) {
    deleteArt(deleteId)
  }

  // 将子组件要修改文章的操作交给父组件
  function onFinish(formData) {
    modifyArt(formData)
  }
  function handleOk() {
    setModalVisible(false)
    form.submit()
  }
  function handleCancel() {
    setModalVisible(false)
  }

  return (
    <>
      <div className="content-header article-content-item">
        <span style={{ fontWeight: 500, fontSize: 16 }}>文章列表</span>
        <Search
          placeholder="输入查找内容"
          onSearch={(value) => handleSearch(value)}
          style={{ width: 200 }}
          loading={isSearch}
        />
      </div>
      <div className="article-content-item">
        <span className="content-item-title">文章名称</span>
        <span className="content-item-class">包含标签</span>
        <span className="content-item-date">发布时间</span>
        {canOpera ? <span className="content-item-opera">文章操作</span> : null}
      </div>
      <Skeleton loading={contentLoading} active>
        {renderData.length ? (
          renderData.map((item) => (
            <div className="article-content-item" key={item && item._id}>
              <span className="content-item-title">
                <a href={`#/article/${item && item._id}`}>
                  {item && item.title}
                </a>
              </span>
              <span className="content-item-class">
                {item &&
                  item.artTags.split(',').map((item, index) => (
                    <Tag
                      color={tagColor[Math.floor(Math.random() * 10) % 4]}
                      key={index}
                      style={{ margin: 4 }}
                    >
                      {item}
                    </Tag>
                  ))}
              </span>
              <span className="content-item-date">
                {item && formatDate(item.publishDate)}
              </span>
              {/* 遇到的问题： 点击按钮，但是现实的内容不一致 */}

              {canOpera ? (
                <span className="content-item-opera">
                  <div className="operation-wrap">
                    {/* <a href="/edit">编辑</a> */}
                    <span
                      onClick={() => {
                        form.setFieldsValue({
                          artId: item && item._id,
                          title: item && item.title,
                          publishDate: item && formatDate(item.publishDate),
                          artType: item && item.artType.split(','),
                          artTags: item && item.artTags.split(','),
                          content:
                            item && turndownService.turndown(item.content),
                        })
                        showModal()
                      }}
                    >
                      <FormOutlined style={{ color: '#58a', fontSize: 16 }} />
                    </span>
                    <Popconfirm
                      title="确定永久删除吗?"
                      cancelText="取消"
                      okText="确定"
                      onConfirm={() => handleDelete(item && item._id)}
                    >
                      <DeleteOutlined style={{ color: '#f00', fontSize: 16 }} />
                    </Popconfirm>
                  </div>
                </span>
              ) : null}
            </div>
          ))
        ) : (
          <div
            className="article-content-item"
            style={{ paddingLeft: '48%', color: '#f33' }}
          >
            暂时还没有数据哦
          </div>
        )}
      </Skeleton>

      <Modal
        visible={modalVisible}
        title="文章信息"
        cancelText="取消"
        okText="确定修改"
        style={{ top: 1, right: -40 }}
        width="88%"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          {...formLayout}
          layout="horizontal"
          onFinish={onFinish}
          form={form}
          scrollToFirstError={true}
          size="middle"
        >
          <Form.Item
            name="artId"
            style={{ display: 'none' }}
            label="文章ID"
            rules={[
              {
                required: true,
                message: '文章标题不可缺少',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="publishDate"
            label="发布时间"
            rules={[
              {
                required: true,
                message: '发布时间不能改变',
              },
            ]}
          >
            <Input disabled={true} />
          </Form.Item>
          <Form.Item
            name="title"
            label="文章标题"
            rules={[
              {
                required: true,
                message: '文章标题不可缺少',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="修改类别"
            name="artType"
            rules={[
              {
                required: true,
                message: '请选择文章类别',
                type: 'array',
              },
            ]}
          >
            <Cascader
              options={artClass_OPTIONS}
              placeholder="修改文章类别"
              expandTrigger="hover"
            />
          </Form.Item>
          <Form.Item
            label="修改标签"
            name="artTags"
            rules={[
              {
                required: true,
                max: 3,
                message: '修改不能为空,且最多选择3个标签',
                type: 'array',
              },
            ]}
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              tokenSeparators={[',']}
              allowClear
              showArrow={true}
              placeholder="请填写或者选择文章标签"
            >
              {optionsChilren}
            </Select>
          </Form.Item>
          <Form.Item
            label="文章内容"
            name="content"
            rules={[
              {
                required: true,
                message: '文章标题不可缺少',
              },
            ]}
          >
            <Editor
              height={460}
              // addImg={($file) => addImg($file)}
              ref={editorRef}
              value={editorValue}
              onChange={() => handleEditorChange()}
              placeholder="请在此处创作您的文章"
              width="100%"
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  )
}

export default connect((state) => state.user, {})(ArticleList)
