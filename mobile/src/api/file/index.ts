import request, {IBaseRes} from "@/api/request";
import {IUploadFileRes} from "@/api/file/const";

export const uploadFile = async (params: Partial<FormData>) => {
  const res = await request.post<IBaseRes<IUploadFileRes>>('/api/file/upload', params, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });
  return res;
}
