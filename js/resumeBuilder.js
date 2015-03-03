/*
	I was bothered by text jiggling while the page loaded. I first experimented with trying to minimize page rendering with multiple jQuery appends. I found that this can be done by detaching an element from the dom, building its contents and then appending the whole reconstructed element with a single append. Then had the idea that #main could be hidden and then made visible at a later time. After testing, it became apparent that the render was affected by how the map rendered. This led me to modify helper.js to determine when the markers had all been created.

	My interest in learning flexbox lead to how I'll modify the css for this project. In order to use flexboxgrid.css, I need to wrap each div that demarcates a section of information in a div with class="row". I can detach elements and append later as needed to modify the html.
*/
/*
	TODO: encapsulate global vars into an object. create loading indicator. modify css. add carousel for images. create svg charts.
*/

var numLocations = 0,
		markersCreated = 0,
		replaceable = "%data%",
		rowHtml = '<div class="row"></div>',
		colFullHtml = '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12">',
		colProjectsHtml = '<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 bkg-projects">',
		colWorkHtml = '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 bkg-work">',
		colEducationHtml = '<div class="col-xs-12 col-sm-6 col-md-6 col-lg-6 bkg-education">',
		colSkillHtml = '<div class="col-xs-12 col-sm-12 col-md-5 col-lg-6">',
		colMapHtml = '<div class="col-xs-12 col-sm-12 col-md-8 col-lg-9 bkg-map">',
		colConnectHtml = '<div class="col-xs-12 col-sm-12 col-md-4 col-lg-3 bkg-connect">',
		$main = $("#main"),
		$workExperience = $('#workExperience').detach(),
		$projects = $('#projects').detach(),
		$education = $('#education').detach(),
		$topContacts = $('#topContacts').detach(),
		$header = $('#header').detach(),
		$footer = $('#letsConnect').detach(),
		$map = $('#mapDiv').detach(); //needed for flexboxgrid.css

var bio = {
	"name": "fffplok",
	"role": "Front End Web Developer",
	"contacts": {
		"mobile": "XXX-XXX-XXXX",
		"email": "XXX@wxyzmail.com",
		"github": "https://github.com/fffplok",
		"twitter": "@XXX",
		"location": "Osceola, WI"
	},
	"welcomeMessage": "fffplok, you say? Hello! I'm a specialist in developing interactive eLearning.",
	"skills": [
		"html", "css", "javascript", "jquery", "svg", "git/github", "bootstrap", "handlebars"
	],
	"bioPic": "images/me-standard-450.jpg"
};

bio.display = function() {
	//var topContacts = $header.find('#topContacts'),
	var footerContacts = $footer.find('#footerContacts'),
			colHeadHalfHtml = '<div class="col-xs-6">',
			$headLeft = $('<div class="col-xs-12 col-sm-12 col-md-3 col-lg-3 bg-head">'),
			$headRight = $('<div class="col-xs-12 col-sm-12 col-md-9 col-lg-9 pad-sides">'),
			$headRightTop = $('<div class="col-xs-12">'),
			$headTopRow = $(rowHtml),
			$headBottomRow = $(rowHtml),
			$headBottomLeft = $(colHeadHalfHtml),
			$headBottomRight = $(colHeadHalfHtml),
			htmlContent = "",
			contacts = this.contacts,
			skills = this.skills,
			ix, start, $row;

	//update class attributes. header now becomes a row
	$header.removeClass('clearfix').removeClass('center-content').addClass('row');

	//get bioPic and put it into its column and append to header
	//or, header left box gets the image
	/*
		ignore image, use background image (.bg-head). this is because ie11 stretched the image. Used the same responsive image css as bootstrap, so it seems that the issue with ie11 is that the css height:auto; is ignored when in a flex item
	*/
	//htmlContent = HTMLbioPic.replace(replaceable, bio.bioPic);
	//$headLeft.append($(htmlContent));
	$header.append($headLeft);

	//build header right box. it contains two rows. top row contains name/role/contacts. bottom row contains two boxes: message and skills

	htmlContent = '';
	htmlContent = HTMLheaderName.replace(replaceable, bio.name)
								+ HTMLheaderRole.replace(replaceable, bio.role);
	htmlContent = htmlContent.replace('</h1>','') + '</h1>';
	console.log('htmlContent: ', htmlContent);

	//$header.append($(colHeadRightHtml).append($(rowHtml).append($(colNameHtml).append(htmlContent))));
	//$headRight.append($(rowHtml).append($headRightTop.append(htmlContent)));
	$headRightTop.append(htmlContent);

	//contacts list items created and appended to header and footer
	htmlContent = '';
	if (bio.contacts) {
		for (ix in contacts) {
			htmlContent += HTMLcontactGeneric.replace("%contact%", ix).replace(replaceable,contacts[ix]);
		}

		$headRightTop.append($topContacts.append(htmlContent));

		$headRight.append($headTopRow.append($headRightTop));
		$header.append($headRight);
		footerContacts.append(htmlContent);
	}


	$headBottomRow.append($headBottomLeft.append(HTMLWelcomeMsg.replace(replaceable, bio.welcomeMessage)));
	$headBottomRow.append($headBottomRight);
	$headRight.append($headBottomRow);

	if (skills && skills.length > 0) {
		start = $(HTMLskillsStart);
		//$header.append(start);
		$headBottomRight.append(start);

		htmlContent = "";
		for (ix in skills) {
			htmlContent += HTMLskills.replace(replaceable, skills[ix]);
		}

		$headBottomRight.find('ul#skills').append(htmlContent);
		$headBottomRow.append($headBottomRight);

	}
};

