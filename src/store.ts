import { BehaviorSubject } from "rxjs";

export type Task = {
  description: string;
  id: number;
}

export type Store = {
  tasks: Task[];
  newTask$: BehaviorSubject<string>;
  newTask: (description: string) => Promise<void>;
}

export async function getStore(): Promise<Store> {
  const tasks: Task[] = [];

  const getId = ((i: number) => {
    return () => {
      return i++;
    }
  })(0)

  async function simulateDelay() {
    return new Promise<void>(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000)));
  }

  const store: Store = {
    tasks,
    "newTask": async description => {
      await simulateDelay();
      tasks.push({
        description,
        "id": getId()
      })
    },
    "newTask$": new BehaviorSubject("")
  };
  await simulateDelay();

  return store;

}