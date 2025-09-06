var Test = /** @class */ (function () {
    function Test(a, b) {
        this.a = a;
        this.b = b;
        this.c = this.a;
    }
    return Test;
}());
var test = new Test('a', 'b');
console.log(test.c);
