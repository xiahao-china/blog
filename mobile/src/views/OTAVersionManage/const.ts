// Storage储存进入

export const FREQUENTLY_PROJECT_RECORD_KEY = "FREQUENTLY_PROJECT_RECORD";

export interface IFrequentlyProjectRecord {
  projectId: string;
  num: number;
}

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
        a.num - b.num
    );
    return handleList[0];
  } catch (err) {
    console.error(err);
    return [];
  }
};

export const addFrequentlyProjectRecord = (projectId: string) => {
  const currentList = getFrequentlyProjectRecord(true) as IFrequentlyProjectRecord[];
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
  )
};

