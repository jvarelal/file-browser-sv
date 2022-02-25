const app = require("./app")

app.listen(app.get("port"), () => {
	console.log(`File Browser running ${app.get("port")}`)
})