# ProcrastiMonster

Procrastimonster uses images to help Dungeon Masters find a challenging monster for their players in the the tabletop game [Dungeons and Dragons](http://dnd.wizards.com/).

## WHY

As a prior Dungeon Master—and an ongoing fan of the D&D franchise—I know that being a DM isn't easy. You have a lot of responsibility on your shoulders, including world-building, refereeing, and controlling the fun. Adventurers depend on their DM for ingenuity and spontaneity in a reactive world. Any tool that can help a Dungeon Master can be immensely appreciated.

I wanted to make an image-based app to help novice DMs. Playerbooks and Monster Manuals aren't always the easy to sift through. However, as long as the DM can visualize their adventurers' environment, the Procrastimonster can help find the perfect fit of monster based off of two simple things: Combat Rating and appearance.

## SCREENSHOT

![Screenshot of App](https://github.com/nomcgill/DnDprocrastiMonster/blob/master/1ProcrastimonsterScreen.png?raw=true)

## THE USER EXPERIENCE

Dungeons and Dragons makes a large amount of the base game data legally available for 3rd party use. In the context of the newest edition, this is refered to as D&D 5th edition SRD. The 5e SRD, at the time of this documentation, has 325 monsters of varying strength, abilities, and appearance.

The Procrastimonster is simple. The **header pane is static** at all times, consisting of the title, a brief description of the app, a box to enter a combat rating, and a generate button.

Below the static header pane is the bread and butter of the app—**the body**. Mobile or desktop, there are three screen stages:
1. **Home.** A single random monster image displays. The app is loaded and awaits user submission. This screen will not be returned to without a page refresh.
2. **Choice.** A grid of images. Upon the "Generate!" click, the user waits for six worthy monsters to load into a grid on the screen. The user can then either select one, or "Generate" another time.
3. **Details.** A grid of information. After a monster has been selected, many statistics display. Either the user has reached their destination, or they can proceed to generate another six monsters using the top pane. 

## UNDER THE HOOD
* HTML, CSS, JavaScript, JQuery, and JSON API GET requests
### The API
This app uses a 3rd party API created and open-sourced by Adrian Padua in 2016. The API was the most complete D&D monster API that could be found in January, 2019.

### The Images
Without a way to obtain free, relevant images (the app was created for a class, not for commercial use), I simply took the time to create a javascript object of the proper images for each monster. This is store in *"imageArray.js"*.

### The Process
On the home page, the app fetches a single monster name from the API. The "name" uses the data-store js to find one monster image URL to display. In the header pane, a number between 1-30 can be filled in the box to match the available An event listener attached to "Generate" click awaits user form submission.

As the form is submitted, four things happen in sequence:
1. A GET request fetches an object filled with individual monster JSON URLS. An array is built with all of them.
2. Each of those URLs are fetched from using a loop. A new array is built with hundreds of individual monster data.
3. That monster data is looked through. Each monster is filtered in or out by comparing to the Combat Rating input by the User, their order is shuffled, and the first six are truncated into the final monster array stored in var = theSix.
4. After promises resolve, theSix display on the UI, ready to click on for details.

## To Be Continued...

The app still has improvements to be made! Upcoming changes include:
* Hovering. On the details page, hovering should display additional information on what skills and actions do and mean. Hovering over any monster image should display its name in a clean, appealing way.
* Timing. Generating takes a while. The user would benefit from an initial load-up of the used API information. Waiting on load-up would be a lot less frustrating than waiting in between clicks.
* Consistent images. Increased uniformity between images would look much cleaner.

## See It Working
See a working example that uses [herokuapp](http://procrastimonster.herokuapp.com/).
