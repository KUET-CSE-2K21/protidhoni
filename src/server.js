import express from 'express'
let server = express()
server.all("*", async (req, res) => {
	res.send("Okay!")
})
export default server;