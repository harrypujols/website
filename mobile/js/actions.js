// JavaScript Document

$(document).ready(function() {
	
//link functions
function suffleClasses() {
  $('nav').addClass("page");
	$('nav').removeClass("current");
	$('article').removeClass("current");
}
$('a#link1').click(function() {
	suffleClasses();
	$("#about").toggleClass("current");
	});
$('a#link2').click(function() {
	suffleClasses();
	$("#contact").toggleClass("current");
	});
$('a#link3').click(function() {
	suffleClasses();
	$("#social").toggleClass("current");
	});
   
//window close function
$(".close").click(
function() {
	$('nav').removeClass("page");
	$('nav').addClass("current");
	$('article').removeClass("current");
	$('article').addClass("page");
	}
);

//hide my email from bots
    $(function() {
	var m = 'mail';
	var a = 'to';
	var i = '@harrypujols.com';
	$('a#email').replaceWith('<a href='+m+a+':'+m+i+'>email</a>');
	});
	
//hide my phone from bots
    $(function() {
	var f = 'tel';
	var o = '1646';
	var n = '7700740';
	$('a#phone').replaceWith('<a href='+f+':'+o+n+'>call</a>');
	});
	
})


