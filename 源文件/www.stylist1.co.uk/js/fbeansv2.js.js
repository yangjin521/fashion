function newnavigation(type){						
		
	//If it's not a touch screen device (i.e. tablet) then we can do fancy things with the navigation...
	if ( !is_touch_device() ) {
	
	//Load the hover intent drop down menus
	newdropdowns();
	
	//We can do hover over drop down menus and associated click to open/close	
	navClicks();
	
	// on scroll, 
	$(window).on('scroll',function(){		
		
		if ($(".homeATFHPU").innerHeight() > 300) {
			$(".instagramHome").css("display", "none");
		}
		else {
			$(".instagramHome").css("display", "block");	
		}
		//Get the top of the navigation height so we can fix it when we reach it.
		//var mainbottom = $('.navigation').offset().top;
		var mainbottom = $('.navAd').innerHeight();
	
		//This is the bodymargin we need to use - it's the above ad space plus the height of the condensed nav (75px) and secondary nav (45px) = 120
		bodymargin = mainbottom + 120;
		
		//The sub nav should close after ad height plus nav and subnav, plus wrapper padding and 200px more
		//var subclose = mainbottom + 130;
		var subclose = $('#wrapper').offset().top;
					
		// we round here to reduce a little workload
		stop = Math.round($(window).scrollTop());
		
			if (stop > mainbottom) {
				
				//So if we hit the navigation, fix it to the roof of the browser
				$('header').addClass('fixed');
				$('body').css("margin-top", bodymargin);
				//Reset the position of the drop down menu as height above it will have changed
				//$('.multi_menu').css("top", 74);
				
				//Carry on scrolling until we hit the main content wrapper and then slide up the sub navigation
				if (stop > subclose) {
					if (!$( "#submenuIcon span" ).hasClass( "subopen" )) {
						$( "#secondarynavContainer" ).slideUp('fast');
						$('#submenuIcon span').removeClass('subopen');
						$('.submenu').show('fast');
						$('.sub-arrow').css("visibility", "hidden");
					}				
				}
				if (stop < $('#wrapper').offset().top) {
					$('#secondarynavContainer').css("display", "block");
					$('.submenu').hide('fast');
					$('.sub-arrow').css("visibility", "visible");
					$('#searchform').css("display", "");
					$('.subnavSearchBox').css("width", "40px");
					$('#submenuIcon span').removeClass('subopen');
				}
				
			}
			
			else {
				//When we get back to the top, reset all the styles
				$('header').removeClass('fixed');
				$('.submenu').hide('fast');
				$('#secondarynavContainer').css("display", "block");
				$('.sub-arrow').css("visibility", "visible");
				$('#searchform').css("display", "");
				$('.subnavSearchBox').css("width", "40px");
				$('body').css("margin-top", "0");
				$('#submenuIcon span').removeClass('subopen');
			}

	}); //End of scroll function
	
	} 
	else {
		navClicks('tablet');	
		tabletNav();
	}; //End of touch device test
	
};

function is_touch_device() {
	//returns whether it's a touch device or not
  	return !!('ontouchstart' in window);
};

