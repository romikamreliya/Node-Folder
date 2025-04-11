const cron = require("cron");
const Logs = require("../Utils/logs");

class TestCron {
  
  constructor() {
    this.name = "testCron";
    this.schedule = "* * * * * *";
    this.timeZone = 'Asia/Kolkata';
    this.cronRun;
  }

  datetimeExpression = (datetime = new Date()) => {
    try {
        const d = new Date(new Date(datetime).getTime() + 5000);
        return `${d.getSeconds()} ${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`;
    } catch (error) {
        const d = new Date(new Date().getTime() + 5000);
        return `${d.getSeconds()} ${d.getMinutes()} ${d.getHours()} ${d.getDate()} ${d.getMonth() + 1} *`;
    }
  }

  cronTask = async () => {
    try {
      console.log("CronTask");
    } catch (error) {
      Logs.createLog(error, this.name);
    }
  };

  cronComplete = () => {
    Logs.CreateLog(`Cron Completed :- ${new Date()}`, this.name);
  }

  nextCall = (next = 1) => {
    return this.cronRun.nextDates(next);
  } 

  cronStatus = () => {
    return this.cronRun.running?"running":"stopped";
  }

  Run = () => {

    this.cronRun = cron.CronJob.from({
      cronTime: this.schedule,
      onTick: this.cronTask,
      onComplete: this.cronComplete,
      name: this.name,
      start: true,
      timeZone: this.timeZone
    });

  };

}
module.exports = new TestCron();
