/*

This file contains all of the code running in the background that makes resumeBuilder.js possible. We call these helper functions because they support your code in this course.

Don't worry, you'll learn what's going on in this file throughout the course. You won't need to make any changes to it until you start experimenting with inserting a Google Map in Problem Set 3.

Cameron Pittman
*/


/*
These are HTML strings. As part of the course, you'll be using JavaScript functions
replace the %data% placeholder text you see in them.
*/

var HTMLheaderName = '<h1>%data%</h1>';
var HTMLheaderRole = '<span>%data%</span>';
var HTMLskillsStart = '<h3>Skills at a Glance:</h3><ul id="skills"></ul>';
var HTMLskills = '<li>%data%</li>';
var HTMLbioPic = '<img src="%data%">';
var HTMLWelcomeMsg = '<p>%data%</p>';

var HTMLcontactList = '<ul id="contacts"></ul>';
var HTMLmobile = '<li>mobile<span><a href="#">%data%</a></span></li>';
var HTMLemail = '<li>email<span><a href="#">%data%</a></span></li>';
var HTMLgithub = '<li>github<span><a href="#">%data%</a></span></li>';
var HTMLtwitter = '<li>twitter<span>%data%</span></li>';
var HTMLblog = '<li>blog<span>%data%</span></li>';
var HTMLlocation = '<li>location<span>%data%</span></li>';

var HTMLrow = '<div class="row"></div>';
var HTMLcell = '<div class="cell"></div>';
var HTMLcellFeedback = '<div class="feedback cell"><p></p></div>';

var HTMLworkRow = '<div class="work-entry row"></div>';
var HTMLworkEmployer = '<a href="#">%data%';
var HTMLworkTitle = ' - %data%</a>';
var HTMLworkDates = '<span class="date-text">%data%</span>';
var HTMLworkLocation = '<p class="location-text">%data%</p>';
var HTMLworkDescription = '<p>%data%</p>';

var HTMLprojectSlide = '<div class="slide"></div>';
var HTMLprojectStart = '<div class="project-entry container"></div>';
var HTMLprojectHeader = '<h2>Project</h2>';
var HTMLprojectDates = '<span class="date-text">%data%</span>'; //NB, SAME AS HTMLworkDates
var HTMLprojectTitle = '<a href="#">%data%</a>';
var HTMLprojectDescription = '<p>%data%</p>';
var HTMLprojectFade = '<div class="fade"></div>';
var HTMLprojectImage = '<div><img src="%data%"></div>';

var HTMLschoolStart = '<div class="education-entry"></div>';
var HTMLschoolName = '<h4>%data%';
var HTMLschoolDegree = ' -- %data%</h4>';
var HTMLschoolLocation = '<p class="location-text">%data%</p>';
var HTMLschoolDates = '<span class="date-text">%data%</span>';
var HTMLschoolMajor = '<p>Major: %data%</p>';

var HTMLonlineTitle = '<a href="#">%data%';
var HTMLonlineDates = '<div class="date-text">%data%</div>';
var HTMLonlineURL = '<a href="#">%data%</a>';

var HTMLonlineSchool = '<h4>%data%</h4>';
var HTMLonlineCourses = '<p>%data%</p>';

var googleMap = '<div id="map"></div>';


/*
This is the fun part. Here's where we generate the custom Google Map for the website.
See the documentation below for more details.
https://developers.google.com/maps/documentation/javascript/reference
*/

/*
Start here! initializeMap() is called when page is loaded.
*/
function initializeMap() {

  var locations;

  var mapOptions = {
    disableDefaultUI: true
  };

  // This next line makes `map` a new Google Map JavaScript Object and attaches it to
  // <div id="map">, which is appended as part of an exercise late in the course.
  map = new google.maps.Map(document.querySelector('#map'), mapOptions);


  /*
  locationFinder() returns an array of every location string from the JSONs
  written for bio, education, and work.
  */
  function locationFinder() {

    // initializes an empty array
    var locations = [];

    // adds the single location property from bio to the locations array
    if (bio.contacts) locations.push(bio.contacts.location);

    // iterates through school locations and appends each location to
    // the locations array
    for (var school in education.schools) {
      locations.push(education.schools[school].location);
    }

    // iterates through work locations and appends each location to
    // the locations array
    for (var job in work.jobs) {
      locations.push(work.jobs[job].location);
    }

    //GG code. keep number of locations for use later
    numLocations = locations.length;

    return locations;
  }

  /*
  createMapMarker(placeData) reads Google Places search results to create map pins.
  placeData is the object returned from search results containing information
  about a single location.
  */
  function createMapMarker(placeData) {

    // The next lines save location data from the search result object to local variables
    var lat = placeData.geometry.location.lat();  // latitude from the place service
    var lon = placeData.geometry.location.lng();  // longitude from the place service
    var name = placeData.formatted_address;   // name of the place from the place service
    var bounds = window.mapBounds;            // current boundaries of the map window

    // marker is an object with additional data about the pin for a single location
    var marker = new google.maps.Marker({
      map: map,
      position: placeData.geometry.location,
      title: name
    });

    // infoWindows are the little helper windows that open when you click
    // or hover over a pin on a map. They usually contain more information
    // about a location.
    var infoWindow = new google.maps.InfoWindow({
      content: name
    });

    // hmmmm, I wonder what this is about...
    google.maps.event.addListener(marker, 'click', function() {
      // your code goes here!
      infoWindow.open(map,marker);
    });

    // this is where the pin actually gets added to the map.
    // bounds.extend() takes in a map location object
    bounds.extend(new google.maps.LatLng(lat, lon));
    // fit the map to the new marker
    map.fitBounds(bounds);
    // center the map
    map.setCenter(bounds.getCenter());

    //GG code. reveal main when all markers have been created
    ++markersCreated;
    if (numLocations && markersCreated >= numLocations) {
      builder.showMain(); //wait til we've got all markers
    }
  }

  /*
  callback(results, status) makes sure the search returned results for a location.
  If so, it creates a new map marker for that location.
  */
  function callback(results, status) {
    if (status == google.maps.places.PlacesServiceStatus.OK) {
      createMapMarker(results[0]);
    }
  }

  /*
  pinPoster(locations) takes in the array of locations created by locationFinder()
  and fires off Google place searches for each location
  */
  function pinPoster(locations) {

    // creates a Google place search service object. PlacesService does the work of
    // actually searching for location data.
    var service = new google.maps.places.PlacesService(map);

    // Iterates through the array of locations, creates a search object for each location
    for (var place in locations) {

      // the search request object
      var request = {
        query: locations[place]
      };

      // Actually searches the Google Maps API for location data and runs the callback
      // function with the search results after each search.
      service.textSearch(request, callback);
    }
  }

  // Sets the boundaries of the map based on pin locations
  window.mapBounds = new google.maps.LatLngBounds();

  // locations is an array of location strings returned from locationFinder()
  locations = locationFinder();

  // pinPoster(locations) creates pins on the map for each location in
  // the locations array
  pinPoster(locations);

}

/*
Uncomment the code below when you're ready to implement a Google Map!
*/

// Calls the initializeMap() function when the page loads
//window.addEventListener('load', initializeMap); //orig
//GG code. In resumeBuilder builder.displayMap now makes call to initializeMap


// Vanilla JS way to listen for resizing of the window
// and adjust map bounds
window.addEventListener('resize', function(e) {
  //Make sure the map bounds get updated on page resize
  if (map) map.fitBounds(mapBounds);
  //map.fitBounds(mapBounds); //orig
});
