###
Name: Dryad Timeline - Version 2.0.0
Date: 03/11/2016
Purpose: Display event timeline for HR Candidates\Employee 
@author: Youri Noel Nelson (Yourinium)
###

# This data can be substituted in Skuid with dates = MyModel.data 
dates = 
	date:
		Event_Date__c:'2014-11-17'
		Event_Type__c:'Confirmed Start'
		In_Approval_Process__c:false
		Approved__c:false
		NOT_Approved__c: false
	date:
		Event_Date__c:'2015-11-17'
		Event_Type__c:'Promotion'
		In_Approval_Process__c:false
		Approved__c:false
		NOT_Approved__c: false

# The system date is used on the timeline to place the [NOW] mention
today = new Date
today.setHours(0,0,0,0)

# Days of the week for the Bubble display 
weekday = [
	"Sunday"
	"Monday"
	"Tuesday"
	"Wednesday"
	"Thursday"
	"Friday"
	"Saturday"
]

# Months of the year for the Bubble display
month =[
	"January"
	"February"
	"March"
	"April"
	"May"
	"June"
	"July"
	"August"
	"September"
	"October"
	"November"
	"December"
]

BubbleTime = (config) ->
	obj = this
	obj.config =
		### id: string (MANDATORY)
			This is the bubble time container's id 
		###
		#id: config.id

		### dates: array of object with following variables (MANDATORY)
			Event_Date__c : date YYYY-MM-DD 
			Event_Type__c: string 
			In_Approval_Process__c : boolean 
			Approved__c : boolean 
			NOT_Approved__c: boolean 
			This is where the bulk of the information is stored to be used int eh creation of the bubble time 
		###
		#dates: config.dates 

		###	branchCap: integer  
			The length cap for any given line connecting two bubbles
			after which the branch will be compressed to save space.
		###
		branchCap: lookup 'branchCap' , config , 300

		### dotdotRadius: integer
							| o o o |
			The size of the 3 dots when compressing a branch
		###
		dotdotRadius: lookup 'dotdotRadius', config , 3 

		### dotdotWall: integer
							| o o o |
			The size of the line on either size of the 3 dots 
		###
		dotdotWall: lookup 'dotdotWall', config , 20 

		### dotdotSpace: integer
							| o o o |
			The width between the 2 lines, the 3 dots 
			will be evenly distributed between these lines
		###
		dotdotSpace: lookup 'dotdotSpace', config , 42 


		### lineHeight: integer
			Sets the height of the line in between bubbles
		###
		lineHeight: lookup 'lineHeight', config, 5

		### pointInnerRadius: integer
			Sets the radius of event point innner radius
		###
		pointInnerRadius: lookup 'pointInnerRadius', config, 5

		### pointOuterRadius: integer
			Sets the radius of event point outer radius
		###
		pointOuterRadius: lookup 'pointInnerRadius', config, 8


	obj.drawNowBox()
	obj.drawLine(150, "#004165")
	obj.drawPoint("number_0","event1", "#004165", true)

	return

###
	Prototype functions used in the graphical display of the bubble time 
###

###
	Function to draw the event circle
	eventID : String; Ex: "number_0"
	className: String; Ex: "event1" or "event2". Will place a bubble above the
	outerRing: boolean; Determines whether the point has an outer ring	
	line and another below.
###
BubbleTime.prototype.drawPoint = (eventID, className , color, outerRing) ->
	obj = this

	$(".Timeline").append "<div class= #{className} id = #{eventID}>"

	point = d3.select "##{eventID}"
				.append "svg"
				.attr "width", obj.config.pointOuterRadius*2.75
				.attr "height", obj.config.pointOuterRadius*3

	#Inner Circle
	point.append "circle"
			.attr "cx", obj.config.pointOuterRadius*1.375
			.attr "cy", obj.config.pointOuterRadius*1.625
			.attr "r", obj.config.pointInnerRadius
			.style "fill", color

	if outerRing
		#Outer Circle
		point.append "circle"
				.attr "cx", obj.config.pointOuterRadius*1.375
				.attr "cy", obj.config.pointOuterRadius*1.625
				.attr "r", obj.config.pointOuterRadius
				.style "fill", "none"
				.style "stroke-width", 2
				.style "stroke", color

	return

