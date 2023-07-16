import {Calculator} from './calculator'

describe('Calculator Test', () => {
    it('multiply shoulf return a nine', () => {
        // arrange
        const calculator = new Calculator()
        // Act
        const rta = calculator.multiply(3,3)
        // Assert
        expect(rta).toEqual(9)
    });

    it('multiply shoulf return a four', () => {
        // arrange
        const calculator = new Calculator()
        // Act
        const rta = calculator.multiply(1,4)
        // Assert
        expect(rta).toEqual(4)
    });

    it('should return null', () => {
        const calculator = new Calculator()
        expect(calculator.divide(1,0)).toBe(null);
    });

    it('should return number', () => {
        const calculator = new Calculator()
        expect(calculator.divide(1,2)).toBe(0.5);
    });
    
    
});