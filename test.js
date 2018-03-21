const server_api = require('./tests/server-api');
const server_gate = require('./tests/server-gate');
const axios = require('axios').default;
const assert = require('assert');

const targetHost = 'http://localhost:8080';
const targetAPI = targetHost + '/comments';

describe('TGateServer', () => {
  let serverApi, serverGate;
  //------------------------------------------
  describe('Starting servers', ()=>{
    it('start api server', (done) => {
      server_api.then( server => {
        serverApi = server;
        assert.notEqual(serverApi, undefined);
        done();
      });
    });
    it('start gate server', (done) => {
      server_gate.then( server => {
        serverGate = server;
        assert.notEqual(serverGate, undefined);
        done();
      });
    });

  });
  //------------------------------------------
  describe('Requests', ()=>{
    it('make request to ' + targetHost, (done) => {
      axios.get(targetHost, {headers: {modname: 'mock-test'}}
      ).then(res=>{
        assert.ok;
        done();
      }).catch(err => {
        assert.fail(err);
        done();
      });
    });

    it('make request to ' + targetHost + ' (without modname)', (done) => {
      axios.get(targetHost, {}
      ).then(res=>{
        assert.fail('Should return error with status code 404');
        done();
      }).catch(err => {
        assert.equal(err.response.data.status, 404);
        assert.equal(err.response.data.error, 'ERROR_MODULE_NOT_EXIST');
        done();
      });
    });
  });
  //------------------------------------------
  describe('Middleware', ()=>{

    let toCheckMiddleware = false;

    const mid1 = (req, res, next) => {
      // execute before module check
      toCheckMiddleware = true;
      next();
    }

    const mid2 = (req, res, next) => {
      // stop middleware execution (does not invoke next)
      // ends http request
      res.end();
    }

    it('add middleware', () => {
      try {
        serverGate.use(mid1);
        assert.ok;
      } catch(err) {
        assert.fail(err);
      }
    });

    it('make request and check middleware', (done) => {
      axios.get(targetHost, {headers: {modname: 'mock-test'}}
      ).then(res=>{
        assert.equal(toCheckMiddleware, true);
        done();
      }).catch(err => {
        assert.fail(err);
        done();
      });
    });

    it('add middleware 2 (blocking mid execution)', () => {
      try {
        toCheckMiddleware = false;
        serverGate.use(mid2);
        assert.ok;
      } catch(err) {
        assert.fail(err);
      }
    });

    it('make request and check middleware 2', (done) => {
      axios.get(targetHost, {headers: {modname: 'mock-test'}}
      ).then(res=>{
        assert.equal(toCheckMiddleware, false);
        done();
      }).catch(err => {
        assert.fail(err);
        done();
      });
    });
  });
  //------------------------------------------
  // describe('API', ()=>{
  //   let insertedData = {};

  //   it('post data ' + targetAPI, (done) => {
  //     const data = {subject: "Test", message: "Test Message."};
  //     axios.post(targetAPI, data, {headers: {modname: 'mock-test'}}
  //     ).then(res=>{
  //       insertedData = res.data;
  //       assert.notEqual(insertedData.id, undefined);
  //       assert.notEqual(insertedData.id, 0);
  //       assert.notEqual(insertedData.id, false);
  //       done();
  //     }).catch(err => {
  //       assert.fail(err);
  //       done();
  //     });
  //   });

  //   it('get data ' + targetAPI, (done) => {
  //     axios.get(targetAPI + '/' + insertedData.id, {headers: {modname: 'mock-test'}}
  //     ).then(res=>{
  //       const getData = res.data;
  //       assert.equal(getData.id, insertedData.id);
  //       done();
  //     }).catch(err => {
  //       assert.fail(err);
  //       done();
  //     });
  //   });

  //   it('patch data ' + targetAPI, (done) => {
  //     axios.get(targetAPI + '/' + insertedData.id, {headers: {modname: 'mock-test'}}
  //     ).then(res=>{
  //       const getData = res.data;
  //       assert.equal(getData.id, insertedData.id);
  //       done();
  //     }).catch(err => {
  //       assert.fail(err);
  //       done();
  //     });
  //   });

  // });
  //------------------------------------------
  describe('Stoping servers', ()=>{
    it('stop api server', (done) => {
      serverApi.close(()=>{
        assert.ok;
        done();
      });
    });
    it('stop gate server', (done) => {
      serverGate.close(()=>{
        assert.ok;
        done();
      });
    });
  });
  //------------------------------------------
});