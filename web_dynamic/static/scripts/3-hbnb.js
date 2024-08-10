
$(document).ready(function() {
  let selectedAmenities = [];

  $('input[type="checkbox"]').change(function() {
    let amenityId = $(this).data('id');
    let amenityName = $(this).data('name');

    if (this.checked) {
      selectedAmenities.push(amenityId);
    } else {
      let index = selectedAmenities.indexOf(amenityId);
      if (index !== -1) {
        selectedAmenities.splice(index, 1);
      }
    }

    $('div.amenities h4').text(selectedAmenities.map(id => $(`input[data-id="${id}"]`).data('name')).join(', ') || '&nbsp;');
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    success: function(response) {
      if (response.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    },
    error: function() {
      $('#api_status').removeClass('available');
    }
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/places_search/',
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify({}),
    success: function(places) {
      for (let place of places) {
        let article = $('<article></article>');
        let title_box = $('<div class="title_box"></div>');
        title_box.append($('<h2></h2>').text(place.name));
        title_box.append($('<div class="price_by_night"></div>').text('$' + place.price_by_night));
        
        let information = $('<div class="information"></div>');
        information.append($('<div class="max_guest"></div>').text(place.max_guest + ' Guest' + (place.max_guest !== 1 ? 's' : '')));
        information.append($('<div class="number_rooms"></div>').text(place.number_rooms + ' Bedroom' + (place.number_rooms !== 1 ? 's' : '')));
        information.append($('<div class="number_bathrooms"></div>').text(place.number_bathrooms + ' Bathroom' + (place.number_bathrooms !== 1 ? 's' : '')));
        
        let description = $('<div class="description"></div>').html(place.description);
        
        article.append(title_box, information, description);
        $('section.places').append(article);
      }
    }
  });
});
