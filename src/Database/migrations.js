require("dotenv").config();
const path = require("path");
const fs = require("fs");
const DBknex = require("../common/connection");
const loggerUtils = require("../utils/logger.utils");

const MIGRATIONS_DIR = path.join(__dirname, "migrations_files");

class migrationRunner {
  constructor() {
    this.db = DBknex;
    this.logger = loggerUtils;
  }

  messageText = {
    migrationCreate: `/**
    * Migration: {migrationName}
    */
    module.exports = {
      name: "{migrationName}",
      up: async (knex) => {
        // Write migration up code here
        // Example:
        // return knex.schema.createTable('users', (table) => {
        //   table.increments('id');
        //   table.string('name');
        // });
      },

      down: async (knex) => {
        // Write migration down code here
        // Example:
        // return knex.schema.dropTableIfExists('users');
      }
    };`
  }

  /**
   * ------------------------------------------------
   * Helper Functions
   * ------------------------------------------------
   */
  async getMigrationFiles() {
    try {
      const files = fs.readdirSync(MIGRATIONS_DIR).filter(file => file.endsWith(".js")).sort();
      return files;
    } catch (error) {
      this.logger.createLog(error, "MigrationRunner: getMigrationFiles");
      throw new Error(`Failed to read migrations directory: ${error.message}`);
    }
  }

  async getExecutedMigrations() {
    try {
      const migrations = await this.db("migrations_history").where("status", "success").select("name");
      return migrations.map(m => m.name);
    } catch (error) {
      return [];
    }
  }

  async recordMigration(name, status = "success", errorMessage = null) {
    try {
      const existing = await this.db("migrations_history").where("name", name).first();
      if (existing) {
        await this.db("migrations_history").where("name", name).update({status,error_message: errorMessage,executed_at: this.db.fn.now()});
        return;
      }
      await this.db("migrations_history").insert({name,status,error_message: errorMessage});
    } catch (error) {
      // Silently fail if migrations_history doesn't exist
      console.warn(`Warning: Could not record migration history: ${error.message}`);
    }
  }


  /**
   * ------------------------------------------------
   * Migration Command Functions
   * ------------------------------------------------
   */

  async databaseConnection() {
    try {
      await this.db.raw("SELECT 1+1 AS result");
      return true;
    } catch (error) {
      return false;
    }
  }

  async migrationHistoryTable() {
    try {
      await this.db.schema.hasTable("migrations_history").then(exists => {
        if (!exists) {
          return this.db.schema.createTable("migrations_history", (table) => {
            table.increments("id").primary();
            table.string("name", 255).notNullable().unique();
            table.string("status", 20).defaultTo("success");
            table.text("error_message").nullable();
            table.timestamp("executed_at").defaultTo(this.db.fn.now());
            table.timestamp("rolled_back_at").nullable();
          });
        }
      });
    } catch (error) {
      this.logger.createLog(error, "MigrationRunner: migrations_history");
      console.error("Failed to initialize migrations history table:", error.message);
    }
  }

  async runMigrations() {
    console.log("\n📦 Starting migrations...\n");

    try {
      const migrationFiles = await this.getMigrationFiles();
      const executedMigrations = await this.getExecutedMigrations();

      let migrationsRun = 0;

      for (const file of migrationFiles) {
        const migrationName = path.basename(file, ".js");

        // Skip if already executed
        if (executedMigrations.includes(migrationName)) {
          console.log(`⏭️  Skipped: ${migrationName} (already executed)`);
          continue;
        }

        const migration = require(path.join(MIGRATIONS_DIR, file));

        try {
          await migration.up(this.db);
          await this.recordMigration(migrationName, "success");
          console.log(`✅ Migration: ${migrationName}`);
          migrationsRun++;
        } catch (error) {
          await this.recordMigration(migrationName, "failed", error.message);
          console.error(`❌ Failed: ${migrationName} - ${error.message}`);
          this.logger.createLog(error, `Migration: ${migrationName}`);
          throw new Error(`Migration ${migrationName} failed: ${error.message}`);
        }
      }

      console.log(`\n✨ Migrations completed! (${migrationsRun} new migrations executed)\n`);
    } catch (error) {
      console.error("\n❌ Migration failed:", error.message, "\n");
      this.logger.createLog(error, "MigrationRunner: runMigrations");
      process.exit(1);
    }
  }