var work = {
	"jobs": [
		{
			"employer": "BI Worldwide",
			"title": "Interactive Developer",
			"location": "Edina, MN",
			"dates": "2000-2014",
			"description": "eLearning development with authorware, flash/actionscript, html, css, javascript, jQuery, ..."
		},
		{
			"employer": "Allen Interactions",
			"title": "Interactive Developer",
			"location": "Minneapolis, MN",
			"dates": "2000",
			"description": "eLearning development with authorware"
		},
		{
			"employer": "Minneapolis Public Library",
			"title": "Library Page",
			"location": "Minneapolis, MN",
			"dates": "1999",
			"description": "book schlepper"
		}
	]
};

work.display = function() {
	//build contents of the div and then re-attach to the dom.
	var jobs = this.jobs,
			ix, start, htmlContent;

	//remove unused classes
	$workExperience.removeClass('gray');

	if (jobs.length > 0) {
		for (ix in jobs) {
			start = $(HTMLworkStart);
			htmlContent = HTMLworkEmployer.replace(replaceable, jobs[ix].employer)
										+ HTMLworkTitle.replace(replaceable, jobs[ix].title)
										+ HTMLworkLocation.replace(replaceable, jobs[ix].location)
										+ HTMLworkDates.replace(replaceable, jobs[ix].dates)
										+ HTMLworkDescription.replace(replaceable, jobs[ix].description);

			start.append($(htmlContent));
			$workExperience.append(start);
		}

		//use this when not using flexboxgrid.css
		//$main.prepend($workExperience);

		//use with flexboxgrid.css
		//$main.prepend($(rowHtml).append($workExperience));
	}
}

