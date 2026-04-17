const cron = require("cron");
const loggerUtil = require("../../common/utils/logger.util");
const Constants = require("../../common/utils/constants");

class TestCron {
  constructor() {
    this.name = "testCron";
    this.schedule = "* * * * * *";
    this.timeZone = Constants.cron.defaultTimezone;
    this.cronRun;
  }

  datetimeExpression(datetime = new Date()) {
    try {
      const d = new Date(new Date(datetime).getTime() + Constants.cron.scheduleOffsetMs);
      return `${d.getSeconds()} ${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`;
    } catch (error) {
      const d = new Date(new Date().getTime() + Constants.cron.scheduleOffsetMs);
      return `${d.getSeconds()} ${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`;
    }
  }

  executeTask() {
    try {
      console.log("CronTask");
    } catch (error) {
      loggerUtil.createLog({ msg: error, name: this.name });
    }
  }

  cronComplete() {
    loggerUtil.createLog({
      msg: `Cron Completed :- ${new Date()}`,
      name: this.name,
    });
  }

  nextCall(next = 1) {
    return this.cronRun.nextDates(next);
  }

  cronStatus() {
    return this.cronRun.running ? "running" : "stopped";
  }

  run() {
    this.cronRun = cron.CronJob.from({
      cronTime: this.schedule,
      onTick: this.executeTask,
      onComplete: this.cronComplete,
      name: this.name,
      start: true,
      timeZone: this.timeZone,
    });
  }
}
module.exports = new TestCron();
