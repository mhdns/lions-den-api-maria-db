/* eslint-disable no-console */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server');
const User = require('../models/User');


const { expect } = chai;

chai.use(chaiHttp);

describe('Authoriziation endpoints....', () => {
  before(() => { sinon.stub(console, 'log'); });
  after(() => { console.log.restore(); });

  // Registration Section
  describe('Registering a user...', () => {
    after((done) => {
      User.deleteMany().then(() => { done(); });
    });

    it('able to register with a valid email and password', (done) => {
      chai.request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@gmail.com',
          password: '12345678'
        }).end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.success).to.equal(true);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.not.equal({});
          done();
        });
    });

    it('not able to register without an email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          password: '12345678'
        }).end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Please enter all fields');

          done();
        });
    });

    it('not able to register without a valid email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'afsfafsafda.com',
          password: '12345678'
        }).end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.have.string('Path `email` is invalid');

          done();
        });
    });

    it('not able to register without a password', (done) => {
      chai.request(app)
        .post('/api/v1/auth/register')
        .send({
          name: 'Test User',
          email: 'test@gmail.com'
        }).end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Please enter all fields');

          done();
        });
    });

    it('not able to register with an existing email belonging existing user', (done) => {
      const user = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: '12345678'
      };

      chai.request(app).post('/api/v1/auth/register').send(user).end();
      chai.request(app)
        .post('/api/v1/auth/register')
        .send(user)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.success).to.equal(false);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('User already exists');

          done();
        });
    });
  });

  // Login Section
  describe('When user tries to login...', () => {
    after((done) => {
      User.deleteMany().then(() => { done(); });
    });
    before((done) => {
      const user = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: '12345678'
      };

      chai.request(app).post('/api/v1/auth/register').send(user).end(() => done());
    });

    it('able to login with valid email and password', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@gmail.com',
          password: '12345678'
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.have.property('data');
          expect(res.body.data).to.not.equal({});
          done();
        });
    });

    it('not able to login with invalid email', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'testing@gmail.com',
          password: '12345678'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid Credentials');
          done();
        });
    });

    it('not able to login with invalid password', (done) => {
      chai.request(app)
        .post('/api/v1/auth/login')
        .send({
          email: 'test@gmail.com',
          password: '123456789'
        })
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body).to.have.property('error');
          expect(res.body.error).to.equal('Invalid Credentials');
          done();
        });
    });
  });
});
