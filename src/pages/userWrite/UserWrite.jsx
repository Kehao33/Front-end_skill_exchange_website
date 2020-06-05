import React, { Component, createRef } from 'react'
import Editor from 'for-editor'
import { connect } from 'react-redux'
import './UserWrite.less'
import {
  Form,
  Input,
  Button,
  Divider,
  Select,
  message,
  Cascader,
  Modal,
} from 'antd'
import { CheckOutlined } from '@ant-design/icons'
import { reqAddArt } from './../../requestAPI/operHttp.js'
import { optionsChilren, artClass_OPTIONS } from './../../options/options.js'
const { confirm } = Modal

class UserWrite extends Component {
  constructor() {
    super()
    this.$vm = createRef()
    this.formRef = createRef()
    this.handleEditorChange = this.handleEditorChange.bind(this)
    this.state = {
      value: '',
      selectedItems: [],
    }
  }

  addImg($file) {
    this.$vm.current.$img2Url($file.name, 'file_url')
    console.log('$file: ', $file)
  }

  // 处理for-editor富文本改变数据的函数
  handleEditorChange(value) {
    this.setState({
      value: value,
    })
  }

  // 表单文章提交
  onFinish = async (formData) => {
    const self = this
    console.log('formDataa: ', formData)
    const { data } = await reqAddArt(formData)
    if (data.isOk) {
      confirm({
        title: '发布文章成功',
        cancelText: '继续写作',
        okText: '管理文章',
        icon: <CheckOutlined />,
        content: '请选择您的下一步操作?',
        onOk() {
          self.props.history.push(`/user/${self.props.userObj._id}`)
        },
        onCancel() {
          self.props.history.push('/user/write')
          self.formRef.current.resetFields()
        },
      })
    } else message.error(data.msg)
  }

  render() {
    const formLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    }
    const { userObj } = this.props

    return (
      <>
        {/* <Header /> */}
        <div className="user-write">
          <Divider orientation="left" style={{ fontSize: 23, fontWeight: 700 }}>
            文章创作
          </Divider>
          <Form
            onFinish={this.onFinish}
            {...formLayout}
            ref={this.formRef}
            size="large"
            initialValues={{ title: '', author: userObj && userObj._id }}
          >
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: '文章标题不可缺少',
                },
              ]}
            >
              <Input size="large" placeholder="请输入标题" width="100%" />
            </Form.Item>
            <Form.Item
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
                placeholder="请选择文章类别"
                expandTrigger="hover"
                size="large"
              />
            </Form.Item>
            <Form.Item
              name="artTags"
              rules={[
                {
                  required: true,
                  max: 3,
                  message: '选择不能为空,且只能最多选择3个标签',
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
              style={{ display: 'none' }}
              name="author"
              rules={[
                {
                  required: true,
                  message: '作者ID不能少',
                },
              ]}
            >
              <Input size="large" placeholder="请输入标题" width="100%" />
            </Form.Item>
            <Form.Item
              name="content"
              rules={[
                {
                  required: true,
                  message: '文章内容不可缺少',
                },
              ]}
            >
              <Editor
                height={460}
                addImg={($file) => this.addImg($file)}
                ref={this.$vm}
                value={this.state.value}
                onChange={() => this.handleEditorChange()}
                placeholder="请在此处创作您的文章"
                width="100%"
              />
            </Form.Item>

            <Form.Item wrapperCol={{ span: 8, offset: 10 }}>
              <Button type="primary" danger htmlType="submit">
                发表文章
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>
    )
  }
}

export default connect((state) => state.user, {})(UserWrite)
