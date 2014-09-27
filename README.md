# *reddsight*

*Reddsight* is an open-source Reddcoin blockchain explorer with complete REST and websocket APIs.
Reddsight runs in NodeJS, uses AngularJS for the front-end and LevelDB for storage.

Check some screenshots and more details at [reddsight's project homepage](https://github.com/reddcoin-project/reddsight).

*Reddsight* project is now split in two repositories. One for the [API](https://github.com/reddcoin-project/reddsight-api)
and for the front-end. This repository is for the front-end, which will install the API as a NPM dependency.


## Prerequisites

* **Node.js v0.10.x** - Download and Install [Node.js](http://www.nodejs.org/download/).

* **NPM** - Node.js package manager, should be automatically installed when you get Node.js.


## Quick Install
  Check the Prerequisites section above before installing.

  To install reddsight, clone the main repository:

    $ git clone https://github.com/reddcoin-project/reddsight.git && cd reddsight

  Install dependencies:

    $ npm install
    
  Run the main application:

    $ npm start
    
  Then open a browser and go to:

    http://localhost:3000

  If *reddsight* reports problems connecting to **reddcoind** please check the CONFIGURATION section of 
  [reddsight-api README](https://github.com/reddcoin-project/reddsight-api/blob/master/README.md). To set the 
  environment variables run something like:
  
     $ INSIGHT_NETWORK=livenet BITCOIND_USER=user BITCOIND_PASS=pass INSIGHT_PUBLIC_PATH=public  npm start


  Please note that the app will need to sync its internal database
  with the blockchain state, which may take some time. You can check
  sync progress from within the web interface. More details about that process
  on [reddsight-api README](https://github.com/reddcoin-project/reddsight-api/blob/master/README.md). 
  
  
## Nginx Setup

To use Nginx as a reverse proxy for reddsight, use the following base [configuration](https://gist.github.com/matiu/bdd5e55ff0ad90b54261)


## Development

To run reddsight locally for development mode:

Install bower dependencies:

```
$ bower install
```

To compile and minify the web application's assets:

```
$ grunt compile
```

There is a convenient Gruntfile.js for automation during editing the code

```
$ grunt
```

In case you are developing *reddsight* and *reddsight-api* together, you can do the following:

* Install reddsight and reddsight-api on the same path ($IROOT)

```
  $ cd $IROOT/reddsight
  $ grunt
```

in other terminal:

```
  $ cd $IROOT/reddsight-api
  $ ln -s ../reddsight/public
  $ INSIGHT_PUBLIC_PATH=public node insight.js 
```


``` 
INSIGHT_PUBLIC_PATH=reddsight/public  grunt
```

at reddsight-api's home path (edit the path according your setup).

**also** in the reddsight-api path. (So you will have to grunt process running, one for reddsight and one for reddsight-api).


## Multilanguage support

reddsight use [angular-gettext](http://angular-gettext.rocketeer.be) for
multilanguage support. 

To enable a text to be translated, add the ***translate*** directive to html tags. See more details [here](http://angular-gettext.rocketeer.be/dev-guide/annotate/). Then, run:

```
grunt compile
```

This action will create a template.pot file in ***po/*** folder. You can open
it with some PO editor ([Poedit](http://poedit.net)). Read this [guide](http://angular-gettext.rocketeer.be/dev-guide/translate/) to learn how to edit/update/import PO files from a generated POT file. PO file will be generated inside po/ folder.

If you make new changes, simply run **grunt compile** again to generate a new .pot template and the angular javascript ***js/translations.js***. Then (if use Poedit), open .po file and choose ***update from POT File*** from **Catalog** menu.

Finally changes your default language from ***public/src/js/config*** 

```
gettextCatalog.currentLanguage = 'es';
```

This line will take a look at any *.po files inside ***po/*** folder, e.g.
**po/es.po**, **po/nl.po**. After any change do not forget to run ***grunt
compile***.


## Note

For more details about the *reddsight-api* configs and end-point, just go to [reddsight-api github repository](https://github.com/reddcoin-project/reddsight-api) or read the [documentation](https://github.com/reddcoin-project/reddsight-api/blob/master/README.md)

## Contribute

Contributions and suggestions are welcomed at [reddsight github repository](https://github.com/reddcoin-project/reddsight).


## License
(The MIT License)

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
