/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect } from "react";
import {Observable} from "rxjs";



export function useObservable(params: {
	setter: (e: unknown)=> void;
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