# Tandem

## What it does
Tandem is a hardware extension for bicycles that aims to improve safety for cyclists in cities. We use a rear-mounted camera to track vehicles and alert the cyclist of potentially unsafe situations via the handlebar-mounted touchscreen display. These include when vehicles are approaching quickly from behind, or if a vehicle is in the cyclist's blind spot.

Further, cyclists are able to report accidents along their route which are then tracked on a publicly-accessible map. The valuable location data can be used by cities to prioritize areas for better cycling and pedestrian infrastructure.

## How we built it
The camera is a Luxonis OAK-D with an on-chip computer vision processor and two spatial cameras for depth perception. We use an open-source model from OpenVINO to recognize vehicles. The camera and model results are sent to the Raspberry Pi, which uses Flask to stream it to our web frontend built in Next.js hosted on Vercel. 

We developed weighted algorithms based on the size and locations of the bounding boxes to offer blind spot warnings and score the overall safety of the cyclist's current environment. To communicate these warnings to cyclists, we use Flask to send real-time data over an open WebSocket connection to our dashboard. Finally, the accident location database is stored on CockroachDB and is manipulated by an Express server running on Heroku.

## Challenges we ran into
One of the greatest and most persistent challenges of the build was the slow processing speeds of the Raspberry Pi 3 board. This was exacerbated by our power source, which was a portable power bank that output slightly under 5V power. Unfortunately, because of this, the Pi behaved inconsistently and lagged for long periods of time while booting, loading the camera, and activating the browser (up to 3 minutes).

At one point, we had also strapped a portable speaker on the bike to enable sound cues based on hazards in the cyclist’s environment. However, we found that the speaker would play sounds repeatedly and would become more of a nuisance than a boon to  cyclists. We ultimately ended up scrapping it.

The algorithms we used to determine blind spot presence and risk scores based on bounding boxes were also a challenge to fine tune. In the beginning, there would often be many false positives where a blind spot warning was issued but the detected vehicle was still far behind the cyclist. Or, the algorithm would report an unsafe cycling environment while there were very few vehicles on the road. By trial and error, we managed to find threshold values for these algorithms that give reasonably consistent results.

## Accomplishments that we're proud of
We are very proud of our efficiency and cohesiveness as a team. Each member was responsible for a unique aspect of the build, ranging from hardware integration to CV processing to geolocation, and executed well. 

Although many of the technologies we used were unfamiliar, we still managed to complete the project in under 36 hours. We also think the bike looks pretty cool.

## What we learned
This was the first hardware hack for every member of our team. From connecting wires without interfering with the bicycle spokes to janky hot glued components, it is a completely different experience from writing software.  

We also learned a variety of new Web APIs, including geolocation and WebSockets. Surprisingly, performance was also now much more important, with the limited compute resources of the Pi. Thus, we could not afford to have large bundle sizes or unoptimized code. 

## What's next for Tandem
The OAK-D camera also provides two cameras for depth perception and spatial analysis, which could be used to give distances to detected vehicles. We would like to incorporate this data into our safety scoring algorithms to improve accuracy.

Moreover, we plan to expand the accident response map to build a safer, more sustainable city for all.
