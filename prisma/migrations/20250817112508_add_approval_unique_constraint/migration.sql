/*
  Warnings:

  - A unique constraint covering the columns `[documentId,approverId]` on the table `document_approvals` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `document_approvals_documentId_approverId_key` ON `document_approvals`(`documentId`, `approverId`);
