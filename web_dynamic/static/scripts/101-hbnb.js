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
            '<div class="reviews">',
            '<h2>Reviews <span class="toggle-reviews" data-place-id="' + place.id + '">show</span></h2>',
            '<ul class="review-list"></ul>',
            '</div>',
            '</article>'];
          $('section.places').append(article.join(''));
        }
        
        // Add click event for review toggle
        $('.toggle-reviews').click(function() {
          const placeId = $(this).data('place-id');
          const reviewList = $(this).parent().siblings('.review-list');
          
          if ($(this).text() === 'show') {
            $.ajax({
              url: `http://0.0.0.0:5001/api/v1/places/${placeId}/reviews`,
              type: 'GET',
              success: function(reviews) {
                reviewList.empty();
                for (const review of reviews) {
                  const li = `<li>
                    <h3>From ${review.user.first_name} ${review.user.last_name} the ${review.created_at}</h3>
                    <p>${review.text}</p>
                  </li>`;
                  reviewList.append(li);
                }
                $(this).text('hide');
              }.bind(this)
            });
          } else {
            reviewList.empty();
            $(this).text('show');
          }
        });
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
