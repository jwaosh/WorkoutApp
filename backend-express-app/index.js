const { createClient } = require("@supabase/supabase-js");
const cookieParser = require("cookie-parser");
const express = require("express");
const path = require("path");
const env = require("dotenv");
const cors = require("cors");

env.config();

const supabase = createClient(
	process.env.SUPABASE_URL,
	process.env.SUPABASE_ANON_KEY,
	{
		auth: {
			autoRefreshToken: false,
			persistSession: false,
			detectSessionInUrl: false,
		},
	}
);

const app = express();
const port = process.env.PORT || 8000;
//const workoutsRouter = require("./routes/workouts");

const router1 = express.Router();

//MIDDLEWARES
const setTokens = async function (req, res, next) {
	const refreshToken = req.cookies.my_refresh_token; // do not just use req.cookies, turn into bearer tokens
	const accessToken = req.cookies.my_access_token;
	if (refreshToken && accessToken) {
		await supabase.auth.setSession({
			refresh_token: refreshToken,
			access_token: accessToken,
		});
		console.log("ref", refreshToken);
		console.log("acc", accessToken);
	} else {
		// make sure you handle this case!
		throw new Error("User is not authenticated.");
	}
	next();
};

const setResHeaders = (req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", process.env.ADDRESS);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	next();
};

// app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(cors());
app.use(cookieParser());
app.use("/workouts", router1);
// app.use("/workouts", workoutsRouter);

// ROUTES

app.get("/", (req, res) => {
	res.send("Hello World!");
});

app.get("/cats", (req, res) => {
	res.send({ name: "catchy" });
});

router1.get("/", setTokens, setResHeaders, async (req, res) => {
	const { data, error } = await supabase.from("workouts").select("name,url");
	if (error) {
		console.error(error);
		return;
	}
	res.send(data);
});

router1.get("/:workoutUrl", setTokens, setResHeaders, async (req, res) => {
	const workoutUrl = req.params.workoutUrl;
	const { data, error } = await supabase
		.from("workouts")
		.select("name, url, id, last_performed, exercises(name, id)")
		.eq("url", workoutUrl)
		.single(); // get single row as object instead of arr
	console.log("dad", data); // show in terminal
	res.send(data);
});

// app.get("/workouts", async (req, res) => {
// 	const response = await fetch(
// 		"https://pogoapi.net/api/v1/raid_exclusive_pokemon.json"
// 	);
// 	const body = await response.text();
// 	res.send(body);
// });

app.get("/exercises", async (req, res) => {
	let { data: exercises, error } = await supabase
		.from("exercises")
		.select("name");
	console.log(exercises);
	res.send(exercises);
});

// app.use("/workouts", workoutsRouter);

app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log(`App listening at http://localhost:${port}`);
});

/// AAAHH so to pass cookies to the server, you need to include {credentials= "include"} in the
