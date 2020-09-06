jQuery(function() {

    jQuery.each( l35.sources, function( key, value ) {
            jQuery('.gform_autocomplete.auto.'+key+'').autoComplete({
                minChars: 1,
                source: function(term, suggest){
                    term = term.toLowerCase();
                    var choices = value;
                    var suggestions = [];
                    for (i=0;i<choices.length;i++)
                        if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                    suggest(suggestions);
                }
            });
    });
    
jQuery('body').delegate('.gform_autocomplete.manual', 'focus', function() {
        var el = jQuery(this);
        jQuery(this).autoComplete({
                minChars: 1,
                source: function(term, suggest){
                    term = term.toLowerCase();
                    var choices = el.data('choices');
                    var suggestions = [];
                    for (i=0;i<choices.length;i++)
                        if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                    suggest(suggestions);
                }
          });
    });
    
jQuery('body').delegate('.gform_autocomplete.ajax', 'focus', function() {
    
        var el = jQuery(this);
        var ajaxData;
        
        jQuery.getJSON( el.data('ajax'), function( data ) {
             ajaxData = data;
        });
        
        jQuery(this).autoComplete({
                minChars: 1,
                source: function(term, suggest){
                    term = term.toLowerCase();
                    var choices = ajaxData;
                    var suggestions = [];
                    for (i=0;i<choices.length;i++)
                        if (~choices[i].toLowerCase().indexOf(term)) suggestions.push(choices[i]);
                    suggest(suggestions);
                }
          });
    });
    
});


// This example displays an address form, using the autocomplete feature
// of the Google Places API to help users fill in the information.

var placeSearch, google_autocomplete;
var componentForm = {
    street_number: 'short_name',
    route: 'long_name',
    locality: 'long_name',
    administrative_area_level_1: 'short_name',
    country: 'long_name',
    postal_code: 'short_name'
};

function initAutocomplete() {
    // Create the autocomplete object, restricting the search to geographical
    // location types.
    var autocomplete_id = jQuery('.gform_autocomplete.autocomplete_search_line input').attr('id');

    google_autocomplete = new google.maps.places.Autocomplete(/** @type {!HTMLInputElement} */(document.getElementById(autocomplete_id)), {types: ['geocode']});

    // When the user selects an address from the dropdown, populate the address
    // fields in the form.
    google_autocomplete.addListener('place_changed', fillInAddress);

    //geolocate();
}

// [START region_fillform]
function fillInAddress() {
    // Get the place details from the autocomplete object.
    var place = google_autocomplete.getPlace();
    
    var street_number = '';
    var street_name = '';

    //console.log(place);
    
    for (var i = 0; i < place.address_components.length; i++) {
        var addressType = place.address_components[i].types[0];
        var long_name = place.address_components[i].long_name;
        var short_name = place.address_components[i].short_name;
        
        
        
        //console.log(addressType);
        //console.log(long_name);
        //console.log(short_name);
        
        if(addressType === 'street_number'){
            street_number = long_name;
        }
        if(addressType === 'route'){
            street_name = short_name;
        }
        if(addressType === 'administrative_area_level_1'){
            jQuery('.gform_autocomplete_container .address_state input').val(long_name);
        }
        if(addressType === 'locality'){
            jQuery('.gform_autocomplete_container .address_city input').val(long_name);
        }
        if(addressType === 'country'){
            jQuery('.gform_autocomplete_container .address_country select').val(short_name);
        }
        if(addressType === 'postal_code'){
            jQuery('.gform_autocomplete_container .address_zip input').val(long_name);
        }
    }
    jQuery('.gform_autocomplete_container .address_line_1 input').val(street_name+', '+street_number);
}
// [END region_fillform]

// [START region_geolocation]
// Bias the autocomplete object to the user's geographical location,
// as supplied by the browser's 'navigator.geolocation' object.
function geolocate() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function (position) {
            var geolocation = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            var circle = new google.maps.Circle({
                center: geolocation,
                radius: position.coords.accuracy
            });
            google_autocomplete.setBounds(circle.getBounds());
        });
    }
}

// [END region_geolocation]