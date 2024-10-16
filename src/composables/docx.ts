import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  UnderlineType,
  AlignmentType,
  VerticalAlign,
  WidthType
} from 'docx'
import type { IRunOptions, IParagraphOptions, ParagraphChild } from 'docx'
type Mutable<T> = {
  -readonly [P in keyof T]: T[P] extends ReadonlyArray<infer U> ? Mutable<U>[] : T[P] extends object ? Mutable<T[P]> : T[P]
}

interface Style {
  backgroundColor?: string
  ['background-color']?: string
  color?: string
  fontWeight?: string
  ['font-weight']?: string
  fontStyle?: string
  ['font-style']?: string
  textDecoration?: string
  ['text-decoration']?: string
  marginTop?: string
  ['margin-top']?: string
  marginBottom?: string
  ['margin-bottom']?: string
  marginLeft?: string
  ['margin-left']?: string
  marginRight?: string
  ['margin-right']?: string
  textAlign?: string
  ['text-align']?: string
  fontSize?: string
  ['font-size']?: string
}

type TextStyle = Mutable<IRunOptions>
type ParagraphStyle = Mutable<IParagraphOptions>
const defaultWordTextStyle = {
  size: 16,
  font: {
    name: '宋体'
  }
}
class CustomTextRun {
  constructor(initOption: string | IRunOptions) {
    if (typeof initOption === 'string') {
      return new TextRun({ text: initOption, ...defaultWordTextStyle })
    } else {
      return new TextRun({ ...defaultWordTextStyle, ...initOption })
    }
  }
}

