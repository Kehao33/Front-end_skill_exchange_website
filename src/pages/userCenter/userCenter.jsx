import React, { Component, createRef } from 'react'
import {
  Avatar,
  Affix,
  Input,
  Button,
  Modal,
  Form,
  message,
  Upload,
  Row,
  Col,
} from 'antd'
import { connect } from 'react-redux'

import { SmileTwoTone, PlusOutlined } from '@ant-design/icons'
import './userCenter.less'
import Footer from './../../components/footer/footer'
import { uModifyInfo } from './../../redux/user.redux.js'
import {
  reqArtByUid,
  reqModifyArt,
  reqDeleteArt,
  reqUserByUid,
} from './../../requestAPI/operHttp.js'
import ArticleList from './../../components/articleList/articleList'
const { TextArea } = Input

class UserCenter extends Component {
  constructor(props) {
    super(props)
    this.formRef = createRef()
    this.requeryId = props.match.params.id
    this.getArtByUserId = this.getArtByUserId.bind(this)
    this.getUserByUid = this.getUserByUid.bind(this)
    this.sendDataToList = this.sendDataToList.bind(this)
    this.onFinish = this.onFinish.bind(this)
    this.modifyArt = this.modifyArt.bind(this)
    this.deleteArt = this.deleteArt.bind(this)
    this.state = {
      canOpera: false, //如果Header的用户信息和主题的用户信息相同，就可以实现信息完善和文章修改
      visible: false,
      renderData: [],
      sendData: [],
      dynArt: [],
      algoArt: [],
      resArt: [],
      structArt: [],
      imageUrl: '',
      activeIndex: 1, // 当点击导航的时候显示特殊样式
      renderUser: null,
    }
  }
  // 实现点击不同的nav实现数据的加载
  sendDataToList(e) {
    e.persist()
    e.preventDefault()
    this.setState({
      activeIndex: parseInt(e.currentTarget.getAttribute('index')),
    })
    const { dynArt, algoArt, resArt, structArt } = this.state
    switch (parseInt(e.currentTarget.getAttribute('index'))) {
      case 1:
        this.setState({ sendData: dynArt })
        break
      case 2:
        this.setState({ sendData: algoArt })
        break
      case 3:
        this.setState({ sendData: resArt })
        break
      case 4:
        this.setState({ sendData: structArt })
        break
      default:
        break
    }
  }

  showModal = () => {
    this.setState({
      visible: true,
    })
  }

  // 表单提交的时候获取表单数据，并对数据进行操作
  async onFinish(formData) {
    // const { data } = await reqUpdateUserInfo(formData)
    this.props.uModifyInfo(formData)
    this.getUserByUid(this.requeryId)
  }

  handleOk = (e) => {
    this.setState({
      visible: false,
    })
    this.formRef.current.submit()
  }

  handleCancel = () => {
    this.setState({ visible: false })
  }

  async getArtByUserId() {
    const { data } = await reqArtByUid({ id: this.requeryId })
    console.log('data.data',data.data)

    if (data.isOk) {
      this.setState({
        renderData: data.data,
      })

      if (this.state.renderData.length !== 0) {
        const { renderData } = this.state
        this.setState({
          dynArt: renderData.filter(
            (item) => item.artType.search(/前端动态/g) !== -1
          ),
          algoArt: renderData.filter(
            (item) => item.artType.search(/数据结构&算法,算法/g) !== -1
          ),
          resArt: renderData.filter(
            (item) => item.artType.search(/资源共享/g) !== -1
          ),
          structArt: renderData.filter(
            (item) => item.artType.search(/数据结构&算法,数据结构/g) !== -1
          ),
        })

        this.setState({
          sendData: this.state.dynArt,
        })
      }
    } else {
      message.error('获取信息失败，请查看操作是否正确')
    }

    const { userObj } = this.props
    // 需要对requeryID进行判断
    if (this.requeryId === (userObj && userObj._id))
      this.setState({ canOpera: true })
  }

  // 提供给子组件修改文章
  async modifyArt(artObj) {
    const { data } = await reqModifyArt(artObj, 'POST')
    this.getArtByUserId()
    data.isOk && message.success(data.msg)
    !data.isOk && message.error(data.msg)
  }
  // 提供给子组件通过文章id删除文章
  async deleteArt(deleteId) {
    const { data } = await reqDeleteArt({ id: deleteId }, 'POST')
    data.isOk && message.success(data.msg)
    !data.isOk && message.error(data.msg)
    this.getArtByUserId()
  }

