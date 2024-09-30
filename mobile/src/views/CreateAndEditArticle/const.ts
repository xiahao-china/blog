export const TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // 基础字体样式
  ["blockquote", "code-block", "check"], // 行格式
  ["link", "image", "video", "formula"], //
  // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  // ['ordered','bullet','check'],
  // [{'list': ['ordered','bullet','check']}],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  // [{ 'direction': 'rtl' }],                         // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  // [{ 'font': [] }],
  // [{ 'align': [] }],
  // ['clean']                                         // remove formatting button
];

// 将Base64编码转换为File对象
export function base64ToFile(base64: string) {
  const headStrAry = base64.split(',');
  let fileRegRes: string = headStrAry[0].match(/^data:image\/[A-z]+;base64/)?.[0] || '';
  fileRegRes = fileRegRes.replace('data:image/', '').replace(';base64','');
  const filename = `${new Date().getTime()}.${fileRegRes}`;
  const byteCharacters = atob(headStrAry[1]);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new File([byteArray], filename, { type: fileRegRes });
}
