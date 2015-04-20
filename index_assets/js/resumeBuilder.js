/*
	I strove to eliminate text jiggling while the page loaded. I first experimented with trying to minimize page rendering with multiple jQuery appends. I found that this can be done by detaching an element from the dom, building its contents and then appending the whole reconstructed element with a single append. This led me to modify helper.js to determine when the markers had all been created. Finally made ui more friendly with a spinner and fades.

	This project utilizes two plugins:
		fullPage.js by Alvaro Trigo - https://github.com/alvarotrigo/fullPage.js
		slick by Ken Wheeler - https://github.com/kenwheeler/slick/

	Note: there must be at least one location on the map for the page to render properly.
*/

//global vars map, numLocations and markersCreated needed for helper.js to monitor when map is ready
var map,
		numLocations = 0,
		markersCreated = 0,
		replaceable = "%data%",
		replaceable2 = "%data2%",
		$main = $("#main").detach();

var builder = {
	showMap: true,
	anchors: ['header', 'work', 'projects', 'education', 'whereabouts', 'connect'],

	/*
	hiding code originally found in index.html emulated here for the fullPage.js interface by modifying what goes into the sections, content may be empty save the background image
	*/
	assessContents: function() {
    //header. at minimum display name and role
    if (document.getElementById('idheader').getElementsByClassName('cell')[0].children.length === 0) {
      document.getElementById('idheader').style.display = 'none';
    }

    //work experience
    if (!document.getElementById('idwork').getElementsByClassName('row')[0]) {
      $('#idwork').hide();
    }

    //projects
    if (!document.getElementById('idprojects').getElementsByClassName('fp-slides')) {
      $('#idprojects').hide();
    }

    //education
    var elEd = document.getElementById('ideducation'),
    		elEd0 = document.getElementById('ideducation').getElementsByClassName('cell')[0],
        elEd1 = document.getElementById('ideducation').getElementsByClassName('cell')[1];
    if (elEd0.children.length === 1 && elEd1.children.length === 1) {
      elEd.style.display = 'none';
    } else {
      if (elEd0.children.length === 1) {
      	console.log('hiding elEd0', elEd0);
        elEd0.style.display = 'none';
      }
      if (elEd1.children.length === 1) {
        elEd1.style.display = 'none';
      }
    }

    //map
    if(document.getElementById('map') === null) {
      $('#idwhereabouts').hide();
    }

    //connect
    if(document.getElementById('contacts') === null) {
      $('#idconnect').hide();
    }
	},

	displayMap: function() {
		// Google Maps is appended to the correct div in index.html, using a JQuery selector. //
		$('#idwhereabouts').append(googleMap);
		initializeMap(); //pulled from helper.js
 	},

	build: function() {
		bio.display();
		work.display();
		education.display();
		projects.display();
		$('body').append($main);

		//displayMap call must occur after $main appended to body
		if (this.showMap) this.displayMap(); //use flag to determine whether to display map
		this.assessContents();
		if (!this.showMap) this.showMain(); //if no map, make the call to showMain here
	},

	//To get a non-jiggly render, wait for it a bit. fade for ui nicety
	showMain: function() {
		//console.log('builder.showMain');
		setTimeout(function() {
			$('#spinner').hide('slow');
			$('#menu').fadeTo('slow', 1.0, 'linear');
			$main.fadeTo('slow', 1.0, 'linear');
		}, 500);
	}
};

