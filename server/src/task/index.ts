import { sslCheckTask } from "@/task/sslCheck";

export const BASE_TIME_MS = 1000 * 60; // 最小执行间隔为一分钟

export enum ETaskItemStatus {
  // 未执行
  UNIMPLEMENTED = 0,
  // 执行中
  IMPLEMENTING = 1,
  // 已执行
  IMPLEMENTED = 2,
}

export interface ITaskItem {
  intervalMs: number;
  lastImplement?: number;
  status?: ETaskItemStatus;
  fn: () => ({
    status?: ETaskItemStatus;
  } | undefined);
}

export class ScheduledTasks {

  private timeId: number;
  private taskList: ITaskItem[];

  constructor() {
    this.taskList = [];
    this.timeId = setInterval(() => {
      this.checkAndDoTask();
    }, BASE_TIME_MS) as unknown as number;
  }

  // 添加任务
  addTask(task: ITaskItem) {
    this.taskList.push({
      ...task,
      status: ETaskItemStatus.IMPLEMENTING
    });
    return this;
  }

  // 检查当前时间是否需要执行任务
  checkAndDoTask() {
    const currentTime = Date.now();
    for (const task of this.taskList) {
      if ((!task.lastImplement || (currentTime - task.lastImplement) >= task.intervalMs) && (task.status === ETaskItemStatus.IMPLEMENTING)) {
        // 满足执行条件，执行任务
        const doRes = task.fn();
        if (doRes?.status) task.status = doRes?.status;
        task.lastImplement = currentTime;
      }
    }
  }
}