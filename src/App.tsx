import {memo, useState} from "react";
import type { Store } from "./store"
import { useConstCallback } from "powerhooks/useConstCallback";
import { Tasks } from "./Tasks";
import { makeStyles } from "./theme";
import {Text} from "./theme";
import MuiTextField from "@mui/material/TextField";
import MuiButton from "@mui/material/Button";
import { useObservable } from "./tools/useObservable";
import {map} from "rxjs";

export const App = memo((props: Store) => {

	const {
		tasks,
		newTask,
		taskObserver,
		tasksObserver,
		deleteTask,
		toggleSelect,
		unSelectSelectedTasks,
		deleteSelectedTasks,
		toggleComplete,
		completeSelectedTasks,
		deleteCompletedTasks,
		unCompleteSelectedTasks
	} = props;

	const [formData, setFormData] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const onChange = useConstCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData(e.target.value)
	});

	const onSubmit = useConstCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setIsLoading(true);
		setFormData("");
		newTask(formData);
	});

	useObservable({
		"observable": tasksObserver.pipe(
			map(() => false)
		),
		"setter": setIsLoading
	});

	const handleUnSelectSelectedTasks = useConstCallback(() => {
		unSelectSelectedTasks(tasks);
	});

	const handleDeleteSelectedTasks = useConstCallback(() => {
		deleteSelectedTasks(tasks);
	});

	const handleCompleteSelectedTasks = useConstCallback(() => {
		completeSelectedTasks(tasks);
	});

	const handleDeleteCompletedTasks = useConstCallback(() => {
		deleteCompletedTasks(tasks);
	});

	const handleUnCompleteSelectedTasks = useConstCallback(() => {
		unCompleteSelectedTasks(tasks);
	})

	const { classes } = useStyles();

	return <div className={classes.root}>
		<Text
			className={classes.title}
			typo="display heading"
		>
			To do list with RXJS
		</Text>

		<form onSubmit={onSubmit}>
			<MuiTextField
				variant="filled"
				type="text"
				value={formData}
				onChange={onChange}
			/>
		</form>

		<div className={classes.buttons}>
			{
				[
					{
						"onClick": handleUnSelectSelectedTasks,
						"label": "Clear tasks"
					},
					{
						"onClick": handleDeleteSelectedTasks,
						"label": "Delete selected tasks"
					},
					{
						"onClick": handleUnCompleteSelectedTasks,
						"label": "Un complete selected tasks"
					},
					{
						"onClick": handleCompleteSelectedTasks,
						"label": "Complete selected tasks"
					},
					{
						"onClick": handleDeleteCompletedTasks,
						"label": "Delete completed tasks"
					},
				].map(({ label, onClick }) =>
					<MuiButton className={classes.button} key={label} variant="outlined" onClick={onClick}>
						{label}
					</MuiButton>
				)
			}
		</div>
		{
			isLoading ? 
			<Text typo="object heading">Loading...</Text> :
			undefined
		}

		<Tasks
			toggleComplete={toggleComplete}
			className={classes.tasks}
			deleteTask={deleteTask}
			tasksObserver={tasksObserver}
			tasks={tasks}
			taskObserver={taskObserver}
			toggleSelect={toggleSelect}
		/>

	</div>
});


const useStyles = makeStyles()(
	theme => ({
		"root": {
			"display": "flex",
			"flexDirection": "column",
			"alignItems": "center",
			"position": "relative"
		},
		"title": {
			...theme.spacing.topBottom("margin", `${theme.spacing(6)}px`)
		},
		"tasks": {
			"marginTop": theme.spacing(7),
		},
		"buttons": {
			"marginTop": theme.spacing(6),
			"display": "flex",
			"alignItems": "center",
			"flexWrap": "wrap",
			"justifyContent": "center"


		},
		"button": {
			"margin": theme.spacing(2)

		}

	})
);