var bio = {
	"name": "Glen Giefer",
	"role": "Front End Web Developer",

	"contacts": {
		"mobile": "1-651-769-3446",
		"email": "fffplok@gmail.com",
		"github": "https://github.com/fffplok",
		//"twitter": "@fffplok",
		"location": "Osceola, WI"
	},

	"welcomeMessage": "Hello! I'm a specialist in developing interactive eLearning. <span class='smaller'>You may call me fffplok.</span>",
	"skills": [
		"html", "css", "javascript", "jquery", "svg", "git/github", "bootstrap", "handlebars"
	],

	"bioPic": "index_assets/images/me-standard-450.jpg",

	//bio data is displayed in the header section and the lets connect section
	display: function() {
		//create jquery objects for dom manipulation. we need access to header and connect sections
		var $connect = $main.find('#idconnect'),
				cells =	$main.find('#idheader').find('.cell'),
				$contacts, contacts = [], i, mobile, email, github, location;

		if (this.contacts) {
			$contacts = $(HTMLcontactList);
			mobile = HTMLmobile.replace(replaceable, this.contacts.mobile).replace('"#"', '"tel:' + this.contacts.mobile + '"');
			$contacts.append(mobile);

			email = HTMLemail.replace(replaceable, this.contacts.email).replace('"#"', '"mailto:'+ this.contacts.email + '?subject=Portfolio%20visit&amp;body=Hello,%20fffplok!"');
			$contacts.append(email);

			github = HTMLgithub.replace(replaceable, this.contacts.github).replace('"#"', '"' + this.contacts.github + '" target=_blank');
			$contacts.append(github);

			location = HTMLlocation.replace(replaceable, this.contacts.location);
			$contacts.append(location);
			//leave out twitter, TO DO: add linkedIn

			//contacts to connect section
			$connect.append($contacts);
		}

		//header section contains two cells. build first cell: name, role, message, skills
		$(cells[0]).append($(HTMLheaderName.replace(replaceable,this.name)).append(HTMLheaderRole.replace(replaceable,this.role)));
		if (this.welcomeMessage) {
			$(cells[0]).append(HTMLWelcomeMsg.replace(replaceable,this.welcomeMessage));
		} else {
			$(cells[0]).append('<p></p>'); //empty paragraph to get line seperator
		}

		if (this.skills) {
			$(cells[0]).append(HTMLskillsStart);

			//build skills list
			var $skillsList = $(cells[0]).find('#skills');

			for (i = 0; i < this.skills.length; i++) {
				$skillsList.append(HTMLskills.replace(replaceable,this.skills[i]));
			}
		}

		//biopic to second cell of header
		if (this.bioPic) $(cells[1]).append(HTMLbioPic.replace(replaceable, this.bioPic));
	}
};

var work = {
	"jobs": [
		{
			"employer": "BI Worldwide",
			"title": "Interactive Developer",
			"location": "Edina, MN",
			"dates": "2000-2014",
			"description": "eLearning development with html, css, javascript, jQuery, jQuery UI, plugins, bootstrap, handlebars, and earlier with flash/actionscript, authorware. Scoreboards for aggregated results."
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
			"description": "library page"
		}
	],

	display: function() {
		//create jquery objects for dom manipulation. we need access to work section
		var $work = $main.find('#idwork'),
				i, $row, $cell, $workDates; /*, htmlLocDate, htmlEmployTitle, htmlDesc, htmlContent;*/

		if (this.jobs) {
			//there are two cells for every row in the work section
			for (i = 0; i < this.jobs.length; i++) {
				//append row every two cells
				if (i % 2 === 0) {
					$row = $(HTMLworkRow);
					$work.append($row);
				}

				//build cell and append it to the current row
				$cell = $(HTMLcell);

				//span for dates appended to the paragraph that contains location
				$workDates = $(HTMLworkLocation.replace(replaceable, this.jobs[i].location)).append(HTMLworkDates.replace(replaceable, this.jobs[i].dates));

				$cell.append(HTMLworkEmployer.replace(replaceable, this.jobs[i].employer) + HTMLworkTitle.replace(replaceable, this.jobs[i].title));
				$cell.append($workDates).append(HTMLworkDescription.replace(replaceable, this.jobs[i].description));

				$row.append($cell);
			}
		}
	}
};

