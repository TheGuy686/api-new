import { create, all, BigNumber } from 'mathjs';
import { insertArgsToStr } from './misc';

// create a mathjs instance with configuration

const math = create(all, {
    epsilon: 1e-12,
    matrix: 'Matrix',
    number: 'number',
    precision: 64,
    predictable: false,
});

export default class EMath {
    static mathConfig: math.ConfigOptions = {
        epsilon: 1e-12,
        matrix: 'Matrix',
        number: 'number',
        precision: 64,
        predictable: false
    };

    static math = create(all, EMath.mathConfig);

    /**
     *
     * @param formula
     * @param variables
     * @returns
     */
    static raw(formula: string, variables: any) {
        const parser = math.parser();

        let results;

        const fi = insertArgsToStr(formula, variables);

        try {
            results = parser.evaluate(fi);
            parser.clear();
        }
        catch(err) {
            throw new Error(`EMath.raw error thrown: ${err.message}`);
        }

        return results;
    }

    /**
     *
     * @param formula
     * @param variables
     * @returns
     */
    static calc(formula: string, variables?: any) {
        const parser = math.parser();

        parser.clear();

        const fi = insertArgsToStr(formula, variables);

        let results;

        try {
            results = parser.evaluate(fi);
            parser.clear();
        }
        catch(err) {
            throw new Error(`EMath.calc error thrown: ${err.message}, formula "${fi}"`);
        }

        return results;
    }

    static format(formula: string, variables: any) {
        try {
            return math.number(insertArgsToStr(formula, variables));
        }
        catch(err) {
            throw new Error(`EMath.format error thrown: ${err.message}`);
        }
    }

    static addition(val1: number, val2: number) {
        return val1 + val2; // The addition returs sum of two numbers
    }

    static subtraction(val1: number, val2: number) {
        return val1 - val2; // The subtraction returs the result subtracting second number from first number
    }

    static multiplication(val1: number, val2: number) {
        return val1 * val2;  // The addition returs multiplication of two numbers
    }

    static division(val1: number, val2: number) {
        return val1 / val2;  // The division returs the result dividing first number by second number
    }

    static modulus(val1: number, val2: number) {
        return val1 % val2;  // The division returs the remainders after dividing first number by second number
    }

    static exponentiation(val1: number, val2: number) {
        return val1 ** val2; // The exponentiation returns the result of raising the first operand to the power of the second operand.
    }

    static increment(val1: number) {
        return val1++; // The decrement returns value incremented by 1
    }

    static decrement(val1: number) {
        return val1--; // The decrement returns value decremented by 1
    }

    // math
    static abs(val1: number) {
        return math.abs(val1); // The math.abs() function returns the absolute value of a number
    }

    static acos(val1: number) {
        return math.acos(val1); // The math.acos() function returns the arccosine (in radians) of a number
    }

    static acosh(val1: number) {
        return math.acosh(val1); // The math.acosh() function returns the hyperbolic arc-cosine of a number
    }

    static asin(val1: number) {
        return math.asin(val1); //  The math.asin() function returns the arcsine (in radians) of a number
    }

    static asinh(val1: number) {
        return math.asinh(val1); // The math.asinh() function returns the hyperbolic arcsine of a number
    }

    static atan(val1: number) {
        return math.atan(val1); // The math.atan() function returns the arctangent (in radians) of a number
    }

    static atan2(val1: number, val2: number) {
        return math.atan2(val1, val2); // The math.atan2() function returns the angle in the plane (in radians) between the positive x-axis and the ray from (0,0) to the point (x,y), for math.atan2(y,x)
    }

    static atanh(val1: number) {
        return math.atanh(val1); //  The math.atanh() function returns the hyperbolic arctangent of a number
    }

    static cbrt(val1: number) {
        return math.cbrt(val1);  // The math.cbrt() function returns the cube root of a number
    }

    static ceil(val1: number) {
        return math.ceil(val1); // The math.ceil() function always rounds a number up to the next largest integer
    }

    static clz32(val1: number) {
        return Math.clz32(val1); // The math.clz32() function returns the number of leading zero bits in the 32-bit binary representation of a number
    }

    static cos(val1: number) {
        return math.cos(val1); // The math.cos() static function returns the cosine of the specified angle, which must be specified in radians
    }

    static cosh(val1: number) {
        return math.cosh(val1); // The math.cosh() function returns the hyperbolic cosine of a number, that can be expressed using the constant e
    }

    static exp(val1: number) {
        return math.exp(val1); // The math.exp() function returns e^x, where x is the argument, and e is Euler's number (also known as Napier's constant), the base of the natural logarithms.
    }

