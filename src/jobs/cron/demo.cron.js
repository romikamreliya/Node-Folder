const cron = require("cron");
const loggerUtil = require("../../common/utils/logger.util");
const Constants = require("../../common/utils/constants");

class DemoCron {
  constructor() {
    this.name = "demoCron";
    // this.schedule = "*/2 * * * * *";
    this.schedule = this.datetimeExpression();
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

  async executeTask() {
    try {
      console.log(`CronTask ${new Date()}`);

      this.cronRun.stop();
    } catch (error) {
      loggerUtil.createLog({ msg: error, name: this.name });
    }
  }

  async cronComplete() {
    this.schedule = this.datetimeExpression();
    this.run();

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
module.exports = new DemoCron();
