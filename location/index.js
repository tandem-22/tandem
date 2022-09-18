import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
app.use(express.static("public"));
app.use(cors());

app.get("/", async (req, res) => {
  // html response
  res.send(`
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Demo: Add custom markers in Mapbox GL JS</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        href="https://fonts.googleapis.com/css?family=Open+Sans"
        rel="stylesheet"
      />
      <script src="https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.js"></script>
      <link
        href="https://api.tiles.mapbox.com/mapbox-gl-js/v2.9.2/mapbox-gl.css"
        rel="stylesheet"
      />
      <style>
        body {
          margin: 0;
          padding: 0;
        }
        #map {
          position: absolute;
          top: 0;
          bottom: 0;
          width: 100%;
        }
        .marker {
          width: 100px;
          height: 100px;
        }
      </style>
    </head>
    <body>
      <div id="map"></div>
  
      <script>
        mapboxgl.accessToken = 'pk.eyJ1IjoicHJhbmF2bnQiLCJhIjoiY2w4NjFxMWs3MHA2ejNxbmw0MHdscXRkYiJ9.PC15dueGbvKxc7JSlvpwYA';
  
        const map = new mapboxgl.Map({
          container: 'map',
          style: 'mapbox://styles/mapbox/light-v10',
          center: [-96, 37.8],
          zoom: 3
        });

        // make this a get request to /locations
        let features = fetch("http://localhost:8080/location").then((res) => res.json()).then((data) => {
          for (const feature of data) {
            // create a HTML element for each feature
            const el = document.createElement('div');
            el.className = 'marker';
            el.style.backgroundImage = 'url(/bike.png)';
            el.style.width = '50px';
            el.style.height = '50px';
            el.style.backgroundSize = '100%';
    
            // make a marker for each feature and add it to the map
            new mapboxgl.Marker(el)
              .setLngLat([feature.long, feature.lat])
              .addTo(map);
          }
        });
      
      </script>
    </body>
  </html>  
    `);
});

app.post("/location", async (req, res) => {
  console.log("Got a request");
  const { lat, long, type, description } = req.body;

  if (!lat || !long || !type) {
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

  if (type !== "NEAR_MISS" && type !== "ACCIDENT" && type !== "OTHER") {
    return res.status(400).send("Invalid type");
  }

  const location = await prisma.locations
    .create({
      data: {
        lat,
        long,
        type,
        description,
      },
    })
    .catch((err) => {
      console.log(err);
      return res.status(500).send("Internal server error");
    });

  res.json(location);
});

app.get("/location", async (req, res) => {
  const locations = await prisma.locations.findMany();
  res.json(locations);
});

app.listen(8080, () => {
  console.log("Server running on port 8080!");
});
