import { createThemeProvider } from "onyxia-ui";
import { useStyles } from "onyxia-ui/lib/ThemeProvider";
import { createMakeStyles } from "tss-react/compat";
import { createText } from "onyxia-ui/Text";
export { breakpointsValues } from "onyxia-ui/lib/breakpoints"




export const { ThemeProvider } = createThemeProvider({});

export function useTheme() {
	const { theme } = useStyles();

	return theme;
}

export const { makeStyles } = createMakeStyles({ useTheme });

export const { Text } = createText({ useTheme });