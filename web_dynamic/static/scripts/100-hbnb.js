$(document).ready(function () {
  const amenityObj = {};
  const stateObj = {};
  const cityObj = {};

  $('input[type="checkbox"]').change(function () {
    const dataId = $(this).data('id');
    const dataName = $(this).data('name');

    if ($(this).is(':checked')) {
      if ($(this).parent().parent().is('div.amenities ul')) {
        amenityObj[dataId] = dataName;
      } else if ($(this).parent().is('h2')) {
        stateObj[dataId] = dataName;
      } else {
        cityObj[dataId] = dataName;
      }
    } else {
      if ($(this).parent().parent().is('div.amenities ul')) {
        delete amenityObj[dataId];
      } else if ($(this).parent().is('h2')) {
        delete stateObj[dataId];
      } else {
        delete cityObj[dataId];
      }
    }

    const locations = Object.values(stateObj).concat(Object.values(cityObj));
    $('.locations h4').text(locations.join(', '));
    $('.amenities h4').text(Object.values(amenityObj).join(', '));
  });

  $.ajax({
    url: 'http://0.0.0.0:5001/api/v1/status/',
    type: 'GET',
    success: function (data) {
      if (data.status === 'OK') {
        $('div#api_status').addClass('available');
      } else {
        $('div#api_status').removeClass('available');
      }
    }
  });

  function fetchPlaces(filters) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify(filters),
      success: function (data) {
        $('section.places').empty();
        for (const place of data) {
          const article = ['<article>',
            '<div class="title_box">',
            `<h2>${place.name}</h2>`,
            `<div class="price_by_night">$${place.price_by_night}</div>`,
            '</div>',
            '<div class="information">',
            `<div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>`,
            `<div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>`,
            `<div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>`,
            '</div>',
            '<div class="description">',
            `${place.description}`,
            '</div>',
            '</article>'];
          $('section.places').append(article.join(''));
        }
      }
    });
  }

  fetchPlaces({});

  $('button').click(function () {
    fetchPlaces({
      amenities: Object.keys(amenityObj),
      states: Object.keys(stateObj),
      cities: Object.keys(cityObj)
    });
  });
});