    static expm1(val1: number) {
        return math.expm1(val1); //  The math.expm1() function returns e^x - 1, where x is the argument, and e the base of the natural logarithms.
    }

    static floor(val1: number) {
        return math.floor(val1); //  The math.floor() function returns the largest integer less than or equal to a given number
    }

    static fround(val1: number) {
        return math.round(val1); //  The math.fround() function returns the nearest 32-bit single precision float representation of a Number
    }

    static hypot(val1: (number | BigNumber)[]) {
        return math.hypot(val1 as any); // The math.hypot() function returns the square root of the sum of squares of its arguments
    }

    static imul(val1: number, val2: number) {
        return math.multiply(val1, val2); //  The math.imul() function returns the result of the C-like 32-bit multiplication of the two parameters
    }

    static log(val1: number) {
        return math.log(val1); // The math.log() function returns the natural logarithm (base e) of a number
    }

    static log10(val1: number) {
        return math.log10(val1); // The math.log10() function returns the base 10 logarithm of a number
    }

    static log1p(val1: number) {
        return math.log1p(val1); // The math.log1p() function returns the natural logarithm (base e) of 1 + a number
    }

    static log2(val1: number) {
        return math.log2(val1); // The math.log2() function returns the base 2 logarithm of a number
    }

    static max(val1: number) {
        return math.max(val1); // The math.max() function returns the largest of the zero or more numbers given as input parameters, or NaN if any parameter isn't a number and can't be converted into one
    }

    static min(val1: number) {
        return math.min(val1); // The static function math.min() returns the lowest-valued number passed into it, or NaN if any parameter isn't a number and can't be converted into one
    }

    static pow(val1: number, val2: number) {
        return math.pow(val1, val2); // The math.pow() static method, given two arguments, base and exponent, returns baseexponent
    }

    static random() {
        return math.random(); // The math.random() function returns a floating-point, pseudo-random number in the range 0 to less than 1 (inclusive of 0, but not 1) with approximately uniform distribution over that range — which you can then scale to your desired range. The implementation selects the initial seed to the random number generation algorithm; it cannot be chosen or reset by the user
    }

    static round(val1: number) {
        return math.round(val1); //  The math.round() function returns the value of a number rounded to the nearest integer.
    }

    static sign(val1: number) {
        return math.sign(val1); // The math.sign() function returns either a positive or negative +/- 1, indicating the sign of a number passed into the argument. If the number passed into math.sign() is 0, it will return a +/- 0. Note that if the number is positive, an explicit (+) will not be returned
    }

    static sin(val1: number) {
        return math.sin(val1); // The math.sin() function returns the sine of a number.
    }

    static sinh(val1: number) {
        return math.sinh(val1); // The math.sinh() function returns the hyperbolic sine of a number, that can be expressed using the constant e
    }

    static sqrt(val1: number) {
        return math.sqrt(val1); // The math.sqrt() function returns the square root of a number
    }

    static tan(val1: number) {
        return math.tan(val1); // The math.tan() function returns the tangent of a number.
    }

    static tanh(val1: number) {
        return math.tanh(val1); // The math.tanh() function returns the hyperbolic tangent of a number
    }

    static trunc(val1: number) {
        return Math.trunc(val1); //  The math.trunc() function returns the integer part of a number by removing any fractional digits
    }

    static toObj() {
        return {
            calc: this.calc,
            format: this.format,
            addition: this.addition,
            subtraction: this.subtraction,
            multiplication: this.multiplication,
            division: this.division,
            modulus: this.modulus,
            exponentiation: this.exponentiation,
            increment: this.increment,
            decrement: this.decrement,
            abs: this.abs,
            acos: this.acos,
            acosh: this.acosh,
            asin: this.asin,
            asinh: this.asinh,
            atan: this.atan,
            atan2: this.atan2,
            atanh: this.atanh,
            cbrt: this.cbrt,
            ceil: this.ceil,
            clz32: this.clz32,
            cos: this.cos,
            cosh: this.cosh,
            exp: this.exp,
            expm1: this.expm1,
            floor: this.floor,
            fround: this.fround,
            hypot: this.hypot,
            imul: this.imul,
            log: this.log,
            log10: this.log10,
            log1p: this.log1p,
            log2: this.log2,
            max: this.max,
            min: this.min,
            pow: this.pow,
            random: this.random,
            round: this.round,
            sign: this.sign,
            sin: this.sin,
            sinh: this.sinh,
            sqrt: this.sqrt,
            tan: this.tan,
            tanh: this.tanh,
            trunc: this.trunc,
        };
    }
}