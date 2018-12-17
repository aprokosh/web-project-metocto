const assert = require('chai').assert;
const count_new = require('../index.js').count_new;

describe ('App', function(){
    it('app should return number of under-review', function(){
        let k=0;
        const mongoClient = require("mongodb").MongoClient;
        const url = process.env.MONGODB_URI || "mongodb://user:user123@ds056549.mlab.com:56549/metodbase";
        mongoClient.connect(url, function (err, client) {
            client.db("metodbase").collection("mero").find({
                status: 'review'
            }).count(function (err, result) {
                k = result;
            });
        });
        let res = count_new();
        assert.equal(res, k);
    });
});