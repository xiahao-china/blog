// Storage储存进入

import { IOTAProject } from "@/api/ota/const";

export const FREQUENTLY_PROJECT_RECORD_KEY = "FREQUENTLY_PROJECT_RECORD";

export interface IFrequentlyProjectRecord {
  projectId: string;
  num: number;
}

export const createDefaultOTAProjectInfo = (): IOTAProject => {
  return {
    id: "",
    name: "暂无项目", // 项目名称
    description: "", // 项目描述
    currentVersion: 0, // 当前启用版本，即最后可使用版本 格式为 0.1
    createTime: "", // 创建时间
    createUid: "", // 创建者uid
    maxVersion: 0, // 最大版本，即当前最大版本 格式为 0.1
  };
};

export const getFrequentlyProjectRecord = (
  isAll: boolean
): IFrequentlyProjectRecord[] | IFrequentlyProjectRecord => {
  try {
    const recordList = JSON.parse(
      localStorage.getItem(FREQUENTLY_PROJECT_RECORD_KEY) || "[]"
    );
    if (isAll) {
      return recordList;
    }
    const handleList = recordList.sort(
      (a: IFrequentlyProjectRecord, b: IFrequentlyProjectRecord) =>
        b.num - a.num
    );
    return handleList[0];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addFrequentlyProjectRecord = (projectId: string) => {
  const currentList = getFrequentlyProjectRecord(
    true
  ) as IFrequentlyProjectRecord[];
  const aimIndex = currentList.findIndex(
    (item: IFrequentlyProjectRecord) => item.projectId === projectId
  );
  if (aimIndex !== -1) {
    currentList[aimIndex].num += 1;
  } else {
    currentList.push({ projectId, num: 1 });
  }
  localStorage.setItem(
    FREQUENTLY_PROJECT_RECORD_KEY,
    JSON.stringify(currentList)
  );
};
