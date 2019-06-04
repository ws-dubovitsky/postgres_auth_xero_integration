module.exports = {
	db_main		: process.env.DB_MAIN  || 'mongodb://localhost/Peasy',
	JWT_KEY		: process.env.JWT_KEY  || 'fpeijf83KFWEN#@KGYUIINEo3hr3jeruerioewrh3',

	EMAIL_SERVICE_LOGIN 		: process.env.EMAIL_SERVICE_LOGIN || 'queensbeansbot@gmail.com',
  EMAIL_SERVICE_PASSWORD	: process.env.EMAIL_SERVICE_PASSWORD || 'queensbeansbot2260!',
	EMAIL_CLIENT_URL				: process.env.EMAIL_CLIENT_URL || 'http://localhost:3000',

	API_URL: process.env.API_URL || 'http://localhost:5000',

	GOOGLE_OAUTH_URL: process.env.GOOGLE_OAUTH_URL || 'https://www.googleapis.com/oauth2/v4/token',
	GOOGLE_CLIENT_ID:	process.env.GOOGLE_CLIENT_ID || '93785813578-v878if1bb5in8ecu0srh7mii80skgqad.apps.googleusercontent.com',
	GOOGLE_CLIENT_SECRET:	process.env.GOOGLE_CLIENT_SECRET || 'WfAbV5kkYT-GrRf12trEMrdG',
	GOOGLE_REDIRECT_URL:	process.env.GOOGLE_REDIRECT_URL || 'http://localhost:4200/social/google',

	INSTAGRAM_OAUTH_URL: process.env.INSTAGRAM_OAUTH_URL || 'https://api.instagram.com/oauth/access_token',
	INSTAGRAM_CLIENT_ID:	process.env.INSTAGRAM_CLIENT_ID || '5b1e549586b242319f02585be20d4ddf',
	INSTAGRAM_CLIENT_SECRET:	process.env.INSTAGRAM_CLIENT_SECRET || '4d4c07882a6f4257aecb3ef5a7eba2fb',
	INSTAGRAM_REDIRECT_URL:	process.env.INSTAGRAM_REDIRECT_URL || 'http://localhost:4200/social/instagram',

	LINKEDIN_OAUTH_URL: process.env.LINKEDIN_OAUTH_URL || 'https://www.linkedin.com/oauth/v2/accessToken',
	LINKEDIN_PEOPLE_API_URL: process.env.LINKEDIN_PEOPLE_API_URL || 'https://api.linkedin.com/v1/people',
	LINKEDIN_CLIENT_ID:	process.env.LINKEDIN_CLIENT_ID || '78zxailainp6sn',
	LINKEDIN_CLIENT_SECRET:	process.env.LINKEDIN_CLIENT_SECRET || 'scxpxreT5X6zn5OZ',
	LINKEDIN_REDIRECT_URL:	process.env.LINKEDIN_REDIRECT_URL || 'http://localhost:4200/social/linkedin',

	FACEBOOK_OAUTH_URL: process.env.FACEBOOK_OAUTH_URL || 'https://graph.facebook.com/v3.2/oauth/access_token?',
	FACEBOOK_PEOPLE_API_URL: process.env.FACEBOOK_PEOPLE_API_URL || 'https://graph.facebook.com/v3.2/me?',
	FACEBOOK_CLIENT_ID:	process.env.FACEBOOK_CLIENT_ID || '1172231259598249',
	FACEBOOK_CLIENT_SECRET:	process.env.FACEBOOK_CLIENT_SECRET || '4378665181f12d73ef4af47964e54867',
	FACEBOOK_REDIRECT_URL:	process.env.FACEBOOK_REDIRECT_URL || 'http://localhost:4200/social/facebook',

}