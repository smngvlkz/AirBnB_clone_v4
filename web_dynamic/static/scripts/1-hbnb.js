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
});
