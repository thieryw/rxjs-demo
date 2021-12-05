import { memo, useState, useEffect } from "react";
import type {Store} from "./store";
import {useConstCallback} from "powerhooks/useConstCallback";
import { filter, map } from "rxjs";
import { makeStyles, breakpointsValues, Text } from "./theme";
import MuiDoneIcon from '@mui/icons-material/Done';
import MuiClearIcon from '@mui/icons-material/Clear';


export type TaskProps = Pick<
	Store,
	"deleteTask" |
	"toggleSelect" |
	"toggleComplete" |
	"taskObserver"
> &
	Store["tasks"][number]

export const Task = memo((props: TaskProps) => {

	const {
		description,
		deleteTask,
		id,
		isSelected,
		isCompleted,
		toggleSelect,
		taskObserver,
		toggleComplete
	} = props;


	const [isTaskSelected, setIsTaskSelected] = useState(isSelected);
	const [isTaskCompleted, setIsTaskCompleted] = useState(isCompleted);

	const handleDelete = useConstCallback(
		(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
			deleteTask(id);
			e.stopPropagation();
		})

	const handleToggleSelected = useConstCallback(() => {
		toggleSelect(id);
	});

	const handleToggleComplete = useConstCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>)=>{
		toggleComplete(id);
		e.stopPropagation();
	})


	useEffect(()=>{ 

		const subscription = taskObserver.pipe(
			filter(({ id: taskId }) => taskId === id),
			map(({ isSelected, isCompleted, action }): { value: boolean; action: typeof action } => {
				switch(action){
					case "complete": return {
						"value": isCompleted,
						action
					};
					case "select": return {
						"value": isSelected,
						action
					}
				}
			})
		).subscribe(e => {
			switch(e.action){
				case "complete": setIsTaskCompleted(e.value); break;
				case "select": setIsTaskSelected(e.value); 
			}
		})

		return () => subscription.unsubscribe();

	}, [id, isTaskSelected, taskObserver]);

	const { classes } = useStyles({ isTaskSelected, isTaskCompleted });

	return <div onClick={handleToggleSelected} className={classes.root}>
		<div className={classes.button} onClick={handleToggleComplete}>
			<MuiDoneIcon color={isTaskCompleted ? "success" : "action"} />
		</div>
		<Text className={classes.text} typo="body 1">{description === "" ? "Loading..." : description}</Text>
		<div className={classes.button} onClick={handleDelete}>
			<MuiClearIcon color="action"/>
		</div>

	</div>

})

const useStyles = makeStyles<{ isTaskSelected: boolean; isTaskCompleted: boolean; }>()(
	(theme, { isTaskSelected, isTaskCompleted }) => ({

		"root": {
			"display": "flex",
			"justifyContent": "space-between",
			"position": "relative",
			"alignItems": "center",
			"padding": theme.spacing({
				"rightLeft": `${theme.spacing(1)}px`,
				"topBottom": `${theme.spacing(2)}px`
			}),
			...theme.spacing.topBottom("margin", `${theme.spacing(1)}px`),
			"width": theme.windowInnerWidth >= breakpointsValues.sm ? 400 : "100%",
			"transition": "backgroundColor 400ms",
			"backgroundColor": !isTaskSelected ? theme.colors.useCases.surfaces.surface1 : theme.colors.useCases.surfaces.surface2
		},
		"button": {
			"display": "flex",
			"justifyContent": "center"
		},
		"text": {
			"textDecoration": isTaskCompleted ? "line-through" : undefined
		}
	})
)