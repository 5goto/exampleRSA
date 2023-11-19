const fs= require('fs');

const readFile = (filePath) => {
    return fs.readFileSync(filePath, 'utf-8')
}

const readEncryptedFile = (filePath) => {
    const str = fs.readFileSync(filePath, 'utf-8')
    return JSON.parse(str)
}

const writeFileFromArr = (arr) => {
        fs.writeFile('result', `${String.fromCharCode.apply(null, arr)}`, function(error){
            if(error) throw error;
        });
}

const writeAsJSON = (arr) => {
    const arrayAsString = JSON.stringify(arr);
    fs.writeFile('result.enc', arrayAsString, function(error){
        if(error) throw error;
    });
}

function utf8Encode(str) {
    const utf8 = [];

    for (let i = 0; i < str.length; i++) {
        let charCode = str.charCodeAt(i);

        if (charCode < 0x80) {
            utf8.push(charCode);
        } else if (charCode < 0x800) {
            utf8.push(0xc0 | (charCode >> 6), 0x80 | (charCode & 0x3f));
        } else if (charCode < 0xd800 || charCode >= 0xe000) {
            utf8.push(
                0xe0 | (charCode >> 12),
                0x80 | ((charCode >> 6) & 0x3f),
                0x80 | (charCode & 0x3f)
            );
        } else {
            // Surrogate pair
            i++;
            charCode =
                0x10000 +
                (((charCode & 0x3ff) << 10) | (str.charCodeAt(i) & 0x3ff));
            utf8.push(
                0xf0 | (charCode >> 18),
                0x80 | ((charCode >> 12) & 0x3f),
                0x80 | ((charCode >> 6) & 0x3f),
                0x80 | (charCode & 0x3f)
            );
        }
    }

    return utf8;
}


const getAsciiArrFromFile = (filePath) => {
    try {
        // Считываем содержимое файла
        const fileContent = fs.readFileSync(filePath, 'utf-8');

        return utf8Encode(fileContent)
        // Преобразуем каждый символ в ASCII код и создаем массив значений
        // const asciiSequence = [];
        // for (let i = 0; i < fileContent.length; i++) {
        //     const charCode = fileContent.charCodeAt(i);
        //     asciiSequence.push(charCode);
        // }
        //
        // return asciiSequence;
    } catch (error) {
        console.error('Ошибка при чтении файла:', error.message);
        return null;
    }
}

const encrypt = (asciiArray, pub) => {
    let [e, n] = pub.split(':')
    e = parseInt(e)
    n = parseInt(n)

    return asciiArray.map(( code ) => {
        return powModBig(code, e, n)
    })
}

function powModBig(n, p, m) {
    if (n < 1n) { return 0n; }
    if (m < 0n) { m = 0n; }
    n = n % m;
    n = BigInt(n)
    p = BigInt(p)
    m = BigInt(m)
    let r = 1n;
    while (p >= 1n) {
        if (p % 2n) {
            r = (r * n) % m;
        }
        n = (n * n) % m;
        p = p / 2n;
    }
    return Number(r);
}


const decrypt = (asciiArray, priv) => {
    let [d, n] = priv.split(':')
    d = parseInt(d)
    n = parseInt(n)

    return asciiArray.map(( code ) => {
        return powModBig(code, d, n)
    })
}

module.exports.encrypt = encrypt
module.exports.getAsciiArrFromFile = getAsciiArrFromFile
module.exports.decrypt = decrypt
module.exports.readFile = readFile
module.exports.writeFileFromArr = writeFileFromArr
module.exports.readEncryptedFile = readEncryptedFile
module.exports.writeAsJSON = writeAsJSON
