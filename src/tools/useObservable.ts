import { useEffect } from "react";
import { Observable } from "rxjs"



export function useObservable(
	params: {
		observable: Observable<unknown>,
		setter: React.Dispatch<React.SetStateAction<any>> |
			React.DispatchWithoutAction
	}
) {
	const { observable, setter } = params;
	useEffect(() => {
		const subscription = observable.subscribe(e => {
			setter(e);
		})

		return () => subscription.unsubscribe();

	}, [observable, setter])
};