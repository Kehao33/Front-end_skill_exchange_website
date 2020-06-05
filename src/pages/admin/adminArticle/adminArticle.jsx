import React, { useState, createRef, useEffect } from 'react'
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Input,
  Select,
  Cascader,
} from 'antd'
import { NavLink } from 'react-router-dom'
import { FormOutlined, DeleteOutlined } from '@ant-design/icons'
import Editor from 'for-editor'
import { optionsChilren, artClass_OPTIONS } from './../../../options/options.js'

import '../adminTable.less'
import {
  reqAllArt,
  reqDeleteArt,
  reqModifyArt,
} from './../../../requestAPI/operHttp.js'
import { formatDate } from './../../../tools.js'

function Adminarticle(props) {
  const [form] = Form.useForm()
  let $vm = createRef()
  const [visible, setVisible] = useState(false)
  const [value, setValue] = useState('')
  const [dataSource, setDataSource] = useState([])
  const columns = [
    {
      title: '文章ID',
      dataIndex: '_id',
      align: 'center',
    },
    {
      title: '标题',
      dataIndex: 'title',
      align: 'center',
    },
    {
      title: '作者',
      dataIndex: 'authorName',
      align: 'center',
    },
    {
      title: '发布时间',
      dataIndex: 'publishDate',
      align: 'center',
    },
    {
      title: '文章操作',
      dataIndex: 'operation',
      render: (text, record) =>
        dataSource.length >= 1 ? (
          <div className="operation-wrap">
            <span onClick={() => editArticle(record)}>
              <FormOutlined style={{ color: '#58a', fontSize: 16 }} />
            </span>
            <Popconfirm
              cancelText="取消"
              okText="确定"
              title="确定永久删除吗?"
              onConfirm={() => handleDelete(record._id)}
            >
              <DeleteOutlined style={{ color: '#f00', fontSize: 16 }} />
            </Popconfirm>
          </div>
        ) : null,
      align: 'center',
    },
  ]

  function addImg($file) {
    $vm.current.$img2Url($file.name, 'file_url')
    console.log('$file: ', $file)
  }

  // 展示对话框
  function showModal() {
    setVisible(true)
  }
  // 处理for-editor富文本改变数据的函数
  function handleEditorChange(value) {
    setValue(value)
  }

  // 点击修改文章
  function handleOk() {
    form.submit()
    setVisible(false)
  }
  // 取消编辑
  function handleCancel() {
    setVisible(false)
  }

  // 删除列表项
  async function handleDelete(deleteId) {
    const { data } = await reqDeleteArt({ id: deleteId }, 'POST')
    data.isOk && message.success(data.msg)
    !data.isOk && message.error(data.msg)
    getData()
  }

  function editArticle(record) {
    form.setFieldsValue({
      artId: record._id,
      title: record.title,
      content: record.content,
      nickName: record.author.nickName,
      publishDate: record.publishDate,
      artType: record.artType.split(','),
      artTags: record.artTags.split(','),
    })
    showModal()
  }

  //表单提交的时候触发，values为表单里的值对应的对象
  async function onFinish(formData) {
    // 修改文章的信息
    const { data } = await reqModifyArt(formData, 'POST')
    if (!data.isOk) message.error(data.msg)
    else {
      message.success(data.msg)
      getData()
    }
  }

  async function getData() {
    const { data } = await reqAllArt()
    if (data.isOk) {
      data.data.forEach((item) => {
        item['key'] = item._id
        item['authorName'] =
          item.author.nickName + ' : ' + item.author.userEmail
        item['publishDate'] = formatDate(item.publishDate)
      })
      setDataSource(data.data)
    } else {
      message.error(data.msg)
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const formLayout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 22,
    },
  }

  return (
    <div>
      <Button
        // onClick={handleAdd}
        type="primary"
        style={{
          marginBottom: 16,
        }}
      >
        <NavLink to="/user/write">新增文章</NavLink>
      </Button>
      <Table
        rowClassName={() => 'editable-row'}
        bordered
        dataSource={dataSource}
        columns={columns}
      />
      <Modal
        visible={visible}
        title="文章信息"
        cancelText="取消"
        okText="确定"
        style={{ top: 1 }}
        width="100%"
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
          {...formLayout}
          layout="horizontal"
          form={form}
          onFinish={onFinish}
          scrollToFirstError={true}
          size="middle"
        >
          <Form.Item
            name="artId"
            label="文章ID"
            rules={[
              {
                required: true,
                message: '文章标题不可缺少',
              },
            ]}
          >
            <Input disabled />
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
            <Input disabled />
          </Form.Item>
          <Form.Item
            name="nickName"
            label="文章作者"
            rules={[
              {
                required: true,
                message: '文章标题不可缺少',
              },
            ]}
          >
            <Input disabled />
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
              addImg={($file) => addImg($file)}
              ref={$vm}
              value={value}
              onChange={() => handleEditorChange()}
              placeholder="请在此处创作您的文章"
              width="100%"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default Adminarticle
