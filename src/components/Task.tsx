import { memo } from "react";
import type { Task as TaskType } from "../store";
import { Text, makeStyles } from "../theme";


export type TaskProps = Pick<TaskType, "description">;

export const Task = memo((props: TaskProps) => {
	const { description } = props;

	const {classes} = useStyles();

	return <div className={classes.root}>
		<Text typo="body 1">{description}</Text>
	</div>
});



const useStyles = makeStyles()(
	theme => ({
		"root": {
			"display": "flex",
			"justifyContent": "space-between",
			"alignItems": "center",
			"backgroundColor": theme.colors.useCases.surfaces.surface1,
			"padding": theme.spacing({
				"rightLeft": `${theme.spacing(3)}px`,
				"topBottom": `${theme.spacing(4)}px`,
			}),
			...theme.spacing.topBottom("margin", `${theme.spacing(3)}px`)
		}

	})
)

