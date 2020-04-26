const express = require('express');
const app = express();
const favicon = require('serve-favicon');
const join = require('path').join;
const bodyparser = require('body-parser');
const cors = require('cors');
const robots = require('express-robots-txt');
const logger = require('morgan');
const path = require('path');
const sentencer = require('sentencer');

// Set Up App
app.set('views', join(__dirname, 'public', 'views'));
app.set('view engine', 'pug');
app.use(favicon(join(__dirname, 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({
	extended: true
}));
app.use(robots([
	{
		'User-agent': 'Yandex',
		Disallow: '/'
	},
	{
		'User-agent': 'baiduspider',
		Disallow: '/'
	},
	{
		'User-agent': 'AhrefsBot',
		Disallow: '/'
	},
	{
		'User-agent': 'BLEXBot',
		Disallow: '/'
	}, {
		'User-Agent': '*'
	}
]));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

// Helpers
function createSitemap() {
	const domain = 'https://obscure.chat/r/';
	// const maxUrlLen = 2048;
	// const minUrlLen = domain.length;
	// const totalAvailablePlaces = maxUrlLen-minUrlLen;
	// const allAvailableNumbers = 10**totalAvailablePlaces;
	const header = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
	const footer = '</urlset>';
	const pre = '<url><loc>';
	const post = '</loc><changefreq>always</changefreq><priority>0.5</priority></url>';

	let out = header;

	out += pre + domain + '*' + post;

	out += `<url><loc>${domain}</loc><changefreq>monthly</changefreq><priority>1</priority></url>`;
	out += footer;

	return out;
}

// Routes
app.get('/', (_req, res) => {
	const newUname = sentencer.make('{{ adjective }} {{ noun }}');
	res.render('home', { newUname });
});

app.get('/sitemap.xml', (_req, res) => {
	res.set('Content-Type', 'text/xml');
	res.send(createSitemap());
});

app.get('/r/:num', (req, res, next) => {
	const num = req.params.num;
	const uname = (req.query.u || 'unknown_rebel')
		// disabling lint because it appears to be incorrect here...
		// eslint-disable-next-line no-useless-escape
		.replace(/[!@#$%^&*()\\+=?><.,{}[\]:;'"`~|\/]/ig, '')
		.trim()
		.replace(' ', '_')
		.replace('-', '_')
		.toLowerCase();
	const newUrl = `/r/${Number(num || 0)}?u=${uname}`;

	if (req.url !== newUrl) {
		return res.redirect(newUrl);
	}
	
	return next();
}, (req, res) => {
	const uname = req.query.u;
	const num = Number(req.params.num);
	if (!isNaN(num)) {
		res.render('index', {
			num,
			uname
		});
	} else {
		res.redirect('/');
	}
});

app.get('/*', (_req, res) => {
	res.redirect('/');
});

module.exports = app;