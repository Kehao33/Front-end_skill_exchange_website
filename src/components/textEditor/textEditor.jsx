import React, { Component, createRef } from 'react'
import E from 'wangeditor'

class Editor extends Component {
  constructor(props) {
    super(props)
    this.editorRef = createRef()
    this.state = {
      editorContent: '',
    }
  }
  render() {
    return (
      <div className="Editor">
        {/* 将生成编辑器 */}
        <div ref={this.editorRef} style={{ textAlign: 'left' }}></div>
      </div>
    )
  }
  componentDidMount() {
    const elem = this.editorRef.current
    const editor = new E(elem)
    // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
    editor.customConfig.onchange = (html) => {
      this.setState({
        editorContent: html,
      })
      this.props.setEditorContent(html)
    }
    editor.customConfig.fontNames = [
      '宋体',
      '微软雅黑',
      'Arial',
      'Tahoma',
      'Verdana',
    ]
    editor.customConfig.colors = [
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#ffffff',
    ]
    editor.create()
  }
  clickHandle() {
    // alert(this.state.editorContent)
  }
}

export default Editor