var projects = {
	"projects": [
		{
			"title": "Standalone Quiz",
			"dates": "2013-14",
			"description": "Scorm 1.2 compliant quiz module supporting cmi.interactions property tracking. Created a standalone quiz that our pharmaceutical client could use to deploy multiple quizzes by populating json. Customized navigation allows participant to selectively answer questions, clear responses, and review what has been answered before submitting all responses.",
			"link": "",
			"images": [
				{
					"img":"index_assets/images/sq-intro.jpg",
					"feedback":"Introduction to quiz indicates passing percentage and total number of questions. Additionally describes how to navigate the quiz."
				},
				{
					"img":"index_assets/images/sq-true-false.jpg",
					"feedback":"True or false (radio button interaction) with optional image."
				},
				{
					"img":"index_assets/images/sq-checkbox.jpg",
					"feedback":"Checkbox interaction with optional video."
				},
				{
					"img":"index_assets/images/sq-text-entry.jpg",
					"feedback":"Text entry where an exact numeric answer required. Also available is entry of a number within a range."
				},
				{
					"img":"index_assets/images/sq-status.jpg",
					"feedback":"Modal window that lists each question and indicates whether it has been answered. Participant can navigate directly from here to any question."
				},
				{
					"img":"index_assets/images/sq-accordion.jpg",
					"feedback":"Sorting interaction using jQuery UI accordion. Labels can be expanded for more information. Drag and drop labels into correct order."
				},
				{
					"img":"index_assets/images/sq-summary.jpg",
					"feedback":"Summary presents score and the required score for passing the quiz. A review button is available so participant can view answers submitted."
				},
				{
					"img":"index_assets/images/sq-result-review.jpg",
					"feedback":"Modal window that shows the participants answers for each question and whether the answer was correct."
				}
			]
		},
		{
			"title": "eLearning Automotive Sales",
			"dates": "2013",
			"description": "Scorm 1.2 compliant eLearning. Integrated multiple interactions including quizzes, click-tell, tip behavior into online course targeted for iPad users. Developed restricted navigation so that user is required to visit every aspect of an interaction before proceeding to the next.",
			"link": "",
			"images": [
				{
					"img":"index_assets/images/gm-00-open.jpg",
					"feedback":"Opening view of the course. Learner progress is at 0%. Once begun, Learner may resume at beginning or most recent page viewed."
				},
				{
					"img":"index_assets/images/gm-01-click-tell.jpg",
					"feedback":"The click-tell interaction. Tap a label and see some information. You know the drill."
				},
				{
					"img":"index_assets/images/gm-02-tip.jpg",
					"feedback":"Feedback modal superimposed over an interaction."
				},
				{
					"img":"index_assets/images/gm-03-quiz.jpg",
					"feedback":"Quiz in a single page interface. Here showing feedback to a radio button selection."
				},
				{
					"img":"index_assets/images/gm-05-glossary.jpg",
					"feedback":"Glossary allows simple search of course related terms."
				}
			]
		},
		{
			"title": "eLearning Pharmaceutical Sales",
			"dates": "2014",
			"description": "Scorm 1.2 compliant eLearning. Integrated multiple interactions into online course targeted for iPad users. Integrated audio into main navigation and individual interactions. Unified css for the various interactions. Developed custom quiz with supplemental questions when initial response is incorrect. Developed matching interaction with svg.",
			"link": "",
			"images": [
				{
					"img":"index_assets/images/ro-04-grid-radio-try2.jpg",
					"feedback":"Grid radio checklist. One radio button per row may be selected. Correct answers are shown with feedback when response is submitted."
				},
				{
					"img":"index_assets/images/ro-14-menu-expanded.jpg",
					"feedback":"Menu expanded to show all pages have been viewed for the topic selected."
				},
				{
					"img":"index_assets/images/ro-15-matching-entry.jpg",
					"feedback":"Matching interaction. Items in left column must be correctly matched to item in right column."
				},
				{
					"img":"index_assets/images/ro-17-matching-try1-feedback.jpg",
					"feedback":"Learner has matched each pair by clicking or tapping sequentially. A line is drawn with svg to connect the pairs selected. When answer is checked (as shown here) any incorrect matches are grayed out."
				},
				{
					"img":"index_assets/images/ro-18-matching-try1-answer-shown.jpg",
					"feedback":"After noting incorrect pairs, feedback is provided showing all correct matches. Learner may start over with randomized order of targets to match."
				},
				{
					"img":"index_assets/images/ro-21-scenario-q.jpg",
					"feedback":"Scenario interaction with audio introduction and feedback. When initial question is incorrectly answered, a supplemental question is presented. Here is the view of an initial question."
				},
				{
					"img":"index_assets/images/ro-23-scenario-q-wrong.jpg",
					"feedback":"Scenario showing feedback to an incorrect response."
				},
				{
					"img":"index_assets/images/ro-27-scenario-summary.jpg",
					"feedback":"Scenario summary view."
				}
			]
		},
		{
			"title": "Promotional User Interface",
			"dates": "2014",
			"description": "Single page scrollable interface with parallax. Custom fonts were deployed with Typekit (note, fallback font seen in linked example). Svg was added for visual interest and animated using Raphael.js. Carousels were created using flex-slider.js. Scrolling was managed with skrollr.js. Initially used to promote employee engagement product.",
			"link": "",
			"images": [
				{
					"img":"index_assets/images/ees-intro.jpg",
					"feedback":"Introduction with full background hero image. You are invited to continue viewing with the big button pointing down."
				},
				{
					"img":"index_assets/images/ees-boomerang.jpg",
					"feedback":"Menu appears after viewer scrolls past intro. Select a module from the menu or scroll to navigate. This is the boomerang module, to be used as the introduction to the promotion. When content is available, the view module button launches additional content in a new window."
				},
				{
					"img":"index_assets/images/ees-new-rules.jpg",
					"feedback":"A carousel that content of the new rules module and has a button for launching a new window with content described by the current carousel item."
				},
				{
					"img":"index_assets/images/ees-deeper-dive.jpg",
					"feedback":"Another carousel for the deeper dive module. The return button takes viewer back to the intro. When scrolled completely to bottom, the animated strand at left connects with a boomerang."
				}
			]
		},
		{
			"title": "Tree House",
			"dates": "2012",
			"description": "A lovely treehouse nestled in the woods overlooking the road.",
			"images": ["index_assets/images/treehouse.jpg"]
		}
	],

	display: function() {
		//create jquery objects for dom manipulation. we need access to projects section
		var $projects = $main.find('#idprojects'),
				$cell, $row, $container, $slide,
				i, j, project, htmlContent, htmlTitle;

		//for each project, we create a slide. a slide contains a header followed by one or two rows
		if (this.projects) {
			for (i = 0; i < this.projects.length; i++) {
				project = this.projects[i];

				//header appended to container
				$container = $(HTMLprojectStart).append(HTMLprojectHeader);

				//first row populated and appended to container
				$row = $(HTMLrow);
				htmlTitle = HTMLprojectTitle.replace(replaceable, project.title);
				if (project.link) {
					htmlTitle = htmlTitle.replace('"#"', '"' + project.link + '" target=_blank');
					htmlTitle = htmlTitle.replace('</a>', '<span class="external-link"><img src="index_assets/images/external-link.png" class="external-link"></span></a>');
				}

				htmlContent = HTMLprojectDates.replace(replaceable, project.dates) + htmlTitle+ HTMLprojectDescription.replace(replaceable, project.description);

				$row.append(htmlContent);
				$container.append($row);

				//determine if there will be a second row, build and append to container if so. if there is an images object, there'll be a second row. the second row may one or two cells
				if (project.images) {
					htmlContent = '';
					$row = $(HTMLrow);
					$cell = $(HTMLcell);

					//single image
					if (project.images.length <= 1) {
						htmlContent += HTMLprojectImage.replace(replaceable, project.images[0]);
						$cell.append(htmlContent);
					} else {
						//multiple images (in carousel)

						//important. need identifier for managing feedback
						$row.attr('id',' car-'+i);

						for (j = 0; j < project.images.length; j++) {
							htmlContent += HTMLprojectImage.replace(replaceable, project.images[j].img);
						}
						$cell.append($(HTMLprojectFade).append(htmlContent));
					}
					$row.append($cell);

					//determine if there is a second cell. carousel will use per image feedback. single image option requires a top level feedback object for addtional text
					if (project.images.length > 1 || project.feedback) {
						$cell = $(HTMLcellFeedback);
						if (project.feedback) {
							$cell.find('p').append(project.feedback);
						} else {
							//feedback for first image in carousel
							$cell.find('p').append(project.images[0].feedback);
						}
						$row.append($cell);
					}

					//append second row
					$container.append($row);
				}

				//append container to slide
				$slide = $(HTMLprojectSlide).append($container);

				//append slide to projects (multi-slide view)
				$projects.append($slide);
			}
		}
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
		},
		{
			"name": "University of Minnesota",
			"location": "Minneapolis, MN",
			"degree": "Computer Science",
			"majors": [
				"not declared"
			],
			"dates": 1992,
			"url": "http://twin-cities.umn.edu/"
		}

	],
	"onlineCourses": [
		{
			"school": "Udacity",
			"date": 2015,
			"url": "http://udacity.com",
			"courses": [
				"Intro to HTML and CSS",
				"Interactive Resume",
			]
		},
		{
			"school": "Code School",
			"date": "2014-2015",
			"url": "http://codeschool.com",
			"courses": [
				"JavaScript Road Trip, Parts 1-3",
				"JavaScript Best Practices",
				"Try jQuery",
				"jQuery: The Return Flight",
				"Shaping up with Angular.js",
				"Fundamentals of Design",
				"Journey into Mobile"
			]
		}
	],

	display: function() {
		//create jquery objects for dom manipulation. we need access to cells of the education section
		var cells = $main.find('#ideducation').find('.cell'),
				schools = this.schools,
				onlineCourses = this.onlineCourses,
				i, start, htmlContent;

		//first cell contains divs with traditional courses
		if (schools && schools.length > 0)	{
			for (i = 0; i < schools.length; i++) {
				start = $(HTMLschoolStart);
				htmlContent = HTMLschoolName.replace(replaceable, schools[i].name) + HTMLschoolDegree.replace(replaceable, schools[i].degree) + HTMLschoolDates.replace(replaceable, schools[i].dates) + HTMLschoolLocation.replace(replaceable, schools[i].location) + HTMLschoolMajor.replace(replaceable, schools[i].majors.join(", "));

				start.append($(htmlContent));
				$(cells[0]).append(start);
			}
		}
		//second cell contains divs with online courses
		if (onlineCourses && onlineCourses.length > 0)	{
			for (i= 0; i < onlineCourses.length; i++) {
				start = $(HTMLschoolStart);
				htmlContent = HTMLonlineSchool.replace(replaceable,onlineCourses[i].school) + HTMLonlineDates.replace(replaceable, onlineCourses[i].date) + HTMLonlineURL.replace(replaceable, onlineCourses[i].url);

				//make link active
				htmlContent = htmlContent.replace('"#"', '"' + onlineCourses[i].url + '" target=_blank');
				htmlContent = htmlContent.replace('</a>', '<span class="external-link"><img src="index_assets/images/external-link.png" class="external-link"></span></a>');


				htmlContent += HTMLonlineCourses.replace(replaceable,onlineCourses[i].courses.join('&nbsp;&nbsp;&nbsp;&middot;&nbsp;&nbsp;&nbsp;'));

				start.append($(htmlContent));
				$(cells[1]).append(start);
			}
		}
	}
};

