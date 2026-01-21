import { CronJob } from "cron";
import http from "http";
import { env } from "../config/env";
const job = new CronJob("*/14 * * * *", function () {
  http
    .get(env.API_URL, (res) => {
      if (res.statusCode === 200) {
        console.log("Cron request sent");
      } else {
        console.log("Cron request failed");
      }
    })
    .on("error", (e) => {
      console.error(`Error while sending cron request:\n\t${e}`);
    });
});

export default job;
