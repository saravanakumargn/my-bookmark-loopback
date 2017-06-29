var assert = require('assert');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../server/server');
let should = chai.should();

chai.use(chaiHttp);

  describe('index / route', () => {
    it('should return valid page results', (done) => {
      chai.request(server).get('/').end((err, res) => {
        res.should.have.status(200);
        // res.body.should.be.a('text');
        // res.should.equal('bar');
        done();
      })
    });
  });

  describe('/bookmark route', () => {
    it('should return valid main page results', (done) => {
      chai.request(server).get('/bookmark').end((err, res) => {
        res.should.have.status(200);
        // res.body.should.be.a('text');
        // res.should.equal('bar');
        done();
      })
    });
  });  