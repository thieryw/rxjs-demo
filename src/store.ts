import { ReplaySubject } from "rxjs";

export type Task = {
  description: string;
  id: string;
}

export type Store = {
  tasks: Task[];
  newTask$: ReplaySubject<string>;
  newTask: (description: string) => Promise<void>;
}

function generateId(): string{
  const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ&é\"'(-è_çà)=";
  const out: string[] = [];

  for(let i = 0; i < alphabet.length; i++){
    out.push(alphabet[Math.floor(Math.random() * alphabet.length)]);
  };
  return out.join("");
}

export async function getStore(): Promise<Store> {
  const tasks: Task[] = [];

  async function simulateDelay() {
    return new Promise<void>(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000)));
  }

  const store: Store = {
    tasks,
    "newTask": async description => {
      await simulateDelay();
      tasks.push({
        description,
        "id": generateId()
      })
    },
    "newTask$": new ReplaySubject()
  };
  await simulateDelay();

  return store;

}