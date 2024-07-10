export interface IRandomListItem {
  id: string;
  name: string;
  weight: number;
}

export const RANDOM_LIST_DEFAULT_ITEM: IRandomListItem = {
  id: "1",
  name: "",
  weight: 1
};

export const RANDOM_DICE_CONFIG_HISTORY_KEY = "RANDOM_DICE_CONFIG_HISTORY_KEY";

export const setRandomDiceConfigHistory = (data: IRandomListItem[]) => {
  localStorage.setItem(RANDOM_DICE_CONFIG_HISTORY_KEY, JSON.stringify(data));
};

export const getRandomDiceConfigHistory = (): IRandomListItem[] => {
  const res = localStorage.getItem(RANDOM_DICE_CONFIG_HISTORY_KEY);
  const handleRes = res ? JSON.parse(res) as IRandomListItem[] : [];
  return handleRes;
};

export interface IStartRandomRes {
  item: IRandomListItem;
  textList: string[];
}

export const startRandom = (randomlist: IRandomListItem[]): IStartRandomRes => {
  const fillerText = "-";
  const maxNameLen = Math.max(...randomlist.map((item) => item.name.length));
  const handleRandom = randomlist.map((item) => ({
    ...item,
    name: `${fillerText.repeat(maxNameLen - item.name.length)}${item.name}`,
    weight: item.weight * 10
  }));
  const count = handleRandom.reduce((pre, nxt) => pre + nxt.weight, 0);
  let randomRes = Math.round(Math.random() * count);
  const resIndex = handleRandom.findIndex((item) => {
    if (item.weight >= randomRes) return true;
    else {
      randomRes -= item.weight;
      return false;
    }
  });
  return {
    item: randomlist[resIndex],
    textList: [
      ...handleRandom.map((item)=>item.name),
      handleRandom[resIndex].name,
    ]
  };
};