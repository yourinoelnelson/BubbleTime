var myModel = skuid.model.getModel('CandidateTimeline');
	var myComponent = skuid.component.getById('MyComponentUniqueId');
		
	//Dates to plot	
	var dates = myModel.data;	
		
    //Today's date
    var today = new Date();
    today.setHours(0,0,0,0);
    
    //Days of the week
    var weekday = new Array(7);
    weekday[0]=  "Sunday";
    weekday[1] = "Monday";
    weekday[2] = "Tuesday";
    weekday[3] = "Wednesday";
    weekday[4] = "Thursday";
    weekday[5] = "Friday";
    weekday[6] = "Saturday";
    
    //Months of the Year
    var month = new Array();
    month[0] = "January";
    month[1] = "February";
    month[2] = "March";
    month[3] = "April";
    month[4] = "May";
    month[5] = "June";
    month[6] = "July";
    month[7] = "August";
    month[8] = "September";
    month[9] = "October";
    month[10] = "November";
    month[11] = "December";
    
    
    //This variable will help display any sort of statuses above or below bubble.
    var status;

        $(".none").append("No Events to Display");
    if(dates.length == 0){
       
        $(".Timeline").append("<div class='none'>");
        $(".Timeline").css("width","100%");
        $(".none").css({
                "margin":"auto",
                "color": "#C3C2C2"
            
        })
        
        
    }else{
        
        
      if(dates[0].In_Approval_Process__c == true){
        
        status = "<span style='color: #FF9800;'>Approval In Progress</span>";
        
        
      } else if(dates[0].Approved__c == true) {
        
        status ="<span style='color: #8BC34A;'>Approved</span>"
        
      }else if(dates[0].NOT_Approved__c == true){

        status ="<span style='color: #F44336;'>Rejected</span>"

      }else{
        
        status = null;
      }
        
        
        
    }
    
    function twoDigitDate(input){
        
        if (input < 10) { input = '0' + input; }
        return input;
    }
    
    
    // parse a date in yyyy-mm-dd format
    function parseDate(input) {
      var parts = input.match(/(\d+)/g);
      // new Date(year, month [, date [, hours[, minutes[, seconds[, ms]]]]])
      return new Date(parts[0], parts[1]-1, parts[2]); // months are 0-based
    }

  //function to easily calculate the number of days between two dates
  function daySpan(date1, date2) {
    var days = Math.round(Math.abs((date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000)));
    return days;
  }
  

  //Calculating how many days the timeline will span over.
  if (parseDate(dates[dates.length - 1].Event_Date__c) < today) {

    var TotalSpan = daySpan(parseDate(dates[0].Event_Date__c), today);


  } else {

    var TotalSpan = daySpan(parseDate(dates[0].Event_Date__c), parseDate(dates[dates.length - 1].Event_Date__c));
  }
  
  
  //Width of the visible timeline container
  var timelineWidth = $(".TimeScroll").width() - 225;
  
  $(".Timeline").css("width", $(".TimeScroll").width());

  //Pixel length for one day, rounded to the nearest hundreth
  var oneDay = Math.round((timelineWidth / TotalSpan) * 100) / 100;
  var noBubbleContact = 105;
  var TPS //Three event width span
  var branchCap = 300;
  var branchCompress = (branchCap - 42) / 2;

  for (i = 0; i < (dates.length - 2); i++) {

    TPS = Math.round(oneDay * daySpan(parseDate(dates[i].Event_Date__c), parseDate(dates[i + 2].Event_Date__c)));

    if ((TPS <= noBubbleContact) && (daySpan(parseDate(dates[i].Event_Date__c), parseDate(dates[i + 2].Event_Date__c)) !== 0)) {
      oneDay = (noBubbleContact / daySpan(parseDate(dates[i].Event_Date__c), parseDate(dates[i + 2].Event_Date__c)));
      timelineWidth = Math.round(oneDay * TotalSpan);
      $(".Timeline").css("width", timelineWidth + 225);
    }

  }

  //Function to display a compress timeline
  function compressTime(sideLines, color) {

    var line = d3.select(".Timeline").append("svg")
      .attr("width", sideLines)
      .attr("height", 5);

    line.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", sideLines)
      .attr("y2", 0)
      .style("stroke", color)
      .style("stroke-width", "5");

    var dotdot = d3.select(".Timeline").append("svg")
      .attr("width", 42)
      .attr("height", 20);

    dotdot.append("line")
      .attr("x1", 1)
      .attr("y1", 0)
      .attr("x2", 1)
      .attr("y2", 20)
      .style("stroke", color)
      .style("stroke-width", "2");

    dotdot.append("circle")
      .attr("cx", 11)
      .attr("cy", 10)
      .attr("r", 3)
      .style("fill", color);

    dotdot.append("circle")
      .attr("cx", 21)
      .attr("cy", 10)
      .attr("r", 3)
      .style("fill", color);

    dotdot.append("circle")
      .attr("cx", 31)
      .attr("cy", 10)
      .attr("r", 3)
      .style("fill", color);

    dotdot.append("line")
      .attr("x1", 41)
      .attr("y1", 0)
      .attr("x2", 41)
      .attr("y2", 20)
      .style("stroke", color)
      .style("stroke-width", "2");

    var line = d3.select(".Timeline").append("svg")
      .attr("width", sideLines)
      .attr("height", 5);

    line.append("line")
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", sideLines)
      .attr("y2", 0)
      .style("stroke", color)
      .style("stroke-width", "5");

  }

  //Start of the timeline
 

  if(parseDate(dates[i].Event_Date__c).getTime() == today.getTime()){

     $(".Timeline").append("<div class='now'>");
        $(".now").append("NOW");
      $(".Timeline").append("<div class='event1 number_0'>");
      
  }else{

     $(".Timeline").append("<div class='event1 number_0'>");
    var startingPoint = d3.select(".number_0").append("svg")
      .attr("width", 22)
      .attr("height", 25);
    //Inner Circle
    startingPoint.append("circle")
      .attr("cx", 11)
      .attr("cy", 13)
      .attr("r", 5)
      .style("fill", "#004165");

    //Outer Circle
    startingPoint.append("circle")
      .attr("cx", 11)
      .attr("cy", 13)
      .attr("r", 8)
      .style("fill", "none")
      .style("stroke-width", 2)
      .style("stroke", "#004165");
  }


  //First Bubble on Timeline
  var firstEvent = $(".Timeline > .number_0");
  firstEvent.append($('<div/>', {
      'class': 'event1Bubble'
    })

    .append($('<div/>', {
        'class': 'eventTime'
      })

      .append($('<div/>', {
          'class': 'DayDigit'
        })
        .append(twoDigitDate(parseDate(dates[0].Event_Date__c).getUTCDate())))

      .append($('<div/>', {
          'class': 'Day'
        })
        .append(weekday[parseDate(dates[0].Event_Date__c).getDay()])
        .append($('<div/>', {
            'class': 'MonthYear'
          })
          .append(month[parseDate(dates[0].Event_Date__c).getMonth()] + " " + (1900 + parseDate(dates[0].Event_Date__c).getYear())))))

    .append($('<div/>', {
        'class': 'eventTitle'
      })
      .append(dates[0].Event_Type__c)
    )
  );


  
  firstEvent.append($('<div/>', {
      'class': 'event1Author'
    })
    .append("by Youri Nelson"));
    
    
  firstEvent.append($('<div/>', {
      'class': 'status1'
    })
    .append(status));

  if(parseDate(dates[i].Event_Date__c).getTime() == today.getTime()){
    $('.Timeline').find('.number_0 > .event1Bubble').css({"top": "-90px", "left": "-48px"});
  }

    //If there are no more than one event
    if(dates.length == 1 && (parseDate(dates[i].Event_Date__c).getTime() != today.getTime())){
      
        var widthOfLine = Math.round(oneDay * daySpan(parseDate(dates[0].Event_Date__c), today));
    
        if (widthOfLine <= branchCap) {

          var line = d3.select(".Timeline").append("svg")
            .attr("width", widthOfLine)
            .attr("height", 5);

          line.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", widthOfLine)
            .attr("y2", 0)
            .style("stroke", "#004165")
            .style("stroke-width", "5");

        }else {
          compressTime(branchCompress, "#004165");
        }
    $(".Timeline").append("<div class='now'>");
        $(".now").append("NOW");


  };





  //Now that the first event is generated, we must loop through the remaining dates and map them onto the Timeline

  //This variable will determine the position around the axis
  // 0 is over 1 is under;
  var overUnder = 1;

  //Starting at i = 1 because the first dates was already plotted
  for (i = 1; i < dates.length; i++) {
      
    
      
      if(dates[i].In_Approval_Process__c == true){
        
        status = "<span style='color: #FF9800;'>Approval In Progress</span>";
        
        
    } else if(dates[i].Approved__c == true) {
        
        status ="<span style='color: #8BC34A;'>Approved</span>"
        
    }else{
        
        status = null;
    }

    //If the event is happening today, we don't display the dot, just the now event.
    if (parseDate(dates[i].Event_Date__c).getTime() == today.getTime()){
        
      if (parseDate(dates[i - 1].Event_Date__c).getTime() < today.getTime()) {

          var widthOfLine = Math.round(oneDay * daySpan(parseDate(dates[i - 1].Event_Date__c), today));

        if (widthOfLine <= branchCap) {

          var line = d3.select(".Timeline").append("svg")
            .attr("width", widthOfLine)
            .attr("height", 5);

          line.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", widthOfLine)
            .attr("y2", 0)
            .style("stroke", "#004165")
            .style("stroke-width", "5");

        } else {
          compressTime(branchCompress, "#004165");
        }

        $(".Timeline").append("<div class='now'>");
        $(".now").append("NOW");

      } 

    }else if (parseDate(dates[i].Event_Date__c).getTime() > today.getTime()) {

      if (parseDate(dates[i - 1].Event_Date__c).getTime() < today.getTime()) {

        var widthOfLine = Math.round(oneDay * daySpan(parseDate(dates[i - 1].Event_Date__c), today));

        if (widthOfLine <= branchCap) {

          var line = d3.select(".Timeline").append("svg")
            .attr("width", widthOfLine)
            .attr("height", 5);

          line.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", widthOfLine)
            .attr("y2", 0)
            .style("stroke", "#004165")
            .style("stroke-width", "5");

        } else {
          compressTime(branchCompress, "#004165");
        }

        $(".Timeline").append("<div class='now'>");
        $(".now").append("NOW");

        var widthOfLine = Math.round(oneDay * daySpan(today, parseDate(dates[i].Event_Date__c)));

        if (widthOfLine <= branchCap) {
          var line = d3.select(".Timeline").append("svg")
            .attr("width", widthOfLine)
            .attr("height", 5);

          line.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", widthOfLine)
            .attr("y2", 0)
            .style("stroke", "rgba(162, 164, 163, 0.37)")
            .style("stroke-width", "5");
        } else {

          compressTime(branchCompress, "rgba(162, 164, 163, 0.37)");

        }

      } else if (parseDate(dates[i].Event_Date__c).getTime() !== parseDate(dates[i-1].Event_Date__c).getTime()) {

        var widthOfLine = Math.round(oneDay * daySpan(parseDate(dates[i - 1].Event_Date__c), parseDate(dates[i].Event_Date__c)));
        if (widthOfLine <= branchCap) {
          var line = d3.select(".Timeline").append("svg")
            .attr("width", widthOfLine)
            .attr("height", 5);

          line.append("line")
            .attr("x1", 0)
            .attr("y1", 0)
            .attr("x2", widthOfLine)
            .attr("y2", 0)
            .style("stroke", "rgba(162, 164, 163, 0.37)")
            .style("stroke-width", "5");
        } else {

          compressTime(branchCompress, "rgba(162, 164, 163, 0.37)");

        }

      }

    } else if (parseDate(dates[i].Event_Date__c).getTime() !== parseDate(dates[i-1].Event_Date__c).getTime()) {

      var widthOfLine = Math.round(oneDay * daySpan(parseDate(dates[i - 1].Event_Date__c), parseDate(dates[i].Event_Date__c)));

      if (widthOfLine <= branchCap) {

        var line = d3.select(".Timeline").append("svg")
          .attr("width", widthOfLine)
          .attr("height", 5);

        line.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", widthOfLine)
          .attr("y2", 0)
          .style("stroke", "#004165")
          .style("stroke-width", "5");
      } else {

        compressTime(branchCompress, "#004165");

      }

    }

    //If event are on the same day we are stacking the bubbles
    if (parseDate(dates[i].Event_Date__c).getTime() === parseDate(dates[i-1].Event_Date__c).getTime()) {

      overUnder = (overUnder + 1) % 2;
      $(".Timeline").append("<div class='event" + (overUnder + 1) + " number_" + i + "'>");
      //This reference to the class .event1 and .event2, overUnder only takes value 0 and 1
      // hence the addition +1 to match class names.

    } else {
      $(".Timeline").append("<div class='event" + (overUnder + 1) + " number_" + i + "'>");
      //This reference to the class .event1 and .event2, overUnder only takes value 0 and 1
      // hence the addition +1 to match class names.

     if(parseDate(dates[i].Event_Date__c).getTime() !== today.getTime()){
      //Placing the dot on the timeline 
      var point = d3.select(".number_" + i).append("svg")
        .attr("width", 22)
        .attr("height", 25);

      //Event point should be grey if located in the future
      if (parseDate(dates[i].Event_Date__c) > today) {
        //Inner Circle
        point.append("circle")
          .attr("cx", 11)
          .attr("cy", 13)
          .attr("r", 5)
          .style("fill", "rgba(162, 164, 163, 0.37)");

      } else {
        //Inner Circle
        point.append("circle")
          .attr("cx", 11)
          .attr("cy", 13)
          .attr("r", 5)
          .style("fill", "#004165");
      }
     }
    }

    //Place Bubble on Timeline
    var event = $(".Timeline > .number_" + i);
    event.append($('<div/>', {
        'class': 'event' + (overUnder + 1) + 'Bubble'
      })

      .append($('<div/>', {
          'class': 'eventTime'
        })

        .append($('<div/>', {
            'class': 'DayDigit'
          })
          .append(twoDigitDate(parseDate(dates[i].Event_Date__c).getUTCDate())))

        .append($('<div/>', {
            'class': 'Day'
          })
          .append(weekday[parseDate(dates[i].Event_Date__c).getDay()])
          .append($('<div/>', {
              'class': 'MonthYear'
            })
            .append(month[parseDate(dates[i].Event_Date__c).getMonth()] + " " + (1900 + parseDate(dates[i].Event_Date__c).getYear())))))

      .append($('<div/>', {
          'class': 'eventTitle'
        })
        .append(dates[i].Event_Type__c)
      )
    );

       if(parseDate(dates[i].Event_Date__c).getTime() === today.getTime()){

       var lefty = $(".Timeline > .number_" + i + '> .event' + (overUnder + 1) + 'Bubble').css("left");
        
      $(".Timeline > .number_" + i + '> .event' + (overUnder + 1) + 'Bubble').css("left", parseInt(lefty) -34);  
      $(".Timeline > .number_" + i + '> .event' + (overUnder + 1) + 'Bubble').css("top", "29px");
      
      }




    if (parseDate(dates[i].Event_Date__c).getTime() === parseDate(dates[i-1].Event_Date__c).getTime()) {

      var topPos = $('.number_' + (i - 1) + '> .event' + (overUnder + 1) + 'Bubble').position().top;
      var leftPos = $('.number_' + (i - 1) + '> .event' + (overUnder + 1) + 'Bubble').position().left;
      var zIndex = $('.number_' + (i - 1) + '> .event' + (overUnder + 1) + 'Bubble').css("z-index");

      if ((overUnder + 1) == 1) {
        if ((zIndex == 100)) {
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("top", topPos - 20);
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("left", leftPos - 28);
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("z-index", zIndex - 1);
        } else {
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("top", topPos - 6);
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("left", leftPos - 6);
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("z-index", zIndex - 1);
        }
      } else {

        if ((zIndex == 100)) {
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("top", topPos - 8);
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("left", leftPos - 16);
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("z-index", zIndex - 1);
        } else {
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("top", topPos + 6);
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("left", leftPos + 6);
          $('.number_' + (i) + '> .event' + (overUnder + 1) + 'Bubble').css("z-index", zIndex - 1);
        }

      }

    }

    //Only display the of event author and time if it's in the past
    //if (parseDate(dates[i].Event_Date__c) < today) {
      event.append($('<div/>', {
          'class': 'event' + (overUnder + 1) + 'Author'
        })
        .append("by Youri Nelson"));
      event.append($('<div/>', {
          'class': 'status' + (overUnder + 1)
        })
        .append(status));
    //}

    //Apply gray filter if in the future
    if (parseDate(dates[i].Event_Date__c).getTime() > today.getTime()) {
      event.find('.DayDigit, .Day, .eventTitle').addClass('futureGray');

      //event.find($('.event' + (overUnder + 1) + 'Bubble')).addClass('futureOpacity');
    }


    //If there are no events in the future do the following
    if ((dates[i].Event_Date__c == dates[dates.length - 1].Event_Date__c) && (parseDate(dates[i].Event_Date__c) < today)) {

      var widthOfLine = Math.round(oneDay * daySpan(parseDate(dates[i].Event_Date__c), today));

      if (widthOfLine <= branchCap) {
        var line = d3.select(".Timeline").append("svg")
          .attr("width", widthOfLine)
          .attr("height", 5);

        line.append("line")
          .attr("x1", 0)
          .attr("y1", 0)
          .attr("x2", widthOfLine)
          .attr("y2", 0)
          .style("stroke", "#004165")
          .style("stroke-width", "5");
      } else {

        compressTime(branchCompress, "#004165");

      }

      $(".Timeline").append("<div class='now'>");
      $(".now").append("NOW");
      
    }

    //Alternated CSS style over axis, under axis
    overUnder = (overUnder + 1) % 2

  }

  

