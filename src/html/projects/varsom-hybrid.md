---
title: Varsom
excerpt: Ionic app displaying avalanche, flood and landslide warning forecasts.
year: 2016 - present
type: Hybrid app
role: Developer, UX/UI designer
tech: Ionic (hybrid framework), Firebase (BaaS), Node.js (server), Heroku (PaaS), api.nve.no (api), Leaflet (map js framework)
notice: Use of map interface and push notifications
client: NVE (Norwegian Water Resources and Energy Directorate)
links:
  GitHub: https://github.com/bGraphic/varsom-hybrid
  AppStore: https://itunes.apple.com/no/app/varsom/id623785979
---

The client wanted to reinvent the Varsom app from 2013 as a hybrid app.

As with the original app I had complete control over how to make this happen.

The api data is imported into Firebase by Heroku Scheduler and a simple Node script. 
The same script is also responsible for checking if the warning 
levels have changed and in that case call the Ionic Push Api with the correct push tokens.

The design is basic Ionic with some inspiratoin from the new varsom.no. 