var projects = {
	"projects": [
		{
			"title": "eLearning Automotive Sales",
			"dates": "2013",
			"description": "Scorm 1.2 compliant eLearning. Integrated multiple interactions including quizzes, click-tell, tip behavior into online course targeted for iPad users. Developed restricted navigation so that user is required to visit every aspect of an interaction before proceeding to the next.",
			"images": [
				"images/gm-01-click-tell.jpg",
				"images/gm-02-tip.jpg",
				"images/gm-03-quiz.jpg",
				"images/gm-04-menu.jpg",
				"images/gm-05-glossary.jpg",
				"images/gm-05-resume.jpg"
			],
			"carouselClass":"responsive"
		},
		{
			"title": "eLearning Pharmaceutical Sales",
			"dates": "2014",
			"description": "Scorm 1.2 compliant eLearning. Integrated multiple interactions including quizzes, click-tell, grid select into online course targeted for iPad users. Integrated both audio and video elements to interactions. Unified css for the various interactions. Developed custom quiz with supplemental questions when initial response is incorrrect. Developed matching interaction with svg.",
			"images": [
				"images/ro-00-open.jpg",
				"images/ro-01-open-info.jpg",
				"images/ro-02-grid-radio-start.jpg",
				"images/ro-03-grid-radio-try1.jpg",
				"images/ro-04-grid-radio-try2.jpg",
				"images/ro-05-click-tell.jpg",
				"images/ro-06-grid-checkbox.jpg",
				"images/ro-07-click-tell2.jpg",
				"images/ro-08-slider.jpg",
				"images/ro-09-quiz.jpg",
				"images/ro-10-quiz-radio-selected.jpg",
				"images/ro-11-quiz-feedback.jpg",
				"images/ro-12-accordion-closed.jpg",
				"images/ro-13-accordion-open.jpg",
				"images/ro-14-menu-expanded.jpg",
				"images/ro-15-matching-entry.jpg",
				"images/ro-16-matching-try1.jpg",
				"images/ro-17-matching-try1-feedback.jpg",
				"images/ro-18-matching-try1-answer-shown.jpg",
				"images/ro-19-matching-restarted.jpg",
				"images/ro-20-scenario-intro.jpg",
				"images/ro-21-scenario-q.jpg",
				"images/ro-22-scenario-q-selected.jpg",
				"images/ro-23-scenario-q-wrong.jpg",
				"images/ro-24-scenario-try2-ok-new-q.jpg",
				"images/ro-25-scenario-q2-wrong-try1.jpg",
				"images/ro-26-scenario-q2-wrong-try2.jpg",
				"images/ro-27-scenario-summary.jpg"
			],
			"carouselClass":"responsive"
		} /*,
		{
			"title": "Tree House",
			"dates": "2012",
			"description": "A lovely treehouse nestled in the woods overlooking the road.",
			"images": []
		}
		*/
	]
};

projects.display = function() {
	//note this.projects is the array of project objects

	//make minimal impact to dom by first detaching the div with id "projects".
	//build contents of the div and then re-attach to the dom.
	var projects = this.projects,
			ix, i, start, htmlContent;

	if (projects.length > 0) {
		for (ix in projects) {
			start = $(HTMLprojectStart);
			htmlContent = HTMLprojectTitle.replace(replaceable, projects[ix].title)
										+ HTMLprojectDates.replace(replaceable, projects[ix].dates)
										+ HTMLprojectDescription.replace(replaceable, projects[ix].description);

			start.append($(htmlContent));
			/*
			// static images
			if (projects[ix].images.length > 0) {
				for (i = 0; i < projects[ix].images.length; i++) {
					start.last().append($(HTMLprojectImage.replace(replaceable, projects[ix].images[i])));
				}
			}
			*/
			if (projects[ix].images.length > 0) {
				var $carouselStart = $('<div class="'+projects[ix].carouselClass+'"></div>');
				console.log('$carouselStart: ', $carouselStart);
				for (i = 0; i < projects[ix].images.length; i++) {
					$carouselStart.append('<div>'+HTMLprojectImage.replace(replaceable, projects[ix].images[i])+'</div>');
				}
				start.last().append($carouselStart);
			}

			/*
			//html for the slick carousel
	    <div class="responsive">
	      <div><img src="img/ro-00-open.jpg"></div>
	      <div><img src="img/ro-02-grid-radio-start.jpg"></div>
	      ...
	    </div>
			*/

			$projects.append(start);
		}

		//$main.prepend($projects);
		//$main.prepend($(rowHtml).append($projects));
	}
};