if(parseDate(dates[dates.length-1].Event_Date__c).getTime() == today.getTime()){

  var line = d3.select(".Timeline").append("svg")
    .attr("width", ($('.TimeScroll').width() - 100))
    .attr("height", 83);

  var linePath = line.append("g")
    .attr("stroke", "rgba(162, 164, 163, 0.37)")
    .attr("stroke-width", "3")
    .attr("fill", "none");

   linePath.append("path")
    .style("stroke-dasharray", "10,10")
    .attr("d", "M5 40 l"+  ($('.TimeScroll').width() - 100) +" 0");

}else{
  var line = d3.select(".Timeline").append("svg")
    .attr("width", 225)
    .attr("height", 83);

  var linePath = line.append("g")
    .attr("stroke", "rgba(162, 164, 163, 0.37)")
    .attr("stroke-width", "3")
    .attr("fill", "none");

  linePath.append("path")
    .style("stroke-dasharray", "10,10")
    .attr("d", "M5 40 l225 0");

}
 

  $('.Timeline').on('mouseenter', '.event1Bubble', function() {
    $(this).addClass("TopOfThePile");

  }).on('mouseleave', '.event1Bubble', function() {
    $(this).removeClass("TopOfThePile");
    
  });

  $('.Timeline').on('mouseenter', '.event2Bubble', function() {
    $(this).addClass("TopOfThePile");

  }).on('mouseleave', '.event2Bubble', function() {
    $(this).removeClass("TopOfThePile");
  });

  var viewPort = $('.TimeScroll').outerWidth();
  var moveLength = viewPort / 2;
  var lengthofLine = $('.Timeline').outerWidth();
 if($('.Timeline').width() <=  $('.TimeScroll').width() ){
     
      $('.arrowRight > svg').hide();
      $('.arrowLeft > svg').hide();
    
  }else{
    
    var startPos = -(Math.round(lengthofLine/moveLength)-2)*moveLength;
    $('.Timeline').css('left', startPos);
   
    if((Math.abs(parseInt(startPos)) + viewPort) > lengthofLine){
      
      $('.arrowRight > svg').hide();
    }
  }
  $('.arrowRight').on('click', 'svg', function() {

    if ($('.Timeline').css('left') == '0px') {
      $('.arrowLeft > svg').show();
    }

    if ((Math.abs(parseInt($('.Timeline').css('left'))) + viewPort) < lengthofLine) {
      $('.Timeline').animate({
        left: '-=' + moveLength
      }, function() {

        if ((Math.abs(parseInt($('.Timeline').css('left'))) + viewPort) >= lengthofLine) {
          $('.arrowRight > svg').hide();
        }

      });
    }
  })

  $('.arrowLeft').on('click', 'svg', function() {

    if ((Math.abs(parseInt($('.Timeline').css('left'))) + viewPort) >= lengthofLine) {
      $('.arrowRight > svg').show();
    }

    $('.Timeline').animate({
      left: '+=' + moveLength
    }, function() {

      if ($('.Timeline').css('left') == '0px') {
        $('.arrowLeft > svg').hide();
      }

    });

  })