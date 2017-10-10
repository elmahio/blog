---
```

The easiest way is to use Kudo, but FTP or any Azure file browser should do the trick. That's it for the proxy part. Deploy your website to the new web app on Azure:

![Deploy project to Azure](images/sslgithub_deployproject.png)

I'm using the deployment feature in Visual Studio here, but you probably want to use VSTS, Octopus Deploy, Kudo or similar in production. Once deployed, Visual Studio launches your preferred browser, which now show the content from `http://elmahio.github.io/blog/` when requesting the URL `http://myproxy.azurewebsites.net`. Actually, you have SSL support already, since all websites served by `azurewebsites.net` comes with a SSL certificate. We need to serve the content through a custom domain, so go set that up. I won't go into detail on how to set up custom domains on Azure, since that is already described in [hundreds of blog posts](http://lmgtfy.com/?q=azure+website+custom+domain).

When setup and the DNS records are propagated, I can browse the content on GibHub, using the Azure website as a proxy. It's important here, that you let GitHub serve the content on the default URL (`http://organization.github.io/project/`) and not on a custom domain. This means that any `CNAME` file you may have in your repository and/or `CNAME` DNS records pointing to GitHub Pages must be deleted.

[![Scott Hanselman quote](images/scott-hanselman.png)](https://elmah.io/?utm_source=blogbanner&utm_medium=blog&utm_campaign=blogbanner)

For the final step, I need to set up HTTPS on the Azure web site. Doing that is also [fully documented](https://docs.microsoft.com/en-us/azure/app-service-web/web-sites-configure-ssl-certificate) in the Azure documentation. In the case of the elmah.io blog, I've used this excellent tutorial written by Troy Hunt, to get a free SSL certificate from Let's Encrypt: [Everything you need to know about loading a free Let's Encrypt certificate into an Azure website](https://www.troyhunt.com/everything-you-need-to-know-about-loading-a-free-lets-encrypt-certificate-into-an-azure-website/).

I assume that you are now able to browse your GitHub Pages content through HTTPS on the custom domain. The only thing left, is to redirect requests to the non-SSL version of the domain to one including SSL. Add another rule to `web.config`:

```xml
<rule name="RedirectToHTTPS" stopProcessing="true">
  <match url="(.*)"/>
  <conditions>
    <add input="{HTTPS}" pattern="off" ignoreCase="true"/>
  </conditions>
  <action type="Redirect" url="https://{SERVER_NAME}/{R:1}" redirectType="Permanent"/>
</rule>
```

Once the updated website is deployed, requests are successfully redirected to HTTPS and served from GitHub Pages. For a full example including some extra goodies, we've [open sourced the reverse proxy](https://github.com/elmahio/Elmah.Io.ReverseProxy) running in front of blog.elmah.io and docs.elmah.io.