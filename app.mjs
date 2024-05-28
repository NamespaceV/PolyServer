console.log("starting poly-server")

import _ from "lodash";
import express from "express";
import { subMinutes } from 'date-fns'

import {html} from "./site.mjs"

const app = express();
const port = process.env.PORT || 3001;

let servers = []

function clearOldServers(){
  servers = servers.filter(s =>
      new Date(s.timestamp) > subMinutes(new Date(), 30))
}

app.use(express.json());

app.get("/", (req, res) => res.type('html').send(html));
app.get("/polyspear/servers", (req, res) => {
  clearOldServers();
  res.type('json').send(servers);
});
app.post("/polyspear/servers", (req, res) => {
  let new_server = _.pick(req.body, ["login", "address", "port", "description"]);
  new_server.timestamp = new Date().toISOString()
  servers.push(new_server)
  res.type('json').send({message:"OK"})
});
app.delete("/polyspear/servers/:login", (req, res) => {
  servers = servers.filter(s => s.login != req.params.login)
  res.type('json').send({message:"OK"})
});

const server = app.listen(port, () => console.log(`Example app listening on port ${port}!`));

server.keepAliveTimeout = 120 * 1000;
server.headersTimeout = 120 * 1000;
