(function () {
    var qList = byId('questions');
    var $legend = byId('legend');
    var workerChart = $('.workers .chart');
    var retireeChart = $('.retirees .chart');
    var currentAnswers = $('.current-answers section');
    var currentAnswerItems = $all('.current-answers section .answer-item a');
	var $previous = byId('previous');
	var $next = byId('next');
	var qPosition = 0;
	var statkey = 1;
	
	


    var legend = {
        "Frozen": {
            className: 'frozen',
            color: '#0097A9',
            desc: "You may know a lot about retirement preparation, but don't yet have the resources to retire, so do little to plan for it."
        },
        "Behind": {
            className: 'blind',
            color: '#B73F7C',
            desc: "You're not yet financially prepared for retirement, nor do you yet have the tools to help plan and budget for your retirement."
        },
        "Aware": {
            className: 'challenged',
            color: '#76C5E4',
            desc: "You're knowledgeable about the planning and budgeting you'll need in retirement, but you likely haven't yet secured your finances."
        },
        "Stable": {
            className: 'auto-pilot',
            color: '#FFC700',
            desc: "You may be financially secure because of your pension, but there's more you could learn about planning and budgeting for your retirement."
        },
        "Prepared": {
            className: 'ready',
            color: '#D75426',
            desc: "You are confident about your retirement because you have prepared financially and mentally for the journey ahead."
        }
    };
	
	
	var urlParams;
	(window.onpopstate = function () {
		var match,
			pl     = /\+/g,  // Regex for replacing addition symbol with a space
			search = /([^&=]+)=?([^&]*)/g,
			decode = function (s) { return decodeURIComponent(s.replace(pl, " ")); },
			query  = window.location.search.substring(1);
	
		urlParams = {};
		while (match = search.exec(query))
		   urlParams[decode(match[1])] = decode(match[2]);
	})();
	if(urlParams['prepared'] != undefined){
		//	console.log("prepared",urlParams['prepared']);
			legend.Prepared.color = "#"+urlParams['prepared'];
	}
	if(urlParams['stable'] != undefined){
		//	console.log("prepared",urlParams['prepared']);
			legend.Stable.color = "#"+urlParams['stable'];
	}
	if(urlParams['aware'] != undefined){
		//	console.log("prepared",urlParams['prepared']);
			legend.Aware.color = "#"+urlParams['aware'];
	}
	if(urlParams['behind'] != undefined){
		//	console.log("prepared",urlParams['prepared']);
			legend.Behind.color = "#"+urlParams['behind'];
	}
	if(urlParams['frozen'] != undefined){
		//	console.log("prepared",urlParams['prepared']);
			legend.Frozen.color = "#"+urlParams['frozen'];
	}
	if(urlParams['statkey'] != undefined){
		//	console.log("prepared",urlParams['prepared']);
			statkey = urlParams['statkey'];
	}



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
      //   console.log("position",position);

		 drawIdv(position);
	});


	$previous.addEventListener('click', function (e) {
		if(qPosition == 0){
			 drawIdv(8);
		}  else{
		drawIdv(qPosition-1);
		}
	});
	$next.addEventListener('click', function (e) {
		 if(qPosition == 8){
			 drawIdv(0);
		}  else{
		drawIdv(qPosition+1);
		}
	});

	var drawIdv = function(position) {

		qPosition = position;

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
        vData.questions[position].wchoices.forEach(function (choice,ci) {
          //  console.log('retirees choice',choice);
			var worker_percentage =  vData.questions[position].wchoices[ci].p;
            ul_answer_items += '<li class="answer-item '+sanitizeClass(vData.questions[position].wq+'-'+ci)+'"><a data-choice="'+sanitizeClass(vData.questions[position].wq+'-'+ci)+'" href="#'+sanitizeClass(vData.questions[position].wq+'-'+ci)+'">'+choice.l+'<BR> W'+worker_percentage+'% | R'+choice.p+'%</a></li>';


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
                    var archetype_percent = r[0][1];
					var percent = r[0][5];
                    ul += '<li class="subgroup-item" data-tooltip="'+ archetype_percent +'% of'+ r[0][2] +' | '+ r[0][5] +'%" style="width: ' + archetype_percent + '%; background-color: ' + legend[r[0][2]].color + '">' + archetype_percent + '%</li>';
                }
            });
            ul += '</ul>';

            li.insertAdjacentHTML('beforeend', ul);
            li.insertAdjacentHTML('afterbegin', '<svg width="300" height="300" viewBox="-150 -150 300 300"></svg>');

            var svg = li.querySelector('svg');

            var groups = {
                "Behind": [],
                "Aware": [],
                "Stable": [],
                "Prepared": []
            };

            var n = 0;

            choice.a.reverse().forEach(function (answer) {
				console.log('answer',answer);
                for (var j = 0; j < answer[statkey]; j++, n++) {
                    var theta = 2.39998131 * n;
                    var radius = 2.5 * Math.sqrt(theta);
                    var x = Math.cos(theta) * radius;
                    var y = Math.sin(theta) * radius;
                    var fill = legend[answer[2]].color;

                    var circle = document.createElementNS(ns, 'circle');
                    setAttrs(circle, {
                        r: dotR,
                        cx: x,
                        cy: y,
                        fill: 'rgba(0, 0, 0, 0)',
						class: answer[2].toLowerCase()
                    });
                   // circle.dataset.tooltip = answer[2];

                   setTimeout(function (circle, fill) {
                       circle.setAttribute('fill', fill);
                   }.bind(this, circle, fill), n * 5 + 250);

                    svg.appendChild(circle);
                }
            });

            // setTimeout(function () {
            //     svg.getElementsByTagName('circle').forEach(function (circle) {
            //         circle.setAttribute('fill-opacity', 1);
            //     });
            // }, 0);

            retireesQ.appendChild(li);
        });

        ul_answers.insertAdjacentHTML('beforeend',ul_answer_items);

        var answer_menu = document.querySelectorAll('.answer-item a');
        answer_menu.forEach(function(a){
            a.addEventListener('click',function(e){
                var answerAnchor = e.currentTarget;
                var answerChoice = answerAnchor.dataset.choice;
             //   console.log(answerChoice);

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
		//	console.log(choiceTotal);
            var ul = '<ul class="subgroup">';
            Object.keys(legend).reverse().forEach(function (l) {
                var w = choice.a.filter(function(a){
                    return l==a[2];
                });
                if(w.length>0){
					 var archetype_percent = w[0][1];
                    var percent = w[0][5];
					
                    ul += '<li class="subgroup-item" data-tooltip="'+ archetype_percent +'% '+ w[0][2] +'" style="width: ' + archetype_percent + '%; background-color: ' + legend[w[0][2]].color + '">' + archetype_percent + '%</li>';
                }
            });
            ul += '</ul>';

            li.insertAdjacentHTML('beforeend', ul);
            li.insertAdjacentHTML('afterbegin', '<svg width="300" height="300" viewBox="-150 -150 300 300"></svg>');

            var svg = li.querySelector('svg');

            var n = 0;

            choice.a.reverse().forEach(function (answer) {
                for (var j = 0; j < answer[statkey]; j++, n++) {
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
                        cx: x,
                        cy: y,
						class: answer[2].toLowerCase()
						
                    });
                 //   circle.dataset.tooltip = answer[2];

                    svg.appendChild(circle);

                    setTimeout(function (fill, circle) {
                        circle.setAttribute('fill', fill);
                    }.bind(this, fill, circle), n * 5);
                }
            });

            workerQ.appendChild(li);
        });

        currentAnswerItems = $all('.current-answers section .answer-item a');
        currentAnswerItems[0].click();

    };

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