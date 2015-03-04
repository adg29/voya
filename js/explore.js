$.noConflict();
(function () {
    var qList = byId('questions');
    var workerChart = $('.workers .chart');
    var retireeChart = $('.retirees .chart');

    var legend = {
        "Blind & Behind": {
            className: 'blind',
            color: '#f90'
        },
        "Challenged": {
            className: 'challenged',
            color: '#ff0'
        },
        "Auto-Pilot": {
            className: 'auto-pilot',
            color: '#66f'
        },
        "Ready & Able": {
            className: 'ready',
            color: '#0c0'
        }
    };

    for (var key in legend) {
        workerChart.querySelector('.' + legend[key].className).setAttribute('fill', legend[key].color);
        retireeChart.querySelector('.' + legend[key].className).setAttribute('fill', legend[key].color);
    }

    document.getElementsByTagName('circle').forEach(function (c) {
        setAttrs(c, {r: 3, cx: 20, cy: 125, 'fill-opacity': 0.5});
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

        vData.questions[position].rchoices.forEach(function (choice) {
            var li = document.createElement('li');
            li.textContent = choice.l;
            // li.insertAdjacentHTML('beforeend', '<li>' + choice.l + '</li>');
            retireesQ.appendChild(li);

            var ul = choice.a.reduce(function (m, r, i) {
                return m + '<li class="subgroup-item" style="width: ' + r[1] + '%; background-color: ' + legend[r[2]].color + '"></li>';
            }, '<ul class="subgroup">') + '</ul>';

            li.insertAdjacentHTML('beforeend', ul);
        });

        vData.questions[position].wchoices.forEach(function (choice) {
            workerQ.insertAdjacentHTML('beforeend', '<li>' + choice.l + '</li>');
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