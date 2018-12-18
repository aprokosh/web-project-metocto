const index = require('../')
const chai = require('chai')
const expect = chai.expect;
chai.use( require('chai-integer') );


describe('Тесты', function() {
    describe('Проверка регулярных выражений', function() {
        it('regex1 true', async () => {
            let string = '12 медвежат';
            let regex1 = /([0-9\s\D]*)([a-zA-Zа-яА-Я]+)([0-9\s\D]*){3,}/g;
            const result = await index.check_regex(regex1, string);
            expect(result).to.equal(true)
        });

        it('regex1 false', async () => {
            let string = '89215678213';
            let regex1 = /([0-9\s\D]*)([a-zA-Zа-яА-Я]+)([0-9\s\D]*){3,}/g;
            const result = await index.check_regex(regex1, string);
            expect(result).to.equal(false)
        });

        it('regex2 true', async () => {
            let string = 'vk.com/123'
            let regex2 = /([a-zA-Z0-9/]+)([a-zA-Z0-9/:-]*)([.]+)([a-zA-Z]+)([a-zA-Z0-9/-]*){5,}/g;
            const result = await index.check_regex(regex2, string);
            expect(result).to.equal(true)
        });

        it('regex2 false', async () => {
            let string = '-vk.com/123'
            let regex2 = /([a-zA-Z0-9/]+)([a-zA-Z0-9/:-]*)([.]+)([a-zA-Z]+)([a-zA-Z0-9/-]*){5,}/g;
            const result = await index.check_regex(regex2, string);
            expect(result).to.equal(false)
        });
    });

    describe('Проверка принадлежности избранному', function() {
        it('Должен возвращать false', async () => {
            var mero = await index.find_mero_by_id('5be60de932964217643498b3');
            let result = await index.is_fav("admin", await mero);
            expect(result).to.equal(false)
        });

        it('Должен возвращать true', async () => {
            var mero = await index.find_mero_by_id('5c034047b011113d08139796');
            let result = await index.is_fav("admin", await mero);
            expect(result).to.equal(true)
        });
    });

    describe('Проверка новых мероприятий', function() {
        it('Возвращаемый тип - целое число', async () => {
            const cnt = await count_new();
            expect(cnt).to.be.an.integer();
        });

        it('Количество новых мероприятий (2)', async () => {
            const result = await count_new();
            expect(result).to.equal(1)
        });
    });
});