-- AlterTable
ALTER TABLE "ProjectUpdate" ADD COLUMN     "progress" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "password" DROP NOT NULL;
