
$(document).ready(function() {
  let selectedAmenities = [];

  $('input[type="checkbox"]').change(function() {
    let amenityId = $(this).data('id');
    let amenityName = $(this).data('name');

    if (this.checked) {
      selectedAmenities.push(amenityId);
      $('div.amenities h4').text(selectedAmenities.map(id => $(`li input[data-id="${id}"]`).data('name')).join(', ') || '&nbsp;');
    } else {
      let index = selectedAmenities.indexOf(amenityId);
      if (index !== -1) {
        selectedAmenities.splice(index, 1);
        $('div.amenities h4').text(selectedAmenities.map(id => $(`li input[data-id="${id}"]`).data('name')).join(', ') || '&nbsp;');
      }
    }
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
});
