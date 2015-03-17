(function () {
    var qList = byId('questions');
    var $legend = byId('legend');
    var workerChart = $('.workers .chart');
    var retireeChart = $('.retirees .chart');
    var currentAnswers = $('.current-answers section');
    var currentAnswerItems = $all('.current-answers section .answer-item a');

    var legend = {
        "Frozen": {
            className: 'frozen',
            color: '#6E6E6E',
            desc: 'Describe frozen ....'
        },
        "Behind": {
            className: 'blind',
            color: '#B7357C',
            desc: 'Describe behind ....'
        },
        "Aware": {
            className: 'challenged',
            color: '#FFC700',
            desc: 'Describe aware ....'
        },
        "Stable": {
            className: 'auto-pilot',
            color: '#76C5E4',
            desc: 'Describe stable ....'
        },
        "Prepared": {
            className: 'ready',
            color: '#9AC1A6',
            desc: 'Describe prepared ....'
        }
    };

    Object.keys(legend).forEach(function (key) {
        $legend.insertAdjacentHTML('afterbegin', '<li data-tooltip="'+legend[key].desc+'"><span class="dot" style="background: ' + legend[key].color + '"></span> <span class="key">' + key + '</span></li>');
    });

    var dotR = 3;
    var dotGap = 8;

    vData.questions.forEach(function (q, i) {
        qList.insertAdjacentHTML('beforeend', '<li></li>');
    });

    // select from one of 9 questions
    qList.addEventListener('click', function (e) {
        if (e.target.tagName !== 'LI') return;
        // console.log(e);
        var position = Array.prototype.indexOf.call(qList.childNodes, e.target);
        // console.log(position);

        $('#questions .active').classList.remove('active');
        qList.childNodes[position].classList.add('active');

        $('.current-question').textContent = vData.questions[position].wl;

        var workerQ = $('.workers .qualifiers');
        var retireesQ = $('.retirees .qualifiers');

        while (workerQ.lastChild) { workerQ.removeChild(workerQ.lastChild); }
        while (retireesQ.lastChild) { retireesQ.removeChild(retireesQ.lastChild); }
        while (currentAnswers.lastChild) { currentAnswers.removeChild(currentAnswers.lastChild); }


        // console.log(vData.questions);
        // qualifiers.dataset.current = position;

        var ul_answers = document.createElement('ul');
        ul_answers.classList.add('answers');
        var ul_answer_items = "";

        //Retired choices
        vData.questions[position].rchoices.forEach(function (choice,ci) {
            console.log('retirees choice', choice);

            ul_answer_items += '<li class="answer-item '+sanitizeClass(vData.questions[position].wq+'-'+ci)+'"><a data-choice="'+sanitizeClass(vData.questions[position].wq+'-'+ci)+'" href="#'+sanitizeClass(vData.questions[position].wq+'-'+ci)+'">'+choice.l+'</a></li>';


            currentAnswers.appendChild(ul_answers);

            var li = document.createElement('li');
            li.classList.add(sanitizeClass(vData.questions[position].wq+'-'+ci));
            // li.textContent = choice.l;

            var choiceTotal = choice.a.reduce(function(t,p,i){ return t + p[0];},0);

            var ul = '<ul class="subgroup">';
            Object.keys(legend).reverse().forEach(function (l, i) {

                var r = choice.a.filter(function(a){
                    return l==a[2];
                });
                if(r.length>0){
                    var percent = (r[0][0] / choiceTotal * 100).toFixed(1);
                    ul += '<li class="subgroup-item" data-tooltip="'+ percent +'% '+ r[0][2] +'" style="width: ' + percent + '%; background-color: ' + legend[r[0][2]].color + '">' + percent + '%</li>';
                }
            });
            ul += '</ul>';

            li.insertAdjacentHTML('beforeend', ul);
            li.insertAdjacentHTML('afterbegin', '<svg width="400" height="400" viewBox="-200 -200 400 400"></svg>');

            var svg = li.querySelector('svg');

            var groups = {
                "Behind": [],
                "Aware": [],
                "Stable": [],
                "Prepared": []
            };

            var n = 0;

            choice.a.forEach(function (answer) {
                for (var j = 0; j < answer[0]; j++, n++) {
                    var theta = 2.39998131 * n;
                    var radius = 2.5 * Math.sqrt(theta);
                    var startRad = 5 * Math.sqrt(theta);
                    var x = Math.cos(theta) * startRad;
                    var y = Math.sin(theta) * startRad;
                    var endX = Math.cos(theta) * radius;
                    var endY = Math.sin(theta) * radius;

                    var circle = document.createElementNS(ns, 'circle');
                    setAttrs(circle, {
                        fill: legend[answer[2]].color,
                        r: dotR,
                        style: 'transform: translate(' + x + 'px, ' + y + 'px)'
                    });
                   // circle.dataset.tooltip = answer[2];
                    circle.endX = endX;
                    circle.endY = endY;

                    svg.appendChild(circle);
                }
            });

            setTimeout(function () {
                svg.getElementsByTagName('circle').forEach(function (circle) {
                    circle.setAttribute('style', 'transform: translate(' + circle.endX + 'px, ' + circle.endY + 'px)');
                });
            }, 0);

            retireesQ.appendChild(li);
        });

        ul_answers.insertAdjacentHTML('beforeend',ul_answer_items);

        var answer_menu = document.querySelectorAll('.answer-item a');
        answer_menu.forEach(function(a){
            a.addEventListener('click',function(e){
                var answerAnchor = e.currentTarget;
                var answerChoice = answerAnchor.dataset.choice;
                console.log(answerChoice);

                $all('.qualifiers > li.active, .answer-item.active').forEach(function(c){
                    c.classList.remove('active');
                });

                $all('.'+answerChoice).forEach(function(c){
                    c.classList.add('active');
                });
            });
        });

        //Worker choices
        vData.questions[position].wchoices.forEach(function (choice,ci) {
            var li = document.createElement('li');
            li.classList.add(sanitizeClass(vData.questions[position].wq+'-'+ci));
            // li.textContent = choice.l;
            var choiceTotal = choice.a.reduce(function(t,p,i){ return t + p[0]; },0);

            var ul = '<ul class="subgroup">';
            Object.keys(legend).reverse().forEach(function (l) {
                var w = choice.a.filter(function(a){
                    return l==a[2];
                });
                if(w.length>0){
                    var percent = w[0][1];
                    ul += '<li class="subgroup-item" data-tooltip="'+ percent +'% '+ w[0][2] +'" style="width: ' + percent + '%; background-color: ' + legend[w[0][2]].color + '">' + percent + '%</li>';
                }
            });
            ul += '</ul>';

            li.insertAdjacentHTML('beforeend', ul);
            li.insertAdjacentHTML('afterbegin', '<svg width="400" height="400" viewBox="-200 -200 400 400"></svg>');

            var svg = li.querySelector('svg');

            var n = 0;

            choice.a.reverse().forEach(function (answer) {
                for (var j = 0; j < answer[0]; j++, n++) {
                    var theta = 2.39998131 * n;
                    var radius = 2.5 * Math.sqrt(theta);
                    var x = Math.cos(theta) * radius;
                    var y = Math.sin(theta) * radius;

                    var fill = legend[answer[2]].color;
                    var circle = document.createElementNS(ns, 'circle');
                    setAttrs(circle, {
                        // fill: legend[answer[2]].color,
                        fill: 'rgba(0, 0, 0, 0)',
                        r: dotR,
                        style: 'transform: translate(' + x + 'px, ' + y + 'px)'
                    });
                 //   circle.dataset.tooltip = answer[2];

                    svg.appendChild(circle);

                    setTimeout(function (fill, circle) {
                        circle.setAttribute('fill', fill);
                    }, n * 5, fill, circle);
                }
            });

            workerQ.appendChild(li);
        });

        currentAnswerItems = $all('.current-answers section .answer-item a');
        currentAnswerItems[0].click();

    });

    // select from subgroups
    // qualifiers.addEventListener('mouseover', function (e) {
    //     // context is the ul
    //     // console.log(e, this);
    //     var position = Array.prototype.indexOf.call(qualifiers.childNodes, e.target);
    //     var question = vData.questions[this.dataset.current];

    //     console.log(question);

    //     // while (retireeChart.lastChild) { retireeChart.removeChild(retireeChart.lastChild); }
    //     // while (workerChart.lastChild) { workerChart.removeChild(workerChart.lastChild); }

    //     question.rchoices[position].a.forEach(function (r, i) {
    //         // for (var j = 0; j < r[0]; j++) {
    //         //     var person = document.createElementNS(ns, 'circle');
    //         //     setAttrs(person, {cx: j * dotGap + dotGap / 2, cy: i * dotGap + dotGap / 2, r: dotR, fill: legend[r[2]].color});
    //         //     retireeChart.appendChild(person);
    //         // }
    //         retireeChart.querySelector('.' + legend[r[2]].className).setAttribute('r', r[0]);
    //         console.log(r);
    //         // r.forEach(function (group, idx) {
    //         //
    //         // });

    //     });

    //     question.rchoices[position].a.reduce(function (m, w, i) {
    //         // for (var j = 0; j < w[0]; j++) {
    //         //     var person = document.createElementNS(ns, 'circle');
    //         //     setAttrs(person, {cx: j * dotGap + dotGap / 2, cy: i * dotGap + dotGap / 2, r: dotR, fill: legend[w[2]].color});
    //         //     workerChart.appendChild(person);
    //         // }
    //         var bubble = workerChart.querySelector('.' + legend[w[2]].className);
    //         bubble.setAttribute('r', w[0]);
    //         bubble.setAttribute('transform', 'translate(' + (w[0] + m) + ',0)');
    //         return m + w[0];
    //     }, 0);
    // });

    // make there be something to look when page loads
    qList.childNodes[0].classList.add('active');
    qList.childNodes[0].click();

    currentAnswerItems = $all('.current-answers section .answer-item a');
    currentAnswerItems[0].click();

})();