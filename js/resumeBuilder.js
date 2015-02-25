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
		$main = $("#main"),
		$work = $('#workExperience').detach(),
		$projects = $('#projects').detach(),
		$education = $('#education').detach(),
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
	"welcomeMessage": "fffplok, you say? Hello. I'm a long time specialist in developing eLearning.",
	"skills": [
		"html", "css", "javascript", "jquery", "svg", "git/github", "bootstrap", "handlebars"
	],
	"bioPic": "images/me-standard.jpg"
};

bio.display = function() {
	var topContacts = $header.find('#topContacts'),
			footerContacts = $footer.find('#footerContacts'),
			htmlContent = "",
			contacts = this.contacts,
			skills = this.skills,
			ix, start;

	//contacts list items created and appended to header and footer
	if (bio.contacts) {
		for (ix in contacts) {
			htmlContent += HTMLcontactGeneric.replace("%contact%", ix).replace(replaceable,contacts[ix]);
		}

		topContacts.append(htmlContent);
		footerContacts.append(htmlContent);
	}

	htmlContent = HTMLheaderName.replace(replaceable, bio.name)
								+ HTMLheaderRole.replace(replaceable, bio.role);
	$header.prepend($(htmlContent));

	htmlContent = HTMLbioPic.replace(replaceable, bio.bioPic)
								+ HTMLWelcomeMsg.replace(replaceable, bio.welcomeMessage);
	$header.append($(htmlContent));

	if (skills && skills.length > 0) {
		start = $(HTMLskillsStart);
		$header.append(start);

		htmlContent = "";
		for (ix in skills) {
			htmlContent += HTMLskills.replace(replaceable, skills[ix]);
		}

		$header.find('ul#skills').append($(htmlContent));
	}

	//use this when not using flexboxgrid.css
	//$main.prepend($header);
	//$main.append($footer);

	//use with flexboxgrid.css
	$main.prepend($(rowHtml).append($header));
	$main.append($(rowHtml).append($footer));
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

	if (jobs.length > 0) {
		for (ix in jobs) {
			start = $(HTMLworkStart);
			htmlContent = HTMLworkEmployer.replace(replaceable, jobs[ix].employer)
										+ HTMLworkTitle.replace(replaceable, jobs[ix].title)
										+ HTMLworkLocation.replace(replaceable, jobs[ix].location)
										+ HTMLworkDates.replace(replaceable, jobs[ix].dates)
										+ HTMLworkDescription.replace(replaceable, jobs[ix].description);

			start.append($(htmlContent));
			$work.append(start);
		}

		//use this when not using flexboxgrid.css
		//$main.prepend($work);

		//use with flexboxgrid.css
		$main.prepend($(rowHtml).append($work));
	}
}

var projects = {
	"projects": [
		{
			"title": "eLearning Automotive Sales",
			"dates": "2013",
			"description": "Scorm 1.2 compliant eLearning. Integrated multiple interactions including quizzes, click-tell, tip behavior into online course targeted for iPad users. Developed restricted navigation so that user is required to visit every aspect of an interaction before proceeding to the next.",
			"images": [
				"images/gm-00-open.jpg", "images/gm-02-tip.jpg","images/gm-04-menu.jpg"
			]
		},
		{
			"title": "eLearning Pharmaceutical Sales",
			"dates": "2014",
			"description": "Scorm 1.2 compliant eLearning. Integrated multiple interactions including quizzes, click-tell, tip behavior into online course targeted for iPad users. Integrated both audio and video elements to interactions. Unified css for the various interactions. Developed custom quiz with supplemental questions when initial response is incorrrect. Developed matching interaction with svg.",
			"images": [
				"images/ro-00-open.jpg", "images/ro-03-grid-radio-try1.jpg","images/ro-20-scenario-intro.jpg", "images/ro-21-scenario-q.jpg"
			]
		}
		/*,
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

			if (projects[ix].images.length > 0) {
				for (i = 0; i < projects[ix].images.length; i++) {
					start.last().append($(HTMLprojectImage.replace(replaceable, projects[ix].images[i])));
				}
			}

			$projects.append(start);
		}

		//$main.prepend($projects);
		$main.prepend($(rowHtml).append($projects));
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
		$main.prepend($(rowHtml).append($education));
	}
};

var theMap = {
	display: function() {

		$main.append($map.append(googleMap));
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
theMap.display();
education.display();
projects.display();
work.display();
bio.display();

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