export const useDocx = () => {
  const onDocxImport = () => {
    return new Promise((resolve, reject) => {
      const input = document.createElement('input')
      input.style.display = 'none'
      input.type = 'file'
      input.accept = '.docx'
      input.multiple = false
      input.onchange = (e: Event) => {
        const target = e.target as HTMLInputElement
        const file = target.files?.[0]
        if (!file) {
          console.error('未选择文件')
          return
        }

        const reader = new FileReader()
        reader.readAsArrayBuffer(file)

        reader.onload = (e) => {
          const arrayBuffer = e.target?.result // 可选链，避免可能的 null
          if (arrayBuffer instanceof ArrayBuffer) {
            return mammoth.convertToHtml({ arrayBuffer }).then((result) => {
              resolve(result.value)
            })
          }
          input.remove()
        }

        reader.onerror = (error) => {
          console.error('文件读取错误:', error)
          // 在出错的情况下也删除input元素
          input.remove()
          reject(error)
        }
      }

      document.body.appendChild(input)
      input.click()
    })
  }

  const onDocxExport = (content: string) => {
    if (!content) {
      return Promise.reject('内容不能为空')
    }
    // 创建一个元素用来处理富文本内容
    const element = document.createElement('div')
    element.innerHTML = content
    const paragraphs = element.querySelectorAll('p')
    // 将p标签的内容转换成Paragraph
    let children = []
    for (let i = 0; i < paragraphs.length; i++) {
      const paragraph = paragraphs[i]
      children.push(onParagraphCovert(paragraph))
    }
    const doc = new Document({
      creator: 'xnvrub',
      title: '基于tinymce的富文本编辑器',
      sections: [
        {
          children: children
        }
      ]
    })
    const fileName = '导出文档.docx'
    Packer.toBlob(doc).then((blob) => {
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = fileName
      a.click()
      a.remove()
    })
  }

  function onNormalizeColor(color: string) {
    if (!color) return 'ffffff'
    if (color.startsWith('#')) {
      if (color.length === 7 || color.length === 9) return color.replace('#', '')
      if (color.length === 4) {
        return color[1].repeat(2) + color[2].repeat(2) + color[3].repeat(2)
      }
      return 'ffffff'
    }
    if (color.startsWith('rgb(')) {
      const match = color.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)
      if (match) {
        const r = parseInt(match[1], 10).toString(16).padStart(2, '0')
        const g = parseInt(match[2], 10).toString(16).padStart(2, '0')
        const b = parseInt(match[3], 10).toString(16).padStart(2, '0')
        return r + g + b
      }
      return 'ffffff'
    }
    return 'ffffff'
  }
  function onCovertPx(value: string, baseFontSize = 16) {
    // 提取数值和单位
    const match = value.match(/^([\d.]+)([a-zA-Z%]+)?$/)
    if (!match) {
      return 0
    }

    const num = parseFloat(match[1])
    const unit = match[2]

    // 根据单位进行转换
    switch (unit) {
      case 'px':
        return num // 已经是像素，直接返回
      case 'em':
        return num * baseFontSize // em相对于基准字体大小转换
      case 'rem':
        return num * baseFontSize // rem相对于根元素字体大小转换
      case '%':
        return (num / 100) * baseFontSize // 百分比相对于基准字体大小转换
      default:
        return 0
    }
  }
  // 处理css属性中的数值
  function onNormalizeSize(size: string, name: string): number {
    if (!size) return 0
    switch (name) {
      case 'font-size':
      case 'fontSize':
        return onCovertPx(size)
      case 'margin':
      case 'padding':
        return onCovertPx(size) * 10
      default:
        return 0
    }
  }

  function onTextStyleConvert(style: Style): TextStyle {
    const textStyle: TextStyle = {}
    const hasBackground =
      (style.backgroundColor && style.backgroundColor !== 'transparent') ||
      (style['background-color'] && style['background-color'] !== 'transparent')
    const textColor = onNormalizeColor(style.color || '#000000')
    if (hasBackground) {
      textStyle.shading = {
        fill: onNormalizeColor(style.backgroundColor || style['background-color'] || '#000000'),
        color: onNormalizeColor(style.color || '#ffffff')
      }
      textStyle.color = textColor
    } else if (style.color) {
      textStyle.color = textColor
    }

    if (style.fontWeight === 'bold' || style['font-weight'] === 'bold') {
      textStyle.bold = true
    }

    if (style.fontStyle === 'italic' || style['font-style'] === 'italic') {
      textStyle.italics = true
    }

    if (style.textDecoration === 'underline' || style['text-decoration'] === 'underline') {
      textStyle.underline = {
        type: UnderlineType.SINGLE
      }
    }

    if (style.textDecoration === 'line-through' || style['text-decoration'] === 'line-through') {
      textStyle.strike = true
    }

    if (style.fontSize || style['font-size']) {
      textStyle.size = onNormalizeSize(style.fontSize || style['font-size'] || '', 'font-size')
    }
    return textStyle
  }

  function onNodeNameStyleConvert(nodeName: string): TextStyle {
    switch (nodeName) {
      case 'S':
        return {
          strike: true
        }
      case 'EM':
        return {
          italics: true
        }
      case 'STRONG':
        return {
          bold: true
        }
      default:
        return {}
    }
  }

  function onParagraphStyleConvert(style: Style): ParagraphStyle {
    const before = onNormalizeSize(style.marginTop || style['margin-top'] || '', 'margin')
    const after = onNormalizeSize(style.marginBottom || style['margin-bottom'] || '', 'margin')
    const align = style.textAlign || style['text-align']
    const paragraphStyle: ParagraphStyle = {
      spacing: {
        before,
        after
      },
      alignment: align === 'center' ? AlignmentType.CENTER : align === 'right' ? AlignmentType.RIGHT : AlignmentType.LEFT
    }
    return paragraphStyle
  }
  function onParagraphCovert(paragraph: HTMLElement) {
    const paragraphStyle = onParagraphStyleConvert(paragraph.style)
    let children: ParagraphChild[] = []
    let childNodes = paragraph.childNodes

    for (let i = 0; i < childNodes.length; i++) {
      let child = childNodes[i]
      let nodeNameStyle = onNodeNameStyleConvert(child.nodeName)
      children.push(...onTextCovert(child as HTMLElement, nodeNameStyle)) // 初始化为空对象以避免继承不必要的样式
    }

    return new Paragraph({
      children: children,
      ...paragraphStyle
    })
  }

  // 递归调用返回children
  function onTextCovert(node: HTMLElement, inheritedProperties: TextStyle = {}): ParagraphChild[] {
    let children = []
    let childNodes = node.childNodes

    for (let i = 0; i < childNodes.length; i++) {
      let child = childNodes[i]
      let nodeNameStyle = onNodeNameStyleConvert(child.nodeName)
      if (child.nodeType === 3) {
        // 文本节点
        let style = {
          ...nodeNameStyle,
          ...inheritedProperties
        }
        children.push(new CustomTextRun({ text: child.textContent as string, ...style }))
      } else if (child.nodeType === 1) {
        // 元素节点
        let style = onTextStyleConvert((child as HTMLElement).style)
        let mergedStyle = {
          ...style,
          ...inheritedProperties,
          ...nodeNameStyle
        }
        if (child.childNodes.length > 0) {
          children.push(...onTextCovert(child as HTMLElement, mergedStyle)) // 传递合并后的样式
        } else {
          children.push(new CustomTextRun({ text: child.textContent as string, ...mergedStyle }))
        }
      }
    }

    return children as ParagraphChild[]
  }

  return {
    onDocxImport,
    onDocxExport
  }
}
