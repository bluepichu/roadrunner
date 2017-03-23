/********************************
 *
 * RoadRunner for Raspberry Pi
 *
 * Matthew Savage and Zach Wade
 *
 ********************************/

import * as nconf from "nconf"

nconf.argv().env();

import dash from "./dash"
import aylaT from "./ayla"
import cast from "./cast"
import particleT from "./particle"
import delay from "./delay"
import app from "./hyper"
import door, { setAuthHooks } from "./door";
import tts from "./tts";

import * as log from "beautiful-log"
import * as process from "process"
import * as schedule from "node-schedule"

const ayla     = new aylaT();
const particle = particleT(nconf.get("PARTICLE_USER"), nconf.get("PARTICLE_PASS"));

let aylaAuth: string = null

let renew = () =>
	ayla.renew().then((d) => aylaAuth = d)

schedule.scheduleJob('0 0 4 * * *', renew)
renew()

app.post("/lights/on", (req, res) => { ayla.setState(aylaAuth, true); res.status(200).send("Ok"); })
app.post("/lights/off", (req, res) => { ayla.setState(aylaAuth, false); res.status(200).send("Ok"); })
app.post("/lights/trigger", (req, res) => { ayla.trigger(aylaAuth); res.status(200).send("Ok"); })
app.get("/lights/trigger", (req, res) => { ayla.trigger(aylaAuth); res.status(200).send("Ok"); })

setAuthHooks(app);

dash("a0:02:dc:3a:1c:ec", "ON", () => ayla.trigger(aylaAuth));
dash("44:65:0d:c5:6d:5f", "All", cast("doorbell.mp3", "audio/mp3", .75, 12000), particle("1f0039001047343339383037", "setPattern", "flash"), delay(particle("1f0039001047343339383037", "setPattern", "last"), 12000));
dash("f0:27:2d:bb:21:9d", "Gatorade", () => door(51022800).then((code) => tts(code.split("").join(" "), 0)).then((url) => {console.log(url); cast(url, "audio/mp3", .75, 12000)()}));