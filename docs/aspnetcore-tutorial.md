# ASP.NET Core Tutorial##### [Thomas Ardal](http://elmah.io/about/), November 28, 2016Most parts of elmah.io consist of small services. While they may not be microservices, they are in fact small and each do one thing. We recently started experimenting with ASP.NET Core (or just Core for short) for some internal services and we already released a number of blog posts about the subject. This post is meant to summarize on all of our material on ASP.NET Core.## What is ASP.NET CoreASP.NET Core is an open source redesign of ASP.NET, able to run on multiple operating systems like Linux, Mac and Windows. Core lives alongside the existing ASP.NET and doesn't deprecate anything that you know (so far at least). Core runs on top of both .NET core as well as the full .NET framework. Since only .NET core runs on Mac and Linux, choosing to run Core on the full .NET framework, also binds you to run it on Windows (which may be a fine decision in many case).Core contains a lot of the same features as available in ASP.NET (MVC, Web API etc.). With that said, you will find that developing applications in Core, is quite another experience. While Core definitely offer some nice features, ASP.NET still is the more mature platform. In time, Core may or may not replace ASP.NET entirely, but only time will tell.## Concepts in CoreCore offers a range of new concepts. While some are born out of OWIN and inspiration from Node.js, others are entirely new. Here are a list of terms to know about in Core:### InitializationWeb applications are no longer configured through `Global.asax` and `web.config`.. There's a new class in town, simply called `Startup.cs` to configure everything around Core.### ConfigurationA new configuration system has been developed for Core. To read more, check out our blog posts about configuration:- [AppSettings in ASP.NET Core](appsettings-in-aspnetcore.md)
- [Config transformations in ASP.NET Core](config-transformations-in-aspnetcore.md)
- [Configuration with Azure App Services and ASP.NET Core](configuration-with-azure-app-services-and-aspnetcore,md)

### Middleware

Much like OWIN and Node.js, Core uses the concept of middleware. Middleware are code components executed as part of the application pipeline. You will find middleware for a lot of different purposes like logging, exception handling, routing etc.

We wrote a blog post about middleware as well:

- [Error Logging Middleware in ASP.NET Core](error-logging-middleware-in-aspnetcore.md)

### Logging

Core comes with a new logging framework called Microsoft.Extensions.Logging. If you want to know more about logging, read through our blog post:

- [ASP.NET Core Logging Tutorial](aspnetcore-logging-tutorial.md)

### Routing

Routing in its basic form, works much like in previous versions of ASP.NET. When looking into the details, you quickly spot some new features and fixes, that makes routing in Core really awesome. We may blog about routing at some time.

### Error Handling

Error handling in Core is something that we are particular interested in :-) Stay tuned for future blog posts about the subject and make sure to check out our [elmah.io middleware for ASP.NET Core](http://docs.elmah.io/logging-to-elmah-io-from-aspnet-core/).

### Dependency Injection

Dependency injection always were a bit of a hack in ASP.NET. Since Core has been designed from the ground up, dependency injection is provided out of the box. The DI framework in Core doesn't necessarily replace your favourite IoC container, since it plays well with popular packages like Autofac and Windsor.

### Kestrel

Kestrel is a new webserver bundled with Core. Kestrel is a lightweight web server, built on top of libuv (yes, the same as Node.js). Kestrel is used to serve requests in Core, but it isn't intended to be serving requests towards the public. For that purpose, integrations for other web servers and reverse proxies have been made available from Microsoft. A popular choice for now, is to wrap Kestrel behind IIS, but serving Core behind Apache or nginx, seems like obvious choices as well.