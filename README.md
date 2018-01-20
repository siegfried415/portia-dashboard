Portia-dashboard
======

Portia is a great tool that allows you to visually scrape websites without any programming knowledge required. With Portia you can annotate a web page to identify the data you wish to extract, and Portia will understand based on these annotations how to scrape data from similar pages. 

Because Portia by scrapinghub has no dashboard with it, so user can't get the status of spider and scraped items visually , for solving this problem, I add a simple dashboard to Portia, so everybody can get a free dashboard just like scrapinghub cloud.

Sometimes, you will need input user name and password to login, or give a query string to begain a search. Portia can't do this by default. So we add a functionality called "Action" to Portia, like Selenium IDE, user interaction with current page such as mouse click, keyboard input can be recorded as Action, and will be playback when crawling is started.


# Running Portia
The easiest way to run Portia is using Docker.
You can run Portia using docker by running:

    docker run -v ~/portia_projects:/app/data/projects:rw -p 9001:9001 siegfried415/portia-dashboard start-dev 


Portia should now be running on port 9001 and you can access it at ``http://localhost:9001``.


# Documentation

When the docker started, you can get documentation at ``http://localhost:9001/doc/index.html``.  

