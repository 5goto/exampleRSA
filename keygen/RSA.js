const fs = require('fs');

module.exports.RSA = class RSA {

    constructor() {
    }
    isPrime(number) {
        if (number <= 1) return false;
        if (number <= 3) return true;

        if (number % 2 === 0 || number % 3 === 0) return false;

        let i = 5;
        while (i * i <= number) {
            if (number % i === 0 || number % (i + 2) === 0) return false;
            i += 6;
        }
        return true;
    }

    getRandomPrime(min=1157,
                   max=11579208) {
        min = Math.ceil(min);
        max = Math.floor(max);

        while (true) {
            const randomNum = Math.floor(Math.random() * (max - min + 1)) + min;
            if (this.isPrime(randomNum)) {
                return randomNum;
            }
        }
    }

    makePrimes() {   // (1) Генерируем простые числа
        return [this.getRandomPrime(), this.getRandomPrime()]
    }

    eulerFunction(p, q) {  // вычисляем функцию Эйлера
        return (p - 1) * (q - 1)
    }

    gcd(a, b) { // вспомогательная функция для getRandomPrimeLessThanN
        return b === 0 ? a : this.gcd(b, a % b);
    }

    getRandomPrimeLessThanN(N) {
        let e;
        do {
            e = Math.floor(Math.random() * N);
        } while (!this.isPrime(e) || this.gcd(e, N) !== 1);
        return e;
    }

    extendedGCD(a, b) {
        if (b === 0) {
            return { gcd: a, x: 1, y: 0 };
        } else {
            const result = this.extendedGCD(b, a % b);
            return { gcd: result.gcd, x: result.y, y: result.x - Math.floor(a / b) * result.y };
        }
    }

    modInverse(e, phi) {
        const result = this.extendedGCD(e, phi);
        const gcd = result.gcd;
        const x = result.x;

        if (gcd !== 1) {
            throw new Error('Инверсия по модулю не существует, так как числа не взаимно просты.');
        } else {
            // Нормализация к положительному числу в пределах phi
            const d = (x % phi + phi) % phi;
            return d;
        }
    }


    getKeys() {
        const [p, q] = this.makePrimes()
        const n = p * q
        const phi = this.eulerFunction(p, q)
        const e = this.getRandomPrimeLessThanN(phi)
        const d = this.modInverse(e, phi)

        fs.writeFile('public.txt', `${e}:${n}`, function(error){
            if(error) throw error;
        });
        fs.writeFile('private.txt', `${d}:${n}`, function(error){
            if(error) throw error;
        });
    }
}