// JavaScript Document

//removes iscroll for phone browsing
if( navigator.userAgent.match(/Android/i) ||
 navigator.userAgent.match(/webOS/i) ||
 navigator.userAgent.match(/iPhone/i) ||
 navigator.userAgent.match(/iPod/i)
 ){
  $('#iscroll').remove();
/*  $('#container img').css('width', 100);*/
}

else{
var myScroll;

//toggle visibility of buttons on first and last page	
function toggleButtons() {
			  $('#next').css( 'opacity' , 1 ).css( 'cursor' , 'pointer' ); 
			  $('#prev').css( 'opacity' , 1 ).css( 'cursor' , 'pointer' );
					  if ($('#indicator li:last-child').hasClass('active')) {
				   $('#next').css( 'opacity' , 0 ).css( 'cursor' , 'default' );
				   $('#prev').css( 'opacity' , 1 ).css( 'cursor' , 'pointer' ); 
			  }
			  
			  if ($('#indicator li:first-child').hasClass('active')) {
				  $('#prev').css( 'opacity' , 0  ).css( 'cursor' , 'default' );
				   $('#next').css( 'opacity' , 1 ).css( 'cursor' , 'pointer' ); 
			  }
}
function loaded() {
	myScroll = new iScroll('slideshow', {
		snap: true,
		momentum: false,
		hScrollbar: false,
		onScrollEnd: function () {
			document.querySelector('#indicator > li.active').className = '';
			document.querySelector('#indicator > li:nth-child(' + (this.currPageX+1) + ')').className = 'active';
			toggleButtons();
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

var slideWidth = 800;
var slideHeight = 600;
var slides = $('#slides li');
var numberOfSlides = slides.length;
 $('#scroller').css('width', slideWidth * numberOfSlides);
 $('#slideshow').css('width', slideWidth);
 $('#container').css('width', slideWidth + 100);

 
//make indicator's list dynamic
$(slides).clone().appendTo("#indicator");
$('#indicator li').empty();
$('#indicator li:first-child').addClass('active');

//make indicator lenght dynamic
var dotWidth = 12;
var dots = $('#indicator li');
var numberOfDots= dots.length;
$('#indicator').css('width', dotWidth*numberOfDots);

/*remove pesky p tags from comics pages
jQuery.fn.stripTags = function() { return this.replaceWith( this.html().replace(/<\/?[^>]+>/gi, '') ); };
$("li.page").stripTags();*/

//end document ready
});

//end else
}
