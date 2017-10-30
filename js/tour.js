var fabmo = new FabMoDashboard();

var tour = document.getElementById('tour-container');

var currentLeft = 0;
var counter = 0;
var cardWidth = $(window).width();
var lastStat = null;

var content = [
    {
        "id": "1",
        "image": "images/Handibot.png",
        "header": "Welcome to Fabmo",
        "text": "We are excited to get you up and running with your Handibot",
        "actionText" : "",
        "action": ""
 
    },
     {
        "id": "2",
        "video": "images/foam1.webm",
        "header": "First Raise Height of the Z-axis",
        "text": "Your Handibot will hit it's Z-Max and make a loud noise. This is normal. Remove the protective foam circle.",
        "actionText" : "Raise Z",
        "action": function() {fabmo.runSBP('ZZ\nMS3,3\nMZ,2')}
    },
    {
         "id": "3",
        "video": "images/cutterlength2.webm",
        "header": "Z-Zero",
        "text": "Next we remeasure your cutting bit length. We did this at the factory, but things can move in shipping and it's good to learn how to do. This will ensure that your Z-Zero is correct. You will also want to do this everytime you change bits.",
        "actionText" : "Z-Zero",
        "action": function() {fabmo.runSBP('C#,2')}
    },
    {
        "id": "4",
        "video": "images/home1.webm",
        "header": "Home Your Tool",
        "text": "Your X, Y, & Z are already zeroed from the last step, but lest's say you accidentally crashed your tool into your X, Y, or Z. This will cause your tool to loose position. If you haven't changed your bit you can just home it to re-zero your axes. Lets show you what that looks like.",
        "actionText" : "Home Tool",
        "action": function() {fabmo.runSBP('C#,3')}
    },
    {
        "id": "5",
        "video": "images/testcut.webm",
        "header": "Run Test File",
        "text": "Finally we are going to run a test cut. We did this cut at the factory so you can compare your cut with our cut too make sure that you are running your tool correctly. Clicking the button will submit a job and take you to the Job Manager, where you can continue the tour",
        "actionText" : "Submit Test Cut",
        "action": function() {DoJobFile()}
    },

]



function onStatus(status) {
    if(status.state == "idle" && lastStat == "running") {
        fabmo.showModal({
            title : 'Do you have a 1/4 inch bit?',
            message : 'This will determine the rest of the tutorial',
            okText : 'Yes',
            cancelText : 'No',
            ok : function() {
                content = content.concat(bitYes);
                setNext(content[counter+1], counter);
                checkCounter();
                fabmo._event_listeners.status = [];
            },
            cancel : function() {
                content = content.concat(bitNo);
                setNext(content[counter+1], counter);
                checkCounter();
                fabmo._event_listeners.status = [];
            }
        });

    } else if (status.state != lastStat) {
        lastStat = status.state;
    }

}

$( document ).ready(function() {

// fabmo.on('status', function(status){
//     if (status.state === 'running') {
//         $('.image-container').height('90%');
//         $('.content').height('0%');
//     } else  {
//      $('.image-container').height('50%');
//     $('.content').height('50%');
//     }

// });  
loadFirst(content[0]);
    if ( counter < content.length -1) {
    setNext(content[counter + 1], counter + 1);
    
    checkCounter();
    $('.tour-card').css('width', cardWidth);
    $('.tour-decloration').click(function(){
        fabmo.launchApp('home');
    });
}





});

$( window ).resize(function() {
    var currentItem;
    cardWidth = $(window).width();
    var numItems = $('.tour-card').length;
    var newContainer = numItems*cardWidth;
    $('.tour-card').css('width', cardWidth);
    
    // $('.marker').each(function(){
    //     if (isElementInViewport ($(this))) {
    //         currentItem = parseInt($(this).parent().attr('id'));
    //         console.log(currentItem);
    //     } 
        
    // });

    currentLeft = -((counter)*cardWidth);
    $('#tour-container').css({'width': newContainer,  'left': currentLeft + 'px'});
});

