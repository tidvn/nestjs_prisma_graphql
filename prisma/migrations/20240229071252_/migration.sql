-- CreateEnum
CREATE TYPE "Blockchain" AS ENUM ('SOLANA', 'ETHEREUM', 'CARDANO', 'INJECTIVE', 'SUI');

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
    "walletAddress" TEXT NOT NULL,
    "blockchain" "Blockchain" NOT NULL
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
CREATE UNIQUE INDEX "account_wallet_walletAddress_key" ON "account_wallet"("walletAddress");

-- CreateIndex
CREATE UNIQUE INDEX "account_session_id_key" ON "account_session"("id");

-- AddForeignKey
ALTER TABLE "account_wallet" ADD CONSTRAINT "account_wallet_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account_session" ADD CONSTRAINT "account_session_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "account_info"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
