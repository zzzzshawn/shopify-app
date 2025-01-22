-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Setting" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "settingName" TEXT NOT NULL DEFAULT 'wishlistSetting',
    "name" TEXT NOT NULL,
    "description" TEXT
);
INSERT INTO "new_Setting" ("description", "id", "name") SELECT "description", "id", "name" FROM "Setting";
DROP TABLE "Setting";
ALTER TABLE "new_Setting" RENAME TO "Setting";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
