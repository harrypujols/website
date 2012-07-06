<!DOCTYPE html>
<?
$lastPage = 41; //indicates the last page in the comic
$shortName = "kill"; //indicates the name of the folder where the comic is located
$comicName = "Kill Or Be Killed";
$feedName = "Kill_Or_Be_Killed";
$url = "http://www.harrypujols.com/comics/";
$imgFolder = $url . "images/";
$pageFolder = $imgFolder . $shortName;
?>
<html xmlns:og="http://opengraphprotocol.org/schema/" itemscope itemtype="http://schema.org/Book">
<meta charset="utf-8">
<meta http-equiv="content-language" content="en">
<head>
<!--feed-->
<link href="http://harrypujols.com/feed/<? echo $feedName ?>.xml" title="RSS 2.0" type="application/rss+xml" rel="alternate">
<!--descriptions-->
<meta name="description" content="<? $comicName ?>: A Webcomic by Harry Pujols" />
<meta name="keywords" content="comic, comic book, webcomic, web comic, illustrated story, graphic novel" />
<!--opengraph-->
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta property="og:title" content="<? echo $comicName ?> by Harry Pujols" />
<meta property="og:type" content="website" />
<meta property="og:url" content="<? echo $url . $shortName ?>" />
<meta property="og:image" content="<? echo $imgFolder ?>thumbnails/<? echo $shortName ?>.gif" />
<meta property="og:site_name" content="<? echo $comicName ?>" />
<meta property="fb:admins" content="517354557" />
<!-- Google+ graph -->
<meta itemprop="name" content="<? echo $comicName ?>">
<meta itemprop="description" content="<? $comicName ?>: A Webcomic by Harry Pujols">
<meta itemprop="image" content="<? echo $imgFolder ?>thumbnails/<? echo $shortName ?>.gif">
<!--mobile-->
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<meta name="apple-mobile-web-app-status-bar-style" content="black">
<!--[if IE]>
<script type="text/javascript" src="../js/modernizr.js"></script>		
<![endif]-->
<title><? echo $comicName ?></title>
<!--styles-->
<link href="../css/mobile.css" rel="stylesheet" type="text/css" media="only screen and (min-width: 0px) and (max-width: 480px)" >
<link href="../css/horizontal.css" rel="stylesheet" type="text/css" media="only screen and (min-width: 481px)" >
<!--scripts-->
<script type="text/javascript" src="https://ajax.googleapis.com/ajax/libs/jquery/1.6.3/jquery.min.js"></script>
<script type="text/javascript" src="../js/iscroll.js" id="iscroll"></script>
<script type="text/javascript" src="../js/horizontal.js"></script>
</head>
<body>
<header>
<span id="home">
<a href="../index.html"><img src="../images/home.png" width="30" height="30" alt="Return to Main"></a>
</span>
<h1><? echo $comicName ?></h1>
 <span id="feed">
<a href="../../feed/<? echo $feedName ?>.xml">RSS</a> 
</span>
<span id="social">
  <!--like button-->
  <iframe src="http://www.facebook.com/plugins/like.php?href=http%3A%2F%2Fharrypujols.com%2Fcomics%2F<? echo $shortName ?>&amp;send=false&amp;layout=button_count&amp;width=450&amp;show_faces=true&amp;action=like&amp;colorscheme=light&amp;font&amp;height=21" style="border:none; overflow:hidden; width:200px; height:21px;"></iframe>
  <!--tweet button-->
  <script src="http://platform.twitter.com/widgets.js" type="text/javascript"></script>
     <a href="http://twitter.com/share" class="twitter-share-button">Tweet</a>
  <!--Google+ button-->
<g:plusone size="medium" annotation="inline" width="120"></g:plusone>
  </span>

</header>


<div id="container">
<span class="button" id="prev">&#8249;</span>
<section id="slideshow">
	<div id="scroller">
	  <ul id="slides">
        
<?

for ($count = 1; $count <= $lastPage; $count++) {
	if ($count < 10) {
		$page = '0'. $count; //adds the zero if the page is under 10
	}
	else {$page = $count;}
	
	$image = '/image_'. $page .'.jpg';
	
	echo '<li><img src="'. $pageFolder . $image .'" alt="Page '. $count .' of '. $lastPage .'"></li>';
}

?>
      </ul>
	</div>
</section>
<span class="button" id="next">&#8250;</span>
</div><!--container-->



<ul id="indicator">
</ul>

<footer>
<!--comments-->
<div id="fb-root"></div><script src="http://connect.facebook.net/en_US/all.js#appId=144864672250472&amp;xfbml=1"></script><fb:comments href="<? echo $url . $shortName ?>" num_posts="100" width="320"></fb:comments>
</footer>
<!-- Google+ button function -->
<script type="text/javascript">
  (function() {
    var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
    po.src = 'https://apis.google.com/js/plusone.js';
    var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
  })();
</script>
<!--google analytics-->
<script type="text/javascript">
var gaJsHost = (("https:" == document.location.protocol) ? "https://ssl." : "http://www.");
document.write(unescape("%3Cscript src='" + gaJsHost + "google-analytics.com/ga.js' type='text/javascript'%3E%3C/script%3E"));
</script>
<script type="text/javascript">
try {
var pageTracker = _gat._getTracker("UA-9259708-1");
pageTracker._trackPageview();
} catch(err) {}</script><!--google analytics-->
</body>
</html>