function newdropdowns(){

   var config = {    
		sensitivity: 3, // number = sensitivity threshold (must be 1 or higher)    
		interval: 100,  // number = milliseconds for onMouseOver polling interval    
		over: doOpen,   // function = onMouseOver callback (REQUIRED)    
		timeout: 200,   // number = milliseconds delay before onMouseOut    
		out: doClose    // function = onMouseOut callback (REQUIRED)    
	};
		
	function doOpen() { //Do this on hover over
		//If the current nav item has a drop down menu...
		if ($(this).find('div.multi_menu').length) {
		
			//Add a hover class to the nav item and show the drop down menu
			$(this).addClass("hover");
			$('div.multi_menu',this).css('visibility', 'visible');
			$('.closemenu').css('visibility', 'hidden');
			
			//If the current nav item has a hover class set (see above), fade the rest of the screen and hide the sub arrow
			if ($(this).hasClass("hover")) ( 	
				$('div.siteoverlay').css('display', 'block'),
				$('.sub-arrow').css('visibility', 'hidden')
			)
		}
		//If the most popular link has a drop down menu showing popular content...
		if ($(this).find('div#popDrop').length) {
			//Fade the rest of the screen and show popular content drop down menu
			$('div.siteoverlay').css('display', 'block');
			$('div#popDrop', this).css('visibility', 'visible');
			$('.closemenu').css('visibility', 'hidden');
		}		
	} //end of function doOpen()
			 
	function doClose() { //Do this on hover out
		//Remove the hover class and screen fade, and hide the drop down menu (nav or popular articles)
		$(this).removeClass("hover");		
		$('div.multi_menu',this).css('visibility', 'hidden');
		$('div#popDrop', this).css('visibility', 'hidden');
		
		//If there isn't a hover class anywhere on the page (i.e. we no longer hovering over the drop down menu)
		if (!$(".hover")[0]){
			//Remove the site fade
			$('div.siteoverlay').css('display', 'none')
			
			//And put the sub nav icon back if subnav is showing (grey bar)
			if ($('#secondarynavContainer').is(':visible') ) {
				$('.sub-arrow').css('visibility', 'visible')
			}
			
		}		
		
	} //end of function doOpen()
	
	//Set hoverintent for each of the navigation buttons
	$("ul.topnavnewblack li").hoverIntent(config);
	//Set hoverintent for the most popular content drop down list
	$(".popularLink").parent().hoverIntent(config);
	
	$('.multi_menu').on({
    'mousewheel': function(e) {
        e.preventDefault();
        e.stopPropagation();
    }
	})
    
};

function tabletNav() {
	$('.multi_menu').css('position', 'absolute');
	$('.multi_menu').css('top', '74px');

	jQuery("ul.topnavnewblack li a").click(function (event) {		
		//Check if the menu item we just clicked has a drop down menu (i.e. a div with class multi_menu)					
		if ( $(this).parent().has('div.multi_menu').length > 0 ) {
					
				//Stop the user from following the click so we can show sub menu
				event.preventDefault();
				
				//Now do the CSS changes on this menu item...
				cssNavChanges($(this).parent());
		}		
	});
	
	function cssNavChanges(menuitem) {				
		
		if (jQuery('div.multi_menu',menuitem).css('visibility') == 'hidden' ) {
			//Reset the menu styles (get rid of any open menu and remove the hover class
			$('div.multi_menu').css('visibility', 'hidden');
			$('li').removeClass('hover');
			
			//Then open the drop down menu of the one you clicked and add a hover class
			$('div.multi_menu',menuitem).css('visibility', 'visible'); 
			$(menuitem).addClass('hover');
			$('div.siteoverlay').css('display', 'block');
			
			//Sub nav stuff
			$('.sub-arrow').css('visibility', 'hidden');			
			$('.popularLink').css('text-decoration', 'none');
			$('div#popDrop').css('visibility', 'hidden');
			//$('li.mensfashion .topnav').css('background-position', '');
			//$('li.mensstyle .topnav').css('background-position', '');
			//$('li.menshair .topnav').css('background-position', '');
		}
		else {
			$('div.multi_menu',menuitem).css('visibility', 'hidden');
			$(menuitem).removeClass('hover');
			$('.sub-arrow').css('visibility', 'visible');
			$('div.siteoverlay').css('display', 'none');
		}	
				
	};	
	
	jQuery("span.closemenu").click(function (event) {
		//Main menu drop down close
		$('div.multi_menu').css('visibility', 'hidden');
		$('li').removeClass('hover');
		//Popular articles drop down close
		$('div#popDrop').css('visibility', 'hidden');
		$('.popularLink').css('text-decoration', 'none');
		$('.sub-arrow').css('visibility', 'visible');
		$('div.siteoverlay').css('display', 'none');
	});
	
	jQuery(".popularLink").click(function (event) {
		
		//Stop the user from following the click so we can show the popular articles menu
		event.preventDefault();
		
		if (jQuery('div#popDrop').css('visibility') == 'hidden' ) {
			$('div.multi_menu').css('visibility', 'hidden');
			$('div#popDrop').css('visibility', 'visible');
			$('.popularLink').css('text-decoration', 'underline');
			$('div.siteoverlay').css('display', 'block');
		}
		else {
			$('div#popDrop').css('visibility', 'hidden');
			$('.popularLink').css('text-decoration', 'none');
			$('div.siteoverlay').css('display', 'none');
		}
	
	});
		
} //end of tabletNav()

