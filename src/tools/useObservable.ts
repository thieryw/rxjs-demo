/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import {Observable} from "rxjs";



export function useObservable(params: {
	setter: React.Dispatch<React.SetStateAction<any>>;
	observable: Observable<unknown>;
}){
	const {observable, setter} = params;

	useEffect(()=>{
		const subscriber = observable.subscribe(e => {
			setter(e);
		});

		return () => subscriber.unsubscribe();

	},[]);

};