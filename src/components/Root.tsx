import React, { useContext, useEffect } from "react";
import { Header } from "./header/Header";
import { useNavigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthProvider";
import { LoginPage } from "../pages/login/LoginPage";
import { WelcomePage } from "../pages/welcomePage/WelcomePage";

export default function Root() {
	return (
		<>
			<Header />
			<main>
				<Outlet />
			</main>
		</>
	);
}