function navClicks(type) {
	
	//This opens search box on compact navigation on search icon click
	jQuery("#searchIcon").click(function () {
		if (jQuery("#searchform").is(":hidden")) {
			//Close any open menus
			$('div.multi_menu').css('visibility', 'hidden');
			$('div#popDrop').css('visibility', 'hidden');
			$('div.siteoverlay').css('display', 'none');
			$('li').removeClass('hover');
			
			if ( is_touch_device() ) {
				$('.sub-arrow').css('visibility', 'visible');
			}
			
			//Open search form
			$('#searchform').css("display", "block");			
			$('.popularLink').css('text-decoration', 'none');
			$( ".subnavSearchBox" ).focus();
			
			if (jQuery("#submenuIcon").is(":hidden")) {	
				$( '.subnavSearchBox' ).animate({width:'760px'},500);
			} else {
				$( '.subnavSearchBox' ).animate({width:'710px'},500);
			}			
		}
	});
	
	//This closes search box on condensed navigation on ANY outside click
	document.addEventListener("click",function(e){
		var clickedID = e.target.id;
	
		if (clickedID != "searchform" && clickedID != "searchIcon" && clickedID != "thesearchbox" ) {
			$( '.subnavSearchBox' ).animate({width:'0px'},500);
			$('#searchform').css("display", "");							
		}
		else {
			e.stopPropagation();
		}						
	});				
	
	//If it's not a tablet/touch device, we need to alter how clicks are handled for drop down menus
	if (!(type == 'tablet')) {
		jQuery("#submenuIcon").click(function () {
			//If the secondary navigation isn't open, open it
			if (jQuery("#secondarynavContainer").is(":hidden")) {
				$('#secondarynavContainer').show();
				$('#submenuIcon span').addClass('subopen');
				$('.sub-arrow').css("visibility", "visible");
			} else {
				//If it's already open, close it
				$('#secondarynavContainer').hide();
				$('#submenuIcon span').removeClass('subopen');
				$('.sub-arrow').css("visibility", "hidden");
			}
			//If the search form is open, shut it
			if (jQuery("#searchform").is(":visible"))  {	   
				$('#searchform').css("display", "");
				$('.subnavSearchBox').css("width", "40px");
			}
		});
	}
};

//EU Cookie Directive
function cookiepolicy(){
if( $.cookie('fb_cookies') != 'Yes' ) {
		// display message
		$("#cookie-bar").css("display","block");
		
		// set cookie
		$.cookie("fb_cookies", 'Yes', { 
			expires : 365,
			path: '/'
		});
	}
    
    /* dismiss cookie click */
    $("#cookie-dismiss").click(function(e) {
    	$("#cookie-bar").fadeOut();
    	e.preventDefault();
    })
};

// jQuery cookie functions - add, read and delete cookies
(function ($, document, undefined) {

	var pluses = /\+/g;

	function raw(s) {
		return s;
	}

	function decoded(s) {
		return decodeURIComponent(s.replace(pluses, ' '));
	}

	var config = $.cookie = function (key, value, options) {

		// write
		if (value !== undefined) {
			options = $.extend({}, config.defaults, options);

			if (value === null) {
				options.expires = -1;
			}

			if (typeof options.expires === 'number') {
				var days = options.expires, t = options.expires = new Date();
				t.setDate(t.getDate() + days);
			}

			value = config.json ? JSON.stringify(value) : String(value);

			return (document.cookie = [
				encodeURIComponent(key), '=', config.raw ? value : encodeURIComponent(value),
				options.expires ? '; expires=' + options.expires.toUTCString() : '', // use expires attribute, max-age is not supported by IE
				options.path    ? '; path=' + options.path : '',
				options.domain  ? '; domain=' + options.domain : '',
				options.secure  ? '; secure' : ''
			].join(''));
		}

		// read
		var decode = config.raw ? raw : decoded;
		var cookies = document.cookie.split('; ');
		for (var i = 0, parts; (parts = cookies[i] && cookies[i].split('=')); i++) {
			if (decode(parts.shift()) === key) {
				var cookie = decode(parts.join('='));
				return config.json ? JSON.parse(cookie) : cookie;
			}
		}

		return null;
	};

	config.defaults = {};

	$.removeCookie = function (key, options) {
		if ($.cookie(key) !== null) {
			$.cookie(key, null, options);
			return true;
		}
		return false;
	};

})(jQuery, document);

