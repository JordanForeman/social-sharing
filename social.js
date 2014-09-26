var Social = {

	Config: {
		FACEBOOK_APP_ID: 'YOUR FACEBOOK APP ID',
		TWITTER_ACCOUNT: 'YOUR TWITTER USERNAME'
	},

	init: function(config) {

		this.Config = config || this.Config;

		this.Facebook.init();
		this.Pinterest.init();
		this.Twitter.init();
		this.GooglePlus.init();
	},
	
	/* FACEBOOK API */
	Facebook: {

		init: function() {

			this.facebookShareButton = document.querySelector(".facebook-share");

			window.fbAsyncInit = function() {
				FB.init({
					appId      : Social.Config.FACEBOOK_APP_ID,
					xfbml      : true,
					version    : 'v2.1'
				});
			}.bind(this);

			(function(d, s, id){
				var js, fjs = d.getElementsByTagName(s)[0];
				if (d.getElementById(id)) return;
				js = d.createElement(s); js.id = id;
				js.src = "http://connect.facebook.net/es_LA/sdk.js";
				fjs.parentNode.insertBefore(js, fjs);
			}(document, 'script', 'facebook-jssdk'));
		},

		shareToFacebook: function(urlToShare) {
			var pageURL = urlToShare || window.location.href;
			
			FB.ui({
				method: 'share',
				href: pageURL
			}, function(response){
				console.log(response);
			});
		},

		getFBShareCount: function(urlToCheck, callback) {
			var pageURL = urlToCheck || window.location.href,
				ajaxURL = encodeURIComponent('http://graph.facebook.com/' + pageURL);

			Social.AJAX.request('GET', ajaxURL, null, callback || function(response){
				console.log(response);
				console.log(response.shares);
			});
		},

		shareEvent: function(event) {
			var uiTriggerElement = this,
				urlToShare = uiTriggerElement.getAttribute('data-share-url') || window.location.href;

			Social.Facebook.shareToFacebook(urlToShare);
		},

		registerButton: function(element) {
			if (element)
				element.addEventListener('click', this.shareEvent, false);
		}
	},

	/* Pinterest API */
	Pinterest: {

		init: function() {
			(function(d){
				var f = d.getElementsByTagName('SCRIPT')[0], p = d.createElement('SCRIPT');
				p.type = 'text/javascript';
				p.async = true;
				p.src = '//assets.pinterest.com/js/pinit.js';
				f.parentNode.insertBefore(p, f);
			}(document));
		},

		shareToPinterest: function(urlToShare, mediaURL, pinDescription) {
			var shareURL = 'http://pinterest.com/pin/create/button/?url=' + (urlToShare || window.location.href) + '&amp;media=' + (mediaURL || '') + '&amp;description=' + (pinDescription || '');
			window.open(shareURL, '_blank', 'width=700, height=300');
		},

		getPinCount: function(urlToCheck, callback) {
			var pageURL = urlToCheck || window.location.href,
				ajaxURL = encodeURIComponent('http://api.pinterest.com/v1/urls/count.json?url=' + pageURL);

			Social.AJAX.jsonp(ajaxURL, callback || function(response){
				console.log(response);
				console.log(response.count);
			});
		},

		shareEvent: function(event) {
			var uiTriggerElement = this,
				urlToShare = uiTriggerElement.getAttribute('data-share-url') || window.location.href,
				mediaURL = uiTriggerElement.getAttribute('data-media-url') || '',
				description = uiTriggerElement.getAttribute('data-share-description') || '';

			Social.Pinterest.shareToPinterest(urlToShare, mediaURL, description);
		},

		registerButton: function(element) {
			if (element)
				element.addEventListener('click', this.shareEvent, false);
		}
	},

	/* Twitter API */
	Twitter: {

		init: function() {
			// As of this version of the code, there is no need to initialize
		},

		shareToTwitter: function(urlToShare, description) {
			var pageURL = urlToShare || window.location.href,
				shareURL = 'http://twitter.com/share?url=' + pageURL;

			if (Social.Config.TWITTER_ACCOUNT)
				shareURL += '&amp;via=' + Social.Config.TWITTER_ACCOUNT;

			if (description)
				shareURL += '&amp;text=' + description;

			window.open(shareURL, '_blank', 'width=500, height=300');
		},

		getTweetCount: function(urlToCheck, callback) {
			var pageURL = urlToCheck || window.location.href,
				ajaxURL = 'http://urls.api.twitter.com/1/urls/count.json?url=' + pageURL;

			Social.AJAX.jsonp(ajaxURL, callback || function(response){
				console.log(response);
				console.log(response.count);
			});
		},

		shareEvent: function(event) {
			var uiTriggerElement = this,
				urlToShare = uiTriggerElement.getAttribute('data-share-url') || window.location.href,
				description = uiTriggerElement.getAttribute('data-share-description') || '';

			Social.Twitter.shareToTwitter(urlToShare, description);
		},

		registerButton: function(element) {
			if (element)
				element.addEventListener('click', this.shareEvent, true);
		}

	},

	/* Google+ API */
	GooglePlus: {

		init: function() {
			// As of this version of the code, there is no need to initialize
		},

		shareToGooglePlus: function(urlToShare) {
			var pageURL = urlToShare || window.location.href,
				shareURL = 'https://plus.google.com/share?url=' + pageURL;

			window.open(shareURL, '_blank', 'width=500, height=300');
		},

		getGooglePlusShareCount: function(callback) {
			//TODO: figure this out!
		},

		shareEvent: function(event) {
			var uiTriggerElement = this,
				urlToShare = uiTriggerElement.getAttribute('data-share-url') || window.location.href;

			Social.GooglePlus.shareToGooglePlus(urlToShare);
		},

		registerButton: function(element) {
			if (element)
				element.addEventListener('click', this.shareToGooglePlus, false);
		}

	},

	/* AJAX Utility */
	AJAX: {	
		request: function(method, path, data, callback) {
			var request = new XMLHttpRequest();
			request.onreadystatechange = function() {
				if (request.readyState !== 4 || request.status !== 200) {return;} //TODO: better error handling
				var stringResponse = request.responseText,
					response = JSON.parse(stringResponse);
				callback(response);
			};
			request.open(method, path, true);
			request.send(data);
		},

		jsonp: function(url, callback) {
			var callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
			window[callbackName] = function(data) {
				delete window[callbackName];
				document.body.removeChild(script);
				callback(data);
			};

			var script = document.createElement('script');
			script.src = url + (url.indexOf('?') >= 0 ? '&' : '?') + 'callback=' + callbackName;
			document.body.appendChild(script);
		}
	}
};
