# Turning a ASP.NET Core website into a Progressive Web App (PWA)

##### Kristoffer Strube, March #, 2018

Progressive Web Apps (PWA) is a principle covering quite a lot of different web requirements, but what they all have in common are that they better the user's experience. A large part of these principles has to do with availability of content and using new net standards. A full checklist of these principles according to Google can be seen [here](https://developers.google.com/web/progressive-web-apps/checklist).

The first step for converting your site to a PWA is to implement a Service Worker and create a Manifest for your site. The Manifest is a json file stating some details about your site. It makes it possible for a user to add your site to the home screen on their phone or desktop. The Service Worker makes caching easy and defines some rules for if content is not available.

A Service Worker gets registered through some JavaScript and the different rules for handling the cache can take some time to grasp. So, we are lucky to see there is a NuGet Package for simplifying the setup of a Service Worker and handling your Manifest. The package we are going to use is [WebEssentials.AspNetCore.PWA](https://www.nuget.org/packages/WebEssentials.AspNetCore.PWA/), which has been developed by Mads Kristensen.

An important detail before starting is that the Service Worker will only work if your site is SSL-encrypted and redirects to HTTPS. The package makes some services available for you that can be added to the container through the `ConfigureServices` method in your Startup class

```csharp
public void ConfigureServices(IServiceCollection services)
{
    // Your other services
    services.AddProgressiveWebApp();
}
```

The `AddProgressiveWebApp` method adds both a Service Worker and the references to your manifest, but these can be added independently of each other using the  `AddServiceWorker` and `AddWebManifest` methods. The PWA settings can be changed in the `appsettings.json` like so

```json
{
	//Other settings,
	"pwa": {
		"cacheId": "Worker 1.1",
		"strategy": "cacheFirstSafe",
		"routesToPreCache": "/Home/Contact, /Home/About",
		"offlineRoute": "fallBack.html",
		"registerServiceWorker": true,
		"registerWebmanifest": true
	}
}
```

`cacheId` defines a unique id for the current version of your site and will be used in your Service Worker to check if the user currently has the newest version of the page.

`strategy` selects a strategy for your Service Worker among some predefined profiles. `cacheFirstSafe` is the default strategy which caches every resource and ensures each is of the Doctype text/html on the first try gets accessed via the network to get the newest version and then falls back to the cache if this is not available.

It also caches resources with the `v` querystring since it expects this to be unique content. `cacheFirst` is the same as the safe one, but it does not go network first on text/html resources and does not cache resources with the the `v` querystring, so this should only be used for sites you do not expect to change frequently.

`networkFirst`  goes network first for all resources and adds the resource to the cache when doing so, which it then falls back to if it can't get the resource.  `minimal` does not cache at all and its primary use would be to prompt for installation of the PWA on phones using the Manifest.

`routesToPreCache` states which resources should be pre-cachet meaning that it will be added to the cache as soon as the Service Worker has been registered. This is especially useful for caching all the subpages on your site, so that the user can browse these if he later revisits them while being offline.

`offlineRoute` specifies a route (which will be cached) for if the user tries to access a page which was not cached before the user went offline. This can often be avoided by adding the page to `routesToPreCache` or uniquely identifying the resources using the `v` querystring, but it's a better alternative compared to the "There is no connection" page in Chrome.

`registerServiceWorker` and `registerWebmanifest` are for disabling individual features in the service, but the standard is default for both.

The settings can alternatively be changed in the Startup class by giving the `AddProgressiveWebApp` a `PwaOptions` object. A pro for this would be that the settings could be changed programmatically like the following example where the `cacheId` is defined using a version variable which could originate from a database or likewise.

```csharp
public void ConfigureServices(IServiceCollection services)
{
	//Your other services
	services.AddProgressiveWebApp(new PwaOptions
	{
		CacheId = "Worker " + version,
		Strategy = ServiceWorkerStrategy.CacheFirst,
		RoutesToPreCache = "/Home/Contact, /Home/About"
		OfflineRoute = "fallBack.html",
	});
}
```

Already now you can check if your service has been registered by opening the [Chrome DevTool](https://developers.google.com/web/tools/chrome-devtools/) and going to Application > Service Worker.

![DevTool Applikation View](/Images/DevTool_Applikation_Service_Worker.png)

Then we just need to add a manifest for your site, which would normally be referenced as a link in the header of your pages, but this has also taken care of via the [WebEssentials.AspNetCore.PWA](https://www.nuget.org/packages/WebEssentials.AspNetCore.PWA/). The manifest defines some details for your site if it's downloaded, which includes custom splash-screens, icon-standards and more. Furthermore, does it also prompts the user to install it as a PWA, via an install-banner, if they visit the site frequently on a phone. This is one of the core properties of a PWA (Progressive Web App) since it gives the immersive App part. The only thing you need is to make a new json called manifest.json and place it in the wwwroot. The file should have the following pattern:

```json
{
	"name": "My Progressive Web App",
	"short_name": "My PWA",
	"orientation": "portrait",
	"display": "standalone",
	"icons": [
		{
			"src": "images/logox192.png",
			"sizes": "192x192",
			"type": "image/png"
		},
		{
			"src": "images/logox512.png",
			"sizes": "512x512",
			"type": "image/png"
		}
	],
	"start_url": "/",
	"color": "#ffffff",
	"background_color": "#20c4f4",
	"theme_color": "#20c4f4"
}
```

`name` is the full name of your site. `short_name` is what will be displayed if a user adds your site to their homepage on a smartphone or desktop. `orientation` specifies if your website should be viewed in portrait or landscape mode or using the keyword any, if it's up to the user, when it has been installed. `display` sets the way your site will be presented after download. The default is browser, which just opens your site in the standard browser. Alternatives are standalone, minimal-ui or full screen, which all create a splash-screen for your site while it loads. The splash-screen will show the icon for the page and the name. `icons` makes icons in different sizes available via a list representation.

A minimum requirement is to have both 192x192 and 512x512, but more can be added. `start_url` defines the page the site will start on when opened. `color` sets the text color on the splash-screen. `background_color` sets the background color on the splash-screen.
`theme_color` defines the site-wide [theme-color](https://developers.google.com/web/updates/2014/11/Support-for-theme-color-in-Chrome-39-for-Android) of your page, which currently only is a property used in Google Chrome. This property also has to be added to each page individually with a meta-tag for your manifest to be valid, but our PWA package injects this on our pages automatically, so we don't need to bother.

There are multiple other properties which can be added to the manifest, but these are the most basic. More can be found on Google's post [The Web App Manifest](https://developers.google.com/web/fundamentals/web-app-manifest/). The Manifest is now ready and the users will be prompted to add your page to their home screen if it's the correct syntax.

![Add to homescreen](/images/add_to_start.gif)

These are the first steps to making your site a PWA. Other specifications that must be followed is fast response time (also on slow 3G), mobile friendly design and fast response time. An easy way to test to see if your site is up is by using the Chrome tool [LightHouse](https://developers.google.com/web/tools/lighthouse/), which rates your site's use of PWA, your site's performance and speed, accessibility of your content and best practices for a modern web page. This makes it easy to see how far along you are in the process and gives you help on what to do next to improve.