  // 实现获取用户信息
  async getUserByUid(id) {
    const { data } = await reqUserByUid({ id }, 'GET')
    console.log('data.data[0]',data)
    this.setState({
      renderUser: data.data[0],
      // imageUrl: data.data[0].avatarUrl,
    })
  }

  componentDidMount() {
    this.getArtByUserId()
    this.getUserByUid(this.requeryId)
  }

  beforeUpload = (file) => {
    // let flag = true
    const reader = new FileReader()
    const fileData = new FormData()
    fileData.append('file', file)

    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png'
    if (!isJpgOrPng) {
      message.error('上传失败,图片只能为 JPG/PNG 类型!')
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 100
    if (!isLt2M) {
      message.error('上传的文件不能超过 2MB!')
      return false
    }

    reader.addEventListener('load', () =>
      this.setState({
        imageUrl: reader.result,
      })
    )
    reader.readAsDataURL(file)

    // if (isJpgOrPng && isLt2M) {
    //   confirm({
    //     title: '是否确定修改头像?',
    //     cancelText: '取消',
    //     okText: '确定',
    //     icon: <ExclamationCircleOutlined />,
    //     async onOk() {
    //       flag = true
    //     },
    //     onCancel() {
    //       flag = false
    //     },
    //   })
    //   if (flag) {
    //     message.success('上传成功')
    //     return true
    //   } else return false
    // }
    message.success('修改头像成功')
  }

  render() {
    const {
      renderUser,
      dynArt,
      algoArt,
      resArt,
      structArt,
      sendData,
      imageUrl,
      activeIndex,
      canOpera,
    } = this.state
    const { userObj } = this.props
    const formLayout = {
      labelCol: {
        span: 3,
      },
      wrapperCol: {
        span: 21,
      },
    }

    return (
      <>
        <div className="user-center">
          <div className="left">
            <div className="left-title">个人中心</div>
            <div className="article-class-nav">
              <div
                index={1}
                className={activeIndex === 1 ? 'active-nav' : 'art-nav'}
                onClick={this.sendDataToList}
              >
                前端动态
              </div>
              <div
                index={2}
                className={activeIndex === 2 ? 'active-nav' : 'art-nav'}
                onClick={this.sendDataToList}
              >
                算法文章
              </div>
              <div
                index={3}
                className={activeIndex === 3 ? 'active-nav' : 'art-nav'}
                onClick={this.sendDataToList}
              >
                资源共享
              </div>
              <div
                index={4}
                className={activeIndex === 4 ? 'active-nav' : 'art-nav'}
                onClick={this.sendDataToList}
              >
                数据结构
              </div>
            </div>
            <div className="article-class-content">
              <ArticleList
                listData={sendData}
                renderUser={renderUser && renderUser}
                deleteArt={this.deleteArt}
                modifyArt={this.modifyArt}
              />
            </div>
          </div>
          <Affix offsetTop={16} className="right">
            <div>
              {/* <div className="user-info-item personal-card">个人卡片</div> */}
              <div className="user-info-item personal-avatar">
                <span>
                  {renderUser && renderUser.avatarUrl ? (
                    <Avatar src={renderUser.avatarUrl} />
                  ) : (
                    <Avatar>U</Avatar>
                  )}
                </span>
                <div className="nickname-sign">
                  <span className="nickname">
                    {renderUser && renderUser.nickName}
                  </span>
                  {canOpera ? (
                    <Button type="link" size="small" onClick={this.showModal}>
                      完善信息
                    </Button>
                  ) : null}
                  {/* <div>
                  <AimOutlined twoToneColor="#ffcccc" />
                  &nbsp;关注33
                </div>
                <div>
                  <HeartTwoTone twoToneColor="#eb2f96" />
                  &nbsp;粉丝1233
                </div> */}
                  <div>
                    <SmileTwoTone twoToneColor="#d24dff" />
                    &nbsp;
                    <span className="overflow-text">
                      {renderUser && renderUser.signature}
                    </span>
                  </div>
                </div>
              </div>
              <div className="user-info-item personal-achieve">
                <span className="achieve-item">
                  <span className="achieve achieve-item-desc">动态分享</span>
                  <span className="achieve achieve-item-value">
                    {dynArt.length}
                  </span>
                </span>

                <span className="achieve-item">
                  <span className="achieve achieve-item-desc">算法文章</span>
                  <span className="achieve-item-value">{algoArt.length}</span>
                </span>
                <span className="achieve-item">
                  <span className="achieve achieve-item-desc">资源共享</span>
                  <span className="achieve achieve-item-value">
                    {resArt.length}
                  </span>
                </span>
                <span className="achieve-item">
                  <span className="achieve achieve-item-desc">数据结构</span>
                  <span className="achieve achieve-item-value">
                    {structArt.length}
                  </span>
                </span>
              </div>
              <div className="user-info-item personal-firm">
                就职状态: {renderUser && renderUser.firm}
              </div>
              <div className="user-info-item personal-contact">
                联系方式: {renderUser && renderUser.contact}
              </div>
              {/* <div className="user-info-item personal-skill">
              get技能：
              <Tag color="green">node.js</Tag>
              <Tag color="lime">html5</Tag>
              <Tag color="orange">css3</Tag>
              <Tag color="cyan">React.js</Tag>
              <Tag color="green">jQuery</Tag>
            </div> */}
              <div className="user-info-item personal-brief">
                <span>个人简介</span>
                <p>{renderUser && renderUser.brief}</p>
              </div>
            </div>
          </Affix>

          <Modal
            visible={this.state.visible}
            // visible={true}
            title="完善个人信息"
            cancelText="取消"
            okText="确定修改"
            width="90%"
            centered
            style={{ padding: 10 }}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            afterClose={() => this.formRef.current.resetFields()}
          >
            {/* 
            模仿csdn实现头像上传 START
           */}
            <Row>
              <Col span={2}>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="/user/change-avatar"
                  data={{ uid: userObj && userObj._id }}
                  beforeUpload={this.beforeUpload}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      style={{ width: '100%', borderRadius: '50%' }}
                    />
                  ) : (
                    <PlusOutlined />
                  )}
                  <p style={{ color: '#157dcf' }}>修改头像</p>
                </Upload>
              </Col>
              <Col span={22}>
                <div>
                  <Form
                    {...formLayout}
                    onFinish={this.onFinish}
                    ref={this.formRef}
                    scrollToFirstError={true}
                    layout="horizontal"
                    initialValues={{
                      nickName: renderUser && renderUser.nickName,
                      realName: renderUser && renderUser.realName,
                      _id: renderUser && renderUser._id,
                      firm: renderUser && renderUser.firm,
                      signature: renderUser && renderUser.signature,
                      contact: renderUser && renderUser.contact,
                      brief: renderUser && renderUser.brief,
                    }}
                  >
                    <Form.Item
                      name="nickName"
                      label="用户昵称"
                      rules={[
                        {
                          required: true,
                          max: 20,
                          min: 1,
                          message: '真实名字长度不能超过20个字符且不能为空',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="realName"
                      label="真实姓名"
                      rules={[
                        {
                          max: 20,
                          message: '真实名字长度不能超过20个字符',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      style={{ display: 'none' }}
                      name="_id"
                      label="用户ID"
                    >
                      <Input disabled={true} />
                    </Form.Item>

                    <Form.Item name="contact" label="联系方式">
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="signature"
                      label="个性签名"
                      rules={[
                        {
                          max: 20,
                          message: '长度不能大于20个字符',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>

                    <Form.Item
                      name="firm"
                      label="就职公司"
                      rules={[
                        {
                          max: 80,
                          message: '就职公司不能超过80个字',
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="brief"
                      label="个人简介"
                      rules={[
                        {
                          max: 300,
                          message: '个人简介不能超过300个字',
                        },
                      ]}
                    >
                      <TextArea rows={4} />
                    </Form.Item>
                  </Form>
                </div>
              </Col>
            </Row>

            {/* 
            模仿csdn实现头像上传 END
           */}
          </Modal>
        </div>
        <Footer />
      </>
    )
  }
}

export default connect((state) => state.user, { uModifyInfo })(UserCenter)