###Function to draw the NOW rectangle ###
BubbleTime.prototype.drawNowBox = ->
	
	$(".Timeline").append "<div class='now'>"
	$(".now").append "NOW"

	return

###Function to draw the NOW rectangle ###
BubbleTime.prototype.drawBubble = () ->
	


	return



### 
	Function to draw the lines between bubbles
	Length: integer
	Color: String; Ex:"red" or "#F56F23"
 ###
BubbleTime.prototype.drawLine = (length, color) ->

	obj = this

	if length <= obj.config.branchCap	

		line = d3.select ".Timeline"
			.append "svg"
			.attr "width", length
			.attr "height", obj.config.lineHeight
			.append "line"
			.attr "x1", 0
			.attr "y1", 0
			.attr "y2", 0
			.attr "x2", length
			.style "stroke", color
			.style "stroke-width", obj.config.lineHeight

	else
		###
			If the length of the branch is greater than the cap 
			we compress by doing one line, 3 dots another line 
		###
		branchCompress = (obj.config.branchCap - obj.config.dotdotSpace) / 2
		dotxDist = (obj.config.dotdotSpace - 2) / 4
		dotyDist = obj.config.dotdotWall / 2

		line = d3.select ".Timeline"
			.append "svg"
			.attr "width", branchCompress
			.attr "height", obj.config.lineHeight
			.append "line"
			.attr "x1", 0
			.attr "y1", 0
			.attr "y2", 0
			.attr "x2", branchCompress
			.style "stroke", color
			.style "stroke-width", obj.config.lineHeight
		

		dotdot =  d3.select ".Timeline"
					.append "svg"
					.attr "width", obj.config.dotdotSpace
					.attr "height", obj.config.dotdotWall
					
		dotdot.append "line"
					.attr "x1", 1
					.attr "y1", 0
					.attr "x2", 1
					.attr "y2", obj.config.dotdotWall
					.style "stroke", color
					.style "stroke-width", 2

		dotdot.append "circle"
					.attr "cx", dotxDist + 1 
					.attr "cy", dotyDist
					.attr "r", obj.config.dotdotRadius
					.style "fill", color
		
		dotdot.append "circle"
					.attr "cx", dotxDist*2 + 1 
					.attr "cy", dotyDist
					.attr "r", obj.config.dotdotRadius
					.style "fill", color
		
		dotdot.append "circle"
					.attr "cx", dotxDist*3 + 1 
					.attr "cy", dotyDist
					.attr "r", obj.config.dotdotRadius
					.style "fill", color
					
		dotdot.append "line"
					.attr "x1", obj.config.dotdotSpace - 1
					.attr "y1", 0
					.attr "x2", obj.config.dotdotSpace - 1
					.attr "y2", obj.config.dotdotWall
					.style "stroke", color
					.style "stroke-width", 2

		line2 = d3.select ".Timeline"
					.append "svg"
					.attr "width", length
					.attr "height", obj.config.lineHeight
					.append "line"
					.attr "x1", 0
					.attr "y1", 0
					.attr "y2", 0
					.style "stroke", color
					.style "stroke-width", obj.config.lineHeight
					.attr "x2", branchCompress

		return 



### 
	Utility functions below 
###

### Ensure the proper formatting/display of the dates' digits###
twoDigitDate = (input) ->
	input = "0 #{input}" if input < 10
	return input

### Parses a date in yyyy-mm-dd format###
parseDate = (input) ->
	parts = input.match(/(\d+)/g)
	new Date(parts[0], parts[1]-1, parts[2])

### Calculates the number of days between two dates###
daySpan = (date1, date2) ->
	dif = (date1.getTime() - date2.getTime()) / (24 * 60 * 60 * 1000)
	#Making sure the output is a positive round number
	days = Math.round Math.abs dif
	return days

### Calculating the total number of days the BubbleTime will span over###
totalSpan = (firstDate, lastDate) ->
	if parseDate(firsDate) < today
		totalSpan = daySpan parseDate(firstDate) , today
	else
		totalSpan = daySpan parseDate(firstDate) , lastDate
	return totalSpan

### Helper function that looks up the value of a variable in an object and if none
	is found that returns a default value ###

lookup = (keyVar, obj, defval ) ->
	val = defval
	if keyVar?
		if obj? and typeof obj is "object" and key in obj
			val=obj[keyVar] 
		else val = defval
	return val





display = new BubbleTime 