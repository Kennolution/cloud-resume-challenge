import { handler } from '../visitorCounter.js'; // 
import { expect } from 'chai';

describe('Visitor Counter Unit Test', () => {
    it('should be a function', async () => {
        // Change 'app.handler' to just 'handler'
        expect(handler).to.be.a('function');
    });

    it('returns a successful response object', async () => {
        // Change 'app.handler' to just 'handler'
        const result = await handler({}); 
        expect(result).to.be.an('object');
        expect(result.statusCode).to.equal(200);
    });
});