// API KEY: AIzaSyDRj8hLWs2TGSwdlB4eXTYF8EF6QwG-74M
// GEOCODING LINK: https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key=AIzaSyDZT3ioc8QQS0Z-vm6uOfJWf6sLkosI4oY

function App(){
	// SET DEFAULT LOCATION TO SF
	var CURRENT_LOCATION = new google.maps.LatLng(37.7749, -122.4194);
	var CURRENT_DATA, MAP;
	// INITIALIZE FUNCTION, TAKES THE 3 IDS THAT WILL HANDLE INPUT AND OUTPUT
	function init(formID, searchID, mapID, outputID){
		//CHECK IF GEOLOCATION IS AVAILABLE
		if ("geolocation" in navigator) {
			navigator.geolocation.getCurrentPosition(function(position) {
				CURRENT_LOCATION = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
			});
		}
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
					outputEl.appendChild(Place(data[x]).loadHTML());
				}
			});
		});
	};
	function setupMap(mapID){
		MAP = new google.maps.Map(document.getElementById(mapID), {
      center: new google.maps.LatLng(CURRENT_LOCATION.lat, CURRENT_LOCATION.lng),
      zoom: 15
    });
	};
	function getCurrentLocation(){
		return CURRENT_LOCATION;
	};
	function getCurrentData(){
		return CURRENT_DATA;
	};
	/********** PLACE CONSTRUCTOR **********/
	function Place(data){
		if(!data) throw Error("No data for Place constructor");
		var DATA = data;

		function getData(){
			return DATA;
		}; // END GET DATA

		function loadHTML(){
			var newEl = document.createElement('li');
			newEl.className = "place"
			newEl.innerHTML += "<h3>" + DATA.name + "</h3>";
			newEl.innerHTML += "<p>LOCATION: " + DATA.vicinity + "</p>";
			newEl.innerHTML += DATA.rating ? "<p>RATING: " + DATA.rating + "</p>" : "<p>RATING: N/A</p>"
			return newEl;
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
			geocoder.geocode({
				address: input
			}, function(data, status){
				if(status !== "OK") {
					return alert("Something's wrong with your search, please try again!")
				}
				location = data[0].geometry.location;
				service.nearbySearch({
					location: location,
					radius: '5000',
					types: ['bakery', 'cafe', 'restaraunt', 'meal delivery']
				}, function(data, status){
					callback(data, status, location);
				});
			});
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
	/********** RETURN NECESSARY APP CONTENTS **********/
	return {
		init: init,
		getCurrentLocation : getCurrentLocation,
		getCurrentData : getCurrentData,
		Place : Place,
		SearchForm : SearchForm
	}
}


var app = App();
app.init('placesForm', 'placesSearch', 'mapHolder', 'placesOutput');
