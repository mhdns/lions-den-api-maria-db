/* eslint-disable no-console */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server');
const User = require('../models/User');

const { expect } = chai;

chai.use(chaiHttp);

describe('Comments endpoints...', () => {
  before(() => { sinon.stub(console, 'log'); });
  after(() => { console.log.restore(); });

  describe('Comment CRUD', () => {
    let token;
    let projectId;

    after((done) => {
      User.deleteMany().then(() => { done(); });
    });

    before((done) => {
      const user = {
        name: 'Test User 2',
        email: 'test2@gmail.com',
        password: '12345678'
      };

      const project = {
        name: 'Some new project',
        description: 'This is what I need for the project.'
      };

      chai.request(app).post('/api/v1/auth/register').send(user).end(() => {
        chai.request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password })
          .end((error, response) => {
            token = `Bearer ${response.body.data}`;
            chai.request(app).post('/api/v1/projects').send(project).set('Authorization', token)
              .end((err, res) => {
                projectId = res.body.data._id;
                done();
              });
          });
      });
    });

    // Tests
    it('Able to create a comment for a project with valid token and project id', (done) => {
      chai.request(app)
        .post(`/api/v1/projects/${projectId}/comments`)
        .send({ msg: 'This project is high priority and needs to be completed as soon as possible' })
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.be.an('object').that.is.not.equal({});
          expect(res.body.data.msg).to.equal('This project is high priority and needs to be completed as soon as possible');
          done();
        });
    });

    it('Not able to create a comment for a project with valid token and project id', (done) => {
      chai.request(app)
        .post(`/api/v1/projects/${projectId}/comments`)
        .send({ msg: 'This project is high priority and needs to be completed as soon as possible' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.an('string');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    describe('Read, Update and Delete...', () => {
      let commentId;

      before((done) => {
        chai.request(app)
          .post(`/api/v1/projects/${projectId}/comments`)
          .send({ msg: 'This project is high priority and needs to be completed as soon as possible' })
          .set('Authorization', token)
          .end((err, res) => {
            commentId = res.body.data._id;
            done();
          });
      });

      it('Able to get all comments', (done) => {
        chai.request(app)
          .get('/api/v1/comments')
          .set('Authorization', token)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an('object').that.is.not.equal({});
            expect(res.body.success).to.equal(true);
            done();
          });
      });

      it('Not able to get all comments without token', (done) => {
        chai.request(app)
          .get('/api/v1/comments')
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.error).to.be.an('string');
            expect(res.body.success).to.equal(false);
            done();
          });
      });

      it('Able to get a comment by ID', (done) => {
        chai.request(app)
          .get(`/api/v1/comments/${commentId}`)
          .set('Authorization', token)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an('object').that.is.not.equal({});
            expect(res.body.success).to.equal(true);
            expect(res.body.data._id).to.equal(commentId);
            done();
          });
      });

      it('Not able to get a comment by ID without token', (done) => {
        chai.request(app)
          .get(`/api/v1/comments/${commentId}`)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.error).to.be.an('string');
            expect(res.body.success).to.equal(false);
            done();
          });
      });

      it('Able to update a comment by ID', (done) => {
        chai.request(app)
          .put(`/api/v1/comments/${commentId}`)
          .send({ msg: 'This is a totally new project...sorry just updated' })
          .set('Authorization', token)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an('object').that.is.not.equal({});
            expect(res.body.success).to.equal(true);
            expect(res.body.data._id).to.equal(commentId);
            expect(res.body.data.editted).to.equal(true);
            done();
          });
      });

      it('Not able to update a comment by ID without token', (done) => {
        chai.request(app)
          .put(`/api/v1/comments/${commentId}`)
          .send({ msg: 'This is a totally new project...sorry just updated' })
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.error).to.be.an('string');
            expect(res.body.success).to.equal(false);
            done();
          });
      });

      it('Able to delete a comment by ID', (done) => {
        chai.request(app)
          .delete(`/api/v1/comments/${commentId}`)
          .set('Authorization', token)
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.body.data).to.be.an('object').that.is.deep.equal({});
            expect(res.body.success).to.equal(true);
            done();
          });
      });

      it('Not able to delete a comment by ID without token', (done) => {
        chai.request(app)
          .delete(`/api/v1/comments/${commentId}`)
          .end((err, res) => {
            expect(res.status).to.equal(401);
            expect(res.body.error).to.be.an('string');
            expect(res.body.success).to.equal(false);
            done();
          });
      });
    });
  });
});
