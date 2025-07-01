-- CreateTable
CREATE TABLE "InvoiceSignature" (
    "orderId" TEXT NOT NULL,
    "signature" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InvoiceSignature_pkey" PRIMARY KEY ("orderId")
);

-- AddForeignKey
ALTER TABLE "InvoiceSignature" ADD CONSTRAINT "InvoiceSignature_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("orderId") ON DELETE RESTRICT ON UPDATE CASCADE;
