-- AlterTable
ALTER TABLE "users" ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3),
ADD COLUMN     "verificationOtp" TEXT,
ADD COLUMN     "verificationOtpExpiry" TIMESTAMP(3);
