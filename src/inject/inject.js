chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// ----------------------------------------------------------
		// This part of the script triggers when page is done loading
		console.log("Hello. This message was sent from scripts/inject.js");

		newUtterance(null);

		function checkForChanges() {
			currentlySelectedItem = document.getElementsByClassName('NB-feed-story NB-river-story read NB-selected');
				if (currentlySelectedItem.length == 0) {
					setTimeout(checkForChanges, 500);
				}		
				else {
					//console.log('this article has already been read');
					//console.log(currentlySelectedItem[0].getElementsByClassName('NB-feed-story-title')[0].innerHTML);
					if (currentlySelectedItem[0].id == 'spoken') {
						setTimeout(checkForChanges,1000)
					}
		    		else {
		    			previouslyReadIteam = document.getElementsByClassName('NB-feed-story NB-river-story read');
		    			for (var i = 0; i < previouslyReadIteam.length; i++) {
		    				if(previouslyReadIteam[i].id == 'spoken') {
		    					previouslyReadIteam[i].id = '';
		    				};
		    			};
		    			speechSynthesis.cancel();
		    			console.log('the app should be speaking')
		    			currentlySelectedItem[0].id = 'spoken';
		    			console.log(currentlySelectedItem[0].id)

		    			//extract the headline
						currentlySelectedHeadline = currentlySelectedItem[0].getElementsByClassName('NB-feed-story-title')[0].innerHTML;
						currentlySelectedHeadline = currentlySelectedHeadline.replace('&nbsp;',' ')
						//extract the article body
						currentlySelectedArticle = currentlySelectedItem[0].getElementsByClassName('NB-feed-story-content')[0].textContent;
						
						//break article body into blocks of text
						console.log(currentlySelectedHeadline + currentlySelectedArticle);

						//speak headline
						speechSynthesis.speak(newUtterance(currentlySelectedHeadline));

						//speak article bodyThings[i]
						speakArticle(currentlySelectedArticle);
						setTimeout(checkForChanges,500)					
		    		}
				};	
		};
		checkForChanges();


		//add hotkey to repeat last utterance - Hotkey is Q
		window.onkeypress = function (e) {
			char =  e.keyCode;
			console.log('play/pause speech');
			if (char == 113) {
				if (speechSynthesis.speaking) {
					speechSynthesis.cancel()
				}
				else {
					speechSynthesis.cancel();
					speechSynthesis.speak(newUtterance(currentlySelectedHeadline));
					speakArticle(currentlySelectedArticle);
				}
			}
		};	

		function newUtterance(text) {
		var textToBeSpoken = new SpeechSynthesisUtterance();
		var voices = window.speechSynthesis.getVoices()
		if (voices.filter(function(voice) { return voice.name == 'Ava'; })[0]) {
			textToBeSpoken.voice = voices.filter(function(voice) { return voice.name == 'Ava'; })[0]
		};
		textToBeSpoken.text = text;
		textToBeSpoken.volume = 1; // 0 to 1
		textToBeSpoken.rate = 2; // 0.1 to 10
		textToBeSpoken.pitch = 1; //0 to 2
		textToBeSpoken.lang = 'en-US';
		textToBeSpoken.onend = function (e) {textToBeSpoken = undefined;}

		return (textToBeSpoken);
		};

		speakArticle = function(article){
			wordArray = article.match(/\S+\s*/g);
			phraseArray = [''];
			var y = 0;
			var i = 1;
			length = wordArray.length //set once since we are shifting array values
			while (i <= length) {
				while (i % 40 != 0) {
					if (wordArray.length > 0){
						phraseArray[y] += wordArray.shift();
						i++	
					}
					else break;
				}
				i++;
				y++;
				phraseArray[y] = '';				
			};
			for (var i = 0; i < phraseArray.length; i++) {
							speechSynthesis.speak(newUtterance(phraseArray[i]))
						};
			wordArray = undefined;
			phraseArray = undefined;			
		}
		// ----------------------------------------------------------

	}
	}, 10);
});




getElementsByClassName('right-pane')

