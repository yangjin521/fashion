var Website = {

	bodyClass: null,
	windowWidth: 0,
	windowHeight: 0,
	windowRatio: 0,
	contentWidth: 0,
	contentHeight: 0,
	restHeight: 0,
	selectedStories: null,
	selectedStoriesContainer: null,
	sidebar: null,
	tiny: false,

	RESPONSIVE_WIDTH_THRESHOLD: 720,
  RESPONSIVE_HEIGHT_THRESHOLD: 580,

	init: function() {

		this.isMobileSafari = navigator.userAgent.match(/(iPod|iPhone|iPad)/) && navigator.userAgent.match(/AppleWebKit/);
		this.hasTouchEvents = 'ontouchstart' in document.documentElement;

		this.bodyClass = $("body").attr("class");

		$(window).bind("resize", function(){ Website.resize(); });

		if (this.bodyClass == "projects") {
			this.project.init();
			this.stories.init();
		}
		if (this.bodyClass == "video") {
			this.project.init();
		}
		if (this.bodyClass == "stories") this.stories.init();
		if (this.bodyClass == "home") this.home.init();
		// if (this.bodyClass == "info") this.stories.init();
		if (this.bodyClass == "info") this.info.init();
		if (this.bodyClass == "contact") this.info.init();

		this.selectedStoriesContainer = $("aside.selected-stories");
		this.selectedStories = this.selectedStoriesContainer.find("li");
		this.sidebar = $(".sidebar");

		// this.selectedStoriesContainer = $(".selected-stories");
		// this.selectedStories = this.selectedStoriesContainer.find("li");

		var width, img, ratio;
		$(".project-menu li").each(function(){
			img = $(this).find("img");
			if (img.length) {
				width = Math.round($(img).attr("ratio") * 42);
				$(img).css("left", -width);
			}
		});

		$(".hover").bind("mouseover", function(){
			Website.hover.on(this);
		}).bind("mouseout", function(){
			Website.hover.off(this);
		});

		this.responsive.init();

		setTimeout(function () {
			$(window).trigger("resize");
		}, 50);

	},

	responsive: {

		menuIsVisible: false,

		init: function () {
			var self = this;
			this.container = $("#responsive-stuff");
			this.projectHeader = $(".project-responsive-header");
			// this.projectContent = this.projectHeader.next();
			// $("#responsive-menu-toggle").bind("click", function () {
			$("#responsive-menu-toggle, #responsive-stuff .responsive-header").bind("click", function () {
				self.toggleMenu();
			});
			$("#responsive-submenu-toggle, .project-responsive-header").bind("click", function () {
				self.toggleProjectMenu();
			});
		},

		toggleMenu: function () {
			if (this.menuIsVisible) {
				this.container.removeClass("visible");
			} else {
				this.container.addClass("visible");
			}
			this.menuIsVisible = !this.menuIsVisible;
		},

		toggleProjectMenu: function () {
			this.projectHeader.toggleClass('hidden');
		}

	},

	hover: {
		on: function(element) {
			// var id = $(element).attr("hover");
			var id = $(element).attr("data-hover");
			if (!Website.tiny || id.substring(0, 6) == "social") {
				$("#"+id).show();
			}
		},
		off: function(element) {
			// var id = $(element).attr("hover");
			var id = $(element).attr("data-hover");
			$("#"+id).hide();
		},
		close: function() {

		}
	},

	// hover: {
	// 	open: null,
	// 	closeTimeout: null,
	// 	timeoutFor: null,
	// 	on: function(element) {
	// 		var id = $(element).attr("hover");
	// 		if (this.open == id) {
	// 			clearTimeout(this.closeTimeout);
	// 		} else {
	// 			if (this.open) {
	// 				$("#"+this.open).hide();
	// 				this.open = false;
	// 			}
	// 			this.open = id;
	// 			$("#"+id).show();
	// 			clearTimeout(this.closeTimeout);
	// 		}
	// 	},
	// 	off: function(element) {
	// 		var id = $(element).attr("hover");
	// 		if (this.open == id) {
	// 			this.closeTimeout = setTimeout(function(){
	// 				Website.hover.close();
	// 			}, 25);
	// 			this.timeoutFor = id;
	// 		} else {
	// 			// console.log("huh...");
	// 		}
	// 	},
	// 	close: function() {
	// 		if (this.open == this.timeoutFor) {
	// 			$("#"+this.open).hide();
	// 		}
	// 		this.open = false;
	// 		this.timeoutFor = false;
	// 	}
	// },

	resize: function() {

		this.windowWidth = $(window).width();
		this.windowHeight = $(window).height();
		this.windowRatio = this.windowWidth / this.windowHeight;

		// if (this.isMobileSafari) {
		// 	$("html").addClass("tiny");
		// 	this.tiny = true;
		// } else if (this.windowHeight > 654) {
		// 	$("html").removeClass("tiny");
		// 	this.tiny = false;
		// } else {
		// 	$("html").addClass("tiny");
		// 	this.tiny = true;
		// }

		// if (this.windowHeight <= 654) {
		// 	$("html").addClass("tiny");
		// 	this.tiny = true;
		// } else {
		// 	$("html").removeClass("tiny");
		// 	this.tiny = false;
		// }
    this.tiny = false;

		if (this.windowWidth <= this.RESPONSIVE_WIDTH_THRESHOLD || this.windowHeight <= this.RESPONSIVE_HEIGHT_THRESHOLD) {
			this.inResponsiveMode = true;
		} else {
			this.inResponsiveMode = false;
		}

		// if (window.outerWidth <= 640) {
		// 	$("html").addClass("larger-menu");
		// } else {
		// 	$("html").removeClass("larger-menu");
		// }

		// if (this.windowWidth < 640) {
    if (this.windowWidth <= this.RESPONSIVE_WIDTH_THRESHOLD) {
			this.contentWidth = this.windowWidth;
		} else {
			this.contentWidth = this.windowWidth * 0.8;
		}
		this.contentHeight = this.contentWidth / 16 * 9;

		// if (this.contentHeight > this.windowHeight - 30) {
		// 	this.contentHeight = this.windowHeight - 30;
		// 	this.contentWidth = this.contentHeight / 9 * 16;
		// }

		if (this.contentHeight > this.windowHeight - 60) {
			this.contentHeight = this.windowHeight - 60;
			this.contentWidth = this.contentHeight / 9 * 16;
		}

		this.contentWidth = Math.floor(this.contentWidth);
		this.contentHeight = Math.floor(this.contentHeight);

		this.restHeight = this.windowHeight - this.contentHeight - 60;

		// selected stories
		var restHeight = 0;
		if (this.bodyClass == "info" || this.bodyClass == "contact") {
			restHeight = this.windowHeight - $(".text-page").height() - 68;
		} else if (this.bodyClass == "stories") {
			restHeight = this.windowHeight - 692;
		} else if (this.bodyClass == "home") {
			// restHeight = this.windowHeight - ($(".projects-browser nav li").length * 60) - 68;
			restHeight = this.windowHeight - $(".projects-browser nav li").height() - 68;
		}

		if (this.tiny) {
			this.selectedStoriesContainer.hide();
		} else if (restHeight >= 9 * 17) {
			this.selectedStoriesContainer.show().css("bottom", 51);
		} else if (restHeight >= 5 * 17) {
			this.selectedStoriesContainer.show().css("bottom", (restHeight - 51) / 2);
		} else {
			this.selectedStoriesContainer.hide();
		}

		// visible stories
		var count = 0;
		var visibleStories = Math.floor((Website.windowWidth - (Website.windowWidth * 0.1)) / 240);
		this.selectedStories.each(function(){
			var storyWidth = $(this).attr("class") == "featured-story" ? 2 : 1;
			if (count <= visibleStories - storyWidth) {
				$(this).show();
			} else {
				$(this).hide();
			}
			count += storyWidth;
		});

		// sidebar
		if (this.sidebar.length) {
			this.sidebar.css("width", Math.ceil(Website.windowWidth * 0.2));
		}

	},

	info: {

		backgroundImage: null,
		backgroundRatio: null,

		init: function() {

			this.backgroundImage = $(".background img");
			this.backgroundRatio = this.backgroundImage.attr("ratio");

			$(window).bind("resize", function(){ Website.info.resize(); });

		},

		resize: function() {

			if (this.backgroundImage) {

				var image = this.backgroundImage;
				var ratio = this.backgroundRatio;

				var imageWidth, imageHeight, marginLeft, marginTop;

				if (ratio > Website.windowRatio) {
					marginTop = 0;
					imageHeight = Website.windowHeight;
					imageWidth = Math.round(Website.windowHeight * ratio);
					marginLeft = -Math.floor((imageWidth - Website.windowWidth) / 2);
				} else {
					marginLeft = 0;
					imageWidth = Website.windowWidth;
					imageHeight = Math.round(Website.windowWidth / ratio);
					marginTop = -Math.floor((imageHeight - Website.windowHeight) / 2);
				}

				image.css({
					"width": imageWidth,
					"height": imageHeight,
					"margin-top": marginTop,
					"margin-left": marginLeft
				});

			}

		}

	},

	home: {

		currentProject: 0,
		backgroundTimeout: null,
		backgrounds: null,
		numberOfItems: 0,

		init: function() {

			var maxHorizontalPadding = Math.round($(window).width() * 0.05);

			this.backgrounds = $(".resizable-backgrounds li");

			$(".projects-browser nav li").each(function(){
				var id = $(this).attr("id").substring(8);
				// $(this).bind("mouseover", function(){
				// 	return function(id) {
				// 		Website.home.select(id);
				// 	}(id);
				// }).find("> a").css({
				// 	"margin-left": Math.round(Math.random() * maxHorizontalPadding)
				// });

				if (!Website.hasTouchEvents) {
					$(this).bind("mouseover", function(){
						return function(id) {
							Website.home.select(id);
						}(id);
					});
				}

				$(this).find("> a").css({
					"margin-left": Math.round(Math.random() * maxHorizontalPadding)
				});

			});

			this.numberOfItems = $(".projects-browser nav li").length;

			var id = 0;
			if (document.location.hash) {
				var slug = document.location.hash.substring(1);
				$(".projects-browser nav li").each(function(){
					if (slug == $(this).attr("slug")) {
						id = $(this).attr("id").substring(8);
					}
				});
			}
			if (id) {
				this.select(id);
			} else {
				this.select("featured");
			}

			$(window).bind("resize", function(){
				Website.home.resize();
			});

		},

		select: function(projectID) {

			if (projectID == "featured") {
				projectID = 1;
				var result = $(".projects-browser nav li.featured");
				if (result.length) {
					var row = result[0];
					projectID = $(row).attr("id").substring(8);
				}
			}

			var sizeModifier = (($(window).height() - 125) / Website.home.numberOfItems) / 55;

			if (sizeModifier > 1) {
				sizeModifier = 1;
			}

			// console.log(sizeModifier);

			$(".projects-browser nav li").each(function(){
				var id = $(this).attr("id").substring(8);
				var offset = Math.abs(id - projectID);
				var size = 56 - (offset * 8);
				var verticalPadding = 18 - (offset * 4);
				if (size < 32) size = 30;
				if (verticalPadding < 2) verticalPadding = 2;

				if (id == Website.home.numberOfItems) {
					size = 20;
				}

				size *= sizeModifier;
				verticalPadding *= sizeModifier;

				$(this).css({
					"font-size": size,
					"padding-top": verticalPadding,
					"padding-bottom": verticalPadding
				});
				if (offset === 0) {
					document.location.hash = $(this).attr("slug");
					$(this).addClass("current");
				} else {
					$(this).removeClass("current");
				}
			});

			this.currentProject = projectID;
			clearTimeout(this.backgroundTimeout);
			this.backgroundTimeout = setTimeout(function(){
				Website.home.showBackground();
			}, 350);

		},

		showBackground: function() {

			var id = this.currentProject;
			this.backgrounds.each(function(){
				var thisID = $(this).attr("id").substring(11);
				if (thisID == id) {
					$(this).fadeIn(350);
				} else {
					$(this).fadeOut(350);
				}
			});

		},

		resize: function() {

			this.backgrounds.each(function(){

				var image = $(this).find("img");
				var ratio = image.attr("ratio");

				var imageWidth, imageHeight, marginLeft, marginTop;

				if (ratio > Website.windowRatio) {
					marginTop = 0;
					imageHeight = Website.windowHeight;
					imageWidth = Website.windowHeight * ratio;
					marginLeft = -Math.floor((imageWidth - Website.windowWidth) / 2);
				} else {
					marginLeft = 0;
					imageWidth = Website.windowWidth;
					imageHeight = Website.windowWidth / ratio;
					marginTop = -Math.floor((imageHeight - Website.windowHeight) / 2);
				}

				image.css({
					"width": imageWidth,
					"height": imageHeight,
					"margin-top": marginTop,
					"margin-left": marginLeft
				});

			});

		}

	},

	project: {

		contentContainer: null,
		projectCaption: null,
		navContainer: null,

		init: function() {

			this.contentContainer = $("section.project-content");
			this.navContainer = $("nav.project-nav");
			this.projectCaption = $("div.project-caption");
			this.slideshowControls = $("div.controls");

			this.slideshow.init();

			$(window).bind("resize", function(){ Website.project.resize(); });

		},

		resize: function() {

			if (!Website.inResponsiveMode) {

				this.contentContainer.css({
					width: Website.contentWidth,
					height: Website.contentHeight,
					display: "block"
				});

				this.navContainer.css("bottom", Website.restHeight + 30);
				this.projectCaption.css("bottom", Website.restHeight + 13);
				this.slideshowControls.css("bottom", Website.restHeight + 34 + 34 - 8);

			} else {

				// this.contentContainer.css({
				// 	width: "100%",
				// 	height: "auto",
				// 	display: "block"
				// });

				this.contentContainer.css({
					width: "100%",
					display: "block"
				});

				this.contentContainer.find("> .video-embed").css("height", Website.windowWidth / 16 * 9);

			}

		},

		slideshow: {

			container: null,
			list: null,
			numberOfSlides: 0,
			slides: null,
			currentSlide: 0,
			buttonPrevious: null,
			buttonNext: null,
			slideshowStatus: null,
			imageCaption: null,
			slideWidth: 0,
			chapters: null,
			autoplayTimeout: null,
			autoplayInterval: 3500,

			init: function() {
				this.container = $(".slideshow");
				this.list = this.container.find("> ul");
				this.slides = this.list.find("> li");
				this.numberOfSlides = this.slides.length;
				this.buttonPrevious = $(".controls .prev");
				this.buttonNext = $(".controls .next");
				this.slideshowStatus = $(".controls .status");
				this.imageCaption = $(".controls .caption");
				this.chapters = $(".project-nav li.chapter");
				$(window).bind("resize", function(){
					Website.project.slideshow.resize();
				}).bind("keydown", function(){
					Website.project.slideshow.keypress(event);
				});
				if (document.location.hash) {
					this.showChapter(document.location.hash.substring(1), true);
				}
				// if (!Website.inResponsiveMode) {
					this.autoplayTimeout = setTimeout(function(){
						Website.project.slideshow.next(true);
					}, this.autoplayInterval);
				// }
			},

			keypress: function(e) {
				switch (e.which) {
					case 37: // left
					this.previous();
					e.preventDefault();
					break;
					case 39: // right
					this.next();
					e.preventDefault();
					break;
				}
				return false;
			},

			resize: function() {

				if (!Website.inResponsiveMode) {

					this.slideWidth = Website.contentWidth;

					this.list.css({
						"width": Website.contentWidth * this.numberOfSlides,
						"height": Website.contentHeight
					});

					this.slides.css({
						"width": Website.contentWidth,
						"height": Website.contentHeight
					});

					this.show();

				} else {

					this.list.css({
						"width": "100%",
						"height": "auto"
					});

					this.slides.css({
						"width": "100%",
						"height": "auto"
					});

					clearTimeout(this.autoplayTimeout);

				}

			},

			next: function(autoplay) {
				if (!autoplay) {
					clearTimeout(this.autoplayTimeout);
				} else {
					this.autoplayTimeout = setTimeout(function(){
						Website.project.slideshow.next(true);
					}, this.autoplayInterval);
				}
				this.currentSlide++;
				// if (autoplay && this.currentSlide == this.numberOfSlides) this.currentSlide = 0;
				this.show(true);
			},

			previous: function() {
				clearTimeout(this.autoplayTimeout);
				this.currentSlide--;
				this.show(true);
			},

			show: function(animate) {
				// if (this.currentSlide < 0) this.currentSlide = 0;
				// if (this.currentSlide > this.numberOfSlides - 1) this.currentSlide = this.numberOfSlides - 1;
				if (this.currentSlide < 0) this.currentSlide = this.numberOfSlides - 1;
				if (this.currentSlide > this.numberOfSlides - 1) this.currentSlide = 0;
				if (animate) {
					this.list.stop().animate({
						left: -(this.currentSlide * this.slideWidth)
					}, 350);
				} else {
					this.list.css({
						left: -(this.currentSlide * this.slideWidth)
					});
				}
				this.updateInterface();
			},

			showChapter: function(chapter, animate) {
				var found = false;
				var count = 0;
				var id = 0;
				this.slides.each(function(){
					if (!found) {
						if ($(this).attr("chapter") == chapter) {
							found = true;
							id = count;
						}
					}
					count++;
				});
				this.currentSlide = id;
				this.show(!animate);
			},

			updateInterface: function() {

				this.slideshowStatus.text((this.currentSlide+1)+" / "+this.numberOfSlides);

				// this.buttonPrevious.css({
				// 	opacity: this.currentSlide ? 1 : .1,
				// 	cursor: this.currentSlide ? "pointer" : "default"
				// });

				// this.buttonNext.css({
				// 	opacity: this.currentSlide < this.numberOfSlides - 1 ? 1 : .1,
				// 	cursor: this.currentSlide < this.numberOfSlides - 1 ? "pointer" : "default"
				// });

				var chapter = $(this.slides[this.currentSlide]).attr("chapter");
				this.chapters.each(function(){
					if ($(this).attr("chapter") == chapter) {
						$(this).addClass("current");
						document.location.hash = chapter;
					} else {
						$(this).removeClass("current");
					}
				});

				var caption = $(this.slides[this.currentSlide]).find("img").attr("alt");
				this.imageCaption.text(caption);

			}

		}

	},

	stories: {

		navContainer: null,
		storyContainer: null,
		storyWidth: 375,
		currentStory: 0,
		storiesContainer: null,
		numberOfStories: 0,
		visibleStories: 0,
		buttonPrevious: null,
		buttonNext: null,
		animationSpeed: 350,
		withSidebar: false,
		stories: null,

		init: function(withSidebar) {
			this.navContainer = $("nav.story-categories");
			this.storyContainer = $("section.story-container");
			this.storiesContainer = this.storyContainer.find("ul");
			this.numberOfStories = this.storiesContainer.find("li").length;
			this.buttonPrevious = this.storyContainer.find("a.prev");
			this.buttonNext = this.storyContainer.find("a.next");
			this.storiesContainer.css("width", this.numberOfStories * this.storyWidth);
			this.stories = this.storiesContainer.find(".story");
			$(window).bind("resize", function(){ Website.stories.resize(); });
			this.buttonPrevious.css({
				left: "20%"
			});
			// if (document.location.hash) {
			// 	var storyID = "story-"+document.location.hash.substring(1);
			// 	var count = 0;
			// 	this.stories.each(function(){
			// 		if ($(this).attr("id") == storyID) {
			// 			Website.stories.currentStory = count;
			// 		}
			// 		count++;
			// 	});
			// }
			this.parseHash();
			this.updateInterface();

			$(".story-container").bind("swipeone", function(){
				// alert("swipe");
				Website.stories.next();
			});
		},

		reInit: function () {
			var self = this;
			setTimeout(function () {
				self.parseHash();
				self.updateInterface();
				self.move(true);
			}, 25);
		},

		parseHash: function () {
			if (document.location.hash) {
				var storyID = "story-"+document.location.hash.substring(1);
				var count = 0;
				this.stories.each(function(){
					if ($(this).attr("id") == storyID) {
						Website.stories.currentStory = count;
					}
					count++;
				});
			}
		},

		resize: function() {

			if (Website.inResponsiveMode) {

				this.storyContainer.addClass('vertical');
				this.storyContainer.css("display", "block");
				this.storiesContainer.css("width", "auto");
        this.storiesContainer.css("left", "auto");

			} else {

				this.storyContainer.removeClass('vertical');
        this.storiesContainer.css("width", this.numberOfStories * this.storyWidth);

				this.visibleStories = Math.floor(Website.contentWidth / this.storyWidth);
				this.move();

				var top = 68;
				var rest = Website.windowHeight - 587;
				if (this.tiny) {
					top = Math.floor(rest / 2);
				} else {
					top = Math.floor(rest / 2);
				}

				if (top > 68) top = 68;
				if (top < 0) top = 0;

				this.storyContainer.css({
					top: top,
					display: "block"
				});

			}

		},

		updateInterface: function() {

			this.buttonPrevious.css({
				opacity: this.currentStory ? 1 : 0.1,
				cursor: this.currentStory ? "pointer" : "default"
			});

			this.buttonNext.css({
				opacity: this.currentStory < this.numberOfStories - this.visibleStories ? 1 : 0.1,
				cursor: this.currentStory < this.numberOfStories - this.visibleStories ? "pointer" : "default"
			});

			if (this.stories.length) {
				document.location.hash = $(this.stories[this.currentStory]).attr("id").substring(6);
			}

		},

		move: function(animate) {

			if (this.currentStory < 0) this.currentStory = 0;
			if (this.currentStory > this.numberOfStories - 1) this.currentStory = this.numberOfStories - 1;

			var left = -(this.currentStory * this.storyWidth);
			var totalWidth = this.numberOfStories * this.storyWidth;

			if (totalWidth < (Website.windowWidth * 0.8)) {
				left = 0;
				this.currentStory = 0;
			} else if (totalWidth + left < (Website.windowWidth * 0.8)) {
				left = (Website.windowWidth * 0.8) - totalWidth - 15;
				this.currentStory = this.numberOfStories - this.visibleStories;
			}

			left += Website.windowWidth * 0.2;

			if (animate) {
				this.storiesContainer.stop().animate({
					left: left
				}, this.animationSpeed);
			} else {
				this.storiesContainer.css("left", left);
			}

			this.updateInterface();

		},

		next: function() {
			if (!Website.inResponsiveMode) {
				this.currentStory += this.visibleStories;
				this.move(true);
			}
		},

		previous: function() {
			if (!Website.inResponsiveMode) {
				this.currentStory -= this.visibleStories;
				this.move(true);
			}
		}

	}

};

$(function(){ Website.init(); });
