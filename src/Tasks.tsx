import { memo, useReducer } from "react";
import type { Store } from "./store";
import { makeStyles } from "./theme";
import { useObservable } from "./tools/useObservable"
import { Task } from "./Task";


type TasksProps = Pick<Store,
	"tasks" |
	"tasksObserver" |
	"deleteTask" |
	"taskObserver" |
	"toggleSelect" |
	"toggleComplete"
> & {
	className?: string;
};

export const Tasks = memo((props: TasksProps) => {

	const {
		tasks,
		tasksObserver,
		deleteTask,
		className,
		taskObserver,
		toggleSelect,
		toggleComplete,
	} = props;

	const [, forceUpdate] = useReducer(x => x + 1, 0);

	useObservable({
		"observable": tasksObserver,
		"setter": forceUpdate
	})

	const { classes, cx } = useStyles();

	return <div className={cx(classes.root, className)}>
		{
			tasks.map(task =>
				<Task
					toggleComplete={toggleComplete}
					taskObserver={taskObserver}
					toggleSelect={toggleSelect}
					deleteTask={deleteTask}
					{...task}
					key={task.id}
				/>
			).reverse()
		}
	</div>


});

const useStyles = makeStyles()(
	theme => ({
		"root": {
			"width": "100%",
			...theme.spacing.rightLeft("padding", `${theme.spacing(5)}px`),
			"display": "flex",
			"alignItems": "center",
			"flexDirection": "column"
		}
	})
)




