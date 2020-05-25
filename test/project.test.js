/* eslint-disable no-console */
/* eslint-disable no-undef */
const chai = require('chai');
const chaiHttp = require('chai-http');
const sinon = require('sinon');
const app = require('../server');
const User = require('../models/User');

const { expect } = chai;

chai.use(chaiHttp);

describe('Project endpoints...', () => {
  before(() => { sinon.stub(console, 'log'); });
  after(() => { console.log.restore(); });

  describe('Project CRUD...', () => {
    let token;
    let projectId;

    after((done) => {
      User.deleteMany().then(() => { done(); });
    });

    before((done) => {
      const user = {
        name: 'Test User 1',
        email: 'test1@gmail.com',
        password: '12345678'
      };

      const project = {
        name: 'Some project',
        description: 'This is what I need for the project.'
      };

      chai.request(app).post('/api/v1/auth/register').send(user).end(() => {
        chai.request(app).post('/api/v1/auth/login').send({ email: user.email, password: user.password })
          .end((err, res) => {
            token = `Bearer ${res.body.data}`;
            chai.request(app).post('/api/v1/projects').send(project).set('Authorization', token)
              .end((e, r) => {
                projectId = r.body.data._id;
                done();
              });
          });
      });
    });


    it('Able to create a project with a token', (done) => {
      chai.request(app)
        .post('/api/v1/projects')
        .send({ name: 'Baskery Webpage 1', description: 'Something goes here' })
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(201);
          expect(res.body.data).to.be.an('object').that.is.not.equal({});
          expect(res.body.data.name).to.equal('Baskery Webpage 1');
          done();
        });
    });

    it('Not able to create a project without a token', (done) => {
      chai.request(app)
        .post('/api/v1/projects')
        .send({ name: 'Baskery Webpage 1', description: 'Something goes here' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.an('string');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('Not able to create a project without a name', (done) => {
      chai.request(app)
        .post('/api/v1/projects')
        .send({ description: 'Something goes here' })
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.an('string');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('Not able to create a project without a description', (done) => {
      chai.request(app)
        .post('/api/v1/projects')
        .send({ name: 'Project 1' })
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(400);
          expect(res.body.error).to.be.an('string');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('Able to get all projects with valid token', (done) => {
      chai.request(app)
        .get('/api/v1/projects')
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('object').that.is.not.equal({});
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('Not able to get all projects without valid token', (done) => {
      chai.request(app)
        .get('/api/v1/projects')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.an('string');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('Able to get a project with valid token and id', (done) => {
      chai.request(app)
        .get(`/api/v1/projects/${projectId}`)
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('object').that.is.not.equal({});
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('Not able to get a project without valid token', (done) => {
      chai.request(app)
        .get(`/api/v1/projects/${projectId}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.an('string');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('Able to update a project with valid token and id', (done) => {
      chai.request(app)
        .put(`/api/v1/projects/${projectId}`)
        .send({ name: 'New Title', description: 'This is a new description' })
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('object').that.is.not.equal({});
          expect(res.body.success).to.equal(true);
          expect(res.body.data.name).to.equal('New Title');
          expect(res.body.data.description).to.equal('This is a new description');
          done();
        });
    });

    it('Able to update a project with valid token and id', (done) => {
      chai.request(app)
        .put(`/api/v1/projects/${projectId}`)
        .send({ name: 'New Title', description: 'This is a new description' })
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('object').that.is.not.equal({});
          expect(res.body.success).to.equal(true);
          expect(res.body.data.name).to.equal('New Title');
          expect(res.body.data.description).to.equal('This is a new description');
          done();
        });
    });

    it('Not able to update a project without valid token', (done) => {
      chai.request(app)
        .put(`/api/v1/projects/${projectId}`)
        .send({ name: 'New Title', description: 'This is a new description' })
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.an('string');
          expect(res.body.success).to.equal(false);
          done();
        });
    });

    it('Able to delete a project with valid token and id', (done) => {
      chai.request(app)
        .delete(`/api/v1/projects/${projectId}`)
        .set('Authorization', token)
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.data).to.be.an('object').that.is.deep.equal({});
          expect(res.body.success).to.equal(true);
          done();
        });
    });

    it('Not able to delete a project without valid token', (done) => {
      chai.request(app)
        .delete(`/api/v1/projects/${projectId}`)
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(res.body.error).to.be.an('string');
          expect(res.body.success).to.equal(false);
          done();
        });
    });
  });
});
