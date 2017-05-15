/**
 * DFP.js 1.4.2
 *
 * Copyright (c) 2015 Cameron Terry
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

var googletag = googletag || {};
googletag.cmd = googletag.cmd || [];

( function ( $ ) {
    /**
     * Quote from DFP support; "boiler-plate that asynchronously loads the
     * GPT JavaScript library used by DFP, using SSL/HTTPS if necessary".
     */
    var gads = document.createElement( 'script' );
    gads.async = true;
    gads.type = 'text/javascript';
    var useSSL = 'https:' == document.location.protocol;
    gads.src = ( useSSL ? 'https:' : 'http:' ) +
                '//www.googletagservices.com/tag/js/gpt.js';
    var node = document.getElementsByTagName( 'script' )[0];
    node.parentNode.insertBefore( gads, node );

    /**
     * DFP global management object.
     */
    var dfp = {
        collapsable : false,
        video : false,
        ad_slots : [],
        ad_slots_processed : 0,
        ad_slots_requested : 0,
        network : '',
        targeting_all : [],
        zone : '',
        defineSlots : function () {
            dfp.ad_slots_processed = 0;
            dfp.ad_slots_requested = $( 'div[rel="advert"]:visible' ).length;

            $( 'div[rel="advert"][data-ad-complete!="yes"]:visible' ).each( function () {
                var $this = $( this );
                var id = dfp.getID( $this );
                var advert = null;

                if ( 'yes' === $this.data( 'oop' ) ) {
                    advert = googletag.defineOutOfPageSlot( dfp.network + dfp.zone, id );
                }
                else {
                    advert = googletag.defineSlot( dfp.network + dfp.zone, dfp.getSizes( $this.data( 'sizes' ) ), id );
                }

                dfp.setTargetingSingle( $this.data( 'targeting' ), advert );
                dfp.setCompanionSingle( $this.data( 'companion' ), advert );

                advert.addService( googletag.pubads() );

                dfp.ad_slots[id] = advert;
            });
        },
        get : function ( slot ) {
            for ( var id in dfp.ad_slots ) {
                if ( slot === dfp.ad_slots[id] ) {
                    return $( '#' + id );
                }
            }
        },
        getID : function ( el ) {
            if ( el.attr( 'id' ) ) {
                return el.attr( 'id' );
            }

            var NewID = 'div-gpt-ad-' + Math.random().toString( 36 ).substr( 2, 9 );
            el.prop( 'id', NewID );

            return NewID;
        },
        getSizes : function ( size_string ) {
            return $.map( size_string.split( ',' ), function ( el, i ) {
                var wh = el.split( 'x' );
                return [[Number( wh[0] ), Number( wh[1] )]];
            } );
        },
        setCompanionSingle : function ( companion_definition, advert ) {
            if ( companion_definition && companion_definition === 'yes' ) {
                advert.addService( googletag.companionAds() );
            }
        },
        setTargetingAll : function () {
            for ( var i = 0; i < dfp.targeting_all.length; ++i ) {
                googletag.pubads().setTargeting( dfp.targeting_all[i].key, dfp.targeting_all[i].value );
            }
        },
        setTargetingSingle : function ( target_definition, advert ) {
            if ( target_definition ) {
                var targets_array = target_definition.split( '|' );

                for ( var i = 0; i < targets_array.length; ++i ) {
                    var key_value = targets_array[i].split( '=' );

                    /**
                     * Make the call to setTargeting on the GPT adSlot object.
                     */
                    advert.setTargeting( key_value[0], ( key_value[1].indexOf( ',' ) === -1 ? key_value[1] : key_value[1].split( ',' ) ) );
                }
            }
        },
        cycle : function() {
            dfp.defineSlots();

            var ad_slot_ids = dfp.display();
            var ad_slots = [];

            for ( var i = 0; i < ad_slot_ids.length; ++i ) {
                ad_slots.push( dfp.ad_slots[ad_slot_ids[i]] );
            }

            googletag.pubads().refresh( ad_slots );
        },
        display : function () {
            var return_val = [];

            $( 'div[rel="advert"][data-ad-complete!="yes"]:visible' ).each( function () {
                var $this = $( this );
                var ad_id = $this.attr( 'id' );

                googletag.cmd.push( function () {
                    googletag.display( ad_id );
                } );

                $this.attr( 'data-ad-complete', 'yes' );
                return_val.push( ad_id );
            } );

            return return_val;
        },
        enable : function () {
            googletag.cmd.push( function () {
                dfp.defineSlots();
                dfp.setTargetingAll();

                googletag.pubads().enableAsyncRendering();

                /**
                 * Whilst it does not state it anyway (that I can find), "Single Request"
                 * is a pre-requisite for Companion Ads.
                 */
                googletag.pubads().enableSingleRequest();

                /**
                 * Hooking event logic so developers can do post ad rendering logic.
                 *
                 * https://developers.google.com/doubleclick-gpt/reference#googletag.Service_addEventListener
                 */
                googletag.pubads().addEventListener( 'slotRenderEnded', function( slot_data ) {
                    dfp.ad_slots_processed++;

                    /**
                     * Retrieve the actual HTML element attached to the slot. This is used to
                     * return as part of the event trigger as well as to trigger events on the
                     * actual slot itself, so developer's can target an advert specifically
                     * after it is loaded.
                     */
                    var $slot_element = dfp.get( slot_data.slot );

                    /**
                     * Construct the callback data object.
                     */
                    var callback_data = {
                        creative_id : slot_data.creativeId,
                        is_empty : slot_data.isEmpty,
                        el : $slot_element,
                        line_item_id : slot_data.lineItemId,
                        size : slot_data.size,
                    };

                    var render_event = $.Event( 'rendered' );
                    /** Fire the event for the actual advert element being rendered. */
                    $slot_element.trigger( render_event, callback_data );

                    /**
                     * Save other developers of adverts is empty if statements and fire a
                     * separate event.
                     */
                    if ( slot_data.isEmpty ) {
                        var empty_event = $.Event( 'empty' );
                        $slot_element.trigger( empty_event, callback_data );
                    }

                    /** Catch all event to say an ad slot is rendered. */
                    $( window.dfp ).trigger( 'slot_rendered', callback_data );

                    /** Trigger an event which says all Ads on the page have been rendered. */
                    if ( dfp.ad_slots_requested === dfp.ad_slots_processed ) {
                        $( window.dfp ).trigger( 'complete' );
                    }
                });

                /**
                 * If the ad tags have elements around them, then it's best to collapse
                 * the ad tag so that the rest of the elements move into it's place.  This
                 * is instead of leaving a "hole" on the page.
                 */
                googletag.pubads().collapseEmptyDivs( dfp.collapsable );
                googletag.enableServices();

                dfp.display();
            } );
        },
        refresh : function ( id ) {
            googletag.pubads().refresh( [dfp.ad_slots[id]] );
        },
        refreshAll : function () {
            googletag.pubads().refresh();
        },
        takeover : function ( data ) {
            var $body = $( 'body' );

            var $link = $( '<a class="takeover" href="' + data.url + '" target="_blank"></a>' );
            $link.css( 'background-image', 'url(' + data.image + ')' );

            /** Check for a tracker and if so, then create an image tag. */
            if ( data.impressiontracker && '' !== $.trim( data.impressiontracker ) ) {
                $body.prepend( '<img src="' + data.impressiontracker + '" style="display:none;" />' );
            }

            $body.prepend( $link );
        }
    };

    window.dfp = dfp;
} )( jQuery );