  async rollbackAll() {
    console.log("\n🔄 Rolling back all migrations...\n");

    try {
      const executedMigrations = await this.getExecutedMigrations();
      const migrationFiles = await this.getMigrationFiles();

      if (executedMigrations.length === 0) {
        console.log("⏭️  No migrations to rollback\n");
        return;
      }

      // Rollback in reverse order
      for (let i = migrationFiles.length - 1; i >= 0; i--) {
        const file = migrationFiles[i];
        const migrationName = path.basename(file, ".js");

        if (!executedMigrations.includes(migrationName)) {
          console.log(`⏭️  Skipped: ${migrationName} (not executed)`);
          continue;
        }

        const migration = require(path.join(MIGRATIONS_DIR, file));

        if (!migration.down) {
          console.log(`⚠️  Warning: No rollback method for ${migrationName}`);
          continue;
        }

        try {
          await migration.down(this.db);
          await this.db("migrations_history").where("name", migrationName).update({status: "rolled_back",rolled_back_at: this.db.fn.now()});
          console.log(`✅ Rolled back: ${migrationName}`);
        } catch (error) {
          console.error(`❌ Rollback failed: ${migrationName} - ${error.message}`);
          this.logger.createLog(error, `Rollback: ${migrationName}`);
          throw error;
        }
      }

      console.log(`\n✨ All migrations rolled back successfully!\n`);
    } catch (error) {
      console.error("\n❌ Rollback failed:", error.message, "\n");
      this.logger.createLog(error, "MigrationRunner: rollbackAll");
      process.exit(1);
    }
  }

  async checkOrCreateMigration(migrationName) {
    try {
      const files = await this.getMigrationFiles();
      const exists = files.some(f => path.basename(f, ".js") === migrationName);

      if (exists) {
        console.log(`✅ Migration exists: ${migrationName}`);
        return true;
      } else {
        const filePath = path.join(MIGRATIONS_DIR, `${migrationName}.js`);
        fs.writeFileSync(filePath, this.messageText.migrationCreate.replaceAll("{migrationName}", migrationName));
        console.log(`✨ Migration file created: ${filePath}`);
        return false;
      }
    } catch (error) {
      console.error(`❌ Error checking/creating migration:`, error.message);
      this.logger.createLog(error, "MigrationRunner: checkOrCreateMigration");
      process.exit(1);
    }
  }

  async getStatus() {
    try {
      const migrationFiles = await this.getMigrationFiles();
      const executedMigrations = await this.getExecutedMigrations();

      console.log("\n📋 Migration Status:\n");
      console.log("Executed:");
      executedMigrations.forEach(m => console.log(`  ✅ ${m}`));

      const pending = migrationFiles.map(f => path.basename(f, ".js")).filter(m => !executedMigrations.includes(m));

      if (pending.length > 0) {
        console.log("\nPending:");
        pending.forEach(m => console.log(`  ⏳ ${m}`));
      } else {
        console.log("\n🎉 All migrations executed!");
      }
      console.log();
    } catch (error) {
      console.error("Failed to get migration status:", error.message);
    }
  }
  
  async resetMigrations() {
    console.log("\n🔄 Resetting migrations...\n");

    try {
      // First rollback all migrations
      await this.rollbackAll();

      // Clear migration history
      await this.db("migrations_history").del();
      console.log("🗑️  Cleared migration history\n");

      console.log(`✨ Migrations reset successfully! Ready for fresh migration.\n`);
    } catch (error) {
      console.error("\n❌ Migration reset failed:", error.message, "\n");
      this.logger.createLog(error, "MigrationRunner: resetMigrations");
      process.exit(1);
    }
  }
  
}

// Run if executed directly
if (require.main === module) {
  const runner = new migrationRunner();
  const command = process.argv[2];
  const param = process.argv[3];

  (async () => {
    try {

      // Ensure migrations_history table exists before any operations
      await runner.migrationHistoryTable();

      // New db:connection commands
      if (command === "db:connection") {
        console.log("\n🗄️  Checking database connection...\n");
        const exists = await runner.databaseConnection();
        if (exists) {
          console.log("✅ Database connection successful!\n");
        } else {
          console.error("❌ Database connection failed!\n");
          process.exit(1);
        }
      }
      // db:migrate - run pending migrations
      else if (command === "db:migrate") {
        await runner.runMigrations();
      }
      // db:reset - full database reset
      else if (command === "db:reset") {
        console.log("⚠️  WARNING: This will:");
        console.log("  • Rollback all migrations");
        console.log("  • Clear all seeded data");
        console.log("  • Reset migration history\n");
        await runner.rollbackAll();
        await runner.resetMigrations();
        console.log("✨ Full database reset completed!\n");
      }
      // New migration: commands
      else if (command === "migration:create") { 
        if (!param) {
          console.error("❌ Migration name is required");
          console.error("Usage: npm run migration:create <migration-name>");
          process.exit(1);
        }
        await runner.checkOrCreateMigration(param);
      }
      // migration:rollback
      else if (command === "migration:rollback") {
        await runner.rollbackAll();
      }
      // migration:status
      else if (command === "migration:status") {
        await runner.getStatus();
      }

      process.exit(0);
    } catch (error) {
      console.error("❌ Fatal error:", error.message);
      process.exit(1);
    }
  })();
}
