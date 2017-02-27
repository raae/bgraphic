---
title: Kahoot
description: New static website with content in Wordpress.
layout: archive.pug
archive:
  collection: projects
  title: Relevant projects
---

Thanks for including me further in this process. 
Below I try to answer the questions in the latest e-mail.

## Components
Creating components for the front end should be no problem. Static generators 
support different templating engines. Templating engines make it easy to create 
reusable templates.

WordPress, on the other hand, is created around of pages and post, with one 
big wysiwyg input field. To make is possible to use a more
component-based approach one must use a plugin. 

There a many page builder plugins of varying quality, but I like to
use Advanced Custom Fields (ACF). In the pro version, there is a 
field called [Flexible Content](https://www.advancedcustomfields.com/resources/flexible-content/) 
that make it possible for the editors to create a list of blocks and decide the order of these blocks.

To create the provided template example the blocks could be: 
* **Hero** with inputs for text, button, video and video text.
* **CTA's** with choice of one, two or three
* **Blog** with inputs for header text and number of post
* **Divider** with a choice between the fun shapes image or some space
* **Feed** with inputs for header, RSS link and number of feed entries
* **Blurb** with text input
* **Kahoots** with choice between *most popular* or *newest*

The editor would choose one block after the other and reorder as he/she sees fit.

These block would then correspond to reusable components. The components again could have 
reusable elements, but the example shows no such reuse yet. 

I am guessing the header and footer component should be present on all pages throughout the site.

## Hosting
I am not an operations person and have therefore relied on Netlify for 
deployment straight from GitHub. 

Netlify makes it easy to deploy and host static sites. The site is 
rebuilt on each git commit. The site can also be it can be rebuilt using a webhook. 
This would be the way to trigger builds when content changes in the Wordpress install.

Additional perks of using Netlify:
* New temporary builds on each push request
* The possibility to roll back to previous versions with one click
* Possibility to lock a version preventing new builds from being deployed

##  Search engine rich snippets or rich cards
I have some experience and these are usually well documented by the different providers. 

It would be smart to make an automatic generation of default data needed. But also let editors override
the data by using some ACF field.

## Location
I can easily meet with people in Oslo. I am also willing to travel to London if needed.
I have family in London and would not need accommodations. 

## Offer
From the static example provided it is hard to know the need for javascript functionality/enhancements and the 
complexity of the responsive flow.

A template consists of one or more components. The provided template consists of 9 components (see image in e-mail). Another template could be a blog post template. Such a template would have a post content component in addition to the possibility of adding one or more of the components from the provided template.

**Per component:**
* 0.5 day discussing the component with Kahoot designers
* 0.5 day implementing the acf flexible content layout
* 0.5 day implementing the template/css/js
* 0.5 day inevitable challenges

= 7.5 hours \* 2 days = 15 hours

**Per template:** 
* 0.5 day setting up template rules (e.g. what components are allowed)

= 7.5 hours \* 0.5 day = 3.25 hours

**Startup:**  
Setting up the initial workflow generating a static site from a Wordpress site.
* This estimate is for a Metalsmith generated site hosted on Netlify

= 1 week = 37,5 hours

**The full project:**
* C = number of components 
* T = number of templates
* S = startup cost

= C \* 15 hours + T \* 3.25 hours + S

**The provided template:**  
= 9 \* 15 hours + 1 \* 3.25 hours + 37.5 hours = 175 hours

**Availability**: From March 15th, possibly full time  
**Rate**: 1250 NOK per hour
