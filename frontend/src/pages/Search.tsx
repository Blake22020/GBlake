import { useSearchParams } from "react-router-dom";
import LoginNavbarHeader from "../layouts/loginNavbarHeader";
import MainNavbarHeader from "../layouts/mainNavbarHeader";

function Search() {
	const [searchParams] =useSearchParams();
	const query = searchParams.get('q');

	return (
		<div className="Search">
			{localStorage.getItem('token') ? <LoginNavbarHeader /> : <MainNavbarHeader />}
		</div>
	)
}

export default Search;	