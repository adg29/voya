$.noConflict();
(function () {
    var qList = byId('questions');
    var $legend = byId('legend');
    var workerChart = $('.workers .chart');
    var retireeChart = $('.retirees .chart');

    var legend = {
        "Blind & Behind": {
            className: 'blind',
            color: '#145A7B'
        },
        "Challenged": {
            className: 'challenged',
            color: '#551B57'
        },
        "Auto-Pilot": {
            className: 'auto-pilot',
            color: '#B73F7C'
        },
        "Ready & Able": {
            className: 'ready',
            color: '#76C5E4'
        }
    };

    Object.keys(legend).forEach(function (key) {
        $legend.insertAdjacentHTML('beforeend', '<li><span class="dot" style="background: ' + legend[key].color + '"></span> <span class="key">' + key + '</span></li>');
    });

    var dotR = 3;
    var dotGap = 8;

    vData.questions.forEach(function (q, i) {
        qList.insertAdjacentHTML('beforeend', '<li>' + (i + 1) + '</li>');
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


        // console.log(vData.questions);
        // qualifiers.dataset.current = position;

        //Retired choices
        vData.questions[position].rchoices.forEach(function (choice) {
            console.log('retirees choice', choice);

            var li = document.createElement('li');
            li.textContent = choice.l;

            var ul = choice.a.reduce(function (m, r, i) {
                return m + '<li class="subgroup-item" style="width: ' + (r[0] / choice.t * 100) + '%; background-color: ' + legend[r[2]].color + '"></li>';
            }, '<ul class="subgroup">') + '</ul>';

            li.insertAdjacentHTML('beforeend', ul);
            li.insertAdjacentHTML('afterbegin', '<svg width="200" height="200" viewBox="-100 -100 200 200"></svg>');

            var svg = li.querySelector('svg');

            var groups = {
                "Blind & Behind": [],
                "Challenged": [],
                "Auto-Pilot": [],
                "Ready & Able": []
            };

            for (var j = 0; j < choice.t; j++) {
                var theta = 2.39998131 * j;
                var radius = 2.5 * Math.sqrt(theta);
                var startRad = 5 * Math.sqrt(theta);
                var x = Math.cos(theta) * radius;
                var y = Math.sin(theta) * radius;
                var startX = Math.cos(theta) * startRad;
                var startY = Math.sin(theta) * startRad;
                var circle = document.createElementNS(ns, 'circle');
                var fill = legend['Ready & Able'].color;
                if (choice.a[0][0] + choice.a[1][0] + choice.a[2][0] > j) fill = legend['Auto-Pilot'].color;
                if (choice.a[0][0] + choice.a[1][0] > j) fill = legend.Challenged.color;
                if (choice.a[0][0] > j) fill = legend['Blind & Behind'].color;
                setAttrs(circle, {
                    /*cx: x, cy: y, */
                    style: 'transform: translate(' + startX + 'px, ' + startY + 'px)',
                    r: dotR,
                    fill: fill
                });
                circle.endX = x;
                circle.endY = y;
                svg.appendChild(circle);
            }

            setTimeout(function () {
                svg.getElementsByTagName('circle').forEach(function (circle) {
                    circle.setAttribute('style', 'transform: translate(' + circle.endX + 'px, ' + circle.endY + 'px)');
                });
            }, 0);

            retireesQ.appendChild(li);
        });

        //Worker choices
        vData.questions[position].wchoices.forEach(function (choice) {
            var li = document.createElement('li');
            li.textContent = choice.l;

            var ul = choice.a.reduce(function (m, w, i) {
                return m + '<li class="subgroup-item" style="width: ' + (w[0] / choice.t * 100) + '%; background-color: ' + legend[w[2]].color + '"></li>';
            }, '<ul class="subgroup">') + '</ul>';

            li.insertAdjacentHTML('beforeend', ul);
            li.insertAdjacentHTML('afterbegin', '<svg width="200" height="200" viewBox="-100 -100 200 200"></svg>');

            var svg = li.querySelector('svg');

            for (var j = 0; j < choice.t; j++) {
                var theta = 2.39998131 * j;
                var radius = 2.5 * Math.sqrt(theta);
                var x = Math.cos(theta) * radius;
                var y = Math.sin(theta) * radius;
                var circle = document.createElementNS(ns, 'circle');
                var fill = legend['Ready & Able'].color;
                if (choice.a[0][0] + choice.a[1][0] + choice.a[2][0] > j) fill = legend['Auto-Pilot'].color;
                if (choice.a[0][0] + choice.a[1][0] > j) fill = legend.Challenged.color;
                if (choice.a[0][0] > j) fill = legend['Blind & Behind'].color;
                setAttrs(circle, {cx: x, cy: y, r: dotR, fill: 'rgba(0, 0, 0, 0)'});

                setTimeout(function (fill, circle) {
                    circle.setAttribute('fill', fill);
                }, j * 5, fill, circle);

                svg.appendChild(circle);
            }

            workerQ.appendChild(li);
        });

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
    qList.childNodes[6].classList.add('active');
    qList.childNodes[6].click();

})();