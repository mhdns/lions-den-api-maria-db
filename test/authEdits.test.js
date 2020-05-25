/* eslint-disable no-console */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server');
const User = require('../models/User');


const { expect } = chai;

chai.use(chaiHttp);

// Name change
describe('Authoriziation updateDetails, updatePassword and delete endpoints...', () => {
  before(() => { sinon.stub(console, 'log'); });
  after(() => { console.log.restore(); });

  describe('Updating a user\'s name...', () => {
    let token;

    after((done) => {
      User.deleteMany().then(() => { done(); });
    });

    before((done) => {
      const user = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: '12345678'
      };

      chai.request(app).post('/api/v1/auth/register').send(user).end(() => {
        chai.request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password })
          .end((err, res) => {
            token = `Bearer ${res.body.data}`;
            done();
          });
      });
    });

    it('able to update name if authorized', (done) => {
      chai.request(app)
        .put('/api/v1/auth/updatedetails')
        .send({ name: 'Test User 2' })
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('object').that.is.not.equal({});
          expect(res.body.data.name).to.equal('Test User 2');
          done();
        });
    });

    it('unable to update name when there is no token', (done) => {
      chai.request(app)
        .put('/api/v1/auth/updatedetails')
        .send({ name: 'Test User 2' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.have.string('Not Authorized to Access.');
          done();
        });
    });

    it('able to update name when more property is in the body of req', (done) => {
      chai.request(app)
        .put('/api/v1/auth/updatedetails')
        .send({
          name: 'Test User 2',
          junk: 'adjsadaff',
          moreJunk: '12313nadasja'
        })
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('object').that.is.not.equal({});
          expect(res.body.data.name).to.equal('Test User 2');
          done();
        });
    });
  });

  // Password Update
  describe('Updating user password...', () => {
    let token;

    after((done) => {
      User.deleteMany().then(() => { done(); });
    });

    before((done) => {
      const user = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: '12345678'
      };
      chai.request(app).post('/api/v1/auth/register').send(user).end(() => {
        chai.request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password })
          .end((err, res) => {
            token = `Bearer ${res.body.data}`;
            done();
          });
      });
    });

    it('able to update password if authorized', (done) => {
      chai.request(app)
        .put('/api/v1/auth/updatepassword')
        .send({
          oldPassword: '12345678',
          newPassword: 'ajkajfd243143'
        })
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.a('string').that.is.not.equal('');
          done();
        });
    });

    it('unable to update password if no token', (done) => {
      chai.request(app)
        .put('/api/v1/auth/updatepassword')
        .send({
          oldPassword: '12345678',
          newPassword: 'ajkajfd243143'
        })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.have.string('Not Authorized to Access.');
          done();
        });
    });
  });
  // Deleteing
  describe('Deleting user...', () => {
    let token;

    after((done) => {
      User.deleteMany().then(() => { done(); });
    });

    before((done) => {
      const user = {
        name: 'Test User',
        email: 'test@gmail.com',
        password: '12345678'
      };
      chai.request(app).post('/api/v1/auth/register').send(user).end(() => {
        chai.request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password })
          .end((err, res) => {
            token = `Bearer ${res.body.data}`;
            done();
          });
      });
    });

    it('able to delete user if authorized', (done) => {
      chai.request(app)
        .delete('/api/v1/auth/deleteuser')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.deep.equal({});
          done();
        });
    });

    it('unable to update password if no token', (done) => {
      chai.request(app)
        .delete('/api/v1/auth/deleteuser')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.have.string('Not Authorized to Access.');
          done();
        });
    });
  });
});
