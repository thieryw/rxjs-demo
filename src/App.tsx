/* eslint-disable react-hooks/exhaustive-deps */
import {memo, useState} from "react";
import { useConstCallback } from "powerhooks";
import type { Store } from "./store";
import MuiTextField from "@mui/material/TextField";
import { Tasks } from "./components/Tasks";
import { makeStyles, Text } from "./theme";



export const App = memo((props: Store) => {

	const { tasks, newTask$, newTask } = props;

	const [textInput, setTextInput] = useState("");

	const handleChange = useConstCallback((e: React.ChangeEvent<HTMLInputElement>) => {
		setTextInput(e.target.value);
	});

	const handleSubmit = useConstCallback((e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		newTask$.next(textInput);
		setTextInput("");
	});


	const { classes } = useStyles();

	return <div className={classes.root}>
		<Text className={classes.title} typo="page heading">Rxjs Todo List</Text>

		<form className={classes.form} onSubmit={handleSubmit}>
			<MuiTextField
				variant="outlined"
				type="text"
				onChange={handleChange}
				value={textInput}
			/>
		</form>

		<Tasks 
			newTask$={newTask$} 
			newTask={newTask} 
			tasks={tasks}
		/>
	</div>

})

const useStyles = makeStyles()(
	theme => ({
		"root": {
			...theme.spacing.rightLeft("padding", `${theme.spacing(6)}px`),
			"display": "flex",
			"flexDirection": "column",
			"alignItems": "center"
		},
		"title": {
			"marginTop": theme.spacing(6)
		},
		"form": {
			...theme.spacing.topBottom("margin", `${theme.spacing(6)}px`)
		}
	})
)