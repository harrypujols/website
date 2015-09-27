// JavaScript Document

//removes iscroll for phone browsing
if( navigator.userAgent.match(/Android/i) ||
 navigator.userAgent.match(/webOS/i) ||
 navigator.userAgent.match(/iPhone/i) ||
 navigator.userAgent.match(/iPod/i)
 ){
  $('#iscroll').remove();
}

//iscroll functions
else {
var myScroll;

function loaded() {
	myScroll = new iScroll('slideshow', {
		snap: true,
		momentum: false,
		hScrollbar: false,
		onScrollEnd: function () {
			document.querySelector('#indicator > li.active').className = '';
			document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
		}
	 });
}

document.addEventListener('DOMContentLoaded', loaded, false);

//start document ready
$(document).ready(function() {
 
//arrow button functions
 $('#next').click(function () {
	 myScroll.scrollToPage('next', 0);
	 return false;
	 });
 $('#prev').click(function () {
	 myScroll.scrollToPage('prev', 0);
	 return false;
	 });
	 
// same functions with keyboard
$(document).keyup(function(e) {
	if(e.keyCode == 39) {
     myScroll.scrollToPage('next', 0);
	 return false;
	}
	
	if(e.keyCode == 37) {
     myScroll.scrollToPage('prev', 0);
	 return false;
	}
});

//to make the size of the scroller dynamic
var slideWidth = 478;
var slides = $('#slides li');
var numberOfSlides = slides.length;
 $('#scroller').css('width', slideWidth * numberOfSlides);
 $('#slideshow').css('width', slideWidth);
 
//make indicator's list dynamic
$(slides).clone().appendTo("#indicator");
$('#indicator li').empty();
$('#indicator li:first-child').addClass('active');

//make indicator lenght dynamic
var dotWidth = 12;
var dots = $('#indicator li')
var numberOfDots= dots.length;
$('#indicator').css('width', dotWidth*numberOfDots);

 //end document ready
});
//end else
}