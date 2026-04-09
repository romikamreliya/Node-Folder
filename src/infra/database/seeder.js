require("dotenv").config();
const path = require("path");
const fs = require("fs");
const dbKnex = require("./knex");
const loggerUtil = require("../../common/utils/logger.util");

const SEEDS_DIR = path.join(__dirname, "seeds");

class SeederRunner {
  constructor() {
    this.db = dbKnex;
    this.logger = loggerUtil;
  }

  /**
   * ------------------------------------------------
   * Helper Functions
   * ------------------------------------------------
   */

  messageText = {
    seederCreate: `/**
    * Seeder: {seederName}
    */
    module.exports = {
      tableName: "", // Specify the table name
      seed: async (knex) => {
        // Write seed code here
        // Example:
        // return knex('users').insert([
        //   { name: 'John Doe' },
        //   { name: 'Jane Doe' }
        // ]);
      }
    };`,
  };

  async getSeedFiles() {
    try {
      const files = fs
        .readdirSync(SEEDS_DIR)
        .filter((file) => file.endsWith(".js"))
        .sort();
      return files;
    } catch (error) {
      this.logger.createLog(error, "SeederRunner: getSeedFiles");
      throw new Error(`Failed to read seeds directory: ${error.message}`);
    }
  }

  async tableExists(tableName) {
    try {
      return await this.db.schema.hasTable(tableName);
    } catch (error) {
      return false;
    }
  }

  async clearTable(tableName) {
    try {
      const exists = await this.tableExists(tableName);
      if (!exists) {
        console.log(`⚠️  Table '${tableName}' does not exist`);
        return;
      }

      await this.db(tableName).del();
      console.log(`✅ Cleared: ${tableName}`);
    } catch (error) {
      console.error(`❌ Failed to clear ${tableName}: ${error.message}`);
      this.logger.createLog(error, `Clear table: ${tableName}`);
    }
  }

  /**
   * ------------------------------------------------
   * Seed Command Functions
   * ------------------------------------------------
   */

  async runSeeds() {
    console.log("\n🌱 Starting database seeding...\n");

    try {
      const seedFiles = await this.getSeedFiles();

      if (seedFiles.length === 0) {
        console.log("⚠️  No seed files found");
        return;
      }

      let seedsRun = 0;

      for (const file of seedFiles) {
        const seedName = path.basename(file, ".js");
        const seed = require(path.join(SEEDS_DIR, file));

        try {
          // Check if table exists before seeding
          const seedTableName = seed.tableName || "-";
          const exists = await this.tableExists(seedTableName);

          if (!exists) {
            console.log(
              `⏭️  Skipped: ${seedName} (table '${seedTableName}' does not exist)`,
            );
            continue;
          }

          await seed.seed(this.db);
          console.log(`✅ Seeded: ${seedName}`);
          seedsRun++;
        } catch (error) {
          console.error(`❌ Failed: ${seedName} - ${error.message}`);
          this.logger.createLog(error, `Seed: ${seedName}`);
          throw new Error(`Seed ${seedName} failed: ${error.message}`);
        }
      }

      console.log(
        `\n✨ Seeding completed! (${seedsRun} seed files executed)\n`,
      );
    } catch (error) {
      console.error("\n❌ Seeding failed:", error.message, "\n");
      this.logger.createLog(error, "SeederRunner: runSeeds");
      process.exit(1);
    }
  }

  async runSingleSeed(seedName) {
    console.log(`\n🌱 Running single seed: ${seedName}\n`);

    try {
      const seedFiles = await this.getSeedFiles();

      if (seedFiles.length === 0) {
        console.error("❌ No seed files found");
        process.exit(1);
      }

      // Find seed file matching the name (exact match and not passing .js extension)
      let matchedFile = seedFiles.find((f) => f == `${seedName}.js`);

      if (!matchedFile) {
        console.error(`❌ Seed file not found: ${seedName}`);
        console.log("\nAvailable seed files:");
        seedFiles.forEach((f) => {
          console.log(`  • ${path.basename(f, ".js")}`);
        });
        process.exit(1);
      }

      const seedName_base = path.basename(matchedFile, ".js");
      const seed = require(path.join(SEEDS_DIR, matchedFile));
      const seedTableName = seed.tableName || "";

      // Check if table exists
      const exists = await this.tableExists(seedTableName);
      if (!exists) {
        console.error(`❌ Table '${seedTableName}' does not exist`);
        console.error(`   Please run migrations first: npm run db:migrate`);
        process.exit(1);
      }

      try {
        await seed.seed(this.db);
        console.log(`✅ Seeded: ${seedName_base}\n`);
      } catch (error) {
        console.error(`❌ Failed: ${seedName_base} - ${error.message}\n`);
        this.logger.createLog(error, `Seed: ${seedName_base}`);
        process.exit(1);
      }
    } catch (error) {
      console.error("\n❌ Seeding failed:", error.message, "\n");
      this.logger.createLog(error, "SeederRunner: runSingleSeed");
      process.exit(1);
    }
  }

  async checkOrCreateSeeder(seederName) {
    try {
      const files = await this.getSeedFiles();
      const exists = files.some((f) => path.basename(f, ".js") === seederName);

      if (exists) {
        console.log(`✅ Seeder exists: ${seederName}`);
        return true;
      } else {
        const filePath = path.join(SEEDS_DIR, `${seederName}.js`);
        fs.writeFileSync(
          filePath,
          this.messageText.seederCreate.replaceAll("{seederName}", seederName),
        );
        console.log(`✨ Seeder file created: ${filePath}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error checking/creating seeder:`, error.message);
      this.logger.createLog(error, "SeederRunner: checkOrCreateSeeder ");
      process.exit(1);
    }
  }

  async resetDatabase() {
    console.log("\n🔄 Resetting database...\n");

    try {
      const seedFiles = await this.getSeedFiles();

      for (const file of seedFiles) {
        const seed = require(path.join(SEEDS_DIR, file));
        const tableName = seed.tableName || "";
        await this.clearTable(tableName);
      }

      console.log("\n✨ Database reset completed!\n");
    } catch (error) {
      console.error("\n❌ Reset failed:", error.message, "\n");
      this.logger.createLog(error, "SeederRunner: resetDatabase");
      process.exit(1);
    }
  }
}

// Run if executed directly
if (require.main === module) {
  const runner = new SeederRunner();
  const command = process.argv[2];
  const param = process.argv[3];

  (async () => {
    try {
      if (command === "db:seeder") {
        if (param) {
          await runner.runSingleSeed(param);
        } else {
          await runner.runSeeds();
        }
      } else if (command === "seeder:create") {
        if (!param) {
          console.error("❌ Seeder name is required");
          console.error("Usage: npm run seeder:create <seeder-name>");
          process.exit(1);
        }
        await runner.checkOrCreateSeeder(param);
      } else if (command === "seeder:reset") {
        await runner.resetDatabase();
      }
      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error.message);
      process.exit(1);
    }
  })();
}