var education = {
	"schools": [

		{
			"name": "Macalester College",
			"location": "Saint Paul, MN",
			"degree": "BA, Music",
			"majors": [
				"Music"
			],
			"dates": 1988,
			"url": "http://www.macalester.edu/"
		}

	],
	"onlineCourses": [
		{
			"title": "Intro to HTML and CSS",
			"school": "Udacity",
			"date": 2015,
			"url": "http://udacity.com/"
		},
		{
			"title": "Journey into Mobile",
			"school": "Code School",
			"date": 2014,
			"url": "http://codeschool.com/"
		},
		{
			"title": "JavaScript Best Practices",
			"school": "Code School",
			"date": 2015,
			"url": "http://codeschool.com/"
		},
		{
			"title": "Fundamentals of Design",
			"school": "Code School",
			"date": 2014,
			"url": "http://codeschool.com/"
		},

	]
};

education.display = function() {
	//remove unused classes
	$education.removeClass('gray');

	//build contents of the div and then re-attach to the dom.
	var	schools = this.schools,
			onlineCourses = this.onlineCourses,
			ix, htmlContent;

	if (schools && schools.length > 0)	{
		for (ix in schools) {
			start = $(HTMLschoolStart);
			htmlContent = HTMLschoolName.replace(replaceable, schools[ix].name)
										+ HTMLschoolDegree.replace(replaceable, schools[ix].degree)
										+ HTMLschoolDates.replace(replaceable, schools[ix].dates)
										+ HTMLschoolLocation.replace(replaceable, schools[ix].location)
										+ HTMLschoolMajor.replace(replaceable, schools[ix].majors.join(", "));

			start.append($(htmlContent));
			$education.append(start);
		}
	}

	if (onlineCourses && onlineCourses.length > 0)	{
		$education.append($(HTMLonlineClasses));

		for (ix in onlineCourses) {
			start = $(HTMLschoolStart);
			htmlContent = HTMLonlineTitle.replace(replaceable, onlineCourses[ix].title)
										+ HTMLonlineSchool.replace(replaceable, onlineCourses[ix].school)
										+ HTMLonlineDates.replace(replaceable, onlineCourses[ix].date)
										+ HTMLonlineURL.replace(replaceable, onlineCourses[ix].url);

			start.append($(htmlContent));
			$education.append(start);
		}

		//$main.prepend($education);
		//$main.prepend($(rowHtml).append($education));
	}
};

var theMap = {
	display: function() {
		$map.append(googleMap)
		//$main.append($map.append(googleMap));
	}
}

// The click() function makes it possible for console.log() to output grid coordinates for wherever the screen is clicked. //
$(document).click(function(evt) {
	logClicks(evt.pageX, evt.pageY);
});

// Google Maps is appended to the correct div in index.html, using a JQuery selector. //
//console.log('append googleMap');
//$("#mapDiv").append(googleMap);

//run the program (after spaghetti cleaned up)
//get rid of unnecessary div (<div style='clear: both;'></div>). at this time it is the only child of $main
$main.children().remove();

theMap.display();
projects.display();
education.display();
work.display();
bio.display();

//attach rows to dom from bottom up
$main.append($(rowHtml).append($(colMapHtml).append($map)).append($(colConnectHtml).append($footer)));

$main.prepend($(rowHtml).append($(colProjectsHtml).append($projects)));

$main.prepend($(rowHtml).append($(colWorkHtml).append($workExperience)).append($(colEducationHtml).append($education)));

$main.prepend($(rowHtml).append($(colFullHtml).append($header)));

      $('.responsive').slick({
        dots: true, //true
        infinite: true,
        speed: 300,
        slidesToShow: 4,
        slidesToScroll: 4,
        responsive: [
          {
            breakpoint: 1200,
            settings: {
              slidesToShow: 3,
              slidesToScroll: 3,
              infinite: true
            }
          },
          {
            breakpoint: 992,
            settings: {
              slidesToShow: 2,
              slidesToScroll: 2
            }
          },
          {
            breakpoint: 768,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1
            }
          }
          // You can unslick at a given breakpoint now by adding:
          // settings: "unslick"
          // instead of a settings object
        ]
      });

//To get a non-jiggly render, wait for it a bit.
function showMain() {
	setTimeout(function() { $main.css('visibility','visible');}, 500);
}


//prevent empty links from scrolling to top of page but allow clicks to be logged
$('a[href="#"]').click(function(e){
	e.preventDefault();
});

/*
//same as $(document).ready(function(){});
$(function() {

});
*/