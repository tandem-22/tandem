-- CreateTable
CREATE TABLE "Locations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "lat" DECIMAL(65,30) NOT NULL,
    "long" DECIMAL(65,30) NOT NULL,
    "type" STRING NOT NULL,
    "description" STRING NOT NULL,

    CONSTRAINT "Locations_pkey" PRIMARY KEY ("id")
);
