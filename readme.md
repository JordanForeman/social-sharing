# Social Sharing

This lightweight Javascript library is built to help the modern web developer create custom social sharing functionality without having to rely heavily on third party code or ugly vendor UI.

It is important to note that this library, while lightweight, does bring in several other 3rd party scripts which may affect performance. The interaction with these scripts is abstracted by this library.

## Usage

### Getting Started

First, add the script in your markup:

```
<script type='text/javascript' src='social.min.js'></script>
```

Then simply initialize the plugin:

```
Social.init({
	FACEBOOK_APP_ID: 'YOUR APP ID', // Mandatory
	TWITTER_ACCOUNT: 'YOUR TWITTER USERNAME' // Optional
});
```

* Please note that these are the only two options necessary for this library at the time of this writing

### Custom Sharing Buttons

After initializing, you can then register any HTML element you'd like as a share button. Because of how flexible this is, be careful to make any necessary UX considerations beforehand

```
var FacebookShareButton = document.querySelector('.facebook-share');
Social.Facebook.registerButton(FacebookShareButton);

var PinterestPinButton = document.querySelector('.pinterest-share');
Social.Pinterest.registerButton(PinterestPinButton);

var TwitterTweetButton = document.querySelector('.twitter-share')
Social.Twitter.registerButton(TwitterTweetButton);

var GooglePlusShareButton = document.querySelector('.google-plus-share');
Social.GooglePlus.registerButton(GooglePlusShareButton);
```

### Configuring Share Buttons

You can customize how your buttons share by using `data-*` parameters in your markup. The following outlines the options supported:

Network | Data-Option | Description
------- | ----------- | -----------
Facebook| data-share-url | The url to share. Defaults to `window.location.href`
Pinterest| data-share-url| The url to share. Defaults to `window.location.href`
		| data-share-description| The default description of the pin. Can be edited by user before saving
		| data-media-url | Url of the image to associate with a pin
Twitter | data-share-url | The url to share. Defaults to `window.location.href`
		| data-share-description | Default Tweet text that appears before link. Can be edited by user

### Getting Share Counts

It is possible to use this library to access the number of times that the current page has been shared. Doing so is relatively simple. 

```
Social.Facebook.getFBShareCount(...);
Social.Pinterest.getPinCount(...);
Social.Twitter.getTweetCount(...);

// Google+ Counts currently not supported
// Social.GooglePlus.getGooglePlusShareCount(...);
```

Each of these functions takes an optional `callback` parameter that can be used to process the data. Each callback will have access to a response object. Each service will return a slightly different response. You can see a list of different response structures [here](https://gist.github.com/jonathanmoore/2640302). Not supplying a callback will default to logging the response object in the console.
