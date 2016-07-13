// API KEY: AIzaSyDRj8hLWs2TGSwdlB4eXTYF8EF6QwG-74M
function App(){
	// SET DEFAULT LOCATION TO SF
	var CURRENT_LOCATION = new google.maps.LatLng(37.7749, -122.4194);
	var MAP;
	// INITIALIZE FUNCTION, TAKES THE TWO IDS THAT WILL HANDLE INPUT AND OUTPUT
	function init(formID, mapID){
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
			SearchForm().handleSubmit({
				location: CURRENT_LOCATION,
				radius: '5000'
			}, MAP, function(data, status){
				document.getElementById('pre').innerHTML = JSON.stringify(data);
			});
		});
	}
	function setupMap(mapID){
		MAP = new google.maps.Map(document.getElementById(mapID), {
      center: new google.maps.LatLng(CURRENT_LOCATION.lat, CURRENT_LOCATION.lng),
      zoom: 15
    });
	};
	function getCurrentLocation(){
		return CURRENT_LOCATION;
	}
	return {
		init: init,
		getCurrentLocation : getCurrentLocation
	}
}

function SearchForm(){
	function handleSubmit(params, mapObj, callback){
		var service = new google.maps.places.PlacesService(mapObj);
		service.nearbySearch(params, callback);
	}
	return {
		handleSubmit : handleSubmit
	}
}
var app = App();
app.init('placesForm', 'placesOutput');
