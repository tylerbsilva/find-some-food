# Find Some Food

A simple vanilla javascript application to find restaurants in your area using the browser's geolocation or an address typed in by the user

## Running

This application is server-free because it is based off of the Google Places API. To see the finished project, either download and open in a browser or visit the [GH-Pages branch](http://tylerbsilva.github.io/find-some-food) to view the live version.

## Implementation

I decided to go with a just a vanilla javascript application because the Google Map's API was so expansive that I didn't want to bloat the project with unnecessary libraries/frameworks.

I broke it down into a 3 main functions, the `App`, the `SearchForm` and the `Place`:
- `App`: Holds the state of the application. It has an `init` function which sets up the the core functionality of the application using the IDs passed through the `config` object. It also has a `getCurrentData` function which returns the most recent data. Lastly it also has a `getCurrentLocation` which can be used to view the most recent location that was set.
- `SearchForm`: A separate function used to handle the submission of the search-bar. This houses the function that converts an address to the needed format. `SearchForm` returns only one function, `handleSubmit`, which requests the data from Google and then returns it, pending there are no errors.
- `Place`: This sets up each `Place` before it gets loaded on screen. It returns 2 functions, `getData` which returns the data associated with the Place, and `loadHTML` which uses the template provided to return a stringed HTML snippet.

My styles are based off of the Google Material Design guidelines.

Lastly, I found a simple templating function online at [http://jsforallof.us/2014/12/01/the-anatomy-of-a-simple-templating-engine/](http://jsforallof.us/2014/12/01/the-anatomy-of-a-simple-templating-engine/) which was used in `Place.loadHTML()`.

## Issues

I ran into a few issues when it comes to mobile testing. The Google Places API Key that I was provided with doesn't allow for anything other than Desktops to use the API. If you try to view this through a mobile-browser, the request will be denied (but the site is styled to be optimized for mobile :wink:)

*EDIT*: I found out it was only during local development, once I pushed to Github, I was able to use the application within a mobile browser.

## Next Steps

Here is a list on how I plan to further my project:
- [ ] Add more input fields to allow user more options such as type of food and such
- [ ] Add animation to the Places as they are received
- [ ] Build out the `init` function on App to append all needed assets to the page.
- [ ] Expand `Place.loadHTML` to accept an outside template, rather than a string provided by me

If you have any questions, feel free to contact me at [me@tylerbsilva.com](mailto:me@tylerbsilva.com)