//Plugin intialization
$(document).ready(function() {
	builder.build();

	//initialize fullpage, then slick
	$main.fullpage({
		menu: '#menu',
		anchors: builder.anchors, //['header', 'work', 'projects', 'education', 'whereabouts', 'connect'],
		slidesNavPosition: 'top', //values allowed: top, bottom
		loopHorizontal: false, //projects scroll horizontally, stop when at first or last
		autoScrolling: true, //we do want to hide native scrollbars
		navigation: false, //don't want the dots

		//intialize slick after fullpage
		afterRender: function(){
		  //here initialize other plugins
		  $('.fade').slick({
				dots: true,
				infinite: true,
				speed: 500,
				fade: true,
				cssEase: 'linear'
		  });

		  //before slide change
		  $('.fade').on('beforeChange', function(event, slick, currentSlide, nextSlide){
				//traverse to row that has id we can use to get index into projects
				var targForId = $(this).parent().parent();

				//get the feedback cell and fade out
				$(targForId.find('.cell')[1]).find('p').fadeOut();
		  });

		  //after slide change
		  $('.fade').on('afterChange', function(event, slick, currentSlide){
				//traverse to row that has id we can use to get index into projects
				var targForId = $(this).parent().parent();

				//get the feedback cell and index to correct project
				var targCell = targForId.find('.cell')[1];
				var ix = parseInt($(targForId).attr('id').slice(5), 10); //id of form 'car-N'

				//update feedback
				$(targCell).html('<p>' + projects.projects[ix].images[currentSlide].feedback + '</p>').fadeIn();
		  });
		}

	});

});

//prevent empty links from scrolling to top of page but allow clicks to be logged
$('a[href="#"]').click(function(e){
	e.preventDefault();
});
