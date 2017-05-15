function checkMobile(){
	var isiPad = navigator.userAgent.match(/iPad/i) != null;
	if(isiPad){
		return false;
	}
	var isMobile=navigator.userAgent.match(/iphone|android|phone|mobile|wap|netfront|java|opera mobi|opera mini|ucweb|windows ce|symbian|symbianos|series|webos|sony|blackberry|dopod|nokia|samsung|palmsource|xda|pieplus|meizu|midp|cldc|motorola|foma|docomo|up.browser|up.link|blazer|helio|hosin|huawei|novarra|coolpad|webos|techfaith|palmsource|alcatel|amoi|ktouch|nexian|ericsson|philips|sagem|wellcom|bunjalloo|maui|smartphone|iemobile|spice|bird|zte-|longcos|pantech|gionee|portalmmm|jig browser|hiptop|benq|haier|^lct|320x320|240x320|176x220/i)!= null;
	if(isMobile){
	  	return true;
	}
	return false;
}
if(checkMobile()){
	var meta = document.getElementsByName('mobileurl');
	if(meta.length > 0 && meta[0].content != ''){
		window.location.href = meta[0].content;
	}
}
