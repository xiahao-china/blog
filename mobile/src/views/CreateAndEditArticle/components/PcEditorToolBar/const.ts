export const TOOLBAR_OPTIONS = [
  ['bold', 'italic', 'underline', 'strike'],        // 基础字体样式
  ['blockquote', 'code-block', 'check'], // 行格式
  ['link', 'image', 'video', 'formula'], //
  // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  // ['ordered','bullet','check'],
  // [{'list': ['ordered','bullet','check']}],
  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  // [{ 'direction': 'rtl' }],                         // text direction

  [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],

  // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  // [{ 'font': [] }],
  // [{ 'align': [] }],
  // ['clean']                                         // remove formatting button
];