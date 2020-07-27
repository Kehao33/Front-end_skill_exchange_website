import React, { useState, createRef } from 'react'
import Editor from 'for-editor'
import { Form, Input } from 'antd'

function AdminEditArt(props) {
  const formRef = createRef()
  const $vm = createRef()
  const [value, setValue] = useState('')
  function addImg($file) {
    $vm.current.$img2Url($file.name, 'file_url')
    console.log('$file: ', $file)
  }
  // 处理for-editor富文本改变数据的函数
  function handleEditorChange(value) {
    setValue(value)
  }

  const formLayout = {
    labelCol: {
      span: 2,
    },
    wrapperCol: {
      span: 22,
    },
  }

  const onFinish = (formData) => {
    console.log('formData:', formData)
  }
  return (
    <div>
      <Form
        {...formLayout}
        layout="horizontal"
        onFinish={onFinish}
        scrollToFirstError={true}
        ref={formRef}
        size="middle"
        // initialValues={{

        // }}
      >
        <Form.Item
          name="_id"
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
          name="nickName"
          label="文章作者"
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
    </div>
  )
}

export default AdminEditArt
