/*
Bones Scripts File
Author: Eddie Machado

This file should contain any js scripts you want to add to the site.
Instead of calling it in the header or throwing it inside wp_head()
this file will be called automatically in the footer so as not to
slow the page load.
*/

function getSliderSkin(id, options) {
	selector = jQuery('div[data-slider_id=' + id + ' ]');
    height = options.height.replace(/[^\d.]/g, "");
    width = options.width.replace(/[^\d.]/g, "");
    if ( ! options.chrome )
      selector.addClass('ssp_no_chrome_slider_default');
    if ( options.h_responsive == false || options.h_responsive == '' ) {
      jQuery('.slides .slide', selector).each( function() {
        if ( ! Number( height ) <= 0 )
         jQuery(this).css( 'height', height + 'px' );
      });
    }
    if ( options.w_responsive == false || options.w_responsive == '' ) {
      if ( ! Number( width ) <= 0 )
		jQuery( selector ).css( 'width', width + 'px' );
    }
    jQuery(selector).flexslider( {
    	smoothHeight: options.h_responsive,
      	animation: options.animation,
		direction: options.direction,
		slideshow: options.slideshow,
		slideshowSpeed: Number( options.cycle_speed ) * 1000,
		animationSpeed: Number( options.animation_speed ) * 1000,
		pauseOnHover: options.pause_on_hover,
		controlNav: options.control_nav,
		directionNav: options.direction_nav,
		keyboard: options.keyboard_nav,
		touch: options.touch_nav
    });
}

/* @NOTE The code commented below is just for save examples of GA events options and can be removed after */
/*
function fireGAEvent(opts) {
	if (window.dataLayer){
		window.dataLayer.push(opts);
	}
}
function fireSocialClickGAEvent(socialSite) {
	fireGAEvent({
			event: 'GA event',
			priority: 1,
			category: 'outbound_social_links',
			action: 'click',
			label: socialSite
		});
}
jQuery(function($){
    //for ads
    if ( typeof(baseDataLayer) != 'object'){ 
		fireGAEvent({
				event: 'VPV'
		});
	}
	jQuery(".download").click(function(){
        fireGAEvent({
            event: 'GA event',
            priority: 1,
            category: 'whitepaper',
            action: 'download',
            label: jQuery(".download a").attr('href')
        });
    });
});
*/