$('.next').click(function(){
    counter++;    
    startVideo();

    var cardNum = $('.tour-card').length;
   
    if (counter == (cardNum - 1)){
        setNext(content[counter+1], counter+1);  
    } 
    currentLeft = currentLeft - cardWidth;

    $('#tour-container').css('left', currentLeft + "px");
    checkCounter();
    $('.slide-next').show(0).delay(400).hide(0);

});

$('.prev').click(function(){
    startVideo();
    counter--;
    currentLeft = currentLeft + cardWidth;
    $('#tour-container').css('left', currentLeft + "px");
    checkCounter();
    $('.slide-next').show(0).delay(500).hide(0);
});

function loadFirst(obj){
    var set = [];
    
    var id = obj.id;
    $('.tour-card').each(function(){
        set.push($(this).attr('id'));
    });
    if (set.includes(id)){}else{
    var tourItem = document.createElement("li");
    tourItem.setAttribute("id", obj.id);
    tourItem.setAttribute("class", "tour-card");
    if (obj.action && obj.video) {
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><video loop><source src='+obj.video+' type="video/mp4"></video></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p><div class="card-action" id='+id+'>'+obj.actionText+'</div></div>';
  
    } else {
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><img  src='+obj.image+'></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p></div>';
    }

    
    tour.appendChild(tourItem);
    $('.tour-card').css('width', cardWidth);
}
};

function setNext(obj, counter){
    var set = [];
    if (obj){
    var id = obj.id;
    $('.tour-card').each(function(){
        set.push($(this).attr('id'));
    });

    if (set.includes(id)){}else{
    var tourItem = document.createElement("li");
    tourItem.setAttribute("id", 'card-'+obj.id);
    tourItem.setAttribute("class", "tour-card");
    if ( obj.video && obj.action) {
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><video loop><source src='+obj.video+' type="video/mp4"></video></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p><div class="card-action" id="'+id+'">'+obj.actionText+'</div></div>';
    } else if (obj.video){
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><video loop><source src='+obj.video+' type="video/mp4"></video></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p></div>';
    } else if (obj.image ){
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><img  src='+obj.image+'></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p></div>';
    } else if (obj.input) {
        tourItem.innerHTML = '<div class="marker"></div><div class="slide-next"></div><div class="image-container"><input placeholder="'+obj.input+'"></div><div class="content"><h4>'+obj.header+'</h4><p>'+obj.text+'</p><div class="card-action" id="'+id+'">'+obj.actionText+'</div></div>';

    }

    
    tour.appendChild(tourItem);

    $('.tour-card').css('width', cardWidth);
    if ($('#'+obj.id).length){
        $('#'+obj.id).click(function(e) {
            e.stopPropagation();
            e.preventDefault();
            obj.action();
        });
    }
}
}
};

function DoJobFile () {
  var sbp = "";
    var jobPath = 'jobs/test_carve.sbp';
  
  jQuery.get(jobPath, function(data) {
      sbp += data;
    })
    .done(function() {
      jobPath = jobPath.replace('jobs/', '');
      jobPath = jobPath.replace('.sbp', '');
    // sbp += 'end\n';
    // sbp += "'a FabMo load\n";
        fabmo.clearJobQueue(function(err,data){
            if (err) {
                console.log(err);
            } else {
                fabmo.submitJob({
                    file: sbp,
                    filename: 'test_01' + '.sbp',
                    name: "test_01",
                    description: "Test cut to test tool"
                }, {stayHere : true});
                fabmo.launchApp('job-manager', {'from_tour' : true});
            }
        });
    })
}

function checkCounter() {
    if (counter == 0) {
        $('.prev').hide();
    } else if (counter == content.length - 1) {
         $('.next').hide();

    } else {
        $('.prev').show();
        $('.next').show();
    }
}

var visible;
function playVideo(el){
    setTimeout(function(){
       if (isElementInViewport (el)){
           el[0].play();
       } else {
           el[0].pause();
           el[0].currentTime = 0;
       }
    }, 600);
}
function startVideo () {
    $('.image-container video').each(function(){
        playVideo($(this));
    });
}


function isElementInViewport (el) {

    //special bonus for those using jQuery
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
}