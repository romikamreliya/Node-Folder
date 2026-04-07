const cron = require("cron");
const loggerUtils = require("../utils/logger.utils");

class demoCron {
  
  constructor() {
    this.name = "demoCron";
    // this.schedule = "*/2 * * * * *";
    this.schedule = this.datetimeExpression();
    this.timeZone = 'Asia/Kolkata';
    this.cronRun;
  }

  datetimeExpression(datetime = new Date()) {
    try {
        const d = new Date(new Date(datetime).getTime() + 5000);
        return `${d.getSeconds()} ${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`;
    } catch (error) {
        const d = new Date(new Date().getTime() + 5000);
        return `${d.getSeconds()} ${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`;
    }
  }

  async executeTask() {
    try {

        console.log(`CronTask ${new Date()}`);

        this.cronRun.stop();

    } catch (error) {
      loggerUtils.createLog(error, this.name);
    }
  };

  async cronComplete() {
    
    this.schedule = this.datetimeExpression();
    this.Run();

    loggerUtils.createLog(`Cron Completed :- ${new Date()}`, this.name);
  }

  nextCall(next = 1) {
    return this.cronRun.nextDates(next);
  }
  
  cronStatus() {
    return this.cronRun.running?"running":"stopped";
  }

  Run() {
    this.cronRun = cron.CronJob.from({
      cronTime: this.schedule,
      onTick: this.executeTask,
      onComplete: this.cronComplete,
      name: this.name,
      start: true,
      timeZone: this.timeZone
    });
  };

}
module.exports = new demoCron();