//For iPad Sliding of Carousels
function touchwipe(carousel) {
	
	jQuery(carousel).touchwipe({
        wipeLeft: function(e) {
			e.preventDefault();
            jQuery(carousel).jcarousel('next');
        },
        wipeRight: function(e) {
			e.preventDefault();
            jQuery(carousel).jcarousel('prev');
        },
		preventDefaultEvents: false
    });
	
};

//MAIN ARTICLE SCROLLERS
//articleScroller() = initiates the main feature article scroller
//nexslide() = animates the slide to fade in and out so ipad scrolling doesn't lag
//articlecarousel_initCallback() = the callback that makes the direction arrows come on with hover, adds the squares navigation etc.
function articleScroller() {
	
	jQuery('.articleShowcase').jcarousel({
		scroll: 1, animation:600, visible:1, auto:5, wrap:'both', pauseOnHover: true,
		initCallback: homeScroller_Callback,
		itemVisibleInCallback: { onAfterAnimation: nextArticle }		
	});  		
	
};

function nextArticle(c, o, i, s) {
	i = (i - 1) % $('.articleShowcase li').size();
								
	//The scroller navigation buttons
	jQuery('.scrollerNav a').removeClass('active').addClass('inactive');				
	jQuery('.scrollerNav a:eq(' + i + ')').removeClass('inactive').addClass('active');
				
};
		
function homeScroller_Callback(carousel) {
	
	jQuery('.scrollerNav a').bind('click', function() {
		carousel.scroll(jQuery.jcarousel.intval(jQuery(this).text()));
		return false;
	});
							
	// Pause autoscrolling if the user moves with the cursor over the clip.
	carousel.clip.hover(function() {
		carousel.stopAuto();
	}, function() {
		carousel.startAuto();
	});

};

//FEATURE/FULL WIDTH ADVERTORIALS
function featureScroller() {
	
	jQuery(".articleShowcase").jcarousel({
		scroll: 1, animation:800, visible:1, auto:7, wrap:"both", pauseOnHover: true,
		initCallback: advertorial_Callback,
		itemVisibleInCallback: { onAfterAnimation: nextArticle }
	});

};

function advertorial_Callback(carousel) {
					
	//Set direction as zero
	var direction = "";
					
	$(".articleShowcase").mouseenter(function(){
		direction = "out";
		next_prev(direction);
	});
					
	$(".articleShowcase").mouseleave(function(){
		direction = "in"
		next_prev(direction);
	});
						
	function next_prev(){
		if(direction == "out")
		{
			$(".articleShowcase .jcarousel-next-horizontal").css({"top":"50%","margin-top":"-30px","display":"none"}).fadeIn(300);
			$(".articleShowcase .jcarousel-prev-horizontal").css({"top":"50%","margin-top":"-30px","display":"none"}).fadeIn(300);
		} else {
			$(".articleShowcase .jcarousel-next-horizontal").fadeOut(300);
			$(".articleShowcase .jcarousel-prev-horizontal").fadeOut(300);
		}		
	}
	
	jQuery(".scrollerNav a").bind("click", function() {
		carousel.scroll(jQuery.jcarousel.intval(jQuery(this).text()));
		return false;
	});
							
	// Pause autoscrolling if the user moves with the cursor over the clip.
	carousel.clip.hover(function() {
		carousel.stopAuto();
	}, function() {
		carousel.startAuto();
	});
		
};

//ARTICLES SCROLLER
function scroller(theClass, theCallback, scrollAmount, wrapStyle, visibleSlides, afterAnimation) {
		
	jQuery(theClass).jcarousel({
		scroll: scrollAmount,
		wrap: wrapStyle,		
		animation: 600, 
		visible: visibleSlides,				
        initCallback: theCallback,								
        buttonNextHTML: null,
		buttonPrevHTML: null,			
		itemVisibleInCallback: { onAfterAnimation: afterAnimation }				
	}); 	
	
};

//FBTV Homepage Scroller Callback Functions
function buttons_callback(carousel) {
			
	jQuery('.arrow-next').bind('click', function() {
		carousel.next();
		return false;
	});

    jQuery('.arrow-prev').bind('click', function() {
		carousel.prev();
		return false;
	});	
	  
};

//LOOKBOOK SCROLLER CALLBACK FUNCTIONS
function lookbooks_callback(carousel) {
	
	jQuery('#lookbook-next').bind('click', function() {
            carousel.next();
            return false;
        });
    
        jQuery('#lookbook-prev').bind('click', function() {
            carousel.prev();
            return false;
        });
		
};

