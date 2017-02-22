---
title: Metalsmith + Instagram
blurb: How to fetch and use Instagram photos with Metalsmith
publish: draft
---

* Create a client app on Instagram
  * Add a valid url, I used the url of the production site
  * No need for pivacy url in sandbox mode
  * Use another account in case of shut down
  * Allow implicit flow
  * Add yourself as sandbox user
  * Accept the sanbox invitation
* First get access_token
  * Go to https://www.instagram.com/oauth/authorize/?client_id=d71edcd27f57438ab7e39daed054cb3e&redirect_uri=http://bgraphic.no&response_type=token
  * Allow
  * Copy out access_token from http://bgraphic.no/#access_token=207958877.d71edcd.d5cc08583f24453893a181d52dd7d060

* Remember to parseInt the created_time string