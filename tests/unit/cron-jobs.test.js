const cronModulePath = "../../src/jobs/cron";
const loggerModulePath = "../../src/common/utils/logger.util";

function loadCronJob(moduleName) {
  jest.resetModules();

  const mockLoggerError = jest.fn();

  jest.doMock("cron", () => ({
    CronJob: {
      from: jest.fn((config) => ({
        ...config,
        running: true,
        nextDates: jest.fn(),
        stop: jest.fn(),
      })),
    },
  }));

  jest.doMock(loggerModulePath, () => ({
    getLogger: jest.fn(() => ({ error: mockLoggerError })),
    createLog: jest.fn(),
  }));

  const cron = require("cron");
  const cronJob = require(`${cronModulePath}/${moduleName}`);

  return {
    cron,
    cronJob,
    mockLoggerError,
  };
}

describe("cron job onTick wrappers", () => {
  it.each([
    ["demo.cron", "demoCron"],
    ["test.cron", "testCron"],
  ])("logs thrown tick errors for %s", async (moduleName, cronName) => {
    const { cron, cronJob, mockLoggerError } = loadCronJob(moduleName);
    const expectedError = new Error(`${cronName} failed`);

    jest.spyOn(cronJob, "executeTask").mockImplementation(() => {
      throw expectedError;
    });

    cronJob.run();
    const onTick = cron.CronJob.from.mock.calls[0][0].onTick;

    await onTick();

    expect(mockLoggerError).toHaveBeenCalledWith(
      `${cronName} onTick failed`,
      expect.objectContaining({
        cronName,
        schedule: cronJob.schedule,
        timeZone: cronJob.timeZone,
        error: expectedError.message,
        stack: expectedError.stack,
      }),
    );
  });

  it.each([
    ["demo.cron", "demoCron"],
    ["test.cron", "testCron"],
  ])("logs rejected tick errors for %s", async (moduleName, cronName) => {
    const { cron, cronJob, mockLoggerError } = loadCronJob(moduleName);
    const expectedError = new Error(`${cronName} rejected`);

    jest.spyOn(cronJob, "executeTask").mockRejectedValue(expectedError);

    cronJob.run();
    const onTick = cron.CronJob.from.mock.calls[0][0].onTick;

    await onTick();

    expect(mockLoggerError).toHaveBeenCalledWith(
      `${cronName} onTick failed`,
      expect.objectContaining({
        cronName,
        schedule: cronJob.schedule,
        timeZone: cronJob.timeZone,
        error: expectedError.message,
        stack: expectedError.stack,
      }),
    );
  });
});
