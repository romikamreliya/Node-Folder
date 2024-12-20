const cron = require("cron");
const Logs = require("../Utils/logs");

class TestCron {
  
  constructor() {
    this.name = "testcron";
    this.schedule = "* * * * * *";
    this.timeZone = 'Asia/Kolkata';
    this.cronrun;
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

  crontask = async () => {
    try {
      console.log("CronTask");
    } catch (error) {
      Logs.CreateLog(error, "Test - Cron");
    }
  };

  croncomplete = () => {
    Logs.CreateLog(`Cron Completed :- ${new Date()}`, "Test - Cron");
  }

  nextcall = (next = 1) => {
    return this.cronrun.nextDates(next);
  } 

  cronStastus = () => {
    return this.cronrun.running?"running":"stopped";
  }

  Run = () => {

    this.cronrun = cron.CronJob.from({
      cronTime: this.schedule,
      onTick: this.crontask,
      onComplete: this.croncomplete,
      name: this.name,
      start: true,
      timeZone: this.timeZone
    });

  };

}
module.exports = new TestCron();
