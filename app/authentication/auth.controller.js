(function () {
	'use strict';


	const Promise						= require('bluebird');
	const server 						= require('../../server');
	const request						= require('request-promise');
	const AuthService				=	require('../../services/auth.service');
	const Mailer						= require('../shared/mailer.service');
	const jwt 							= require('jsonwebtoken');
	const config		= require('../../config/config');

	const User							= server.main.model('User');

	addSuperUser();

	module.exports = {
		auth,
		update,
		signup,
		login,
		instaLogin,
		facebookLogin,
		linkedinLogin,
		activation,
		passwordAccess,
		changePassword,
		googleLogin,
	};

	async function auth(req, res, next) {
		try {
			const user = await User.findById(req.userId);
			res.status(200).send(user);
		} catch (error) {
			next(error);
		}
	}

	async function update(req, res, next) {
		try {
			const user = await User.findById(req.userId);
			if (user) {
				let owner = await User.findById(req.params.id).populate({
					path: 'deals',
					populate: { path: 'buildings'}
				});;
				if (owner) {
					const newParams = {
						firstname: req.body.user.firstname,
						lastname: req.body.user.lastname,
						avatar: req.body.user.avatar,
						role: req.body.user.role,
					}

					if (user.super || user._id.equals(owner._id)) {
						Object.assign(owner, newParams);
						owner = await owner.save();

						res.status(200).send(owner);
					} else { throw new Error('you have not access for this'); }
				} else { throw new Error('user not found'); }
			} else {
				throw new Error('you not loged in');
			}
		} catch (error) {
			next(error);
		}
	}


	function deleteUser(username) {
		return User.findOneAndRemove({username: username});
	}

	function passwordAccess(req, res, next) {
		const email = req.body.email;

		return User.findOne({email: email})
			.then(user => {
				if (user === undefined ) {
					throw new Error(JSON.stringify({
						status : 400,
						type   : `User doesn't exists`
					}));
				} else {
					return AuthService.jwtCreate(user, { type: 'password-reset' });
				}
			})
			.then(result => {
				return User.findOneAndUpdate({_id: result.user._id}, {resetToken: result.token}, { fields: '+resetToken', new: true });
			})
			.then(result => {
				return Mailer.sendResetToken({
					// email: 'ws.gorelov@gmail.com',
					email: result.email,
					resetToken: result.resetToken,
					username: result.username
				});
			})
			.then(() => {
				res.status(200).send();
			})
			.catch(err => next(err));
	}

	function changePassword(req, res, next) {
		const resetToken = req.body.token;
		const password = req.body.password;
		let userId = null;

		return AuthService.jwtVerify(resetToken)
			.then(decodedToken => {
				if (decodedToken.type === 'password-reset') {
					return User.findOne({_id: decodedToken._id}).select('+resetToken');
				} else {
					throw new Error('token type verify error!');
				}
			})
			.then(user => {
				if (!user) {
					throw new Error(JSON.stringify({
						status : 400,
						type   : `User doesn't exists`
					}));
				} else if (user.resetToken === resetToken) {
					userId = user._id;
					return User.findOneAndUpdate({ _id: userId }, { resetToken: null }, { new: true });
				}
				else {
					throw new Error(JSON.stringify({
						status : 400,
						type   : `Email is already confirmed`
					}));
				}
			})
			.then(() => {
				return AuthService.generateHash(password);
			})
			.then(hash => {
				return User.findOneAndUpdate({_id: userId} , {password: hash}, { new: true });
			})
			.then((result) => {
				res.status(200).send()
			})
			.catch(err => next(err));


	}

	function activation(req, res, next) {
		let activationToken = req.body.activationToken;

		return AuthService.jwtVerify(activationToken)
			.then(decodedToken => {
				if (decodedToken.type === 'activation') {
					return User.findOne({_id: decodedToken._id}).select('+activationToken');
				} else {
					throw new Error('token type verify error!');
				}
			})
			.then(user => {
				if (user === undefined) {
					throw new Error(JSON.stringify({
						status : 400,
						type   : `User doesn't exists`
					}));
				} else if (user.activationToken === activationToken) {
					return User.findOneAndUpdate({ _id: user._id }, { activationToken: null }, { new: true });
				}
				else {
					throw new Error(JSON.stringify({
						status : 400,
						type   : `Email is already confirmed`
					}));
				}
			})
			.then(() => {
				res.status(200).send()
			})
			.catch(err => next(err));
	}

	function signup (req, res, next) {
		let { email, username, password, firstname, lastname } = req.body;

		return Promise.resolve()
			.then(() => {
				return User.findOne({username});
			})
			.then(user => {
				if (user) {
					throw new Error(JSON.stringify({
						status : 400,
						type   : `That user is already exists`
					}));
				}
				return AuthService.generateHash(password);
			})
			.then(hash => {
				let userToCreate = {
					email,
					username,
					firstname,
					lastname,
					password: hash,
					avatar: `${config.API_URL}/assets/user.png`
				};
				return User.create(userToCreate);
			})
			.then(user => {
				return AuthService.jwtCreate(user, { type: 'activation' }); // activation
			})
			.then(result => {

				return User.findOneAndUpdate({_id: result.user._id}, {activationToken: result.token}, { fields: '+activationToken', new: true });
			})

			.then(result => {
				return Mailer.sendActivation({
					// email: 'ws.gorelov@gmail.com',
					email: result.email,
					activationToken: result.activationToken,
					username: result.username
				});
			})
			.then(() => {
				res.status(200).send();
			})
			.catch(err => {
				next(err);
			});
	}

	function login (req, res, next) {
		let {username, password} = req.body;

		return Promise.resolve()
			.then(() => {
				return User.findOne({username}).select('+password +activationToken');
			})
			.then(user => {
				if (!user) {
					throw new Error(JSON.stringify({
						status : 400,
						type   : `User doesn't exists`
					}));
				}
				return AuthService.comparePassword(password, user);
			})
			.then(user => {
				if (!user.activationToken) {
					return AuthService.jwtCreate(user);
				} else {
					throw new Error(JSON.stringify({
						status : 403,
						type   : `Not confirmed email`
					}));
				}
			})
			.then(result => {
				res.status(200).send(result)
			})
			.catch(err => {
				next(err);
			})
	}


	async function googleLogin(req, res, next) {

		const ouathUrl = config.GOOGLE_OAUTH_URL;
		const clientId = config.GOOGLE_CLIENT_ID;
		const clientSecret = config.GOOGLE_CLIENT_SECRET;
		const grantType = 'authorization_code';
		const redirectUri = config.GOOGLE_REDIRECT_URL;
		const code = req.body.code;

		try {
			const result = await request.post({
				url: `${ouathUrl}/?client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grantType}&redirect_uri=${redirectUri}&code=${code}`,
				form: {
					client_id: clientId,
					client_secret: clientSecret,
					grant_type: grantType,
					redirect_uri: redirectUri,
					code,
				},
			});
			const result1 = JSON.parse(result);

			const profile = jwt.decode(result1.id_token);

			if (profile.email) {
				let user = await User.findOne({ email: profile.email });

				if (user) {
					// login
					user = await AuthService.jwtCreate(user);
					res.status(200).send(user)
				} else {
					// signup
					let userToCreate = {
						username: profile.name,
						firstname: profile.given_name,
						lastname: profile.family_name,
						avatar: profile.picture || `${config.API_URL}/assets/user.png`,
						email: profile.email
					};
					user = await User.create(userToCreate);

					const user1 = await AuthService.jwtCreate(user);

					res.status(200).send(user1);
				}
			}
		} catch(err) {
			next(err);
		}
	}

	async function instaLogin(req, res, next) {
		const oauthUrl = config.INSTAGRAM_OAUTH_URL;
		const clientId = config.INSTAGRAM_CLIENT_ID;
		const clientSecret = config.INSTAGRAM_CLIENT_SECRET;
		const grantType = 'authorization_code';
		const redirectUri = config.INSTAGRAM_REDIRECT_URL;
		const code = req.body.code;

		try {
			const result = await request.post({
				url: `${oauthUrl}/?client_id=${clientId}&client_secret=${clientSecret}&grant_type=${grantType}&redirect_uri=${redirectUri}&code=${code}`,
				form: {
					client_id: clientId,
					client_secret: clientSecret,
					grant_type: grantType,
					redirect_uri: redirectUri,
					code,
				},
			});

			const result1 = JSON.parse(result);

			if (result1.access_token) {
				let user = await User.findOne({ username: result1.user.username });

				if (user) {
					// login
					user = await AuthService.jwtCreate(user);
					res.status(200).send(user)
				} else {
					// signup
					let userToCreate = {
						username: result1.user.username,
						firstname: result1.user.full_name.split(' ', 2)[0],
						lastname: result1.user.full_name.split(' ', 2)[1],
						avatar: result1.user.profile_picture || `${config.API_URL}/assets/user.png`,
					};
					user = await User.create(userToCreate);

					const userFinal = await AuthService.jwtCreate(user);

					res.status(200).send(userFinal);
				}

			} else {
				throw new Error('invalid api code');
			}
		}
		catch (error) {
			next(error);
		}
	}


	async function linkedinLogin(req, res, next) {
		const oauthUrl = config.LINKEDIN_OAUTH_URL;
		const peopleApiUrl = config.LINKEDIN_PEOPLE_API_URL;
		const clientId = config.LINKEDIN_CLIENT_ID;
		const clientSecret = config.LINKEDIN_CLIENT_SECRET;
		const grantType = 'authorization_code';
		const redirectUri = config.LINKEDIN_REDIRECT_URL;
		const code = req.body.code;

		try {
			const tokenInfo = await request.post({
				url: `${oauthUrl}`,
				form: {
					client_id: clientId,
					client_secret: clientSecret,
					grant_type: grantType,
					redirect_uri: redirectUri,
					code,
				},
			});

			const tokenInfo1 = JSON.parse(tokenInfo);


			const fields = 'id,firstName,lastName,pictureUrls::(original),headline,publicProfileUrl,location,industry,positions,email-address';
			const profile = await request.get({
				url: `${peopleApiUrl}/~:(${fields})?format=json&oauth2_access_token=${tokenInfo1.access_token}`,
			});
			const profile1 = JSON.parse(profile);

			if (profile1.emailAddress) {
				let user = await User.findOne({ email: profile1.emailAddress });

				if (user) {
					// login
					user = await AuthService.jwtCreate(user);
					res.status(200).send(user)

				} else {
					// signup
					let userToCreate = {
						email: profile1.emailAddress,
						username: profile1.firstName + ' ' + profile1.lastName,
						firstname: profile1.firstName,
						lastname: profile1.lastName,
						// token: '',
						avatar: profile1.pictureUrls.values[0] || `${config.API_URL}/assets/user.png`,
					};
					user = await User.create(userToCreate);

					const user1 = await AuthService.jwtCreate(user);

					res.status(200).send(user1);
				}
			}
			else { throw new Error('invalid linkedIn user profile!') }
		} catch(err) {
			next(err);
		}

	}

	async function facebookLogin(req, res, next) {

	 const oauthUrl = config.FACEBOOK_OAUTH_URL;
	 const peopleApiUrl = config.FACEBOOK_PEOPLE_API_URL;
	 const clientId = config.FACEBOOK_CLIENT_ID;
	 const clientSecret = config.FACEBOOK_CLIENT_SECRET;
	 const grantType = 'authorization_code';
	 const redirectUri = config.FACEBOOK_REDIRECT_URL;
	 const code = req.body.code;

	 try {
		const tokenInfo = await request.post({
			url: `${oauthUrl}/client_id=${clientId}&redirect_uri=${redirectUri}&client_secret=${clientSecret}&grant_type=${grantType}&code=${code}`,
			form: {
				client_id: clientId,
				client_secret: clientSecret,
				grant_type: grantType,
				redirect_uri: redirectUri,
				code,
			},
		});

		const tokenInfo1 = JSON.parse(tokenInfo);
		const fields = 'id,email,name,first_name,last_name,picture,birthday,gender';

		const profile = await request.get({
			url: `${peopleApiUrl}access_token=${tokenInfo1.access_token}&fields=${fields}`,
		});

		const profile1 = JSON.parse(profile);

		let user = await User.findOne({ email: profile1.email });

		if (user) {
			// login
			user = await AuthService.jwtCreate(user);
			res.status(200).send(user)

		} else {
			// signup
			let userToCreate = {
				email: profile1.email,
				username: profile1.name,
				firstname: profile1.first_name,
				lastname: profile1.last_name,
				// token: '',
				avatar: profile1.picture.data.url || `${config.API_URL}/assets/user.png`,
			};
			user = await User.create(userToCreate);

			const user1 = await AuthService.jwtCreate(user);

			res.status(200).send(user1);
		}
	 } catch(err) {
		next(err);
	 }
	}

	async function addSuperUser() {
		try {
			let user = await User.findOne({username: 'superuser'});

			if (!user) {
				const pass = await AuthService.generateHash('superuser123');

				user = await User.create({
					username : 'superuser',
					avatar        : `${config.API_URL}/assets/superuser.jpg`,
					email					: config.EMAIL_SERVICE_LOGIN,
					firstname     : 'Super',
					lastname      : 'User',
					password      : pass,
					super         : true
				});

				console.log('ok');
			}
		} catch (error) {
			console.log('error', error);
		}
	}
})();





