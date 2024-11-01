import { IBaseUserInfo, ISearchUser } from "@/api/usr/const";
import { debounce } from "lodash";
import { searchUser } from "@/api/usr";
import { checkMail } from "@/util";

export const debounceSearch = debounce(
  async (text: string, callback: (info?: IBaseUserInfo) => void) => {
    const params: ISearchUser = {};
    if (checkMail(text)) params.email = text;
    else params.phone = text;
    const res = await searchUser(params);
    callback(res.data);
  },
  300
);
