/**
 * TinyMCE version 7.1.2 (TBD)
 */
import tinymce from 'tinymce/tinymce'
import type { Editor } from 'tinymce/tinymce'
import { useDocx } from '@/composables/docx'
const { onDocxImport, onDocxExport } = useDocx()
;(function () {
  'use strict'

  let editor: Editor
  let editorBody: HTMLElement
  let editorDoc: Document
  const util = {
    loader: tinymce.util.Tools.resolve('tinymce.PluginManager'),
    _dom: tinymce.DOM,
    getEditor() {
      return editor
    },
    execCommand(cmd: string) {
      // 工具函数
      editor.execCommand(cmd)
    }
  }
  const handler = {
    onDocxExport() {
      const content = editor.getContent()
      console.log(content)
      onDocxExport(content)
    },
    onDocxImport() {
      onDocxImport()
        .then((res) => {
          editor.setContent(res as string)
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }
  const register = () => {
    editor.ui.registry.addButton('docxExport', {
      tooltip: '导出Word文档',
      icon: 'export',
      onAction: () => {
        handler.onDocxExport()
      },
      context: ''
    })
    editor.ui.registry.addButton('docxImport', {
      tooltip: '导入Word文档(.docx)',
      icon: 'import-word',
      onAction: () => {
        handler.onDocxImport()
      },
      context: ''
    })
    // 增加快捷键清除格式 和 删除线
    editor.addShortcut('Meta+Shift+U', '', () => {
      util.execCommand('Strikethrough')
    })
    editor.addShortcut('Meta+Shift+F', '', () => {
      util.execCommand('RemoveFormat')
    })
    editor.addCommand('SourceCode', () => {
      alert(editor.getContent())
    })
    editor.addShortcut('Meta+Shift+H', '', () => {
      util.execCommand('SourceCode')
    })
    editor.ui.registry.addButton('customStrikethrough', {
      tooltip: '删除线(Ctrl+Shift+U)',
      icon: 'strike-through',
      onAction: () => {
        util.execCommand('Strikethrough')
      },
      context: ''
    })
    editor.ui.registry.addButton('customRemoveFormat', {
      tooltip: '清除格式(Ctrl+Shift+F)',
      icon: 'remove-formatting',
      onAction: () => {
        util.execCommand('RemoveFormat')
      },
      context: ''
    })

    editor.ui.registry.addButton('html', {
      tooltip: '富文本内容(Ctrl+Shift+H)',
      icon: 'sourcecode',
      onAction: () => {
        util.execCommand('SourceCode')
      },
      context: ''
    })
  }
  const setEditor = (e: Editor) => {
    editor = e
    editor.on('init', () => {
      editorBody = editor.getBody()
      editorDoc = editor.getDoc()
      console.log('插件导入完成')
    })
    editor.addCommand('docxExport', () => {
      handler.onDocxExport(editor)
    })
    editor.addCommand('docxImport', () => {
      handler.onDocxImport(editor)
    })
    register()
  }
  const Plugin = () => {
    util.loader.add('docxPlugin', (editor: Editor) => {
      setEditor(editor)
      return { handler, util }
    })
  }
  Plugin()
})()
