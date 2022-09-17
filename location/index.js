import { PrismaClient } from "@prisma/client";
import express from "express";

const prisma = new PrismaClient();
const app = express();

app.post("/location", async (req, res) => {
  const { lat, long, type, description } = req.body;

  if (!lat || !long || !type || !description) {
    return res.status(400).send("Missing required fields");
  }

  if (
    isNaN(lat) ||
    isNaN(long) ||
    lat > 90 ||
    lat < -90 ||
    long > 180 ||
    long < -180
  ) {
    return res.status(400).send("Invalid lat or long");
  }

  if (type !== "NEAR_MISS" || type !== "ACCIDENT" || type !== "OTHER") {
    return res.status(400).send("Invalid type");
  }

  const location = await prisma.locations.create({
    data: {
      lat,
      long,
      type,
      description,
    },
  });

  res.json(location);
});

app.get("/location", async (req, res) => {
  const locations = await prisma.locations.findMany();
  res.json(locations);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
