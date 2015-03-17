/*
window.fbAsyncInit = function () {
	 // init the FB JS SDK
	 FB.init({
	 appId:'806315612789555', // App ID from the App Dashboard
	 status:true, // check the login status upon init?
	 cookie:true, // set sessions cookies to allow your server to access the session?
	 xfbml:true // parse XFBML tags on this page?
});
FB.getLoginStatus(function (response) {
	if (response.status === 'connected') {
		// the user is logged in and has authenticated your
		// app, and response.authResponse supplies
		// the user's ID, a valid access token, a signed
		// request, and the time the access token
		// and signed request each expire
 		var uid = response.authResponse.userID;
 		var at = response.authResponse.accessToken;
 		// This is your messaging to the parent of the iFrame
		parent.postMessage({connectStatus:"" + response.status + "", userID:"" + uid + "", accessToken:"" + at + ""}, "http://localhost/Users/wondachue/Documents/school/human_comp_inter/TomodachiRoll/popup.html"); //This MUST match the root domain where the iFrame will be inserted, or the message won't get passed
	} 
	else if (response.status === 'not_authorized') {
 		// the user is logged in to Facebook,
 		// but has not authenticated your app
 	} 
 	else {
 		// the user isn't logged in to Facebook.
 	}
});
};
// Load the SDK's source Asynchronously
// Note that the debug version is being actively developed and might
// contain some type checks that are overly strict.
// Please report such bugs using the bugs tool.
(function (d, debug) {
	var js, id = 'facebook-jssdk', ref = d.getElementsByTagName('script')[0];
	if (d.getElementById(id)) {
 		return;
 	}
 	js = d.createElement('script');
 	js.id = id;
 	js.async = true;
 	js.src = "https://connect.facebook.net/en_US/all" + (debug ? "/debug" : "") + ".js";
 	ref.parentNode.insertBefore(js, ref);
}(document, */ /*debug*/ /* true)); */