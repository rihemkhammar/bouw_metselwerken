/*
  Warnings:

  - Added the required column `services` to the `Project` table without a default value. This is not possible if the table is not empty.
  - Added the required column `services` to the `ProjectUpdate` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Service" AS ENUM ('MACONNERIE', 'RENOVATION', 'RESTAURATION', 'CONSTRUCTION_GENERALE', 'REJOINTOIEMENT_RUSTIQUE', 'TRAITEMENT_HYDROFUGE', 'DEMOUSSAGE');

-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "services" "Service" NOT NULL;

-- AlterTable
ALTER TABLE "ProjectUpdate" ADD COLUMN     "services" "Service" NOT NULL;

-- AlterTable
ALTER TABLE "Request" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "address" TEXT,
ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "matricule" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "services" "Service"[];
