# Using multiple elmah.io logs for different environments

##### [Thomas Ardal](http://elmah.io/about/), December 6, 2013 in [Tutorials](/category/tutorials/)

> This post has been adapted as part of our official documentation. To read the most updated version, please check out [Use multiple logs for different environments](http://docs.elmah.io/use-multiple-logs-for-different-environments/)

We bet that you use at least two environments for hosting you website: localhost and a production environment. You probably need to log website errors all your environments, but you don’t want to mix errors from different environments in the same error log. Lucky for you, Microsoft provides a great way of differentiating configuration for different environments called Web Config transformation.

Start by creating two new logs at the elmah.io website called something like “My website” and “My website development”. The naming isn’t really important, so pick something saying.

In your project install the elmah.io NuGet package:

```powershell
Install-Package elmah.io
```

During the installation, NuGet will ask you for your elmah.io log id. In this dialog input the log id from the log named “My website development”. The default configuration is used when running your website locally. When installed open the `web.release.config` file and add the following code:

```xml
<elmah xdt:Transform="Replace">
  <errorLog type="Elmah.Io.ErrorLog, Elmah.Io" LogId="INSERT_HERE" />
  <security allowRemoteAccess="false" />
</elmah>
```

Replace the `INSERT_HERE` value with the log id named “My website”. That’s it! You can now build and deploy your website using different configurations. When nothing is changed, Visual Studio will build your website using the Debug configuration. This configuration looks for the ELMAH code in the `web.debug.config` file. We didn’t add any ELMAH configuration to this file, why the default values from `web.config` are used. When selecting the Release configuration, Web. Config transformations will replace the default values in `web.config` with the new ELMAH configuration from `web.release.config`.

To avoid spending numerous hours of debugging, remember that Web Config transformations are only run on deploy and not on build. In other words deploy your website using Visual Studio, MSBuild or third for the transformations to replace the right ELMAH config.