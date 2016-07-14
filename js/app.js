"use strict";
// HELPER FUNCTION THANKS TO:
// http://jsforallof.us/2014/12/01/the-anatomy-of-a-simple-templating-engine/
var Templater = function(html){
  return function(data){
    for(var x in data){
      var re = "{{\\s?" + x + "\\s?}}";
      html = html.replace(new RegExp(re, "ig"), data[x]);
    }
    return html;
  };
};

// START OF APPLICATION
function App(){
	// SET DEFAULT LOCATION TO SF
	var CURRENT_LOCATION = new google.maps.LatLng(37.7749, -122.4194);
	var CURRENT_DATA, MAP;
	// INITIALIZE FUNCTION, TAKES THE 3 IDS THAT WILL HANDLE INPUT AND OUTPUT
	function init(formID, searchID, mapID, outputID, locationID){
		setupMap(mapID);
		// SETUP FORM SUBMISSION
		document.getElementById(formID).addEventListener('submit', function(e){
			e.preventDefault();
			var input = document.getElementById(searchID).value;
			SearchForm().handleSubmit(input, MAP, function(data, status, location){
				CURRENT_LOCATION = location;
				CURRENT_DATA = data;
				var outputEl = document.getElementById(outputID);
				outputEl.innerHTML = ""
				for(var x in data){
					outputEl.innerHTML += Place(data[x]).loadHTML();
				}
			});
		});
		// SETUP GEOLOCATION
		document.getElementById(locationID).addEventListener('click', function(e){
			e.preventDefault()
			//CHECK IF GEOLOCATION IS AVAILABLE
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(function(position) {
					CURRENT_LOCATION = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					SearchForm().handleSubmit(CURRENT_LOCATION, MAP, function(data, status, location){
						CURRENT_DATA = data;
						var outputEl = document.getElementById(outputID);
						outputEl.innerHTML = ""
						for(var x in data){
							outputEl.innerHTML += Place(data[x]).loadHTML();
						}
					});
				});
			} else {
				alert("Sorry, using geolocation isn't available in your browser");
			}
		});
	}; // END INIT
	function setupMap(mapID){
		MAP = new google.maps.Map(document.getElementById(mapID), {
      center: new google.maps.LatLng(CURRENT_LOCATION.lat, CURRENT_LOCATION.lng),
      zoom: 15
    });
	}; // END SETUP MAP
	function getCurrentLocation(){
		return CURRENT_LOCATION;
	}; // END GET CURRENT LOCATION
	function getCurrentData(){
		return CURRENT_DATA;
	}; // ENT GET CURRENT DATA
	return {
		init: init,
		getCurrentLocation : getCurrentLocation,
		getCurrentData : getCurrentData
	}
} // END APP


/********** PLACE CONSTRUCTOR **********/
function Place(data){
	if(!data) throw Error("No data for Place constructor");
	var DATA = data;

	function getData(){
		return DATA;
	}; // END GET DATA

	function loadHTML(){
		var template = Templater("<li class=\"place\"><h1>{{ name }}</h1><a href=\"https://www.google.com/maps/place/{{ vicinity }}\" target=\"_blank\">{{ vicinity }}</a><p>RATING: {{ rating }}</p></li>");
		return template(DATA);
	}; // END LOAD HTML
	return {
		getData : getData,
		loadHTML : loadHTML
	}
}; // END PLACE CONSTRUCTOR
/********** SEARCH FORM CONSTRUCTOR **********/
function SearchForm(){
	function handleSubmit(input, mapObj, callback){
		var service = new google.maps.places.PlacesService(mapObj);
		var geocoder = new google.maps.Geocoder();
		var location;
		if(typeof input === "string"){
			geocoder.geocode({
				address: input
			}, function(data, status){
				if(status !== "OK") {
					return alert("Something's wrong with your search, please try again!")
				}
				location = data[0].geometry.location;
				service.nearbySearch({
					location: location,
					radius: '2000',
					type: ['restaurant']
				}, function(data, status){
					callback(data, status, location);
				});
			});
		} else {
			service.nearbySearch({
				location: input,
				radius: '2000',
				type: ['restaurant']
			}, function(data, status){
				callback(data, status, location);
			});
		}
	}; // END HANDLE SUBMIT
	function geocodeAddress(addressString, callback){
		geocoder.geocode({
			address : addressString
		}, function(data, status){
			callback(data,status);
		});
	} // END GEOCODE ADDRESS
	return {
		handleSubmit : handleSubmit
	};
}; // END SEARCH FORM CONSTRUCTOR



var app = App();
app.init('placesForm', 'placesSearch', 'mapHolder', 'placesOutput', 'useLocation');
