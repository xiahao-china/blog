export interface ISearchRecordItem {
    text: string;
    time: number;
}

export const BLOG_SEARCH_RECORD = "BLOG_SEARCH_RECORD";

export const getSearchRecord = () => {
    let recordList: ISearchRecordItem[] = [];
    try {
        recordList = JSON.parse(localStorage.getItem(BLOG_SEARCH_RECORD) || "[]");
    } catch (err) {
        console.log(err);
    }
    return recordList;
};

export const setSearchRecord = (list: ISearchRecordItem[]) => {
    localStorage.setItem(BLOG_SEARCH_RECORD, JSON.stringify(list));
};

export const DROPDOWN_SELECT_OPTIONS = [
    {text: "首页", value: "HomePage"},
    {text: "小工具", value: "Gadget"}
];

export const recordScroll = (callback: (val: boolean) => void) => {
    document.addEventListener('scroll',(ev)=>{
        console.log('ev', ev);
    })
}