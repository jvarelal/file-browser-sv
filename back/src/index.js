import app from "./app";
import "./database";

// Server is listening
app.listen(config.port, () => {
	console.log(`File Browser running ${config.port}`)
})