(function () {

    var testExample; // Текущий пример для решения
    var exampleGenerator = []; // Множество типов примеров для теста
    var wrongAnswers = ""; // Строка со списком неправильных ответов
    var exampleTypes = ""; // Список типов примеров для текущего теста

    var answer; // Правильный ответ на пример
    var examplesCount = 0, correctCount = 0, wrongCount = 0; // Счетчик общего количества, а также верных и неверных ответов

    var $example = $('#example'); // Поле с примером
    var $answerInput = $('#answer'); // Поле для ввода ответа на примера
    var $answerCounter = $('#answersCounter'); // Поле для отображения общего количества ответов
    var $correctAnswCounter = $('#correctAnswCounter'); // Поле для отображения количества верных ответов
    var $wrongAnswCounter = $('#wrongAnswCounter'); // Поле для отображения количества неверных ответов

    var $testBlock = $('#testBlock'); // Блок с примером и ответом
    var $resultTab = $('#resultTab'); // Блок с результатом теста
    var $eventMsg = $('#eventMsg'); // Блок с сообщениями об успехах/ошибках

    var $submitBtn = $('#submitBtn'); // Кнопка ответа на пример
    var $toTest = $('#toTest'); // Кнопка для запуска теста
    var $submitTest = $('#submitTest'); // Кнопка для завершения теста
    var $repeatTest = $('#repeatTest'); // Кнопка повторения теста с текущими настройками
    var $testProp = $('#testProp'); // Ссылка на табу "Установка"

    // Прослушка событий нажатия кнопок и ссылок перехода
    $toTest.on('click', function () {
        return checkTypes();
    });

    $submitBtn.on('click', function () {
        return submitExample();
    });

    $repeatTest.on('click', function () {
        resetTest();
        return $toTest.click();
    });

    $submitTest.on('click', function (e) {
        if (!$submitTest.hasClass('disabled')) {
            $eventMsg[0].classList.remove('alert-success', 'alert-danger', 'alert-warning');
            $eventMsg[0].classList.add('alert-info');
            $eventMsg[0].classList.remove('hidden');
            $testProp[0].classList.remove('disabled');
            $testProp.unbind('click', false);
            $testBlock[0].classList.add('hidden');
            $repeatTest[0].classList.remove('hidden');
            $submitTest[0].classList.add('hidden');

            $eventMsg.html("Тест завершен" + "</br>" + "Использованы типы примеров: " + exampleTypes + "</br>" +
                "Процент правильных ответов: " + Math.round(correctCount / examplesCount * 100) + "%")
        }
        e.preventDefault()
    });

    $testProp.on('click', function (e) {
        if (!$testProp.hasClass('disabled')) {
            return resetTest();
        }
        e.preventDefault()
    });

    // Сброс результатов предыдущего теста
    function resetTest() {
        $answerInput.val("");
        $eventMsg.html("");
        $eventMsg[0].classList.add('hidden');
        $testBlock[0].classList.add('hidden');
        $resultTab[0].classList.add('hidden');
        $toTest[0].classList.remove('hidden');
        $repeatTest[0].classList.add('hidden');
        $answerCounter.html("0");
        $correctAnswCounter.html("0");
        $wrongAnswCounter.html("0");
        examplesCount = 0;
        correctCount = 0;
        wrongCount = 0;
        exampleTypes = "";
        wrongAnswers = '';
        exampleGenerator = [];
    }

    // Генератор примеров на сложение
    function additionExamples() {
        var a = Math.floor(Math.random() * (100 - 1)) + 1;
        var b = Math.floor(Math.random() * ((100 - a) - 1)) + 1;
        answer = a + b;
        testExample = a + " + " + b + " = ?";

        $example.html(testExample);
    }

    // Генератор примеров на вычитание
    function subtractionExamples() {
        var a = Math.floor(Math.random() * (100 - 1)) + 1;
        var b = Math.floor(Math.random() * ((100 - a)) - 1) + 1;
        var d = a + b;
        answer = d - a;
        testExample = d + " - " + a + " = ?";

        $example.html(testExample);
    }

    // Генератор примеров на умножение
    function multiplicationExamples() {
        var a = Math.floor(Math.random() * (20 - 2)) + 2;
        var b = Math.floor(Math.random() * (100 / a));
        answer = a * b;
        testExample = a + " * " + b + " = ?";

        $example.html(testExample);
    }

    // Генератор примеров на деление
    function divisionExamples() {
        var a = Math.floor(Math.random() * (10 - 2)) + 2;
        var b = Math.floor(Math.random() * (10 - 2)) + 2;
        var d = a * b;
        answer = d / a;
        testExample = d + " / " + a + " = ?";

        $example.html(testExample);
    }

    // Обработчик ответа пользователя на пример
    function submitExample() {
        $eventMsg[0].classList.remove('alert-success', 'alert-danger', 'alert-warning', 'alert-info');
        if (!/^(100|[1-9]?\d)$/.test($answerInput.val())) {
            $eventMsg[0].classList.add('alert-warning');
            $eventMsg[0].classList.remove('hidden');
            $eventMsg.html("Ответ должен быть в приделах от 0 до 100");
        } else if ($answerInput.val() == answer) {
            $eventMsg[0].classList.add('alert-success');
            $eventMsg[0].classList.remove('hidden');
            $eventMsg.html("Ответ верный");
            correctCount += 1;
            examplesCount += 1;
            $answerCounter.html(examplesCount);
            $correctAnswCounter.html(correctCount);
            $submitBtn.attr('disabled', 'disabled');
            $submitTest.attr('disabled', 'disabled');
            setTimeout(test, 2000);
        } else {
            $eventMsg[0].classList.add('alert-danger');
            $eventMsg[0].classList.remove('hidden');
            $eventMsg.html("Ответ неверный");
            wrongCount += 1;
            examplesCount += 1;
            $answerCounter.html(examplesCount);
            $wrongAnswCounter.html(wrongCount);
            wrongAnswers += wrongCount + ". " + testExample + " Ответ: " + $answerInput.val() + "</br>";
            $submitBtn.attr('disabled', 'disabled');
            $submitTest.attr('disabled', 'disabled');
            setTimeout(test, 2000);
        }
    }

    // Проверка готовности теста к запуску, получение множества типов примеров
    function checkTypes() {
        var additionCheck = $('#addition').prop('checked'); //проверка чекбокса сложение
        var subtractionCheck = $('#subtraction').prop('checked'); //проверка чекбокса вычитание
        var multiplicationCheck = $('#multiplication').prop('checked'); //проверка чекбокса умножение
        var divisionCheck = $('#division').prop('checked'); //проверка чекбокса деление

        if (additionCheck) {
            exampleGenerator.push(additionExamples);
            exampleTypes += "Сложение \n"
        }
        if (subtractionCheck) {
            exampleGenerator.push(subtractionExamples);
            exampleTypes += "Вычитание \n"
        }
        if (multiplicationCheck) {
            exampleGenerator.push(multiplicationExamples);
            exampleTypes += "Умножение \n"
        }
        if (divisionCheck) {
            exampleGenerator.push(divisionExamples);
            exampleTypes += "Деление \n"
        }

        if (exampleGenerator.length > 0) {
            $submitTest[0].classList.remove('hidden');
            $testBlock[0].classList.remove('hidden');
            $resultTab[0].classList.remove('hidden');
            $toTest[0].classList.add('hidden');
            $testProp[0].classList.add('disabled');
            $testProp.bind('click', false);
            test();
        } else {
            $eventMsg[0].classList.add('alert-warning');
            $eventMsg[0].classList.remove('hidden');
            $eventMsg.html("Не выбраны типы примеров для тестирования");
        }
    }

    // Рандомизатор типов примеров из представленного множества
    function test() {

        var getExample; // Получение случайного гененератора примеров из представленного множества

        $submitBtn.removeAttr('disabled');
        $submitTest.removeAttr('disabled');
        $answerInput.val("");
        $answerInput.focus();
        $eventMsg.html("");
        $eventMsg[0].classList.add('hidden');

        getExample = exampleGenerator[Math.floor(Math.random() * exampleGenerator.length)];
        getExample();
    }


/////////////////////////////////////// ClassList support for IE9+ ///////////////////////////////////////////////////

    /*global self, document, DOMException */

    /*! @source http://purl.eligrey.com/github/classList.js/blob/master/classList.js*/

    if ("document" in self) {

        // Full polyfill for browsers with no classList support
        if (!("classList" in document.createElement("_"))) {

            (function (view) {

                "use strict";

                if (!('Element' in view)) return;

                var
                    classListProp = "classList"
                    , protoProp = "prototype"
                    , elemCtrProto = view.Element[protoProp]
                    , objCtr = Object
                    , strTrim = String[protoProp].trim || function () {
                            return this.replace(/^\s+|\s+$/g, "");
                        }
                    , arrIndexOf = Array[protoProp].indexOf || function (item) {
                            var
                                i = 0
                                , len = this.length
                                ;
                            for (; i < len; i++) {
                                if (i in this && this[i] === item) {
                                    return i;
                                }
                            }
                            return -1;
                        }
                    // Vendors: please allow content code to instantiate DOMExceptions
                    , DOMEx = function (type, message) {
                        this.name = type;
                        this.code = DOMException[type];
                        this.message = message;
                    }
                    , checkTokenAndGetIndex = function (classList, token) {
                        if (token === "") {
                            throw new DOMEx(
                                "SYNTAX_ERR"
                                , "An invalid or illegal string was specified"
                            );
                        }
                        if (/\s/.test(token)) {
                            throw new DOMEx(
                                "INVALID_CHARACTER_ERR"
                                , "String contains an invalid character"
                            );
                        }
                        return arrIndexOf.call(classList, token);
                    }
                    , ClassList = function (elem) {
                        var
                            trimmedClasses = strTrim.call(elem.getAttribute("class") || "")
                            , classes = trimmedClasses ? trimmedClasses.split(/\s+/) : []
                            , i = 0
                            , len = classes.length
                            ;
                        for (; i < len; i++) {
                            this.push(classes[i]);
                        }
                        this._updateClassName = function () {
                            elem.setAttribute("class", this.toString());
                        };
                    }
                    , classListProto = ClassList[protoProp] = []
                    , classListGetter = function () {
                        return new ClassList(this);
                    }
                    ;
                // Most DOMException implementations don't allow calling DOMException's toString()
                // on non-DOMExceptions. Error's toString() is sufficient here.
                DOMEx[protoProp] = Error[protoProp];
                classListProto.item = function (i) {
                    return this[i] || null;
                };
                classListProto.contains = function (token) {
                    token += "";
                    return checkTokenAndGetIndex(this, token) !== -1;
                };
                classListProto.add = function () {
                    var
                        tokens = arguments
                        , i = 0
                        , l = tokens.length
                        , token
                        , updated = false
                        ;
                    do {
                        token = tokens[i] + "";
                        if (checkTokenAndGetIndex(this, token) === -1) {
                            this.push(token);
                            updated = true;
                        }
                    }
                    while (++i < l);

                    if (updated) {
                        this._updateClassName();
                    }
                };
                classListProto.remove = function () {
                    var
                        tokens = arguments
                        , i = 0
                        , l = tokens.length
                        , token
                        , updated = false
                        , index
                        ;
                    do {
                        token = tokens[i] + "";
                        index = checkTokenAndGetIndex(this, token);
                        while (index !== -1) {
                            this.splice(index, 1);
                            updated = true;
                            index = checkTokenAndGetIndex(this, token);
                        }
                    }
                    while (++i < l);

                    if (updated) {
                        this._updateClassName();
                    }
                };
                classListProto.toggle = function (token, force) {
                    token += "";

                    var
                        result = this.contains(token)
                        , method = result ?
                            force !== true && "remove"
                            :
                            force !== false && "add"
                        ;

                    if (method) {
                        this[method](token);
                    }

                    if (force === true || force === false) {
                        return force;
                    } else {
                        return !result;
                    }
                };
                classListProto.toString = function () {
                    return this.join(" ");
                };

                if (objCtr.defineProperty) {
                    var classListPropDesc = {
                        get: classListGetter
                        , enumerable: true
                        , configurable: true
                    };
                    try {
                        objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                    } catch (ex) { // IE 8 doesn't support enumerable:true
                        if (ex.number === -0x7FF5EC54) {
                            classListPropDesc.enumerable = false;
                            objCtr.defineProperty(elemCtrProto, classListProp, classListPropDesc);
                        }
                    }
                } else if (objCtr[protoProp].__defineGetter__) {
                    elemCtrProto.__defineGetter__(classListProp, classListGetter);
                }

            }(self));

        } else {

            // There is full or partial native classList support, so just check if we need
            // to normalize the add/remove and toggle APIs.
            (function () {
                "use strict";

                var testElement = document.createElement("_");

                testElement.classList.add("c1", "c2");

                // Polyfill for IE 10/11 and Firefox <26, where classList.add and
                // classList.remove exist but support only one argument at a time.
                if (!testElement.classList.contains("c2")) {
                    var createMethod = function (method) {
                        var original = DOMTokenList.prototype[method];

                        DOMTokenList.prototype[method] = function (token) {
                            var i, len = arguments.length;

                            for (i = 0; i < len; i++) {
                                token = arguments[i];
                                original.call(this, token);
                            }
                        };
                    };
                    createMethod('add');
                    createMethod('remove');
                }

                testElement.classList.toggle("c3", false);

                // Polyfill for IE 10 and Firefox <24, where classList.toggle does not
                // support the second argument.
                if (testElement.classList.contains("c3")) {
                    var _toggle = DOMTokenList.prototype.toggle;

                    DOMTokenList.prototype.toggle = function (token, force) {
                        if (1 in arguments && !this.contains(token) === !force) {
                            return force;
                        } else {
                            return _toggle.call(this, token);
                        }
                    };

                }

                testElement = null;
            }());

        }

    }

})();