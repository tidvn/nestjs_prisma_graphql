-- CreateEnum
CREATE TYPE "BLOCKCHAIN" AS ENUM ('SOLANA', 'CARDANO', 'ALEO');

-- CreateTable
CREATE TABLE "account_info" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "is_email_verified" BOOLEAN NOT NULL,
    "is_enable" BOOLEAN NOT NULL
);

-- CreateTable
CREATE TABLE "account_wallet" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id" TEXT NOT NULL,
    "wallet_address" TEXT NOT NULL,
    "blockchain" "BLOCKCHAIN" NOT NULL
);

-- CreateTable
CREATE TABLE "account_session" (
    "id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "account_id" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "account_info_id_key" ON "account_info"("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_info_email_key" ON "account_info"("email");

-- CreateIndex
CREATE UNIQUE INDEX "account_wallet_id_key" ON "account_wallet"("id");

-- CreateIndex
CREATE UNIQUE INDEX "account_wallet_wallet_address_key" ON "account_wallet"("wallet_address");

-- CreateIndex
CREATE UNIQUE INDEX "account_session_id_key" ON "account_session"("id");
