<script setup lang="ts">
import tinymce, { Editor } from 'tinymce/tinymce' //tinymce默认hidden，不引入不显示
import TinymceEditor from '@tinymce/tinymce-vue'
import 'tinymce/themes/silver/theme' // 主题文件
import 'tinymce/icons/default'
import 'tinymce/models/dom'
import 'tinymce/plugins/wordcount'
import '@/libs/tinymce.plugin'
const init = {
  height: '100%',
  language_url: '/tinymce/langs/zh-Hans.js',
  language: 'zh-Hans',
  skin_url: '/tinymce/skins/ui/oxide', // 皮肤：这里引入的是public下的资源文件
  // skin_url: 'tinymce/skins/ui/oxide-dark',//黑色系
  content_css: ['/tinymce/skins/content/default/content.css'], //内容区域css样式
  plugins: ['docxPlugin'],
  toolbar: 'undo redo|fontGroup|textAlign|forecolor backcolor customRemoveFormat|docxExport docxImport html',
  toolbar_groups: {
    fontGroup: {
      icon: 'translate',
      tooltip: '文字样式',
      items: 'fontsize bold italic underline customStrikethrough'
    },
    textAlign: {
      icon: 'align-left',
      tooltip: '对齐方式',
      items: 'aligncenter alignright alignleft alignnone'
    }
  },
  menubar: false, // 菜单栏
  statusbar: false, // 是否显示底部状态栏
  branding: false, // 默认会在右下角显示Tiny图标
  promotion: false, // 隐藏upgrade按钮
  resize: false, // 改变宽高
  automatic_uploads: false, // 禁止图片自动上传
  license_key: 'gpl',
  noneditable_class: 'non-editable',
  font_size_formats: '12px 14px 16px 18px 24px 36px 48px 56px 72px',
  toolbar_sticky: true,
  font_family_formats:
    '微软雅黑=Microsoft YaHei,Helvetica Neue,PingFang SC,sans-serif;苹果苹方=PingFang SC,Microsoft YaHei,sans-serif;宋体=simsun,serif;仿宋体=FangSong,serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;Book Antiqua=book antiqua,palatino;Comic Sans MS=comic sans ms,sans-serif;Courier New=courier new,courier;Georgia=georgia,palatino;Helvetica=helvetica;Impact=impact,chicago;Tahoma=tahoma,arial,helvetica,sans-serif;Terminal=terminal,monaco;Times New Roman=times new roman,times;Verdana=verdana,geneva;Webdings=webdings;Wingdings=wingdings,zapf dingbats;',
  // 初始化完成
  init_instance_callback: (editor: Editor) => {
    console.log('富文本编辑器,初始化完成')
  }
}
const activeContent = ref(`<p style="text-align: left;" data-mce-style="text-align: left;"><span style="font-size: 16px;" data-mce-style="font-size: 16px;">文字<span style="color: #2dc26b;" data-mce-style="color: #2dc26b;">颜色</span> 背景<span style="background-color: #843fa1;" data-mce-style="background-color: #843fa1;">颜色</span>&nbsp; <span style="color: #2dc26b; background-color: #843fa1;" data-mce-style="color: #2dc26b; background-color: #843fa1;">文字背景颜色</span></span></p><p style="text-align: left;" data-mce-style="text-align: left;"><span style="font-size: 16px;" data-mce-style="font-size: 16px;">字号<span style="font-size: 36px;" data-mce-style="font-size: 36px;">大</span><span style="font-size: 12px;" data-mce-style="font-size: 12px;">小</span> <s>删除线 </s><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">下划线</span></span>&nbsp; <span style="font-size: 16px;" data-mce-style="font-size: 16px;"><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;"><s>删除线下划线</s></span></span>&nbsp; <strong>加粗 </strong><em>斜体</em> <em><strong>加粗斜体<span style="font-size: 24px; color: #2dc26b; background-color: #843fa1;" data-mce-style="font-size: 24px; color: #2dc26b; background-color: #843fa1;"><s><span style="text-decoration: underline;" data-mce-style="text-decoration: underline;">加粗斜体大小删除线下划线文字颜色背景颜色</span></s></span></strong></em></p><p style="text-align: center;" data-mce-style="text-align: center;"><span style="font-size: 16px;" data-mce-style="font-size: 16px;">居中对齐</span></p><p style="text-align: right;" data-mce-style="text-align: right;"><span style="font-size: 16px;" data-mce-style="font-size: 16px;">右对齐</span></p>`)
onMounted(() => {
  tinymce.init({})
})
</script>
<template>
  <div class="w-full h-full flex flex-col p-2">
    <div class="my-2 text-center text-xl text-gray-900">基于 tinymce的富文本编辑器</div>
    <div class="flex-1 overflow-hidden">
      <div class="w-full h-full bg-gray-400 p-1 rounded">
        <tinymce-editor
          v-model="activeContent"
          api-key="aqngunmpf50jtogl327wqjc1u1rz6pgbicrbtjfdxh0bpm01"
          :init="init"></tinymce-editor>
      </div>
    </div>
  </div>
</template>
