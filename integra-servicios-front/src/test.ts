const { describe, it, expect } = require('jasmine-core');

describe('Pruebas unitarias', () => {
    it('debería retornar 2 cuando se suma 1 + 1', () => {
        expect(1 + 1).toBe(2);
    });
});