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
import * as hyper from "./hyper" 

import * as log from "beautiful-log"
import * as process from "process"
import * as schedule from "node-schedule"

let handle = hyper.handler as hyper.methods

const ayla     = new aylaT();
const particle = particleT(nconf.get("PARTICLE_USER"), nconf.get("PARTICLE_PASS"));

let aylaAuth: string = null

let renew = () =>
	ayla.renew().then((d) => aylaAuth = d)

schedule.scheduleJob('0 0 4 * * *', renew)
renew()


delay(() => "boo", 12)


handle.POST("/lights/on", () => ayla.setState(aylaAuth, true))
handle.POST("/lights/off", () => ayla.setState(aylaAuth, false))
handle.POST("/lights/trigger", () => ayla.trigger(aylaAuth))

handle['GET']("/lights/trigger", () => ayla.trigger(aylaAuth))

dash("a0:02:dc:3a:1c:ec", "ON", () => ayla.trigger(aylaAuth));
dash("44:65:0d:c5:6d:5f", "All", cast("doorbell.mp3", "audio/mp3", .75, 12000), particle("1f0039001047343339383037", "setPattern", "flash"), delay(particle("1f0039001047343339383037", "setPattern", "last"), 12000));
