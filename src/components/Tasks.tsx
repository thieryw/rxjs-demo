import { memo, useReducer } from "react";
import { Task } from "./Task";
import { Store } from "../store";
import { useObservable } from "../tools/useObservable";
import { concatMap, from } from "rxjs";
import { makeStyles, breakpointsValues } from "../theme";

export type TasksProps = Pick<Store, "tasks" | "newTask$" | "newTask">;

export const Tasks = memo((props: TasksProps) => {

	const { tasks, newTask, newTask$ } = props;
	const [, forceUpdate] = useReducer(x => x + 1, 0);


	useObservable({
		"observable": newTask$.pipe(
			concatMap(description => from(newTask(description)))
		),
		"setter": () => forceUpdate()
	})

	const {classes} = useStyles();


	return <div className={classes.root}>
		{
			tasks.map(({ description, id }) => <Task
				description={description}
				key={id}
			/>).reverse()
		}
	</div>
})

const useStyles = makeStyles()(
	theme => ({
		"root": {
			...(theme.windowInnerWidth > breakpointsValues.md ? {
				"width": 900
			}: {
				"width": "100%"
			})
		}
	})
)