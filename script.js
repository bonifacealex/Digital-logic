class NumberConverter {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        const convertBtn = document.getElementById('convertBtn');
        const inputValue = document.getElementById('inputValue');
        const inputBase = document.getElementById('inputBase');

        convertBtn.addEventListener('click', () => this.convert());
        inputValue.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.convert();
        });

        // Add copy functionality
        this.initializeCopyFunctionality();
    }

    initializeCopyFunctionality() {
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('result-value') && e.target.textContent !== '-') {
                this.copyToClipboard(e.target.textContent, e.target);
            }
        });
    }

    async copyToClipboard(text, element) {
        try {
            await navigator.clipboard.writeText(text);
            
            // Visual feedback
            const originalText = element.textContent;
            element.textContent = 'Copied!';
            element.style.color = '#10b981';
            
            setTimeout(() => {
                element.textContent = originalText;
                element.style.color = '';
            }, 1500);
        } catch (err) {
            console.error('Failed to copy: ', err);
        }
    }

    convert() {
        const inputValue = document.getElementById('inputValue').value.trim();
        const inputBase = document.getElementById('inputBase').value;
        const errorElement = document.getElementById('inputError');

        // Clear previous errors
        errorElement.textContent = '';

        if (!inputValue) {
            this.showError('Please enter a number');
            return;
        }

        try {
            let decimalValue;

            if (inputBase === 'roman') {
                decimalValue = this.romanToDecimal(inputValue);
                if (decimalValue === null) {
                    this.showError('Invalid Roman numeral');
                    return;
                }
            } else {
                decimalValue = this.toDecimal(inputValue, parseInt(inputBase));
                if (decimalValue === null) {
                    this.showError(`Invalid ${this.getBaseName(inputBase)} number`);
                    return;
                }
            }

            this.displayResults(decimalValue);
        } catch (error) {
            this.showError('Conversion error: ' + error.message);
        }
    }

    showError(message) {
        const errorElement = document.getElementById('inputError');
        errorElement.textContent = message;
        this.clearResults();
    }

    clearResults() {
        const resultIds = ['decimalResult', 'binaryResult', 'octalResult', 'hexResult', 'romanResult'];
        resultIds.forEach(id => {
            document.getElementById(id).textContent = '-';
        });
    }

    toDecimal(value, base) {
        if (base === 10) {
            const num = parseFloat(value);
            return isNaN(num) ? null : Math.floor(num);
        }

        // Validate input for the given base
        const validChars = this.getValidChars(base);
        const regex = new RegExp(`^[${validChars}]+$`, 'i');
        
        if (!regex.test(value)) {
            return null;
        }

        try {
            return parseInt(value, base);
        } catch {
            return null;
        }
    }

    getValidChars(base) {
        switch (base) {
            case 2: return '01';
            case 8: return '0-7';
            case 10: return '0-9';
            case 16: return '0-9A-F';
            default: return '';
        }
    }

    getBaseName(base) {
        const names = {
            '2': 'Binary',
            '8': 'Octal',
            '10': 'Decimal',
            '16': 'Hexadecimal',
            'roman': 'Roman'
        };
        return names[base] || 'Unknown';
    }

    romanToDecimal(roman) {
        const romanNumerals = {
            'I': 1, 'V': 5, 'X': 10, 'L': 50,
            'C': 100, 'D': 500, 'M': 1000
        };

        const validRomanRegex = /^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/i;
        
        if (!validRomanRegex.test(roman.toUpperCase())) {
            return null;
        }

        let result = 0;
        const upperRoman = roman.toUpperCase();

        for (let i = 0; i < upperRoman.length; i++) {
            const current = romanNumerals[upperRoman[i]];
            const next = romanNumerals[upperRoman[i + 1]];

            if (next && current < next) {
                result -= current;
            } else {
                result += current;
            }
        }

        return result;
    }

    decimalToRoman(num) {
        if (num < 1 || num > 3999) return 'Out of range (1-3999)';

        const romanNumerals = [
            ['M', 1000], ['CM', 900], ['D', 500], ['CD', 400],
            ['C', 100], ['XC', 90], ['L', 50], ['XL', 40],
            ['X', 10], ['IX', 9], ['V', 5], ['IV', 4], ['I', 1]
        ];

        let result = '';
        for (const [roman, value] of romanNumerals) {
            while (num >= value) {
                result += roman;
                num -= value;
            }
        }
        return result;
    }

    displayResults(decimalValue) {
        // Decimal
        document.getElementById('decimalResult').textContent = decimalValue.toString(10);

        // Binary
        document.getElementById('binaryResult').textContent = decimalValue.toString(2);

        // Octal
        document.getElementById('octalResult').textContent = decimalValue.toString(8);

        // Hexadecimal
        document.getElementById('hexResult').textContent = decimalValue.toString(16).toUpperCase();

        // Roman (limited to 1-3999)
        if (decimalValue >= 1 && decimalValue <= 3999) {
            document.getElementById('romanResult').textContent = this.decimalToRoman(decimalValue);
        } else {
            document.getElementById('romanResult').textContent = 'Out of range (1-3999)';
        }
    }
}

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new NumberConverter();
});

// Add some example conversions for demonstration
document.addEventListener('DOMContentLoaded', () => {
    // Pre-fill with an example
    setTimeout(() => {
        document.getElementById('inputValue').value = '255';
        document.getElementById('convertBtn').click();
    }, 500);
});
