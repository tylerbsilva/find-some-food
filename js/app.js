"use strict";
// HELPER FUNCTION THANKS TO:
// http://jsforallof.us/2014/12/01/the-anatomy-of-a-simple-templating-engine/
var Templater = function(html) {
	if (typeof html !== "string") throw new TypeError("Templater: Template provided was not a string");
	return function(data) {
		if (typeof data !== "object") throw new TypeError("Templater: Return function: Data Provided was not an object");
		for (var x in data) {
			var re = "{{\\s?" + x + "\\s?}}";
			html = html.replace(new RegExp(re, "ig"), data[x]);
		}
		return html;
	};
};

// START OF APPLICATION
function App() {
	// SET DEFAULT LOCATION TO SF
	var CURRENT_LOCATION = new google.maps.LatLng(37.7749, -122.4194);
	var CURRENT_DATA, MAP, LOADING_DIV;
	var LOADING = false;
	// INITIALIZE FUNCTION, TAKES THE 3 IDS THAT WILL HANDLE INPUT AND OUTPUT
	function init(config) {
		// config object looks like
		// {
		// 	formID: '',
		// 	searchID: '',
		// 	mapID: '',
		// 	outputID: '',
		// 	locationID: ''
		//  loadingID: ''
		// }
		if (!config.formID || !config.searchID || !config.mapID || !config.outputID || !config.locationID || !config.loadingID) throw new TypeError("App: Please provide all IDs in config object");
		// INITIALIZE GOOGLE MAPS API
		setupMap(config.mapID);
		// GRAB LOADING ID
		LOADING_DIV = document.getElementById(config.loadingID);
		// SETUP FORM SUBMISSION
		document.getElementById(config.formID).addEventListener('submit', function(e) {
			e.preventDefault();
			var input = document.getElementById(config.searchID).value;
			var outputEl = document.getElementById(config.outputID);
			outputEl.innerHTML = "";
			LOADING_DIV.className = "loading-" + true;
			SearchForm().handleSubmit(input, MAP, LOADING_DIV, function(data, status, location) {
				CURRENT_LOCATION = location;
				CURRENT_DATA = data;
				LOADING_DIV.className = "loading-" + false;
				for (var x in data) {
					outputEl.innerHTML += Place(data[x]).loadHTML();
				}
			});
		});
		// SETUP GEOLOCATION
		document.getElementById(config.locationID).addEventListener('click', function(e) {
			e.preventDefault()
			var outputEl = document.getElementById(config.outputID);
			outputEl.innerHTML = "";
			LOADING_DIV.className = "loading-" + true;
			//CHECK IF GEOLOCATION IS AVAILABLE
			if ("geolocation" in navigator) {
				navigator.geolocation.getCurrentPosition(function(position) {
					CURRENT_LOCATION = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
					SearchForm().handleSubmit(CURRENT_LOCATION, MAP, LOADING_DIV, function(data, status, location) {
						if (status !== "OK") throw new Error("Google Place Error: " + status)
						CURRENT_DATA = data;
						LOADING_DIV.className = "loading-" + false;
						for (var x in data) {
							outputEl.innerHTML += Place(data[x]).loadHTML();
						}
					});
				});
			} else {
				LOADING_DIV.className = "loading-" + false;
				new Error("Geolocation not available");
				alert("Sorry, using geolocation isn't available in your browser, please use the ");
			}
		});
		LOADING_DIV.className = "loading-" + LOADING;
	}; // END INIT
	function setupMap(mapID) {
		MAP = new google.maps.Map(document.getElementById(mapID), {
			center: new google.maps.LatLng(CURRENT_LOCATION.lat, CURRENT_LOCATION.lng),
			zoom: 15
		});
	}; // END SETUP MAP
	function getCurrentLocation() {
		return CURRENT_LOCATION;
	}; // END GET CURRENT LOCATION
	function getCurrentData() {
		return CURRENT_DATA;
	}; // ENT GET CURRENT DATA
	return {
		init: init,
		getCurrentLocation: getCurrentLocation,
		getCurrentData: getCurrentData
	}
} // END APP


/********** PLACE CONSTRUCTOR **********/
function Place(data) {
	if (!data) throw TypeError("Place: No data for Place constructor");
	var DATA = data;
	DATA.isOpen = data.opening_hours !== undefined ? data.opening_hours.open_now : false;
	DATA.rating = data.rating !== undefined ? data.rating : '-';

	function getData() {
		return DATA;
	}; // END GET DATA

	function loadHTML() {
		var template = Templater("<li class=\"place\"><h1>{{ name }}</h1><a href=\"https://www.google.com/maps/place/{{ name }},{{ vicinity }}\" target=\"_blank\">{{ vicinity }}</a><div class=\"flex-row\"><div class=\"fifty\"><p class=\"rating\">RATING: <span class=\"rate\">{{ rating }}/5</span></p></div><div class=\"fifty\"><span class=\"open-{{ isOpen }}\"></span></div></div></li>");
		return template(DATA);
	}; // END LOAD HTML
	return {
		getData: getData,
		loadHTML: loadHTML
	}
}; // END PLACE CONSTRUCTOR


/********** SEARCH FORM CONSTRUCTOR **********/
function SearchForm() {
	function handleSubmit(input, mapObj, loading, callback) {
		var service = new google.maps.places.PlacesService(mapObj);
		var geocoder = new google.maps.Geocoder();
		var location;

		if (input instanceof google.maps.LatLng) {
			location = input;
			service.nearbySearch({
				location: location,
				radius: '2000',
				type: ['restaurant']
			}, function(data, status) {
				if (status !== "OK") {
					loading.className = 'loading-' + false;
					new Error("Google Places Status: " + status);
					return alert("Something's wrong, please try again!\r\nStatus: " + status);
				}
				return callback(data, status, location);
			});
		} else if (typeof input === "string") {
			geocoder.geocode({
				address: input
			}, function(data, status) {
				if (status !== "OK") {
					loading.className = 'loading-' + false;
					new Error("Google Places Status: " + status);
					return alert("Something's wrong, please try again!\r\nStatus: " + status);
				}
				location = data[0].geometry.location;
				service.nearbySearch({
					location: location,
					radius: '2000',
					type: ['restaurant']
				}, function(data, status) {
					if (status !== "OK") {
						loading.className = 'loading-' + false;
						new Error("Google Places Status: " + status);
						return alert("Something's wrong, please try again!\r\nStatus: " + status);
					}
					return callback(data, status, location);
				});
			});
		} else {
			throw new Error("SearchForm.handleSubmit: Error in input ("+input+")");
		}
	}; // END HANDLE SUBMIT
	function geocodeAddress(addressString, callback) {
		geocoder.geocode({
			address: addressString
		}, function(data, status) {
			if (status !== "OK") throw new Error("Google Geocoding: Error while geocoding address (Status: " + status + ")");
			callback(data, status);
		});
	} // END GEOCODE ADDRESS
	return {
		handleSubmit: handleSubmit
	};
}; // END SEARCH FORM CONSTRUCTOR



var app = App();
app.init({
	formID: 'placesForm',
	searchID: 'placesSearch',
	mapID: 'mapHolder',
	outputID: 'placesOutput',
	locationID: 'useLocation',
	loadingID: 'loading'
});
