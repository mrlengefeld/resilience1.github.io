# resilience1.github.io
Personal Website
<!DOCTYPE html>
<html lang="en" >
body , html


bg {
  /*Futuristic office */
  
  background-image: url(https://images.pexels.com/photos/4827/nature-forest-trees-fog.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260);
    height: 50%;
    background-position: center;
  background-repeat: no-repeat;
  background-size: 1600px 1200px, contain;
  position: absolute;
  
			  }



.weatherapp {
    font-family: sans-serif;
    width: 900px; 
      height: 375px;
    font-size: 20px;
      color: orange;
    margin: auto;
    background: white;
      background-position: center;
  background-repeat: no-repeat;
  background-size: 450px 185px, contain;
  
    border-color: black;
    border-width: 5px;
    border-style: solid;
    padding: 1px;
  }
  #weather {
    margin-top:100px;
  }
  #temp {
    font-weight: bold;
  }
  #temp:hover {
    background: yellow;
    cursor: pointer;
  }
  #wind {
    font-style: italic;
  }

.bg2 {
  background: url("https://images.pexels.com/photos/311458/pexels-photo-311458.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
	
 
  
}

.bg3 {
  background: url("https://images.pexels.com/photos/311458/pexels-photo-311458.jpeg?auto=compress&cs=tinysrgb&h=750&w=1260");
  background-repeat: no-repeat;
  background-size: cover;
  background-position: center;
  color: black;
}

.bg4 {
  background: white;
  background-repeat: no-repeat;
  background-size: 1700px 1975px;
  background-position: center;
  
}

.bg5 {
  background: white;
  background-repeat: repeat;
  background-size: cover;
  background-position: center;
  
}


.cropcircle{
  border-color: silver;
     border-style: solid;
  border-width: 6px;
      width: 250px;
    height: 250px;
    border-radius: 100%;
    background: #eee no-repeat center;
    background-size: cover;
    
}

.name {
  font-family: Georgia, Serif;
  font-style: bold;
  font-size: 300%;
  color: black;
    
}    

.name2 {
  
  font-size: 100%;
  color: white;
	text-shadow: 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
}
   

.textShadow {
  font-family: Georgia, Serif;
  
  font-size: 150%;
   text-shadow: 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
}

.name3 {
  font-family: Georgia, Serif;
  font-style: bold;
  font-size: 400%;
  color: white;
  text-shadow: 1px 0 0 #fff, -1px 0 0 #fff, 0 1px 0 #fff, 0 -1px 0 #fff, 1px 1px #fff, -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff;
}
.name4 {
  font-family: Georgia, Serif;
  font-style: bold;
  font-size: 200%;
  color: white;
   

    
}    
 
 var weather = new XMLHttpRequest();
       weather.open("GET", 
        "https://api.wunderground.com/api/038aa9444988e848/conditions/q/WA/Pullman.json", false);

        weather.send(null);
        
        var r = JSON.parse(weather.response);
        var weather = "Current Location: " + r.current_observation.display_location.full ;
        
        var temp = r.current_observation.temperature_string + "<br />";
        
        var wind = r.current_observation.wind_string + "<br />";
        var relative_humidity = r.current_observation.relative_humidity + "<br />";
        var feelslike_string = r.current_observation.feelslike_f +  "<br />";
        
        document.getElementById("weather").innerHTML = weather ;
        document.getElementById("temp").innerHTML = temp ;
        document.getElementById("wind").innerHTML = wind ;
        document.getElementById("relative_humidity").innerHTML = relative_humidity ;
        document.getElementById("feelslike_string").innerHTML = feelslike_string ;
            



(function($) {
  $(document).ready(function() {
    // hide .navbar first
    $(".navbarscroll").hide();

    //fade in .navbar
    $(function() {
      $(window).scroll(function() {
        // set distance uster needs to scroll before fadeIn starts
        if ($(this).scrollTop() > 100) {
          $(".navscroll").fadeIn();
        } else {
          $(".navscroll").fadeOut();
        }
      });
    });
  });
})(jQuery);
<head>
  <meta charset="UTF-8">
  <title>Personal Webpage</title>
  
  
  
      <link rel="stylesheet" href="css/style.css">

  
</head>

<body>

  <head>

  <title>Michael Lengefeld's Codepen Portfolio</title>

  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">

  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css" />
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">

  <script src="js/jquery-1.12.1.min.js"></script>
  <script src="text/javascript" "js/scrollme.js"></script>

  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.3.1/jquery.min.js"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js">
  </script>
  <script type="text/javascript" src="https://code.jquery.com/jquery-2.1.4.min.js"></script>

</head>

<body>

 
  <body data-spy="scroll" data-target="navbar" data-offset="50">
			<div nav class="navbar navbar-default">
				</nav>
	
				<nav class="navbar navbar-inverse">
					<div class="container-fluid">
						<nav class="navscroll navbar navbar-inverse navbar-fixed-top">
							<ul class="nav navbar-nav">
								<li class="active"><a href="#About">About</a></li>
	
								<li><a href="#Portfolio" class="active" data-id="Portfolio">Portfolio</a></li>
	
								<li><a href="#Art" class="scroll-link" data-id="Art">Art</a></li>
	
								<li><a href="http://www.gmail.com" target="_blank" class="scroll-link" data-id="Contact">Contact</a></li>
						</nav>
	
						<div class="silver-background" : silver;></div>
						<div class="navbar-header ">
							<button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#Home" aria-expanded="false">
					<span class="sr-only">Toggle navigation</span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>
					<span class="icon-bar"></span>                        
				</button>
							<a href="#Home" class="active navbar-brand scroll-top">Home</a>
						</div>
						<div class="collapse navbar-collapse" id="myTopnav">
							<ul class="nav navbar-nav">
								<li class="active"><a href="#About">About</a></li>
	
								<li><a href="#Portfolio" class="active" data-id="Portfolio">Portfolio</a></li>
	
								<li><a href="#Art" class="scroll-link" data-id="Art">Art</a></li>
	
								<li><a href="#contact" class="scroll-link" data-id="Contact">Contact</a></li>
	
								<a href="javascript:void(0);" class="icon" onclick="myFunction()" &#9776; </a> </a>
	
						</div>
					</div>
			</div>
			</div>
			</nav>
	
  <body>
  
		<div>
			<h5 class="text-center name3">Michael Ryan Lengefeld</h5><br>

		</div>
		</div>

		<div>
			<div class="container-fluid text-center" profilePic> <img src="https://s3.wp.wsu.edu/uploads/sites/274/2015/07/Lengefeld-Michael.jpg" class="cropcircle">
			</div>

			<h2 class="text-center name4 bg"> Pullman, Washington </h2> <br><br>
			<div id="#About bg2" class="page-section bg2">
				<h3 class="page-section text-center textShadow" 
            id="About">
          <br>
					<font face="Georgia" style="font:white" size="6"> About Me </h3><br>

				<h3>
					<font face="Georgia" >
						<p class="text-left" > I am a PhD Candidate in the Sociology Department at Washington State University in the beautiful Palouse region of Eastern Washington. Broadly speaking, my research focuses on the intersection of environmental inequality, warmaking, and development. My PhD dissertation uses a comparative historical mechanism-based research design to examine the inertial dynamics of nuclear weapons production in the United States and the Soviet Union/Russia - and the environmental and social implications of these pursuits.</h3>
				</font>
				<br></p>
				<br><br>

			</div>

			<div class="container-fluid text-left image-center bg4">
				<div class="row bg4">
					<div class="col-lg-6">

						<ul class=bullet>

							<font face="Georgia" style="font:white" size="6"> Research</h3>
              
							<font face="Georgia" style="font:white" size="4"><li><p class="text-left"> His primary area of research emphasizes the human dimensions of global environmental change, with a focus on issues of sustainability and the political economy of social development, especially the impact of nuclear weapons development. <br>
                <li>  
                <p class="text-left ">A secondary but overlapping area of research concerns international development and illicit drug policy. This work emphasizes the US militarized drug war in Latin America - with a specific focus on the implications for environmental sustainability and political economic development.<br>
                <li>  
                <p class="text-left ">An additional area of research concerns the political and cultural dimensions of a prominent social problem: sports-related traumatic brain injuries (concussions).</li><br>

							 </li>
							<br>
							<font face="Georgia" style="font:white" size="6.5"><h3>Teaching</h3>

							<font face="Georgia" style="font:white" size="4"><li><p class="text-left">Environmental Sociology <br> 

This course aims to provide students with a selective overview of major approaches and debates shaping the field of environmental sociology. While the course is specifically intended to provide general background to sociology students interested in environmental sociology, it is not limited to such students. Our more general goal is to deepen collective understanding of the dynamics of power and inequality that shape human societies and the natural environment. The class will pursue this goal by contextualizing the early work, reviewing core theories in environmental sociology, and using these newfound theoretical skills to consider inequality, justice, social movements, and other topics of relevance to contemporary human-environment interactions.<br> <br> <li> Statistics and Probability <br>
             The primary goal of this course is to introduce students to some basic statistical concepts and techniques. The material we cover prepares students for more advanced statistical courses. We explore a variety of topics, including graphical and numerical univariate statistics, graphical and numerical bivariate statistics, probability, sampling distributions, and statistical inference.</li>

						<br>	<li>Methods <br> This course is designed to provide stduents with a basic understanding of research methods. We emphasize issues such as the logic of research design, issues of conceptualization and measurement, the range of data collection methods available to scientists, and social scientists in particular, and what scientists do with the data once they have collected it. <br> </li>

							<br><li> Sociology of Film <br> The Sociology of Film examines the content of films and how this content is shaped by the structure of the film industry. In short, it seeks to understand the influence of “Hollywood” on the content of “Hollywood” films. In so doing, it examines the inevitable tension between art and economics within the film industry.  This course covers a series of topics related to the film production and film content. It examines the types of stories that films tell and the way those stories are told using various film techniques. It also examines the structure the film industry and how it influences the content of films. Finally, it examines the division of creative labor within the film industry and how creative artists influence the content of these same films. In the final analysis, this course seeks to understand how films can be both a commodity and an art.</li></font>

							<br><li>Introduction to Sociology and Social Problems <br> </li>

					</div>
<div class="container-fluid text-left image-center bg4">
				<div class="row bg4">
					<div class="col-lg-6">

						<ul class=bullet>

<font face="Georgia" style="font:white" size="7">
  <h3> Publications</h3>
						<font face="Georgia" style="font:white" size="4"><p class="text-left"><li> Smith, Chad L., Greg Hooks, and Michael Lengefeld. 2014. “The War on Drugs in Colombia: The Environment, the Treadmill of Destruction and Risk-Transfer Militarism.” Journal of World-Systems Research 20(2): 185-206.</li>
							<li>Lengefeld, Michael, and Chad L. Smith. 2013. "Nuclear Shadows: Weighing the Environmental Effects of Militarism, Capitalism, and Modernization in a Global Context, 2001-2007." Human Ecology Review 20(1):11-25. <br> 
							<li>Civic Engagement:<br>
							2018 Palouse-Clearwater Food Coalition Food Summit<br>Journal referee, Sociology of Development and Human Ecology Review <br> Food Recovery Network, WSU, Pullman: President and founding member  <br>
	</ul><br>
							</p>
				</div></div>

				<div class="bg2 textShadow">
					
<div class="container-fluid text-left image-center bg4">
				<div class="row bg4">
					<div class="col-lg-6">
						<ul class=bullet>
					<h3 class="page-section" id="Portfolio">Research Synopsis</h3><p class="text-left ">

				<font face="Georgia" style="font:white" size="4"><li><p class="text-left">The Environmental Consences of the War on Drugs in Latin America<br>

					<img src="http://clearingthefogradio.org/wp-content/uploads/2014/05/2229-e1401293639377.jpg">
					<class="img-center">
						<class="img-responsive" alt="Image">
							</img>
							</a>
            <li>The militarized war on drugs in Colombia results in intense degradation in one of the most ecologically sensitive areas of the world. Since 1981, the US militarized efforts to curb coca production and competition among paramilitary, guerilla, and criminal forces has greatly exacerbated ecological destruction.<br> 
              
				</div>
				<div class="container-fluid text-center image-center row col-lg-6"> <br>
					The Environmental Legacy of Nuclear Weapons Production at Hanford. Billboard along a restricted highway.
					<img src="http://www.covertbookreport.com/wp-content/uploads/2017/05/Hanford-1.gif">
					<class="img-responsive" alt="Image" "img-center" "img-responsive" alt="Image">
						</img>
						</a>
						</img>

						
						</div>
					</div>
</div>
		  
	</div><br>
<div class="fluid-container col-lg-9 bg5 textShadow">
	<div id="#Art">
		<h2 class="textShadow bg5">
			<p class="page-section" id="Art"><em>Art</em></p><h2>
</div></div>
			
			
			
			
			

	


<script type="text/javascript">

var clicks = 0;
function hello() {
clicks += 1;
document.getElementById("clicks").innerHTML = clicks;
};
</script>

<h2 class="page-section" id="Contact"> <div id="#Contact">
<div class="text-center">
	<a href="zoho.com" target="_blank">
<button class="btn btn-info page-section">
<i class="fa fa-envelope text-center"></i>
<button id="Contact"> 
Contact: resilience1@zoho.com</button></h2><br>

		
<div class="block relative text-center">
<div class="btnList">


<a href="https://www.codepen.io/resilience1/" class="btn btn-info" target="_blank" role="button">
Codepen.io <i class="fa fa-codepen square text-left"></i>
</a>

<a href="https://www.freecodecamp.org/resilience1" class="btn btn-info" target="_blank" role="button">
freeCodeCamp <i class="fa fa-free-code-camp"></i>
</a>

<a href="https://www.github.com/" class="btn btn-info" target="_blank" role="button">
GitHub <i class="fa fa-github-square text-left"></i>
</a
</div>
</div>  


</div><br><br><br><br><br><br><br>
  <h5 class="text-center name" style= "color: maroon"></i> Written and coded by Michael Lengefeld <i class="fa fa-pied-piper-alt"></i><a href="https://codepen.io/resilience1" target="_blank" role="button" </a></h5>
</b></div>

			</div></div>
		
            <footer>
  
  

    <script  src="js/index.js"></script>




</body>

</html>
