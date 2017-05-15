if(!staimg)
{
	var staimg = 1;
	var refer=encodeURIComponent(document.referrer);
	hostnamereg=/.*[\.]?(vogue|gq|self|adstyle|cntraveler)\.com\.cn$/i;
	nicknamereg=/(;?)(\s?)(vogue|gq|self|adstyle|cnt)bbsnickname=([^;]*);?/;
	uidreg=/(;?)(\s?)(vogue|gq|self|adstyle|cnt)bbsuid=([^;]*);?/;

	condenastuid=0;
	condenastnickname="";
	condenasthost=location.hostname.replace(hostnamereg,"$1");
	$tempstr=document.cookie.replace(/(;?)(\s?)condetotalsession=([^;]*);?/);
	condenasthostsession=RegExp.$3;
	if(condenasthost != location.hostname)
	{
		tempstr=document.cookie.replace(nicknamereg);
		condenastnickname=encodeURIComponent(RegExp.$4);
		tempstr=document.cookie.replace(uidreg);
		condenastuid=encodeURIComponent(RegExp.$4);
	}
	var _hmRequestUrl = (("https:" == window.location.protocol) ? "https://sdc.self.com.cn/total.php" : "http://sdc.adstyle.cn/total.php");
    document.write("<script language=\"javascript\" type=\"text/javascript\" src=\""+_hmRequestUrl+"?ref="+refer+"&u="+condenastuid+"&n="+condenastnickname+"&hs="+condenasthostsession+"\"></script>");
}
