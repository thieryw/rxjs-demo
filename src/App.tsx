import { memo, useState, useEffect } from "react";
import { from, BehaviorSubject, filter, debounceTime, distinctUntilChanged, mergeMap } from "rxjs"
import { useConstCallback } from "powerhooks/useConstCallback";
import type {Observable} from "rxjs";


async function getPokemonByName(name: string) {

	const { results: allPokemons } = await fetch(
		"https://pokeapi.co/api/v2/pokemon/?limit=1000"
	).then(res => res.json());

	return allPokemons.filter(
		(pokemon: { name: string; }
	) => pokemon.name.startsWith(name));

};

const searchSubject = new BehaviorSubject("");

const searchResultObservable = searchSubject.pipe(
	filter(val => val.length > 1),
	debounceTime(700),
	distinctUntilChanged(),
	mergeMap(val => from(getPokemonByName(val)))
)

function useObservable(
	params: {
		observable: Observable<unknown>, 
		setter: React.Dispatch<React.SetStateAction<any>>
	}
){
	const {observable, setter} = params;
	useEffect(()=>{
		const subscription = observable.subscribe(e => {
			setter(e);
		})

		return () => subscription.unsubscribe();

	},[observable, setter])
};


export const App = memo(() => {

	const [search, setSearch] = useState("");
	const [results, setResults] = useState<{name: string; url: string}[]>([]);


	const onChange = useConstCallback(async (
		e: React.ChangeEvent<HTMLInputElement>
	)=>{
		setSearch(e.target.value);
		searchSubject.next(e.target.value)
	})

	const onSubmit = useConstCallback((
		e: React.FormEvent<HTMLFormElement>
	)=>{

		e.preventDefault();
	})

	useObservable({
		"observable": searchResultObservable,
		"setter": setResults
	})

	return <div>
		<form onSubmit={onSubmit}>
			<input value={search} onChange={onChange} type="text" />
		</form>
		{
			results.map(({name, url}) => <div style={{
				"paddingBottom": 40
			}} key={name}>
				<p>NAME: {name}</p>
				<p>URL: <a href={url}>{url}</a></p>
			</div>)

		}
	</div>
});