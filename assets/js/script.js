$(document).ready(function() {
    // Display current day at the top of the calendar
    var currentDate = dayjs().format('dddd, MMMM D, YYYY , h:mm A');
    $('#currentDay').text(currentDate + actualTime);
    var actualTime = dayjs().format('h:mm A');
    // Generate time blocks for standard business hours
    var startHour = 9;
    var endHour = 17;
    
    for (var hour = startHour; hour <= endHour; hour++) {
      var timeBlock = $('<div>').addClass('time-block');
      var hourCol = $('<div>').addClass('hour').text(dayjs().set('hour', hour,'date',currentDate).startOf('hour').format('h:mm A, ddd,mm,yy'));
      var eventInput = $('<textarea>').addClass('event-input').attr('data-hour', hour);
      var saveBtn = $('<button>').addClass('save-btn').text('Save').attr('data-hour', hour);
      var eventText = $('<div>').addClass('event-text');
  
      timeBlock.append(hourCol, eventInput, saveBtn, eventText);
      $('#timeBlocks').append(timeBlock);
    }
  
    // Set color coding for time blocks based on the current hour
    function updateTimeBlockStyles() {
      var currentHour = dayjs().hour();
  
      if (currentHour >= 19) { //if its past 7pm we see the next day
        currentDate = dayjs().add(1, 'day').format('dddd, MMMM D, YYYY');
        currentHour = dayjs().add(24, 'hours').format('h:mm A');
      }
  
      $('#currentDay').text('tomorrow is '+ currentDate);
  
      $('.time-block').each(function() {
        var hour = parseInt($(this).find('.event-input').attr('data-hour'));
  
        if (hour < currentHour) {
          $(this).addClass('past');
        } else if (hour === currentHour) {
          $(this).addClass('present');
        } else {
          $(this).addClass('future');
        }
      });
    }
  
    updateTimeBlockStyles();
  
    // Load saved events from local storage
    function loadSavedEvents() {
      var savedEvents = JSON.parse(localStorage.getItem('events'));
  
      if (savedEvents) {
        $('.event-input').each(function() {
          var hour = parseInt($(this).attr('data-hour'));
          $(this).val(savedEvents[hour]);
          $(this).siblings('.event-text').text(savedEvents[hour]);
        });
      }
    }
  
    loadSavedEvents();
  
    // Save event when the save button is clicked
    $('.save-btn').on('click', function() {
      var hour = parseInt($(this).attr('data-hour'));
      var eventText = $(this).siblings('.event-input').val();
  
      var savedEvents = JSON.parse(localStorage.getItem('events')) || {};
      savedEvents[hour] = eventText;
  
      localStorage.setItem('events', JSON.stringify(savedEvents));
  
      $(this).siblings('.event-text').text(eventText);
    });
  });
  