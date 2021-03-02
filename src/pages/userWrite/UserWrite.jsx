import React, { Component, createRef } from "react";
import Editor from "for-editor";
import BraftEditor from "braft-editor";
import "braft-editor/dist/index.css";
import $ from "jquery";
import { connect } from "react-redux";
import showdown from "showdown";
import {
  Form,
  Input,
  Button,
  Divider,
  Select,
  message,
  Cascader,
  Modal,
} from "antd";
import { CheckOutlined } from "@ant-design/icons";

// import KendoRichEditor from './../../components/richEditor/kendoRichEditor'
/**
 * 解决不能够直接得到BraftEditor的值，可以设置一个state来管理，然后在提交表单的时候触动保存事件，然后给表单对象添加content的事件
 *
 */

import { reqAddArt } from "./../../requestAPI/operHttp.js";
import { optionsChilren, artClass_OPTIONS } from "./../../options/options.js";
import "./UserWrite.less";
const { confirm } = Modal;

class UserWrite extends Component {
  constructor() {
    super();
    this.editorRef = createRef();
    this.formRef = createRef();
    this.handleEditorChange = this.handleEditorChange.bind(this);
    this.handleChangeEditTheme = this.handleChangeEditTheme.bind(this);
    this.state = {
      value: "",
      selectedItems: [],
      isMarkDown: true,
    };
  }

  //  draft-editor start
  // async componentDidMount() {
  //   // Assume here to get the editor content in html format from the server
  //   const htmlContent = "xxxx";
  //   // Use BraftEditor.createEditorState to convert html strings to editorState data needed by the editor
  //   this.setState({
  //     editorState: BraftEditor.createEditorState(htmlContent),
  //   });
  // }

  submitContent = async () => {
    // Pressing ctrl + s when the editor has focus will execute this method,（在表单提交的时候触发来将当前的数据保存到表单里边去）
    // Before the editor content is submitted to the server, you can directly call editorState.toHTML () to get the HTML content
    const content = this.state.value.toHTML();
    return content;
    // 当改变的时候，就将文本保存到数据库中，防止用户编辑的时候网络不好，导致所有的信息丢失了。
    // const result = await saveEditorContent(content)
  };

  // draft-editor end

  async addImg($file) {
    const fileData = new FormData();
    fileData.append("file", $file);
    const self = this;
    $.ajax({
      url: "/user/pic-write",
      data: fileData,
      type: "POST",
      processData: false, //必须
      contentType: false, //必须
      success: function (data) {
        data.isOk && self.editorRef.current.$img2Url($file.name, data.artUrl);
      },
      error: function (data) {
        !data.isOk && message.error(data.msg);
      },
    });
  }

  // 处理for-editor markdowm / braft-editor富文本改变数据的函数
  handleEditorChange(newValue) {
    const oldState = this.state;
    this.setState({
      ...oldState,
      value: newValue,
    });
  }

  // 表单文章提交
  onFinish = async (formData) => {
    const self = this;
    let submitFormDate = {};
    const converter = new showdown.Converter(); //初始化转换器
    if (!this.state.isMarkDown) {
      submitFormDate = { ...formData, content: await this.submitContent(),isRichEdit: true};
      console.dir('content: ',submitFormDate.content)
    } else {
      const { content } = formData;
      submitFormDate = { ...formData, content: converter.makeHtml(content),isRichEdit: false};
    }
    console.log("formDataa: ", submitFormDate);
    const { data } = await reqAddArt(submitFormDate);

    if (data.isOk) {
      confirm({
        title: "发布文章成功",
        cancelText: "继续写作",
        okText: "管理文章",
        icon: <CheckOutlined />,
        content: "请选择您的下一步操作?",
        onOk() {
          self.props.history.push(`/user/${self.props.userObj._id}`);
        },
        onCancel() {
          self.props.history.push("/user/write");
          self.formRef.current.resetFields();
        },
      });
    } else {
      message.error(data.msg);
    }
  };

  handleChangeEditTheme() {
    const oldState = this.state;
    const newIsMarkDown = this.state?.isMarkDown;
    this.setState({ ...oldState, isMarkDown: !newIsMarkDown });
  }

  render() {
    const formLayout = {
      labelCol: {
        span: 2,
      },
      wrapperCol: {
        span: 22,
      },
    };
    const { userObj } = this.props || {};
    const { value, selectedItems, editorState, isMarkDown } = this.state || {};

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
            initialValues={{ title: "", author: userObj && userObj._id }}
          >
            <Form.Item
              name="title"
              rules={[
                {
                  required: true,
                  message: "文章标题不可缺少",
                },
              ]}
            >
              <Input size="large" placeholder="请输入标题" width="100%" />
            </Form.Item>

            <Button
              type="primary"
              className="switch_theme"
              onClick={() => this.handleChangeEditTheme()}
            >
              {`切换为${isMarkDown ? "富文本" : "MarkDown"}模式`}
            </Button>

            <Form.Item
              style={{ display: "none" }}
              name="author"
              rules={[
                {
                  required: true,
                  message: "作者ID不能少",
                },
              ]}
            >
              <Input size="large" placeholder="请输入标题" width="100%" />
            </Form.Item>

            <Form.Item
              name="content"
              // rules={[
              //   {
              //     required: true,
              //     message: "文章内容不可缺少",
              //   },
              // ]}
            >
              {isMarkDown ? (
                <Editor
                  height={460}
                  addImg={($file) => this.addImg($file)}
                  ref={this.editorRef}
                  value={this.state.value}
                  onChange={(e) => this.handleEditorChange(e)}
                  placeholder="请在此处创作您的文章"
                  width="100%"
                />
              ) : (
                <div className="braftEditor">
                  <BraftEditor
                    ref={this.editorRef}
                    value={this.state.value}
                    onChange={this.handleEditorChange}
                    onSave={this.submitContent}
                  />
                </div>
              )}
            </Form.Item>
            <Form.Item
              name="artType"
              rules={[
                {
                  required: true,
                  message: "请选择文章类别",
                  type: "array",
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
                  message: "选择不能为空,且只能最多选择3个标签",
                  type: "array",
                },
              ]}
            >
              <Select
                mode="tags"
                style={{ width: "100%" }}
                tokenSeparators={[","]}
                allowClear
                showArrow={true}
                placeholder="请填写或者选择文章标签"
              >
                {optionsChilren}
              </Select>
            </Form.Item>

            <Form.Item wrapperCol={{ span: 8, offset: 10 }}>
              <Button type="primary" danger htmlType="submit">
                发表文章
              </Button>
            </Form.Item>
          </Form>
        </div>
      </>
    );
  }
}

export default connect((state) => state.user, {})(UserWrite);
