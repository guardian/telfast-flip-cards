# Guardian Interactive - Standalone base template

Requires nodejs, yarn

## Setup

* `yarn install`

## Folder structure

```
/
	- /dev
		- /assets			all source files
			- /img			source images
			- /js				source js
			- /less			source less

		- /static			all static files - e.g downloads, zips etc
									this folder is copied untouched on build

	- /public				deployable built files
```

## Dev

* `yarn dev` : dev server with watch & hot reload

> Note : when running `dev` files are compiled in memory only and _not_ written
> to disk

## Building

Compiled files will be placed in `/public`.

> Note : Files will always be cleaned from `/public` before a build. This
> ensures we always have a clean build containing only files referenced in the
> html/js/less. Anything not a 'source' file that needs to be there after a
> build (for example pdfs, downloads etc) should be placed in the '/dev/static'
> folder and will be copied to `/public/static` on build.

* `yarn build` : build for deployment with compression and all optimisations
  enabled

## Deploying

> Note : Ensure your repo is clean (all files commited) or these commands will
> fail!

### Stage

* `yarn stage` : build and push to stage repo

### Master

* `yarn deploy` : build and push to master repo

## Cleaning

* clean : clean the `/public` dir

---

## FAQ

### Importing assets

#### JS

To import other assets into a js file, you can include/require them relative to
the file or the assets dir.

```
import './foo'
import 'assets/js/foo.js'
import 'assets/img/bar.jpg'
import 'assets/less/baz.less'
```

#### Less

To import assets into a less file, you can import or reference them relative to
the file or the assets dir. However when referencing the assets dir you must
append `~` to the path so less knows where to find the file.

```
@import './foo.less'
@import '~assets/less/bar.less';
body {
  background-image: url('~assets/img/baz.jpg');
}
```

### CSS Processing

CSS is processed via [PostCSS](http://postcss.org/). See `postcss.config.js` to
configure.

### JS Processing

JS is processed via [Babel](https://babeljs.io/). See `.babelrc` to configure.

### Browser targets

The target browsers are set in `package.json`, see the `browserlists` key. Also
see https://github.com/ai/browserslist#queries for info on setting these.

This key will be read by both `babel.preset-env` and `post-css` to determine
what transforms are required for the given browsers.

```
"browserlists": ["> 1%", "last 2 versions", "not ie <= 10"],
```