//COLOURBOX - Load Larger Lookbook Images In A Lightbox On Same Page
function enlargeLookbook(enlargetype, itemwidth, itemheight) {

if (enlargetype == "iframe") {
	jQuery(".iframe").colorbox({iframe:true, width:itemwidth, height:itemheight});
}
else if (enlargetype == "hairstyles") {
	jQuery(".enlarge").colorbox({width:"600px"});	
}
else {
	jQuery(".enlarge").colorbox({rel:"enlarge", width:itemwidth, height:itemheight});
}

};

//TOOLTIPS - SITE NAV BAR, SOCIAL STUFF & ARTICLE LOOKBOOKS
function tooltips() {
	
	jQuery("a.hotspot").qtip( 
	{
		content: {
			attr: "title" // Use the ALT attribute of the area map for the content
		},
		style: {
			classes: "ui-tooltip-lookbooks ui-tooltip-shadow" //Style For The Tooltip
		},
		position:{
			at:"right top",my:"left center",viewport:$(window),effect:false,adjust:{x:0, y:9} //Set and slightly adjust position of tooltip
		}
	});
	
	jQuery("area[alt]").qtip(
	{
		content: {
			attr: "alt" // Use the ALT attribute of the area map for the content
		},
		style: {
			classes: "ui-tooltip-lookbooks ui-tooltip-shadow" //Style For The Tooltip
		},
		position:{
			at:"right top",my:"left center",viewport:$(window),effect:false,adjust:{x:-20, y:100} //Set and slightly adjust position of tooltip
		}
	});
	
	jQuery('.streetStyle li img').each(function() {
		var thumb = jQuery(this).attr('src'), full, content;

		// Create the fullsize image with a link
		content = jQuery('<a />', { 
			href: jQuery(this).parent().attr('href'),			
		})
		.append( jQuery('<img />', { src: thumb }) );
		
		// Create the tooltip
		jQuery(this).qtip({
			content: {
				text: content,
				title: {
					text: jQuery(this).attr('alt') // Use the image ALT text for the title
				}
			},
			position: {
				my: 'center',
				at: 'center',
				viewport: $(window)
			},
			hide: {
				fixed: true
			},
			style: {
				classes: "ui-tooltip-sitebar ui-tooltip-shadow"
			}
		});
	});
	
}; 

//STREET STYLE PAGES - SWITCH MAIN IMAGE WHEN CLICK THUMBNAILS
function streetGallery() {
	
	jQuery(".gallery-thumb").click(function(){
			jQuery("#image").attr("src",jQuery(this).attr("href")).width(jQuery(".zoomImage").width()).css({"left":0,"top":0});
			jQuery("#handle").css("left",0);
			return false;
	});	
	
};

//READ MORE TEXT - FOR PAGES SUCH AS FBTV DESCRIPTIONS
function moreText() {

if ( $(".lookbookCPM").height() < 500 ) {
	$(".videoContent").css('width', '100%');
}

	// The height of the content block when it's not expanded
	var adjustheight = 125;
	// The "more" link text
	var moreText = "Show More Description";
	// The "less" link text
	var lessText = "Show Less Description";
	
	//Test if the more block is taller than the adjust height first - otherwise no point

	if ($(".more-block").height() > adjustheight) {
		
		// Sets the .more-block div to the specified height and hides any content that overflows
		$(".more-less .more-block").css('height', adjustheight).css('overflow', 'hidden');
		
		// The section added to the bottom of the "more-less" div
		$(".more-less").append('<a href="#" class="adjust"></a>');
		
		$("a.adjust").text(moreText);
		
		$(".adjust").toggle(function() {
				$(this).parents("div:first").find(".more-block").css('height', 'auto').css('overflow', 'visible');
				// Hide the [...] when expanded
				$(this).parents("div:first").find("p.continued").css('display', 'none');
				$(this).text(lessText);
			}, function() {
				$(this).parents("div:first").find(".more-block").css('height', adjustheight).css('overflow', 'hidden');
				$(this).parents("div:first").find("p.continued").css('display', 'block');
				$(this).text(moreText);
		});
	
	}; //End initial more-block height test

};

//JQUERY VALIDATE - VALIDATE FORMS AND INPUTS ON THE SITE
function validateForms(validationClass) {
	
	jQuery(validationClass).validate();
	
};


