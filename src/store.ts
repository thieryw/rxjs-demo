import { Subject } from "rxjs";
import { flip } from "tsafe";


export type Task = {
	description: string;
	id: string;
	isCompleted: boolean;
	isSelected: boolean;
};

export type Store = {
	tasks: Task[];
	newTask: (taskDescription: string) => Promise<void>;
	deleteTask: (taskId: string) => Promise<void>;
	toggleSelect: (taskId: string) => Promise<void>;
	unSelectSelectedTasks: (tasks: Task[]) => Promise<void>;
	deleteSelectedTasks: (tasks: Task[]) => Promise<void>;
	toggleComplete: (taskId: string) => Promise<void>;
	completeSelectedTasks: (tasks: Task[]) => Promise<void>;
	unCompleteSelectedTasks: (tasks: Task[]) => Promise<void>;
	deleteCompletedTasks: (tasks: Task[]) => Promise<void>;
	tasksObserver: Subject<Task[] | undefined>;
	taskObserver: Subject<Task & { action: "select" | "complete" }>;

};


export async function getStore(): Promise<Store> {
	const tasks: Task[] = [];

	await simulateDelay();

	const store: Store = {
		tasks,
		"newTask": async description => {

			const newTask: Task = {
				"description": "",
				"id": generateId(),
				"isCompleted": false,
				"isSelected": false
			};

			tasks.push(newTask);

			await simulateDelay();

			newTask.description = description;

			store.tasksObserver.next(tasks);
		},
		"deleteTask": async taskId => {
			await simulateDelay();
			tasks.splice(findTaskIndexFromId(taskId, tasks), 1);
			store.tasksObserver.next(tasks);
		},
		"toggleSelect": async taskId => {
			await simulateDelay();
			const index = findTaskIndexFromId(taskId, tasks);
			flip(tasks[index], "isSelected");
			store.taskObserver.next({ ...tasks[index], "action": "select" });
		},
		"unSelectSelectedTasks": async tasks => {
			const selectedTasks = tasks.filter(({ isSelected }) => isSelected);

			selectedTasks.forEach(({ id }) => {
				store.toggleSelect(id);
			});
		},
		"deleteSelectedTasks": async tasks => {
			const selectedTasks = tasks.filter(({ isSelected }) => isSelected);

			selectedTasks.forEach(({ id }) => {
				store.deleteTask(id);
			})

		},
		"toggleComplete": async taskId => {
			await simulateDelay();
			const index = findTaskIndexFromId(taskId, tasks);
			flip(tasks[index], "isCompleted");
			store.taskObserver.next({ ...tasks[index], "action": "complete" });

		},
		"completeSelectedTasks": async tasks => {
			await simulateDelay();
			const selectedTasks = tasks.filter(
				({ isSelected, isCompleted }) =>
					isSelected && !isCompleted
			);

			selectedTasks.forEach(({ id }) => {
				store.toggleComplete(id);
			});
		},
		"deleteCompletedTasks": async tasks => {
			await simulateDelay();
			const completedTasks = tasks.filter(
				({ isCompleted }) => isCompleted
			);

			completedTasks.forEach(({ id }) => {
				store.deleteTask(id);
			});
		},
		"unCompleteSelectedTasks": async tasks => {
			await simulateDelay();
			const selectedTasks = tasks.filter(
				({ isSelected, isCompleted }) => isSelected && isCompleted
			)

			selectedTasks.forEach(({ id }) => {
				store.toggleComplete(id);
			})
		},
		"tasksObserver": new Subject(),
		"taskObserver": new Subject()

	}

	return store;

}

async function simulateDelay() {
	await new Promise<void>(resolve => setTimeout(resolve, Math.floor(Math.random() * 1000)));
}

function generateId(): string {
	const charsToChooseFrom = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz123456789&é\"'(-è_çà)=$^*ù!:;,"
	const out: string[] = []

	for (let i = 0; i < charsToChooseFrom.length; i++) {
		out.push(charsToChooseFrom[Math.floor(Math.random() * charsToChooseFrom.length)]);
	};

	return out.join("");

}

function findTaskIndexFromId(taskId: string, tasks: Task[]) {
	return tasks.findIndex(({ id }) => id === taskId);
}
