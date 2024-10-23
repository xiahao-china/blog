import Quill from "quill";
import { showToast } from "vant";
import { HtmlToDelta } from "quill-delta-from-html/quill-delta-from-html";
import { IObject } from "@/util";
import { uploadFile } from "@/api/file";

export const TOOLBAR_OPTIONS = [
  ["bold", "italic", "underline", "strike"], // 基础字体样式
  ["blockquote", "code-block", "check"], // 行格式
  ["link", "image", "video", "formula"], //
  // [{ 'header': 1 }, { 'header': 2 }],               // custom button values
  // ['ordered','bullet','check'],
  // [{'list': ['ordered','bullet','check']}],
  [{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
  [{ script: "sub" }, { script: "super" }], // superscript/subscript
  // [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent反
  // [{ 'direction': 'rtl' }],                         // text direction

  [{ size: ["small", false, "large", "huge"] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  // [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
  // [{ 'font': [] }],
  // [{ 'align': [] }],
  // ['clean']                                         // remove formatting button
];

export interface IInitEditParams {
  str: string;
  toolBarEl?: {
    getFixToolbarRef: ()=> HTMLDivElement;
  };
  containerEl?: HTMLDivElement;
  isHTML?: boolean;
}

export interface IExtraArticleInfo {
  cover: string;
  isPrivate?: boolean;
}

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

export const onChoseImgUpload = async (file: File, insert = true, editor: Quill) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await uploadFile(formData);
  if (res.code === 200) {
    const range = editor.getSelection();
    const resUrl = `${location.origin}${res.data.filePath}`;
    //将上传好的图片，插入到富文本的range.index（当前光标处）
    if (insert) editor.insertEmbed(range?.index || 0, "image", resUrl);
    return resUrl;
  } else showToast(res.message || "上传失败，请稍后再试！");
  return "";
};

export const initEdit = (params: IInitEditParams) => {
  const {toolBarEl, str, isHTML, containerEl} = params;
  const FixToolbarRootEl = toolBarEl?.getFixToolbarRef();
  if (!containerEl || !FixToolbarRootEl) return;
  const quill = new Quill(containerEl, {
    placeholder: "请输入正文",
    modules: {
      toolbar: {
        container: FixToolbarRootEl,
        handlers: TOOLBAR_OPTIONS,
      },
    },
    theme: "snow",
  });
  const editorObj = quill;
  if (str) {
    if (isHTML) {
      const handleDeltaAry = new HtmlToDelta().convert(str);
      editorObj.setContents(handleDeltaAry);
    } else {
      try {
        const handleDeltaAry = JSON.parse(str);
        editorObj.setContents(handleDeltaAry);
      } catch (err) {
        console.log(err);
      }
    }
  }
  quill.on("text-change", async (info, oldDelta) => {
    const insertInfo = info.ops[1]?.insert as IObject;
    if (insertInfo && insertInfo["image"]) {
      const isBase64 = /^data:image\/[A-z]+;base64/.test(
        insertInfo["image"].split(",")[0]
      );
      if (!isBase64) return;
      const file = base64ToFile(insertInfo["image"]);
      quill.setContents(oldDelta);
      const imgUrl = await onChoseImgUpload(file, true, editorObj);
      if (imgUrl) {
        insertInfo["image"] = imgUrl;
      }
    }
  });
  return editorObj;
};