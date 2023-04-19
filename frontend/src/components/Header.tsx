import React, { useContext, useEffect } from "react";
import LogoutButton from "./LogOutButton";
import { AuthContext } from "../contexts/AuthProvider";
import { Link, BrowserRouter as Router, Route } from "react-router-dom";

export const Header: React.FC<{}> = () => {
	const { username, isLoggedIn } = useContext(AuthContext);

	useEffect(() => {
		if (username) {
			console.log(`${username} is logged in`);
		}
	}, [isLoggedIn]);

	return (
		<div className="header">
			<Link to="/workouts">
				<h1>Workout Buddy</h1>
			</Link>
			<div className="account">
				{isLoggedIn && (
					<>
						<Link to="/createUsername">
							{!username ? "Create Username" : username}
						</Link>
						<LogoutButton />
					</>
				)}
			</div>
		</div>
	);
};
